/**
 * Instagram Content Processor
 * Lee los archivos descargados por Instaloader y genera content.json para el sitio.
 * Soporta dos modos:
 *   1. Leer posts_metadata.json (generado por nuestro download.py)
 *   2. Leer los .json individuales de Instaloader directamente (fallback)
 */

import { readFileSync, writeFileSync, copyFileSync, existsSync, readdirSync, mkdirSync, statSync } from "fs";
import { join, extname, basename } from "path";

const SCRAPER_OUTPUT = join(__dirname, "..", "scraper", "output");
const SITE_DATA = join(__dirname, "..", "site", "src", "data");
const SITE_IMAGES = join(__dirname, "..", "site", "public", "instagram");

interface ProfileData {
  username: string;
  full_name: string;
  biography: string;
  followers: number;
  followees: number;
  mediacount: number;
  profile_pic_url: string;
  profile_pic_local?: string;
  is_verified: boolean;
  external_url: string;
  downloaded_at: string;
}

interface ProcessedPost {
  id: string;
  date: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  type: string;
  images: string[];
  video: string | null;
  url: string;
  category: string;
}

interface ProcessedContent {
  profile: {
    username: string;
    fullName: string;
    bio: string;
    followers: number;
    following: number;
    postsCount: number;
    avatar: string;
    isVerified: boolean;
    externalUrl: string;
    lastUpdated: string;
  };
  posts: ProcessedPost[];
  categories: string[];
  stats: {
    totalPosts: number;
    totalImages: number;
    totalVideos: number;
    totalReels: number;
    avgLikes: number;
  };
}

// === Utilidades ===

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function readJSON<T>(path: string): T | null {
  try {
    const content = readFileSync(path, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

function isImageFile(filename: string): boolean {
  return [".jpg", ".jpeg", ".png", ".webp"].includes(extname(filename).toLowerCase());
}

function isVideoFile(filename: string): boolean {
  return [".mp4", ".mov", ".avi", ".webm"].includes(extname(filename).toLowerCase());
}

function extractHashtags(text: string): string[] {
  const matches = text.match(/#(\w+)/g);
  return matches ? matches.map((m) => m.slice(1)) : [];
}

/**
 * Inferir categoría del post basándose en caption y hashtags.
 */
function inferCategory(caption: string, hashtags: string[]): string {
  const text = `${caption} ${hashtags.join(" ")}`.toLowerCase();

  const categories: Record<string, string[]> = {
    phones: ["phone", "telefono", "celular", "iphone", "samsung", "smartphone", "movil", "android", "ios", "galaxy"],
    laptops: ["laptop", "computadora", "macbook", "notebook", "pc", "computer", "portatil"],
    accessories: ["accessori", "accesorio", "case", "funda", "cargador", "charger", "cable", "auricular", "headphone", "earphone", "airpod"],
    tablets: ["tablet", "ipad", "tab"],
    gaming: ["gaming", "gamer", "consola", "playstation", "xbox", "nintendo", "ps5", "ps4"],
    audio: ["audio", "speaker", "bocina", "parlante", "beats", "sony", "jbl"],
    wearables: ["watch", "reloj", "smartwatch", "apple watch", "fitbit", "band"],
    deals: ["oferta", "descuento", "promo", "sale", "deal", "precio", "rebaja", "especial", "aprovecha"],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((kw) => text.includes(kw))) {
      return category;
    }
  }

  return "general";
}

// === Lectura de JSON de Instaloader ===

interface InstaNode {
  __typename?: string;
  shortcode?: string;
  taken_at_timestamp?: number;
  is_video?: boolean;
  video_duration?: number;
  display_url?: string;
  edge_media_preview_like?: { count: number };
  edge_liked_by?: { count: number };
  edge_media_to_comment?: { count: number };
  edge_media_to_caption?: { edges: Array<{ node: { text: string } }> };
  edge_sidecar_to_children?: { edges: Array<{ node: InstaNode }> };
}

function parseInstaloaderJSON(filePath: string): ProcessedPost | null {
  const data = readJSON<{ node?: InstaNode } & InstaNode>(filePath);
  if (!data) return null;

  const node = data.node || data;
  const shortcode = node.shortcode;
  if (!shortcode) return null;

  // Extraer caption
  const captionEdges = node.edge_media_to_caption?.edges || [];
  const caption = captionEdges.length > 0 ? captionEdges[0].node.text : "";
  const hashtags = extractHashtags(caption);

  // Likes y comments
  const likes = node.edge_media_preview_like?.count || node.edge_liked_by?.count || 0;
  const comments = node.edge_media_to_comment?.count || 0;

  // Fecha
  const timestamp = node.taken_at_timestamp || 0;
  const date = new Date(timestamp * 1000).toISOString();

  // Tipo
  const isVideo = node.is_video || false;
  const hasSidecar = !!node.edge_sidecar_to_children;
  let type: string;
  if (isVideo) {
    type = node.video_duration && node.video_duration < 90 ? "reel" : "video";
  } else if (hasSidecar) {
    type = "carousel";
  } else {
    type = "image";
  }

  // Categoria
  const category = inferCategory(caption, hashtags);

  return {
    id: shortcode,
    date,
    caption,
    hashtags,
    likes,
    comments,
    type,
    images: [],
    video: null,
    url: `https://www.instagram.com/p/${shortcode}/`,
    category,
  };
}

// === Procesamiento Principal ===

function processProfile(): ProcessedContent["profile"] | null {
  const profilePath = join(SCRAPER_OUTPUT, "profile.json");
  const profile = readJSON<ProfileData>(profilePath);

  if (!profile) {
    console.error("[ERROR] No se encontro profile.json");
    return null;
  }

  // Copiar foto de perfil
  let avatarPath = "/instagram/avatar.jpg";
  if (profile.profile_pic_local) {
    const src = join(SCRAPER_OUTPUT, profile.profile_pic_local);
    if (existsSync(src)) {
      const ext = extname(profile.profile_pic_local);
      const dest = join(SITE_IMAGES, `avatar${ext}`);
      copyFileSync(src, dest);
      avatarPath = `/instagram/avatar${ext}`;
      console.log(`[OK] Avatar copiado: ${avatarPath}`);
    }
  }

  console.log(`[OK] Perfil procesado: @${profile.username}`);

  return {
    username: profile.username,
    fullName: profile.full_name,
    bio: profile.biography,
    followers: profile.followers,
    following: profile.followees,
    postsCount: profile.mediacount,
    avatar: avatarPath,
    isVerified: profile.is_verified,
    externalUrl: profile.external_url,
    lastUpdated: profile.downloaded_at,
  };
}

function processPosts(): { posts: ProcessedPost[]; categories: string[] } {
  const postsDir = join(SCRAPER_OUTPUT, "posts");
  const processedPosts: ProcessedPost[] = [];
  const categoriesSet = new Set<string>();
  let imagesCopied = 0;

  if (!existsSync(postsDir)) {
    console.error("[ERROR] No se encontro directorio de posts");
    return { posts: [], categories: [] };
  }

  // Leer todos los JSON de Instaloader en la carpeta de posts
  const allFiles = readdirSync(postsDir);
  const jsonFiles = allFiles.filter((f) => f.endsWith(".json"));

  console.log(`[INFO] Encontrados ${jsonFiles.length} archivos JSON de metadata`);
  console.log(`[INFO] Encontrados ${allFiles.filter((f) => isImageFile(f)).length} imagenes`);
  console.log(`[INFO] Encontrados ${allFiles.filter((f) => isVideoFile(f)).length} videos`);

  for (const jsonFile of jsonFiles) {
    const jsonPath = join(postsDir, jsonFile);
    const post = parseInstaloaderJSON(jsonPath);
    if (!post) continue;

    // Buscar archivos de imagen/video asociados a este shortcode
    const images: string[] = [];
    let video: string | null = null;

    for (const file of allFiles) {
      // Match files that start with the shortcode (e.g., CuZomBxLL6y.jpg, CuZomBxLL6y_1.jpg)
      const fileBase = basename(file, extname(file));
      if (!fileBase.startsWith(post.id)) continue;

      const srcPath = join(postsDir, file);
      if (!statSync(srcPath).isFile()) continue;

      if (isImageFile(file)) {
        const destPath = join(SITE_IMAGES, file);
        copyFileSync(srcPath, destPath);
        images.push(`/instagram/${file}`);
        imagesCopied++;
      } else if (isVideoFile(file)) {
        const destPath = join(SITE_IMAGES, file);
        copyFileSync(srcPath, destPath);
        video = `/instagram/${file}`;
      }
    }

    post.images = images;
    post.video = video;
    categoriesSet.add(post.category);
    processedPosts.push(post);
  }

  // Ordenar por fecha (mas reciente primero)
  processedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  console.log(`[OK] ${processedPosts.length} posts procesados`);
  console.log(`[OK] ${imagesCopied} imagenes copiadas a site/public/instagram/`);
  console.log(`[OK] Categorias detectadas: ${[...categoriesSet].join(", ")}`);

  return {
    posts: processedPosts,
    categories: [...categoriesSet].sort(),
  };
}

function main() {
  console.log("=".repeat(60));
  console.log("  INSTAGRAM CONTENT PROCESSOR");
  console.log("=".repeat(60));

  // Verificar que existe la salida del scraper
  if (!existsSync(SCRAPER_OUTPUT)) {
    console.error(`[ERROR] No se encontro el directorio: ${SCRAPER_OUTPUT}`);
    console.error("        Ejecuta primero: npm run download");
    process.exit(1);
  }

  // Crear directorios de destino
  ensureDir(SITE_DATA);
  ensureDir(SITE_IMAGES);

  // Procesar perfil
  const profile = processProfile();
  if (!profile) {
    console.error("[ERROR FATAL] No se pudo procesar el perfil");
    process.exit(1);
  }

  // Procesar posts
  const { posts, categories } = processPosts();

  // Calcular estadisticas
  const totalImages = posts.filter((p) => p.type === "image" || p.type === "carousel").length;
  const totalVideos = posts.filter((p) => p.type === "video").length;
  const totalReels = posts.filter((p) => p.type === "reel").length;
  const avgLikes = posts.length > 0 ? Math.round(posts.reduce((sum, p) => sum + p.likes, 0) / posts.length) : 0;

  // Generar content.json
  const content: ProcessedContent = {
    profile,
    posts,
    categories,
    stats: {
      totalPosts: posts.length,
      totalImages,
      totalVideos,
      totalReels,
      avgLikes,
    },
  };

  const outputPath = join(SITE_DATA, "content.json");
  writeFileSync(outputPath, JSON.stringify(content, null, 2), "utf-8");

  // Resumen
  console.log("\n" + "=".repeat(60));
  console.log("  PROCESAMIENTO COMPLETADO");
  console.log("=".repeat(60));
  console.log(`  Posts: ${content.stats.totalPosts}`);
  console.log(`  Imagenes: ${content.stats.totalImages}`);
  console.log(`  Videos: ${content.stats.totalVideos}`);
  console.log(`  Reels: ${content.stats.totalReels}`);
  console.log(`  Promedio likes: ${content.stats.avgLikes}`);
  console.log(`  Categorias: ${categories.join(", ")}`);
  console.log(`  Archivo generado: ${outputPath}`);
  console.log("=".repeat(60));
  console.log("\n  Siguiente paso: npm run dev");
}

main();
