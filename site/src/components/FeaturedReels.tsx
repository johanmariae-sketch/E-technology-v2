"use client";

import { motion } from "framer-motion";
import { Play, Heart, ExternalLink } from "lucide-react";
import Image from "next/image";
import type { SiteContent } from "@/types/content";
import rawContent from "@/data/content.json";
const content = rawContent as SiteContent;

export default function FeaturedReels() {
  const reels = content.posts.filter((post) => post.type === "reel" || post.type === "video");

  if (reels.length === 0) {
    return null;
  }

  return (
    <section id="reels" className="py-20 sm:py-28 bg-[var(--color-surface)]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Reels Destacados
          </h2>
          <p className="text-[var(--color-muted)] text-lg max-w-md mx-auto">
            Mira nuestros videos más populares
          </p>
        </motion.div>

        {/* Reels Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
          {reels.slice(0, 10).map((reel, index) => (
            <motion.a
              key={reel.id}
              href={reel.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative flex-shrink-0 w-52 sm:w-60 aspect-[9/16] rounded-2xl overflow-hidden group snap-start bg-[var(--color-surface)]"
            >
              {/* Thumbnail */}
              {reel.images[0] ? (
                <Image
                  src={reel.images[0]}
                  alt={reel.caption.slice(0, 100) || "Reel"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="240px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white/50" />
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm line-clamp-2 mb-2">
                  {reel.caption.slice(0, 80) || "Ver reel"}
                </p>
                <div className="flex items-center gap-3 text-white/70 text-xs">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {reel.likes}
                  </span>
                  <span>{new Date(reel.date).toLocaleDateString("es-DO")}</span>
                </div>
              </div>

              {/* External link indicator on hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4 text-white" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
