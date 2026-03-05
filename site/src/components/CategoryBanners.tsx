"use client";

import { motion } from "framer-motion";
import { Smartphone, Headphones } from "lucide-react";
import type { ProductCatalog } from "@/types/content";
import rawCatalog from "@/data/products.json";
const catalog = rawCatalog as ProductCatalog;

const phonesCount = catalog.products.filter(p => p.category === "phones").length;
const accessoriesCount = catalog.products.filter(p => p.category === "accessories").length;

const categories = [
  {
    icon: Smartphone,
    title: "Smartphones",
    subtitle: `${phonesCount} productos disponibles`,
    gradient: "from-[#1B2D6E] to-[#3B7DFF]",
    href: "#products",
  },
  {
    icon: Headphones,
    title: "AirPods",
    subtitle: `${accessoriesCount} productos disponibles`,
    gradient: "from-[#059669] to-[#34D399]",
    href: "#products",
  },
];

export default function CategoryBanners() {
  return (
    <section className="py-10 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat, i) => (
            <motion.a
              key={cat.title}
              href={cat.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`card-lift relative overflow-hidden bg-gradient-to-br ${cat.gradient} rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-8 group cursor-pointer`}
            >
              {/* Decorative circle */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full" />

              <cat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white mb-3 sm:mb-4 relative z-10" />
              <h3 className="font-[family-name:var(--font-heading)] font-bold text-white text-base sm:text-lg relative z-10">
                {cat.title}
              </h3>
              <p className="text-white/60 text-xs sm:text-sm mt-1 relative z-10 line-clamp-1">{cat.subtitle}</p>
              <span className="inline-flex items-center gap-1 text-white/80 text-xs font-medium mt-3 sm:mt-4 relative z-10 group-hover:gap-2 transition-all">
                Ver todo &rarr;
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
