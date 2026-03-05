"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Instagram, Menu, X } from "lucide-react";
import type { SiteContent } from "@/types/content";
import rawContent from "@/data/content.json";
const content = rawContent as SiteContent;

const navLinks = [
  { label: "Inicio", href: "#hero" },
  { label: "Productos", href: "#products" },
  { label: "Nosotros", href: "#about" },
  { label: "Contacto", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pt-3 sm:pt-4"
    >
      <nav
        className={`w-full max-w-6xl flex items-center justify-between px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-2xl shadow-lg shadow-[#1B2D6E]/5 border border-[#E2EAFF] rounded-[2rem]"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-[family-name:var(--font-heading)] font-bold text-sm transition-colors ${scrolled ? "bg-[#1B2D6E] text-white" : "bg-white text-[#1B2D6E]"}`}>
            E
          </div>
          <div>
            <span className={`font-[family-name:var(--font-heading)] font-bold text-sm tracking-tight transition-colors ${scrolled ? "text-[#0F172A]" : "text-white"}`}>
              E Technology
            </span>
            <div className={`flex items-center gap-1 text-[10px] transition-colors ${scrolled ? "text-[#64748B]" : "text-white/60"}`}>
              <MapPin className="w-2.5 h-2.5" />
              Piantini, RD
            </div>
          </div>
        </a>

        {/* Nav Links — Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                scrolled
                  ? "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F0F4FF]"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={`https://instagram.com/${content.profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-magnetic hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              scrolled
                ? "bg-[#1B2D6E] text-white hover:bg-[#2B4BAA]"
                : "bg-white text-[#1B2D6E] hover:bg-white/90"
            }`}
          >
            <Instagram className="w-4 h-4" />
            Seguir
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${scrolled ? "text-[#0F172A]" : "text-white"}`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-2 right-2 sm:left-4 sm:right-4 mt-2 bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-[2rem] border border-[#E2EAFF] shadow-xl p-3 sm:p-4 md:hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F0F4FF] text-sm font-medium transition-all"
            >
              {link.label}
            </a>
          ))}
          <a
            href={`https://instagram.com/${content.profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 mt-2 px-5 py-3 rounded-xl bg-[#1B2D6E] text-white text-sm font-semibold"
          >
            <Instagram className="w-4 h-4" />
            Seguir en Instagram
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}
