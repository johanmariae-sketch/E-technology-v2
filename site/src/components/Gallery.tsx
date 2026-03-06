"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Sparkles, X, Star, Eye } from "lucide-react";
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

        {/* Stars */}
        <div className="flex items-center gap-0.5 mt-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3 h-3 fill-[#FBBF24] text-[#FBBF24]" />
          ))}
          <span className="text-[#64748B] text-[10px] ml-1">5.0</span>
        </div>

        {/* Price */}
        <p className="text-[#1B2D6E] text-base sm:text-lg font-bold mt-2">
          {product.priceFormatted}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 mt-3">
          <button
            onClick={onImageClick}
            className="inline-flex items-center justify-center gap-1.5 bg-[#1B2D6E] hover:bg-[#0F1B3D] text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Ver detalles
          </button>
          <a
            href={product.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Consultar
          </a>
        </div>
      </div>
    </div>
  );
}

type ColorOption = { name: string; hex: string; filter: string };

const productColors: Record<string, ColorOption[]> = {
  "iPhone 17 Pro Max": [
    { name: "Cosmic Orange", hex: "#C87533", filter: "" },
    { name: "Natural Titanium", hex: "#B0AFA7", filter: "hue-rotate(180deg) saturate(0.3) brightness(1.2)" },
    { name: "Dark Titanium", hex: "#3B3B3D", filter: "saturate(0) brightness(0.6)" },
    { name: "White Titanium", hex: "#E8E5DF", filter: "saturate(0) brightness(1.4)" },
  ],
  "iPhone 17 Pro": [
    { name: "Cosmic Orange", hex: "#C87533", filter: "" },
    { name: "Natural Titanium", hex: "#B0AFA7", filter: "hue-rotate(180deg) saturate(0.3) brightness(1.2)" },
    { name: "Dark Titanium", hex: "#3B3B3D", filter: "saturate(0) brightness(0.6)" },
    { name: "White Titanium", hex: "#E8E5DF", filter: "saturate(0) brightness(1.4)" },
  ],
  "iPhone 17 Air": [
    { name: "Starlight", hex: "#E8DFD0", filter: "" },
    { name: "Midnight", hex: "#1D1D1F", filter: "saturate(0) brightness(0.4)" },
    { name: "Green", hex: "#C3D4C7", filter: "hue-rotate(90deg) saturate(0.5)" },
    { name: "Blue", hex: "#A7BDD3", filter: "hue-rotate(180deg) saturate(0.6)" },
  ],
  "iPhone 17": [
    { name: "Lavender", hex: "#C8B4D4", filter: "" },
    { name: "Green", hex: "#B3CEB5", filter: "hue-rotate(70deg) saturate(0.7)" },
    { name: "Pink", hex: "#F0C4C8", filter: "hue-rotate(-30deg) saturate(0.8)" },
    { name: "Starlight", hex: "#E8DFD0", filter: "saturate(0.2) brightness(1.3)" },
    { name: "Black", hex: "#1D1D1F", filter: "saturate(0) brightness(0.4)" },
  ],
  "iPhone 16 Pro Max": [
    { name: "Desert Titanium", hex: "#B5946A", filter: "" },
    { name: "Natural Titanium", hex: "#B0AFA7", filter: "saturate(0.3) brightness(1.1)" },
    { name: "White Titanium", hex: "#E8E5DF", filter: "saturate(0) brightness(1.4)" },
    { name: "Black Titanium", hex: "#3B3B3D", filter: "saturate(0) brightness(0.5)" },
  ],
  "iPhone 16 Pro": [
    { name: "Desert Titanium", hex: "#B5946A", filter: "" },
    { name: "Natural Titanium", hex: "#B0AFA7", filter: "saturate(0.3) brightness(1.1)" },
    { name: "White Titanium", hex: "#E8E5DF", filter: "saturate(0) brightness(1.4)" },
    { name: "Black Titanium", hex: "#3B3B3D", filter: "saturate(0) brightness(0.5)" },
  ],
  "iPhone 16 Plus": [
    { name: "Ultramarine", hex: "#5B6CC7", filter: "" },
    { name: "Teal", hex: "#6BA0A0", filter: "hue-rotate(40deg)" },
    { name: "Pink", hex: "#E8A0B0", filter: "hue-rotate(-60deg) saturate(0.8)" },
    { name: "White", hex: "#E8E5DF", filter: "saturate(0) brightness(1.4)" },
    { name: "Black", hex: "#1D1D1F", filter: "saturate(0) brightness(0.4)" },
  ],
  "iPhone 16": [
    { name: "Ultramarine", hex: "#5B6CC7", filter: "" },
    { name: "Teal", hex: "#6BA0A0", filter: "hue-rotate(40deg)" },
    { name: "Pink", hex: "#E8A0B0", filter: "hue-rotate(-60deg) saturate(0.8)" },
    { name: "White", hex: "#E8E5DF", filter: "saturate(0) brightness(1.4)" },
    { name: "Black", hex: "#1D1D1F", filter: "saturate(0) brightness(0.4)" },
  ],
  "AirPods Max": [
    { name: "Starlight", hex: "#E8DFD0", filter: "" },
    { name: "Midnight", hex: "#1D1D1F", filter: "saturate(0) brightness(0.4)" },
    { name: "Blue", hex: "#7BA3C7", filter: "hue-rotate(170deg) saturate(0.7)" },
    { name: "Purple", hex: "#B4A0C8", filter: "hue-rotate(220deg) saturate(0.6)" },
    { name: "Orange", hex: "#E8A070", filter: "hue-rotate(-20deg) saturate(1.2)" },
  ],
};

function getProductColors(product: Product): ColorOption[] {
  return productColors[product.name] || [];
}

function getProductSpecs(product: Product) {
  const specs: { label: string; value: string }[] = [];
  specs.push({ label: "Modelo", value: product.name });
  if (product.variant) {
    specs.push({ label: "Almacenamiento", value: product.variant });
  }
  specs.push({ label: "Categoria", value: product.category === "phones" ? "Smartphone" : "Audio" });
  if (product.category === "phones") {
    specs.push({ label: "Condicion", value: "Nuevo, sellado" });
    specs.push({ label: "Garantia", value: "Garantia oficial Apple" });
  } else {
    specs.push({ label: "Condicion", value: "Nuevo, sellado" });
    specs.push({ label: "Conectividad", value: "Bluetooth 5.3" });
  }
  specs.push({ label: "Envio", value: "A todo el pais" });
  return specs;
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const specs = getProductSpecs(product);
  const colors = getProductColors(product);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const activeColor = colors[selectedColorIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
        >
          <X className="w-4 h-4 text-[#0F172A]" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image — left side */}
          <div className="relative aspect-square md:w-1/2 flex-shrink-0 bg-gradient-to-br from-[#F8FAFF] to-[#EEF2FF]">
            <Image
              src={product.image}
              alt={product.fullName}
              fill
              className="object-contain p-8 transition-[filter] duration-300"
              style={activeColor?.filter ? { filter: activeColor.filter } : undefined}
              sizes="(max-width: 768px) 100vw, 384px"
            />
            {product.isNew && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1 bg-[#10B981] text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Nuevo
              </span>
            )}
          </div>

          {/* Details — right side */}
          <div className="p-6 md:w-1/2 flex flex-col justify-between">
            <div>
              <span className="text-[#3B7DFF] text-xs font-semibold font-[family-name:var(--font-mono)] uppercase tracking-wider">
                {categoryLabels[product.category] || product.category}
              </span>
              <h3 className="text-[#0F172A] text-xl sm:text-2xl font-bold mt-1">
                {product.fullName}
              </h3>

              {/* Stars */}
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
                ))}
                <span className="text-[#64748B] text-xs ml-1">5.0</span>
              </div>

              <p className="text-[#1B2D6E] text-2xl sm:text-3xl font-bold mt-4">
                {product.priceFormatted}
              </p>

              {/* Color selector */}
              {colors.length > 0 && (
                <div className="mt-4">
                  <p className="text-[#64748B] text-xs font-medium mb-2">
                    Color: <span className="text-[#0F172A] font-semibold">{activeColor?.name}</span>
                  </p>
                  <div className="flex gap-2">
                    {colors.map((color, i) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColorIndex(i)}
                        title={color.name}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          i === selectedColorIndex
                            ? "border-[#3B7DFF] scale-110 shadow-md"
                            : "border-[#E2EAFF] hover:border-[#94A3B8]"
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Specs table */}
              <div className="mt-5 space-y-0 border border-[#E2EAFF] rounded-xl overflow-hidden">
                {specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={`flex justify-between px-4 py-2.5 text-sm ${
                      i % 2 === 0 ? "bg-[#F8FAFF]" : "bg-white"
                    }`}
                  >
                    <span className="text-[#64748B] font-medium">{spec.label}</span>
                    <span className="text-[#0F172A] font-semibold text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <a
              href={product.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-semibold px-4 py-3.5 rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
