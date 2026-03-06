"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  ChevronDown,
  X,
  ArrowRight,
  Sparkles,
  Target,
  Users,
  Menu,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SHOP_ITEMS = [
  {
    id: "matcha",
    name: "Piscok Matcha",
    desc: "Lumeran coklat premium dengan balutan teh hijau khas Jepang (Matcha) yang wangi dan creamy.",
    img: "/rasa-piscok/piscok-matcha.webp",
    bg: "#c2d8b9",
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
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      {/* Top Announcement Bar */}
      {isBannerVisible && (
        <div className="w-full bg-[#1b2b5b] text-white text-xs md:text-sm font-bold tracking-wide py-2 overflow-hidden relative transition-all duration-300">
          <div className="animate-marquee whitespace-nowrap flex items-center">
            <span className="mx-8">
              PROMO TERBATAS: HARGA SPESIAL HANYA 10RB | CEPAT SEGERA BELI
              SEBELUM KEHABISAN!
            </span>
            <span className="mx-8">
              PROMO TERBATAS: HARGA SPESIAL HANYA 10RB | CEPAT SEGERA BELI
              SEBELUM KEHABISAN!
            </span>
            <span className="mx-8">
              PROMO TERBATAS: HARGA SPESIAL HANYA 10RB | CEPAT SEGERA BELI
              SEBELUM KEHABISAN!
            </span>
            <span className="mx-8">
              PROMO TERBATAS: HARGA SPESIAL HANYA 10RB | CEPAT SEGERA BELI
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
            {/* Shop Dropdown Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setIsShopOpen(true)}
              onMouseLeave={() => setIsShopOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm border border-black/5 ${isShopOpen ? "ring-2 ring-black/20" : ""}`}
              >
                Shop{" "}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${isShopOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Mega Menu Dropdown */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[700px] bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-black/5 overflow-hidden transition-all duration-500 origin-top
                  ${isShopOpen ? "opacity-100 scale-y-100 pointer-events-auto translate-y-0" : "opacity-0 scale-y-95 pointer-events-none -translate-y-4"}
                `}
              >
                <div className="flex h-[380px]">
                  {/* Left Column: Product Links */}
                  <div className="w-1/2 p-6 flex flex-col gap-2 border-r border-gray-100">
                    <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 px-4">
                      Lumeri Menu
                    </h4>
                    {SHOP_ITEMS.map((item) => (
                      <Link
                        key={item.id}
                        href={`/products/${item.id}`}
                        onMouseEnter={() => setHoveredProduct(item)}
                        onClick={() => setIsShopOpen(false)}
                        className={`px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-between group
                          ${hoveredProduct.id === item.id ? "bg-gray-50" : "hover:bg-gray-50/50"}
                        `}
                      >
                        <span
                          className={`font-bold transition-colors ${hoveredProduct.id === item.id ? "text-black" : "text-gray-600"}`}
                        >
                          {item.name}
                        </span>
                        <ArrowRight
                          className={`w-4 h-4 transition-all duration-300 ${hoveredProduct.id === item.id ? "opacity-100 translate-x-0 text-black" : "opacity-0 -translate-x-2"}`}
                        />
                      </Link>
                    ))}

                    <div className="mt-auto px-4">
                      <Link
                        href="/products"
                        onClick={() => setIsShopOpen(false)}
                        className="text-sm font-bold text-[#e75a40] hover:text-[#d4482e] transition-colors underline underline-offset-4 decoration-2"
                      >
                        View all products
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Dynamic Hover Data */}
                  <div className="w-1/2 p-6 relative overflow-hidden bg-gray-50 flex flex-col items-center justify-center">
                    <div
                      className="absolute inset-0 transition-colors duration-700 opacity-20"
                      style={{ backgroundColor: hoveredProduct.bg }}
                    />

                    <div className="relative z-10 flex flex-col items-center text-center">
                      {/* Product Image */}
                      <div className="w-40 h-40 relative mb-4 transition-transform duration-500 hover:scale-110 hover:-rotate-3 drop-shadow-2xl">
                        <Image
                          src={hoveredProduct.img}
                          alt={hoveredProduct.name}
                          fill
                          className="object-contain"
                          key={hoveredProduct.id} // Forces re-render animation on image swap
                        />
                      </div>

                      {/* Product Data */}
                      <h3 className="text-xl font-extrabold mb-2">
                        {hoveredProduct.name}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed max-w-[80%]">
                        {hoveredProduct.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/products"
              className="group relative flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#e75a40] to-[#ff8a75] text-white font-extrabold shadow-[0_10px_20px_-5px_rgba(231,90,64,0.4)] hover:shadow-[0_15px_25px_-5px_rgba(231,90,64,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden border border-white/20"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:rotate-12" />
              <span>Beli sekarang</span>
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
                    { label: "Meet the Team", href: "/#creators" },
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
              href="/products"
              className="w-10 h-10 rounded-full bg-[#e75a40] text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:bg-[#d4482e]"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:rotate-12" />
            </Link>

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
              className="text-4xl font-black uppercase tracking-tighter"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-4xl font-black uppercase tracking-tighter"
            >
              Shop
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-4xl font-black uppercase tracking-tighter"
            >
              About Us
            </Link>
          </div>

          <div className="mt-auto pb-12">
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-3 w-full py-5 rounded-full bg-[#1b2b5b] text-white font-black text-xl shadow-2xl"
            >
              <ShoppingBag className="w-6 h-6" />
              BELI SEKARANG
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
