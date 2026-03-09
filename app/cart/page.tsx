"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import {
  Plus,
  Minus,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    totalPrice,
    totalItems,
    getItemPrice,
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("IDR", "Rp");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col selection:bg-[#e75a40]/10 selection:text-[#e75a40]">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 pt-40 pb-64">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-gray-700 hover:text-black transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Lanjutkan Belanja
              </span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight">
              Keranjang <span className="text-[#e75a40]">Saya</span>
            </h1>
            <p className="text-gray-500 font-medium mt-2">
              Ada{" "}
              <span className="text-black font-bold">{totalItems} produk</span>{" "}
              tersimpan di keranjang kamu.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                <ShoppingBag className="w-10 h-10 text-gray-200" />
              </div>
              <h2 className="text-2xl font-black text-black uppercase mb-4 tracking-tight">
                Keranjang Kosong
              </h2>
              <p className="text-gray-500 font-medium max-w-sm mb-10 leading-relaxed">
                Kamu belum menambahkan apapun. Yuk, cari cemilan favoritmu
                sekarang!
              </p>
              <Link
                href="/products"
                className="px-10 py-4 bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
              >
                Mulai Belanja
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Product List */}
              <div className="lg:col-span-8 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-6"
                  >
                    <div className="w-24 h-24 bg-gray-50 rounded-xl p-3 shrink-0 flex items-center justify-center border border-gray-100">
                      <Image
                        src={item.img}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-black text-black uppercase tracking-tight truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm font-bold text-[#e75a40]">
                            {item.price}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-black hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Hapus"
                        >
                          <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-black"
                          >
                            <Minus className="w-4 h-4" strokeWidth={3} />
                          </button>
                          <span className="w-10 text-center text-sm font-black text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-black"
                          >
                            <Plus className="w-4 h-4" strokeWidth={3} />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-black italic">
                            {formatPrice(getItemPrice(item))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Link
                  href="/products"
                  className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-200 rounded-2xl text-gray-600 font-bold uppercase tracking-widest text-[10px] hover:border-[#e75a40] hover:text-[#e75a40] transition-all bg-white hover:bg-[#e75a40]/5"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Produk Lainnya
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm sticky top-40">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#e75a40] mb-8">
                    Ringkasan Pesanan
                  </h3>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-4">
                      <span className="font-bold text-gray-600 uppercase tracking-widest text-[10px]">
                        Total Item
                      </span>
                      <span className="font-black text-black">
                        {totalItems} Produk
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-4">
                      <span className="font-bold text-gray-600 uppercase tracking-widest text-[10px]">
                        Subtotal
                      </span>
                      <span className="font-black text-black">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-end pt-4">
                      <span className="text-xs font-black text-black uppercase tracking-widest">
                        Total Bayar
                      </span>
                      <span className="text-2xl font-black text-[#e75a40]">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/products/all/order"
                    className="w-full h-14 bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#e75a40] transition-all shadow-lg active:scale-95 group"
                  >
                    Check Out Sekarang
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] leading-relaxed">
                      Lumeriá &copy; Cemilan Pilihan Terpercaya
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
