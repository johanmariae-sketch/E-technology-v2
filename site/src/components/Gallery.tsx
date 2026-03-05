"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Sparkles, X } from "lucide-react";
import Image from "next/image";
import type { Product, ProductCatalog } from "@/types/content";
import rawCatalog from "@/data/products.json";
const catalog = rawCatalog as ProductCatalog;

const categoryLabels: Record<string, string> = {
  all: "Todos",
  phones: "Telefonos",
  accessories: "AirPods",
};

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = ["all", ...catalog.categories];
  const filteredProducts =
    activeCategory === "all"
      ? catalog.products
      : catalog.products.filter((p) => p.category === activeCategory);

  return (
    <section id="products" className="py-12 sm:py-16 lg:py-24 bg-[#FAFBFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="text-[#3B7DFF] text-sm font-semibold font-[family-name:var(--font-mono)] uppercase tracking-wider">
              Catalogo
            </span>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] mt-2">
              Nuestros Productos
            </h2>
          </div>
          <p className="text-[#64748B] text-sm">
            Precios actualizados al {catalog.lastUpdated}
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex gap-1.5 sm:gap-2 mb-8 sm:mb-10 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn-magnetic whitespace-nowrap px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                activeCategory === cat
                  ? "bg-[#1B2D6E] text-white border-[#1B2D6E] shadow-lg shadow-[#1B2D6E]/20"
                  : "bg-white text-[#64748B] border-[#E2EAFF] hover:border-[#3B7DFF] hover:text-[#1B2D6E]"
              }`}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </motion.div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.4 }}
              >
                <ProductCard product={product} onImageClick={() => setSelectedProduct(product)} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Results */}
        <p className="text-center text-[#64748B] text-sm mt-10">
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} disponible{filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function ProductCard({ product, onImageClick }: { product: Product; onImageClick: () => void }) {
  return (
    <div className="card-lift group bg-white rounded-2xl sm:rounded-[1.5rem] border border-[#E2EAFF] overflow-hidden flex flex-col">
      {/* Image */}
      <button
        onClick={onImageClick}
        className="relative aspect-square bg-gradient-to-br from-[#F8FAFF] to-[#EEF2FF] overflow-hidden p-4 sm:p-6 cursor-pointer"
      >
        <Image
          src={product.image}
          alt={product.fullName}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5">
          {product.isNew && (
            <span className="inline-flex items-center gap-1 bg-[#10B981] text-white text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5" /> Nuevo
            </span>
          )}
        </div>
      </button>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Category */}
        <span className="text-[#3B7DFF] text-[10px] font-semibold font-[family-name:var(--font-mono)] uppercase tracking-wider">
          {categoryLabels[product.category] || product.category}
        </span>

        {/* Product name */}
        <h3 className="text-[#0F172A] text-xs sm:text-sm font-semibold mt-1 leading-snug">
          {product.name}
        </h3>

        {/* Variant */}
        {product.variant && (
          <p className="text-[#64748B] text-[11px] sm:text-xs mt-0.5">
            {product.variant}
          </p>
        )}

        {/* Price */}
        <p className="text-[#1B2D6E] text-base sm:text-lg font-bold mt-2">
          {product.priceFormatted}
        </p>

        {/* CTA */}
        <a
          href={product.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Consultar
        </a>
      </div>
    </div>
  );
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
        >
          <X className="w-4 h-4 text-[#0F172A]" />
        </button>

        {/* Image */}
        <div className="relative aspect-square bg-gradient-to-br from-[#F8FAFF] to-[#EEF2FF]">
          <Image
            src={product.image}
            alt={product.fullName}
            fill
            className="object-contain p-8"
            sizes="(max-width: 512px) 100vw, 512px"
          />
          {product.isNew && (
            <span className="absolute top-4 left-4 inline-flex items-center gap-1 bg-[#10B981] text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> Nuevo
            </span>
          )}
        </div>

        {/* Details */}
        <div className="p-6">
          <span className="text-[#3B7DFF] text-xs font-semibold font-[family-name:var(--font-mono)] uppercase tracking-wider">
            {categoryLabels[product.category] || product.category}
          </span>
          <h3 className="text-[#0F172A] text-xl font-bold mt-1">
            {product.name}
          </h3>
          {product.variant && (
            <p className="text-[#64748B] text-sm mt-1">
              Almacenamiento: {product.variant}
            </p>
          )}
          <p className="text-[#1B2D6E] text-2xl font-bold mt-3">
            {product.priceFormatted}
          </p>

          <a
            href={product.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-semibold px-4 py-3 rounded-xl transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Consultar por WhatsApp
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
