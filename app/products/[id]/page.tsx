"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { PRODUCTS } from "@/constants/products";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Heart,
  Share2,
  Info,
} from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black mb-4">Produk Tidak Ditemukan</h1>
        <Link href="/products" className="text-[#e75a40] font-bold underline">
          Kembali ke Daftar Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
      <Navbar />

      <main className="pt-32 pb-40 px-6 max-w-7xl mx-auto">
        <Link
          href="/products"
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Kembali ke Daftar Produk
        </Link>

        <div className="flex flex-col lg:flex-row gap-16 md:gap-24">
          {/* Left: Product Image Section */}
          <div className="flex-1">
            <div
              className="relative aspect-square rounded-[3rem] overflow-hidden flex items-center justify-center p-12 transition-all duration-700"
              style={{ backgroundColor: `${product.bg}30` }}
            >
              {/* Floating Badge */}
              <div className="absolute top-8 left-8 z-10">
                <span className="bg-white text-black font-black text-xs uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-lg">
                  Best Seller
                </span>
              </div>

              <Image
                src={product.img}
                alt={product.name}
                width={500}
                height={500}
                className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] transition-transform duration-700 hover:scale-110"
                priority
              />
            </div>

            {/* Thumbnails placeholder */}
            <div className="flex gap-4 mt-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-24 h-24 rounded-2xl border-2 flex items-center justify-center p-4 cursor-pointer transition-all ${i === 1 ? "border-[#e75a40] bg-gray-50" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <Image
                    src={product.img}
                    alt="thumb"
                    width={60}
                    height={60}
                    className="object-contain opacity-60"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Details Section */}
          <div className="flex-1 flex flex-col pt-4">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#e75a40] font-black uppercase tracking-widest text-xs">
                  {product.category}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-gray-400 ml-1">
                    5.0 (124 reviews)
                  </span>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-black mb-6 leading-none tracking-tight">
                {product.name}
              </h1>
              <p className="text-3xl font-black text-[#e75a40] mb-8">
                {product.price}
              </p>
              <p className="text-gray-500 font-medium text-lg leading-relaxed mb-10">
                {product.longDesc}
              </p>
            </div>

            {/* Stats / Nutrition Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {Object.entries(product.nutrition).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center"
                >
                  <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">
                    {key}
                  </span>
                  <span className="text-lg font-black text-black">
                    {value as string}
                  </span>
                </div>
              ))}
            </div>

            {/* Ingredients & Benefits Section */}
            <div className="flex flex-col md:flex-row gap-6 mb-12">
              <div className="flex-1 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                <h4 className="font-black text-black uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#e75a40] rounded-full"></div>
                  Bahan Utama
                </h4>
                <ul className="grid grid-cols-1 gap-2">
                  {(product as any).ingredients.map(
                    (ing: string, i: number) => (
                      <li
                        key={i}
                        className="text-sm font-bold text-gray-600 flex items-center gap-2"
                      >
                        <span className="text-[#e75a40]">•</span> {ing}
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <div className="flex-1 bg-[#1b2b5b]/5 p-6 rounded-[2rem] border border-[#1b2b5b]/10">
                <h4 className="font-black text-[#1b2b5b] uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1b2b5b] rounded-full"></div>
                  Manfaat & Keunggulan
                </h4>
                <p className="text-sm font-bold text-[#1b2b5b]/80 leading-relaxed italic">
                  "{(product as any).benefits}"
                </p>
              </div>
            </div>

            {/* CTA's */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="flex-1 h-16 bg-black text-white rounded-full font-black text-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 shadow-xl">
                <ShoppingCart className="w-6 h-6" />
                Tambah ke Keranjang
              </button>
              <button className="w-16 h-16 border-2 border-gray-100 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Heart className="w-6 h-6 text-gray-400" />
              </button>
              <button className="w-16 h-16 border-2 border-gray-100 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Share2 className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="p-6 bg-[#fdf8f5] rounded-3xl border border-black/5 flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                <Info className="w-6 h-6 text-[#e75a40]" />
              </div>
              <div>
                <h4 className="font-bold text-black mb-1">
                  Informasi Pengiriman
                </h4>
                <p className="text-sm text-gray-500 font-medium">
                  Hanya melayani transaksi di lingkungan sekolah. Bisa COD
                  langsung atau kami antar langsung ke kelasmu!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
