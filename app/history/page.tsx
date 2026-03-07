"use client";

import React, { useState } from "react";
import { useCart, HistoryItem } from "@/context/CartContext";
import {
  ShoppingBag,
  Calendar,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  ExternalLink,
  Printer,
  Package,
  Receipt,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function HistoryPage() {
  const { history } = useCart();
  const [selectedOrder, setSelectedOrder] = useState<HistoryItem | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("IDR", "Rp");
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col selection:bg-[#e75a40]/10 selection:text-[#e75a40]">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 pt-40 pb-64">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-gray-700 hover:text-black transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Kembali Belanja
              </span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight">
              Riwayat <span className="text-[#e75a40]">Pesanan</span>
            </h1>
            <p className="text-gray-500 font-medium mt-2">
              Kamu telah melakukan{" "}
              <span className="text-black font-bold">
                {history.length} transaksi
              </span>{" "}
              di Lumeriá.
            </p>
          </div>

          {history.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                <Clock className="w-10 h-10 text-gray-200" />
              </div>
              <h2 className="text-2xl font-black text-black uppercase mb-4 tracking-tight">
                Belum Ada Pesanan
              </h2>
              <p className="text-gray-400 font-medium max-w-sm mb-10 leading-relaxed">
                Riwayat pesanan kamu akan muncul di sini setelah kamu melakukan
                transaksi.
              </p>
              <Link
                href="/products"
                className="px-10 py-4 bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
              >
                Pesan Sekarang
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Order List */}
              <div className="lg:col-span-12 xl:col-span-7 space-y-3">
                {history.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full text-left group bg-white p-6 rounded-2xl border transition-all flex items-center gap-6 ${
                      selectedOrder?.id === order.id
                        ? "border-[#e75a40] ring-1 ring-[#e75a40]/20 shadow-md translate-x-1"
                        : "border-gray-100 hover:border-gray-200 shadow-sm"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl shrink-0 flex items-center justify-center transition-colors ${
                        selectedOrder?.id === order.id
                          ? "bg-[#e75a40]/10"
                          : "bg-gray-50"
                      }`}
                    >
                      <Package
                        className={`w-6 h-6 ${
                          selectedOrder?.id === order.id
                            ? "text-[#e75a40]"
                            : "text-gray-300"
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#e75a40]">
                              #{order.id}
                            </span>
                            <span className="text-xs font-bold text-gray-600">
                              {formatDate(order.date)}
                            </span>
                          </div>
                          <h3 className="text-lg font-black uppercase tracking-tight text-black mt-1">
                            {order.items.length} Produk
                          </h3>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className="text-xl font-black text-black italic">
                            {formatPrice(order.totalPrice)}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-green-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Sukses
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Detail Panel */}
              <div className="lg:col-span-12 xl:col-span-5">
                <div className="sticky top-40">
                  {selectedOrder ? (
                    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg animate-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-black p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#e75a40]/10 rounded-full blur-3xl pointer-events-none" />
                        <h2 className="text-white text-2xl font-black uppercase tracking-tight">
                          Nota <span className="text-[#e75a40]">Digital</span>
                        </h2>
                        <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.3em] mt-2">
                          Lumeriá &copy; Transaksi Terverifikasi
                        </p>
                      </div>

                      <div className="p-8 space-y-8">
                        {/* Customer Info */}
                        <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-50">
                          <div className="space-y-4">
                            <div>
                              <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                Customer
                              </span>
                              <span className="text-sm font-black text-black leading-none">
                                {selectedOrder.customerInfo.name}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">
                                WhatsApp
                              </span>
                              <span className="text-sm font-bold text-black leading-none">
                                {selectedOrder.customerInfo.phone}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">
                              Alamat Pengiriman
                            </span>
                            <span className="text-xs font-bold text-gray-500 leading-relaxed block h-20 overflow-y-auto pr-2">
                              {selectedOrder.customerInfo.address}
                            </span>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                            Detail Item
                          </h4>
                          <div className="space-y-3">
                            {selectedOrder.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-4"
                              >
                                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center p-1 border border-gray-100">
                                  <Image
                                    src={item.img}
                                    alt={item.name}
                                    width={30}
                                    height={30}
                                    className="object-contain"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="block text-xs font-black text-black uppercase tracking-tight truncate">
                                    {item.name}
                                  </span>
                                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    {item.quantity}x @ {item.price}
                                  </span>
                                </div>
                                <span className="text-sm font-black text-black">
                                  {formatPrice(
                                    item.priceNumber * item.quantity,
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Total */}
                        <div className="bg-gray-50 rounded-2xl p-6 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-gray-600 uppercase tracking-widest">
                              Subtotal
                            </span>
                            <span className="font-black text-black">
                              {formatPrice(selectedOrder.totalPrice)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
                            <span className="text-xs font-black text-black uppercase tracking-widest">
                              Total Bayar
                            </span>
                            <span className="text-2xl font-black text-[#e75a40] tracking-tight">
                              {formatPrice(selectedOrder.totalPrice)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <button className="flex-1 h-12 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#e75a40] transition-colors shadow-lg shadow-black/5 group">
                            <Printer className="w-4 h-4" />
                            Cetak Nota
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Receipt className="w-8 h-8 text-gray-200" />
                      </div>
                      <h3 className="text-lg font-black text-black uppercase tracking-widest">
                        Detail Pesanan
                      </h3>
                      <p className="text-xs text-gray-400 font-medium max-w-[200px] mt-4 leading-relaxed">
                        Pilih salah satu transaksi di samping untuk melihat nota
                        digital lengkap.
                      </p>
                    </div>
                  )}
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
