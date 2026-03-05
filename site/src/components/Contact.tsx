"use client";

import { motion } from "framer-motion";
import { Instagram, MessageCircle, MapPin, Clock, ArrowRight } from "lucide-react";
import type { SiteContent } from "@/types/content";
import rawContent from "@/data/content.json";
const content = rawContent as SiteContent;

export default function Contact() {
  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-24 bg-[#F0F4FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#1B2D6E] to-[#3B7DFF] rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-14 text-center relative overflow-hidden"
        >
          {/* Decorative */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full -translate-y-3/4" />

          <div className="relative">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              ¿Listo para tu próximo
              <br />
              <span className="italic text-white/80" style={{ fontFamily: "Georgia, serif" }}>dispositivo?</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg max-w-xs sm:max-w-md mx-auto mb-6 sm:mb-8">
              Visítanos en nuestra tienda o escríbenos por WhatsApp para una atención inmediata.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={content.profile.externalUrl || "https://wa.me/"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-magnetic flex items-center justify-center gap-2 bg-white text-[#1B2D6E] px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-semibold text-sm group w-full sm:w-auto"
              >
                <MessageCircle className="w-5 h-5" />
                Escribir por WhatsApp
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href={`https://instagram.com/${content.profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-magnetic flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-semibold text-sm hover:bg-white/20 w-full sm:w-auto"
              >
                <Instagram className="w-5 h-5" />
                Instagram
              </a>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-[#E2EAFF] rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 flex items-start gap-3 sm:gap-4"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#3B7DFF]/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#3B7DFF]" />
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-heading)] font-bold text-[#0F172A]">Ubicación</h3>
              <p className="text-[#64748B] text-sm mt-1">Av. Abraham Lincoln, Piantini, Santo Domingo, RD</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-[#E2EAFF] rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 flex items-start gap-3 sm:gap-4"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#10B981]" />
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-heading)] font-bold text-[#0F172A]">Horario</h3>
              <p className="text-[#64748B] text-sm mt-1">L-V: 9:30AM — 8:00PM<br />S: 9:30AM — 6:00PM</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-[#E2EAFF] rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 flex items-start gap-3 sm:gap-4"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center flex-shrink-0">
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-[#7C3AED]" />
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-heading)] font-bold text-[#0F172A]">Redes</h3>
              <p className="text-[#64748B] text-sm mt-1">@{content.profile.username}<br />{content.profile.followers.toLocaleString()} seguidores</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
