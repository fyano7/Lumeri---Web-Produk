"use client";

import React, { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    totalPrice,
    totalItems,
    getItemPrice,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen, setIsCartOpen]);

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
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-500 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[101] shadow-2xl transition-transform duration-500 ease-out transform ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#e75a40]/10 rounded-2xl flex items-center justify-center text-[#e75a40]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-black uppercase tracking-tighter">
                Keranjang <span className="text-[#e75a40]">Belanja</span>
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {totalItems} Item Tersimpan
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors group"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-gray-200" />
              </div>
              <h3 className="text-lg font-black text-black uppercase">
                Keranjang Kosong
              </h3>
              <p className="text-sm text-gray-400 font-medium max-w-[200px]">
                Sepertinya kamu belum memilih produk favoritmu.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-8 py-3 bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="group relative flex gap-4 p-4 rounded-[2rem] bg-gray-50/50 border border-transparent hover:border-black/5 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="w-20 h-20 bg-white rounded-2xl p-2 shadow-sm shrink-0 border border-black/5 flex items-center justify-center">
                  {item.img ? (
                    <Image
                      src={item.img}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="object-contain rounded-xl"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-black leading-tight uppercase text-sm">
                      {item.name}
                    </h4>
                    <p className="text-xs font-bold text-[#e75a40] mt-1">
                      {formatPrice(getItemPrice(item))}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center bg-white border border-black/10 rounded-full p-1 shadow-sm">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-black"
                      >
                        <Minus className="w-3.5 h-3.5" strokeWidth={3} />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-black"
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-4 right-4 p-2 text-black hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 md:p-8 bg-white border-t border-gray-100 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.1)]">
            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                  Subtotal
                </span>
                <span className="text-black font-black">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                  Biaya Layanan
                </span>
                <span className="text-black font-black">Rp 0</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-sm font-black text-black uppercase tracking-widest">
                  Total Bayar
                </span>
                <span className="text-2xl font-black text-[#e75a40]">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            <Link
              href="/products/all/order"
              onClick={() => setIsCartOpen(false)}
              className="w-full h-16 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl group"
            >
              Pesan Sekarang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
