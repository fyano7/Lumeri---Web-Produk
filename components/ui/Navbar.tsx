"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  X,
  ArrowRight,
  Sparkles,
  Target,
  Users,
  Menu,
  MessageCircle,
  ShoppingBag,
  History,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

const SHOP_ITEMS = [
  {
    id: "coklat",
    name: "Piscok Coklat",
    desc: "Lumeran coklat premium yang melimpah, rasa klasik yang nggak pernah salah buat pecandu coklat.",
    img: "/rasa-piscok/rasa-coklat.webp",
    bg: "#4a2c2a",
    target: "piscok",
  },
  {
    id: "strawberry",
    name: "Piscok Strawberry",
    desc: "Rasa manis asam nan segar dari coklat strawberry asli yang meleleh berpadu dengan kulit renyah.",
    img: "/rasa-piscok/piscok-starberry.webp",
    bg: "#ffccd5",
    target: "piscok",
  },
  {
    id: "tiramisu",
    name: "Piscok Tiramisu",
    desc: "Sensasi klasik elegan, kekayaan rasa kopi dan coklat yang lumer di setiap gigitan.",
    img: "/rasa-piscok/piscok-tiramisu.webp",
    bg: "#e6ccb2",
    target: "piscok",
  },
  {
    id: "samyang",
    name: "Samyang Roll",
    desc: "Berani coba? Sensasi pedas gurih mi Samyang autentik berbalut kulit lumpia ekstra krispi.",
    img: "/rasa-samyang/samyang-yangsamyang.webp",
    bg: "#ffb5a7",
    target: "samyang",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const [hoveredProduct, setHoveredProduct] = useState(SHOP_ITEMS[0]);

  // Handle transparent to solid background on scroll
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setIsShopOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed top-0 w-full z-50 flex flex-col items-center">
      <CartDrawer />
      {/* Top Announcement Bar */}
      {isBannerVisible && (
        <div className="w-full bg-[#1b2b5b] text-white text-xs md:text-sm font-bold tracking-wide py-2 overflow-hidden relative transition-all duration-300">
          <div className="animate-marquee whitespace-nowrap flex items-center">
            <span className="mx-8">
              PROMO TERBATAS: PISCOK 10RB & SAMYANG 12RB (ISI 3 PCS) | GAS BELI
              SEBELUM KEHABISAN!
            </span>
            <span className="mx-8">
              PROMO TERBATAS: PISCOK 10RB & SAMYANG 12RB (ISI 3 PCS) | GAS BELI
              SEBELUM KEHABISAN!
            </span>
            <span className="mx-8">
              PROMO TERBATAS: PISCOK 10RB & SAMYANG 12RB (ISI 3 PCS) | GAS BELI
              SEBELUM KEHABISAN!
            </span>
            <span className="mx-8">
              PROMO TERBATAS: PISCOK 10RB & SAMYANG 12RB (ISI 3 PCS) | GAS BELI
              SEBELUM KEHABISAN!
            </span>
          </div>
          <X
            className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100 z-10 bg-[#1b2b5b] shadow-[-10px_0_10px_#1b2b5b]"
            onClick={() => setIsBannerVisible(false)}
          />
        </div>
      )}

      {/* Main Navbar Body */}
      <div
        className={`w-full flex justify-center px-4 relative perspective-1000 transition-all duration-300 ${isBannerVisible ? "mt-2" : "mt-4"}`}
      >
        <nav
          className={`w-full max-w-7xl flex items-center justify-between py-2 px-6 rounded-full transition-colors duration-500 ${isScrolled ? "bg-white/90 backdrop-blur-lg shadow-sm border border-black/5" : "bg-transparent"}`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer z-50"
          >
            <Image
              src="/logo/logo_lumeria.webp"
              alt="Lumeriá Logo"
              width={140}
              height={45}
              className="object-contain"
            />
          </Link>

          {/* Center Links */}
          <div className="hidden lg:flex items-center gap-2 font-semibold text-sm text-black">
            <Link
              href="/products"
              className="group relative flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#e75a40] to-[#ff8a75] text-white font-extrabold shadow-[0_10px_20px_-5px_rgba(231,90,64,0.4)] hover:shadow-[0_15px_25px_-5px_rgba(231,90,64,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden border border-white/20"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
              <span>Lihat Menu</span>
            </Link>

            <Link
              href="/history"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-white hover:bg-gray-50 transition-all shadow-sm border border-black/5 font-bold hover:scale-105 active:scale-95"
            >
              <History className="w-4 h-4 text-[#e75a40]" />
              Riwayat
            </Link>
            {/* About Us Menu */}
            <div
              className="relative group"
              onMouseEnter={() => setIsAboutOpen(true)}
              onMouseLeave={() => setIsAboutOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-white hover:bg-gray-50 transition-all shadow-sm border border-black/5 font-bold ${
                  isAboutOpen
                    ? "bg-gray-50 ring-2 ring-black/5 scale-[1.02]"
                    : ""
                }`}
              >
                About Us{" "}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${isAboutOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* About Dropdown */}
              <div
                className={`absolute top-full right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-black/5 overflow-hidden transition-all duration-500 origin-top-right z-50 ${
                  isAboutOpen
                    ? "opacity-100 translate-y-0 scale-100 visible"
                    : "opacity-0 -translate-y-4 scale-95 invisible"
                }`}
              >
                <div className="p-2 space-y-1">
                  {[
                    { label: "Our Story", href: "/about#story" },
                    { label: "Our Mission", href: "/about#mission" },
                    { label: "Meet the Team", href: "/about#team" },
                  ].map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.href}
                      onClick={() => setIsAboutOpen(false)}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#fdf8f5] group/item transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-600 group-hover/item:text-black transition-colors">
                          {link.label}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-[#e75a40]" />
                    </Link>
                  ))}
                </div>
                {/* Bottom Highlight */}
                <div className="bg-[#1b2b5b] p-4 text-center">
                  <Link
                    href="/about"
                    onClick={() => setIsAboutOpen(false)}
                    className="text-xs font-black text-white/90 uppercase tracking-[0.2em] hover:text-white transition-colors"
                  >
                    Explore Full Story
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 z-50 text-black">
            <button className="w-10 h-10 rounded-full bg-white hover:bg-gray-50 shadow-sm border border-black/5 flex items-center justify-center transition-all hover:scale-110 active:scale-95">
              <span className="font-bold text-sm">ID</span>
            </button>
            <Link
              href="/cart"
              className="relative w-10 h-10 rounded-full bg-white hover:bg-gray-50 shadow-sm border border-black/5 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#e75a40] text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </Link>
            <a
              href="https://wa.me/6281219186721"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#e75a40] text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:bg-[#d4482e]"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-full bg-white hover:bg-gray-50 shadow-sm border border-black/5 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white z-[100] transition-all duration-500 ease-in-out lg:hidden ${
          isMobileMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-12">
            <Image
              src="/logo/logo_lumeria.webp"
              alt="Lumeriá Logo"
              width={120}
              height={40}
              className="object-contain"
            />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-4xl font-black uppercase tracking-tighter ${pathname === "/" ? "text-[#e75a40]" : "text-black"}`}
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-4xl font-black uppercase tracking-tighter ${pathname.startsWith("/products") ? "text-[#e75a40]" : "text-black"}`}
            >
              Shop
            </Link>
            <Link
              href="/history"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-4xl font-black uppercase tracking-tighter ${pathname.startsWith("/history") ? "text-[#e75a40]" : "text-black"}`}
            >
              History
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-4xl font-black uppercase tracking-tighter ${pathname.startsWith("/about") ? "text-[#e75a40]" : "text-black"}`}
            >
              About Us
            </Link>
          </div>

          <div className="mt-auto pb-12">
            <a
              href="https://wa.me/628123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-5 rounded-full bg-[#e75a40] text-white font-black text-xl shadow-2xl"
            >
              <MessageCircle className="w-6 h-6" />
              PESAN SEKARANG
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
