"""
Instagram Content Downloader
Descarga todo el contenido de una cuenta de Instagram usando Instaloader.
"""

import instaloader
import json
import os
import sys
import time
from pathlib import Path
from datetime import datetime

# Fix encoding para Windows (emojis en captions/filenames)
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    os.environ["PYTHONIOENCODING"] = "utf-8"

# === CONFIGURACION ===
TARGET_PROFILE = "e__technologystore"
OUTPUT_DIR = Path(__file__).parent / "output"
LOGIN_USER = None  # Opcional: tu usuario de Instagram para descargar stories/highlights
LOGIN_PASS = None  # Opcional: tu contraseña

def setup_directories():
    """Crear estructura de directorios para la descarga."""
    dirs = ["posts", "reels", "stories"]
    for d in dirs:
        (OUTPUT_DIR / d).mkdir(parents=True, exist_ok=True)
    print(f"[OK] Directorios creados en {OUTPUT_DIR}")

def create_loader():
    """Crear y configurar la instancia de Instaloader."""
    L = instaloader.Instaloader(
        download_pictures=True,
        download_videos=True,
        download_video_thumbnails=True,
        download_geotags=False,
        download_comments=False,
        save_metadata=True,
        compress_json=False,
        post_metadata_txt_pattern="",
        filename_pattern="{shortcode}",
        max_connection_attempts=3,
        request_timeout=30,
    )

    # Login opcional (necesario para stories/highlights)
    if LOGIN_USER and LOGIN_PASS:
        try:
            L.login(LOGIN_USER, LOGIN_PASS)
            print(f"[OK] Sesion iniciada como {LOGIN_USER}")
        except Exception as e:
            print(f"[WARN] No se pudo iniciar sesion: {e}")
            print("       Continuando sin login (no se podran descargar stories)")
    else:
        print("[INFO] Sin login - solo se descargara contenido publico")

    return L

def download_profile_info(L, profile):
    """Descargar informacion del perfil."""
    profile_data = {
        "username": profile.username,
        "full_name": profile.full_name,
        "biography": profile.biography,
        "followers": profile.followers,
        "followees": profile.followees,
        "mediacount": profile.mediacount,
        "profile_pic_url": str(profile.profile_pic_url),
        "is_private": profile.is_private,
        "is_verified": profile.is_verified,
        "external_url": profile.external_url or "",
        "downloaded_at": datetime.now().isoformat(),
    }

    # Descargar foto de perfil
    try:
        L.download_profilepic(profile)
        # Mover la foto de perfil al directorio de output
        for f in Path(".").glob(f"{profile.username}_profile_pic*"):
            dest = OUTPUT_DIR / f"profile_pic{f.suffix}"
            f.rename(dest)
            profile_data["profile_pic_local"] = str(dest.name)
            print(f"[OK] Foto de perfil descargada: {dest.name}")
            break
    except Exception as e:
        print(f"[WARN] No se pudo descargar foto de perfil: {e}")

    # Guardar JSON del perfil
    profile_json = OUTPUT_DIR / "profile.json"
    with open(profile_json, "w", encoding="utf-8") as f:
        json.dump(profile_data, f, ensure_ascii=False, indent=2)

    print(f"[OK] Info del perfil guardada: {profile_json}")
    print(f"     @{profile.username} | {profile.followers} seguidores | {profile.mediacount} publicaciones")

    return profile_data

def download_posts(L, profile):
    """Descargar todas las publicaciones (fotos, carruseles, videos)."""
    posts_dir = OUTPUT_DIR / "posts"
    posts_metadata = []

    print(f"\n[...] Descargando publicaciones de @{profile.username}...")

    for i, post in enumerate(profile.get_posts()):
        try:
            # Determinar tipo de contenido
            if post.is_video:
                post_type = "reel" if post.video_duration and post.video_duration < 90 else "video"
            elif post.mediacount > 1:
                post_type = "carousel"
            else:
                post_type = "image"

            # Metadata del post
            post_data = {
                "shortcode": post.shortcode,
                "date": post.date.isoformat(),
                "caption": post.caption or "",
                "hashtags": list(post.caption_hashtags) if post.caption_hashtags else [],
                "mentions": list(post.caption_mentions) if post.caption_mentions else [],
                "likes": post.likes,
                "comments": post.comments,
                "type": post_type,
                "is_video": post.is_video,
                "video_url": str(post.video_url) if post.is_video else None,
                "url": f"https://www.instagram.com/p/{post.shortcode}/",
                "media_count": post.mediacount,
            }

            # Descargar archivos del post
            target_dir = str(posts_dir)
            try:
                L.download_post(post, target=target_dir)
            except Exception as dl_err:
                print(f"  [WARN] Descarga parcial {post.shortcode}: {str(dl_err)[:80]}")

            # Registrar archivos descargados (puede haber descargado parcialmente)
            post_files = list(posts_dir.glob(f"*{post.shortcode}*"))
            post_data["local_files"] = [f.name for f in post_files if not f.name.endswith(".json")]

            # Guardar metadata aunque la descarga falle (tenemos caption, likes, etc)
            posts_metadata.append(post_data)

            progress = f"[{i+1}/{profile.mediacount}]"
            caption_preview = (post.caption or "")[:40].replace("\n", " ")
            print(f"  {progress} {post_type.upper()} | {post.date.strftime('%Y-%m-%d')} | {post.likes} likes | {post.shortcode} | {caption_preview}")

            # Pausa para evitar rate limiting
            if (i + 1) % 10 == 0:
                print(f"  [PAUSA] Esperando 5s para evitar bloqueo...")
                time.sleep(5)
            else:
                time.sleep(1)

        except Exception as e:
            # Guardar metadata aunque falle completamente
            posts_metadata.append(post_data)
            print(f"  [ERROR] Post {post.shortcode}: {str(e)[:80]}")
            continue

    # Guardar metadata de todos los posts
    posts_json = OUTPUT_DIR / "posts_metadata.json"
    with open(posts_json, "w", encoding="utf-8") as f:
        json.dump(posts_metadata, f, ensure_ascii=False, indent=2)

    print(f"\n[OK] {len(posts_metadata)} publicaciones descargadas")
    return posts_metadata

def download_stories(L, profile):
    """Descargar stories highlights (requiere login)."""
    if not LOGIN_USER:
        print("\n[SKIP] Stories requieren login - saltando...")
        return []

    stories_dir = OUTPUT_DIR / "stories"
    stories_metadata = []

    print(f"\n[...] Descargando stories highlights de @{profile.username}...")

    try:
        highlights = L.get_highlights(profile)
        for highlight in highlights:
            highlight_data = {
                "title": highlight.title,
                "items": [],
            }

            for item in highlight.get_items():
                try:
                    L.download_storyitem(item, target=str(stories_dir))
                    item_data = {
                        "date": item.date.isoformat(),
                        "is_video": item.is_video,
                        "shortcode": str(item.mediaid),
                    }
                    highlight_data["items"].append(item_data)
                except Exception as e:
                    print(f"  [ERROR] Story item: {e}")
                    continue

            stories_metadata.append(highlight_data)
            print(f"  [OK] Highlight: {highlight.title} ({len(highlight_data['items'])} items)")

    except Exception as e:
        print(f"[ERROR] No se pudieron descargar stories: {e}")

    # Guardar metadata de stories
    stories_json = OUTPUT_DIR / "stories_metadata.json"
    with open(stories_json, "w", encoding="utf-8") as f:
        json.dump(stories_metadata, f, ensure_ascii=False, indent=2)

    print(f"[OK] {len(stories_metadata)} highlights descargados")
    return stories_metadata

def main():
    print("=" * 60)
    print("  INSTAGRAM CONTENT DOWNLOADER")
    print(f"  Target: @{TARGET_PROFILE}")
    print("=" * 60)

    # Setup
    setup_directories()
    L = create_loader()

    # Obtener perfil
    try:
        profile = instaloader.Profile.from_username(L.context, TARGET_PROFILE)
    except Exception as e:
        print(f"[ERROR FATAL] No se pudo acceder al perfil @{TARGET_PROFILE}: {e}")
        sys.exit(1)

    if profile.is_private:
        print(f"[WARN] El perfil @{TARGET_PROFILE} es privado.")
        if not LOGIN_USER:
            print("       Necesitas login para descargar contenido privado.")
            sys.exit(1)

    # Descargar contenido
    profile_data = download_profile_info(L, profile)
    posts_data = download_posts(L, profile)
    stories_data = download_stories(L, profile)

    # Resumen
    print("\n" + "=" * 60)
    print("  DESCARGA COMPLETADA")
    print("=" * 60)
    print(f"  Perfil: @{profile_data['username']}")
    print(f"  Posts descargados: {len(posts_data)}")
    print(f"  Stories highlights: {len(stories_data)}")
    print(f"  Directorio: {OUTPUT_DIR}")
    print("=" * 60)
    print("\n  Siguiente paso: npm run process")

if __name__ == "__main__":
    main()
