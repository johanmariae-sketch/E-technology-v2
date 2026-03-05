"use client";

import { motion } from "framer-motion";
import { ArrowRight, Truck, CreditCard, Clock, Shield } from "lucide-react";
import Image from "next/image";
import type { SiteContent } from "@/types/content";
import type { ProductCatalog } from "@/types/content";
import rawContent from "@/data/content.json";
import rawCatalog from "@/data/products.json";
const content = rawContent as SiteContent;
const catalog = rawCatalog as ProductCatalog;

const perks = [
  { icon: Truck, text: "Envios a todo el pais" },
  { icon: CreditCard, text: "Tarjetas de credito" },
  { icon: Clock, text: "L-V 9:30AM - 8PM" },
  { icon: Shield, text: "Garantia oficial" },
];

export default function Hero() {
  const featured = catalog.products[0]; // iPhone 17 Pro Max 2TB
  const secondFeatured = catalog.products.find(p => p.id === "iphone-17-air-256gb");

  return (
    <section id="hero" className="relative min-h-[100dvh] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F1B3D] via-[#1B2D6E] to-[#2B4BAA]" />

      {/* Geometric pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full border border-white/20" />
        <div className="absolute top-40 right-40 w-64 h-64 rounded-full border border-white/10" />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-[#3B7DFF]/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-8 sm:pb-16 min-h-[100dvh] flex flex-col justify-end">
        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-12 items-end">
          {/* Left — Text */}
          <div className="pb-8 lg:pb-16">
            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <span className="font-[family-name:var(--font-heading)] font-bold text-lg sm:text-xl text-white">E</span>
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-heading)] text-lg sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                    E Technology <span className="text-[#6BA1FF]">Store</span>
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
                    <span className="text-white/50 text-[11px] sm:text-xs font-[family-name:var(--font-mono)] tracking-wide uppercase">Piantini, Santo Domingo</span>
                  </div>
                </div>
              </div>
              <div className="w-12 h-[2px] bg-gradient-to-r from-[#6BA1FF] to-transparent mt-4 sm:mt-5 rounded-full" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-6"
            >
              <span className="block font-[family-name:var(--font-heading)] text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                Tecnologia es
              </span>
              <span className="block text-4xl sm:text-6xl lg:text-7xl font-bold italic text-[#6BA1FF] mt-1 sm:mt-2" style={{ fontFamily: "Georgia, serif" }}>
                Confianza.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-white/60 text-base sm:text-lg max-w-xs sm:max-w-md mb-8 sm:mb-10 leading-relaxed"
            >
              Los mejores smartphones, tablets y accesorios. {content.profile.followers.toLocaleString()} personas ya confian en nosotros.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#products"
                className="btn-magnetic inline-flex items-center justify-center gap-2 bg-white text-[#1B2D6E] px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-semibold text-sm group"
              >
                Ver productos
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href={content.profile.externalUrl || `https://wa.me/`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-magnetic inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-semibold text-sm hover:bg-white/20"
              >
                Contactar por WhatsApp
              </a>
            </motion.div>
          </div>

          {/* Right — Featured product showcase */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:flex justify-end items-end gap-4 pb-16"
          >
            {/* Main featured card */}
            {featured && (
              <div className="relative w-72 h-96 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/30 border border-white/10 bg-gradient-to-br from-[#F8FAFF] to-[#E0E7FF]">
                <Image
                  src={featured.image}
                  alt={featured.fullName}
                  fill
                  className="object-contain p-6"
                  sizes="288px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2D6E]/90 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[#6BA1FF] text-xs font-[family-name:var(--font-mono)] font-medium uppercase tracking-wider">Destacado</span>
                  <p className="text-white text-sm font-semibold mt-1">{featured.name}</p>
                  <p className="text-[#6BA1FF] text-lg font-bold mt-0.5">{featured.priceFormatted}</p>
                </div>
              </div>
            )}
            {/* Secondary card */}
            {secondFeatured && (
              <div className="relative w-48 h-72 rounded-[2rem] overflow-hidden shadow-xl shadow-black/20 border border-white/10 mb-8 bg-gradient-to-br from-[#F8FAFF] to-[#E0E7FF]">
                <Image
                  src={secondFeatured.image}
                  alt={secondFeatured.fullName}
                  fill
                  className="object-contain p-4"
                  sizes="192px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2D6E]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[#6BA1FF] text-xs font-[family-name:var(--font-mono)] font-medium uppercase tracking-wider">Nuevo</span>
                  <p className="text-white text-xs font-semibold mt-1">{secondFeatured.name}</p>
                  <p className="text-[#6BA1FF] text-sm font-bold mt-0.5">{secondFeatured.priceFormatted}</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom perks bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-6 sm:mt-8"
        >
          {perks.map((perk) => (
            <div
              key={perk.text}
              className="flex items-center gap-2 sm:gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3"
            >
              <perk.icon className="w-4 h-4 text-[#6BA1FF] flex-shrink-0" />
              <span className="text-white/70 text-xs font-medium">{perk.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
