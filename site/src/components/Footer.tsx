"use client";

import { Instagram, MapPin, Phone } from "lucide-react";
import type { SiteContent } from "@/types/content";
import rawContent from "@/data/content.json";
const content = rawContent as SiteContent;

const footerLinks = {
  Categorías: ["Smartphones", "Tablets", "Accesorios", "Wearables"],
  Información: ["Sobre Nosotros", "Garantía", "Envíos", "Devoluciones"],
  Soporte: ["WhatsApp", "Instagram", "Visitar Tienda"],
};

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] rounded-t-2xl sm:rounded-t-[3rem] lg:rounded-t-[4rem] mt-[-1px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-6 sm:pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-10 pb-8 sm:pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#3B7DFF] flex items-center justify-center font-[family-name:var(--font-heading)] font-bold text-sm text-white">
                E
              </div>
              <span className="font-[family-name:var(--font-heading)] font-bold text-white">
                E Technology Store
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              Tu tienda de tecnología de confianza en Piantini, Santo Domingo. Los mejores productos al mejor precio.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`https://instagram.com/${content.profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#3B7DFF] hover:border-[#3B7DFF]/30 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-[family-name:var(--font-heading)] font-semibold text-white text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-6 sm:pt-8">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} E Technology Store. Todos los derechos reservados.
          </p>

          {/* System status */}
          <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
            <span className="text-white/40 text-xs font-[family-name:var(--font-mono)]">
              Tienda operativa
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
