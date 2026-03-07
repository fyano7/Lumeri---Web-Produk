"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { PRODUCTS } from "@/constants/products";
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductsPage() {
  const { addToCart } = useCart();
  return (
    <div className="min-h-screen bg-[#fdf8f5] font-sans selection:bg-black selection:text-white">
      <Navbar />

      <main className="pt-40 md:pt-32 pb-20 md:pb-40 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e75a40]/10 text-[#e75a40] text-xs font-black uppercase tracking-widest hover:bg-[#e75a40] hover:text-white transition-all duration-300 mb-6 group shadow-sm border border-[#e75a40]/20"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              Kembali ke Beranda
            </Link>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none">
              Daftar <br /> <span className="text-[#e75a40]">Produk Kami</span>
            </h1>
          </div>
          <p className="max-w-md text-gray-500 font-medium text-base md:text-lg leading-relaxed">
            Pilih varian favoritmu. Dari Piscok yang lumer hingga Samyang yang
            pedas nampol, semua dibuat dengan bahan terbaik.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-12">
          {PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group relative bg-white border border-black/5 rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row"
            >
              {/* Image side */}
              <div
                className="w-full md:w-2/5 aspect-square relative overflow-hidden transition-colors duration-500"
                style={{ backgroundColor: `${product.bg}40` }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-3 md:p-8 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3">
                  <Image
                    src={product.img}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/80 backdrop-blur-md text-gray-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-black/5">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Content side */}
              <div className="flex-1 p-3 md:p-8 flex flex-col justify-between">
                <div>
                  <h2 className="text-base md:text-3xl font-black text-black mb-1 md:mb-3 group-hover:text-[#e75a40] transition-colors line-clamp-1">
                    {product.name}
                  </h2>
                  <p className="text-gray-500 hidden md:line-clamp-3 text-sm leading-relaxed mb-6 font-medium">
                    {product.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 md:pt-6 border-t border-gray-100">
                  <span className="text-base md:text-2xl font-black text-black">
                    {product.price}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="w-7 h-7 md:w-12 md:h-12 bg-white border border-black/5 text-black rounded-full flex items-center justify-center transition-all hover:scale-110 hover:bg-gray-50 shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 md:w-5 md:h-5" />
                    </button>
                    <div className="w-7 h-7 md:w-12 md:h-12 bg-black text-white rounded-full flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-[#e75a40]">
                      <ArrowRight className="w-3.5 h-3.5 md:w-5 md:h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-20 md:mt-32 p-8 md:p-12 bg-[#1b2b5b] rounded-[2rem] md:rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative group text-center md:text-left">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10 flex-1">
            <h2 className="text-3xl md:text-5xl font-black uppercase mb-4 leading-none">
              Sudah Menentukan <br />{" "}
              <span className="text-pink-400">Pilihanmu?</span>
            </h2>
            <p className="text-white/70 font-medium max-w-md text-sm md:text-base">
              Beli sekarang dan rasakan lumeran coklat yang tak terlupakan
              langsung di tanganmu.
            </p>
          </div>
          <a
            href="https://wa.me/628123456789?text=Halo%20Lumeri%C3%A1,%20saya%20ingin%20memesan%20produknya!"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 bg-white text-[#1b2b5b] px-8 md:px-10 py-4 md:py-5 rounded-full font-black text-lg md:text-xl hover:scale-105 transition-transform flex items-center gap-3"
          >
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
            Pesan Sekarang
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
