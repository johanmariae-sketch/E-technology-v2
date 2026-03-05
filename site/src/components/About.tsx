"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Truck, Headphones, CheckCircle2 } from "lucide-react";
import type { SiteContent } from "@/types/content";
import rawContent from "@/data/content.json";
const content = rawContent as SiteContent;

const features = [
  {
    icon: Zap,
    title: "Tecnología de Punta",
    description: "Los últimos dispositivos del mercado antes que nadie.",
    color: "bg-[#3B7DFF]/10 text-[#3B7DFF]",
  },
  {
    icon: Shield,
    title: "Garantía Oficial",
    description: "Todos nuestros productos con respaldo y garantía.",
    color: "bg-[#10B981]/10 text-[#10B981]",
  },
  {
    icon: Truck,
    title: "Envío Nacional",
    description: "Envíos rápidos con seguimiento a todo el país.",
    color: "bg-[#F59E0B]/10 text-[#F59E0B]",
  },
  {
    icon: Headphones,
    title: "Soporte Dedicado",
    description: "Atención personalizada antes y después de tu compra.",
    color: "bg-[#7C3AED]/10 text-[#7C3AED]",
  },
];

export default function About() {
  return (
    <section id="about" className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Philosophy / Manifesto */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0F172A] rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-14 mb-10 sm:mb-16 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#3B7DFF]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#7C3AED]/5 rounded-full blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[#3B7DFF] text-sm font-semibold font-[family-name:var(--font-mono)] uppercase tracking-wider">
                Nuestra filosofía
              </span>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-3 mb-4 sm:mb-6 leading-tight">
                La mayoría vende productos.
                <br />
                <span className="italic text-[#6BA1FF]" style={{ fontFamily: "Georgia, serif" }}>
                  Nosotros construimos confianza.
                </span>
              </h2>
              <p className="text-white/50 text-base leading-relaxed">
                {content.profile.bio.replace(/\n/g, " ")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              {[
                { number: content.profile.followers.toLocaleString(), label: "Seguidores" },
                { number: `${content.stats.totalPosts}+`, label: "Productos" },
                { number: content.profile.postsCount.toString(), label: "Publicaciones" },
                { number: "5★", label: "Calificación" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center">
                  <div className="font-[family-name:var(--font-heading)] text-lg sm:text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-white/40 text-[10px] sm:text-xs mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <div className="text-center mb-12">
          <span className="text-[#3B7DFF] text-sm font-semibold font-[family-name:var(--font-mono)] uppercase tracking-wider">
            Por qué elegirnos
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] mt-3">
            Todo lo que necesitas
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-lift bg-white border border-[#E2EAFF] rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-8"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${feature.color} flex items-center justify-center mb-3 sm:mb-5`}>
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-base sm:text-lg font-bold text-[#0F172A] mb-1.5 sm:mb-2">
                {feature.title}
              </h3>
              <p className="text-[#64748B] text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
