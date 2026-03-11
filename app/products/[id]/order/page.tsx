"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { toBlob } from "html-to-image";
import {
  ArrowLeft,
  CheckCircle2,
  User,
  School,
  Phone,
  CreditCard,
  MapPin,
  ChevronRight,
  Printer,
  Download,
  Calendar,
  Clock,
  Navigation,
  Info,
  Copy,
  Check,
  ShoppingBag,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { PRODUCTS } from "@/constants/products";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

const DAYS = [
  { id: "Senin", label: "Senin" },
  { id: "Selasa", label: "Selasa" },
  { id: "Rabu", label: "Rabu" },
  { id: "Kamis", label: "Kamis" },
  { id: "Jumat", label: "Jumat" },
  { id: "Sabtu", label: "Sabtu" },
  { id: "Minggu", label: "Minggu", disabled: true },
];

const TIME_SLOTS = [
  "Istirahat 1",
  "Istirahat 2",
  "Pulang Sekolah",
  "Area TB (WhatsApp)",
];

const TIKUM_OPTIONS = ["Kelas", "Kantin", "Area TB (WhatsApp)"];

export default function OrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const { items, history, totalPrice, clearCart, addToHistory } = useCart();
  const [dbDirectProduct, setDbDirectProduct] = useState<any | null>(null);

  // Determine checkout mode: single product or entire cart
  const isDirectCheckout = id !== "all";

  const staticDirectProduct = isDirectCheckout
    ? PRODUCTS.find((p) =>
        String(p.id || "").toLowerCase() === String(id || "").toLowerCase() ||
        String((p as any).slug || "").toLowerCase() === String(id || "").toLowerCase() ||
        String(p.name || "").toLowerCase() === String(id || "").toLowerCase(),
      )
    : null;

  const directProduct = isDirectCheckout
    ? dbDirectProduct || staticDirectProduct
    : null;

  // Items to be checked out
  const checkoutItems =
    isDirectCheckout && directProduct
      ? [
          {
            id: directProduct.id,
            name: directProduct.name,
            price: directProduct.price,
            priceNumber: Number(
              directProduct.price
                ? String(directProduct.price)
                    .replace(/[^0-9]/g, "")
                : 0,
            ),
            img: directProduct.image_url || directProduct.img || directProduct.image,
            quantity: 1,
          },
        ]
      : items;

  const orderTotal = (() => {
    if (isDirectCheckout && directProduct) {
      const priceValue = directProduct.price;
      if (typeof priceValue === "number") return priceValue;
      if (typeof priceValue === "string") {
        const cleaned = priceValue.replace(/[^0-9]/g, "");
        return Number(cleaned) || 0;
      }
      return 0;
    }
    return totalPrice;
  })();

  const [step, setStep] = useState<"form" | "receipt">("form");
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    phone: "",
    payment: "Cash",
    tikum: "Kelas",
    day: "Senin",
    time: "Istirahat 1",
  });

  const [orderId, setOrderId] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Freeze the data on submit so the receipt doesn't render empty when the cart clears
  const [finalOrderData, setFinalOrderData] = useState<{
    items: typeof checkoutItems;
    total: number;
  } | null>(null);

  const displayItems = finalOrderData ? finalOrderData.items : checkoutItems;
  const displayTotal = finalOrderData ? finalOrderData.total : orderTotal;

  useEffect(() => {
    const date = new Date();
    const random = Math.floor(1000 + Math.random() * 9000);
    setOrderId(`LMR-${date.getDate()}${date.getMonth() + 1}-${random}`);

    // Auto-select today if it's not Sunday
    const dayNames = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const todayName = dayNames[date.getDay()];
    if (todayName !== "Minggu") {
      setFormData((prev) => ({ ...prev, day: todayName }));
    }
  }, []);

  // Ambil data produk dari DB kalau direct checkout
  useEffect(() => {
    if (isDirectCheckout && id) {
      const fetchDirectProduct = async () => {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          const { data: slugData, error: slugError } = await supabase
            .from("products")
            .select("*")
            .eq("slug", id)
            .single();

          if (!slugError && slugData) {
            setDbDirectProduct(slugData);
          } else {
            setDbDirectProduct(null);
          }
        } else if (data) {
          setDbDirectProduct(data);
        }

        setDirectLoading(false);
      };

      fetchDirectProduct();
    } else {
      setDirectLoading(false);
    }
  }, [id, isDirectCheckout]);

  const [directLoading, setDirectLoading] = useState(isDirectCheckout);

  // Redirect if no items to checkout
  useEffect(() => {
    if (
      !isSubmitting &&
      step === "form" &&
      checkoutItems.length === 0 &&
      (!isDirectCheckout || (isDirectCheckout && !directLoading))
    ) {
      router.push("/products");
    }
  }, [checkoutItems, router, step, isSubmitting, isDirectCheckout, directLoading]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("IDR", "Rp");
  };

  const sendToTelegram = async (id: string, data: typeof formData) => {
    const BOT_TOKEN = "8776066334:AAFL_uTVOk5pctW70fMpoDlrBS2dzbaj3Cw";
    const CHAT_ID = "5310430098";

    // Capture the visual receipt
    let imageBlob: Blob | null = null;
    if (receiptRef.current) {
      try {
        imageBlob = await toBlob(receiptRef.current, {
          backgroundColor: "#fef3f2",
          quality: 0.95,
        });
      } catch (err) {
        console.error("Failed to capture receipt image:", err);
      }
    }

    const formattedWA = data.phone.startsWith("0")
      ? "62" + data.phone.slice(1)
      : data.phone;

    // Use displayItems instead of checkoutItems
    const itemsList = displayItems
      .map((item) => `- ${item.name} (${item.quantity}x) - ${item.price}`)
      .join("\n");

    const text = `LUMERIÁ - NOTIFIKASI PESANAN BARU
------------------------------------
ORDER ID: ${id}
------------------------------------

DATA PELANGGAN
- Nama: ${data.name}
- Kelas: ${data.class}
- WhatsApp: [Chat via WhatsApp](https://wa.me/${formattedWA}?text=Halo%20${encodeURIComponent(data.name)}%2C%20saya%20dari%20Lumeriá.%20Pesanan%20Anda%20dengan%20ID%20${id}%20sedang%20kami%20proses.) (${data.phone})

JADWAL PENGAMBILAN
- Hari: ${data.day}
- Waktu: ${data.time}
- Tempat: ${data.tikum}

DETAIL PESANAN
${itemsList}

TOTAL BAYAR: ${formatPrice(displayTotal)}
METODE BAYAR: ${data.payment}

------------------------------------
Silakan segera konfirmasi pesanan ini.
------------------------------------`;

    try {
      // 1. Send the visual receipt image if captured
      if (imageBlob) {
        const formData = new FormData();
        formData.append("chat_id", CHAT_ID);
        formData.append("photo", imageBlob, "receipt.png");

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
          method: "POST",
          body: formData,
        });
      }

      // 2. Send the professional text details
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: "Markdown",
        }),
      });
    } catch (error) {
      console.error("Telegram notification failed:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Freeze order data
    setFinalOrderData({ items: checkoutItems, total: orderTotal });

    // Save to history (local state)
    addToHistory({
      name: formData.name,
      phone: formData.phone,
      address: `${formData.class} - ${formData.tikum} (${formData.day}, ${formData.time})`,
      notes: `Metode: ${formData.payment}`,
    });

    // Create order di DB explicit (sesuai schema orders)
    let createdOrderId: string | null = null;
    try {
      const orderPayload = {
        customer_name: formData.name,
        customer_class: formData.class,
        customer_phone: formData.phone,
        payment_method: formData.payment,
        pickup_point: `${formData.class} - ${formData.tikum}`,
        total_price: orderTotal,
        status: "Pending",
      };

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert(orderPayload)
        .select("id")
        .single();

      if (orderError || !orderData) {
        console.error("Gagal simpan order di DB:", orderError ?? "unknown error", {
          payload: orderPayload,
        });
        setIsSubmitting(false);
        alert(
          "Gagal menyimpan pesanan. Cek koneksi Supabase atau rule keamanan tabel orders."
        );
        return;
      }

      createdOrderId = orderData.id;
    } catch (err) {
      console.error("Exception simpan order:", err);
      setIsSubmitting(false);
      alert("Terjadi kesalahan saat menyimpan pesanan. Coba lagi.");
      return;
    }

    if (createdOrderId) {
      try {
        // Prepare order_items rows
        const batchItems = await Promise.all(
          checkoutItems.map(async (item) => {
            let productId: string | null = null;

            // If direct checkout uses db data, gunakan id langsung
            if (isDirectCheckout && dbDirectProduct) {
              productId = dbDirectProduct.id;
            } else if (item.id) {
              // Cari produk di DB dengan id/slug/nama!
              const itemId = String(item.id);
              const { data: found } = await supabase
                .from("products")
                .select("id")
                .or(`id.eq.${itemId},slug.eq.${itemId},name.eq.${itemId}`)
                .limit(1)
                .single();
              if (found && found.id) productId = found.id;
            }

            return {
              order_id: createdOrderId,
              product_id: productId,
              quantity: item.quantity || 1,
              subtotal: item.priceNumber || Number(item.price.toString().replace(/[^0-9]/g, "")) || 0,
            };
          }),
        );

        // Insert order_items; ignore jika tidak ada product_id, tetapi tetap simpan stok
        const insertableItems = batchItems.filter((it) => it.product_id);
        if (insertableItems.length > 0) {
          const { error: itemsError } = await supabase
            .from("order_items")
            .insert(insertableItems);
          if (itemsError) {
            console.error("Gagal simpan order_items di DB:", itemsError);
          }
        }
      } catch (err) {
        console.error("Exception simpan order_items:", err);
      }
    }

    // Switch to receipt first so it renders and can be captured
    setStep("receipt");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Clear cart if not direct checkout
    if (!isDirectCheckout) {
      // We don't clear immediately to ensure receipt renders correctly
      // It's handled after submission finishes
    }
  };

  // Trigger telegram sending after receipt renders
  useEffect(() => {
    if (step === "receipt" && orderId && isSubmitting) {
      // Small delay to ensure styles are fully applied before capture
      const timer = setTimeout(() => {
        sendToTelegram(orderId, formData).finally(() => {
          setIsSubmitting(false);
          if (!isDirectCheckout) {
            clearCart();
          }
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [step, orderId, isSubmitting, isDirectCheckout, clearCart]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(orderId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (displayItems.length === 0 && step === "form" && !isSubmitting) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-[#fdf8f5] font-sans selection:bg-black selection:text-white overflow-hidden">
      <Navbar />

      <main className="pt-40 md:pt-48 pb-32 px-4 md:px-6 max-w-2xl mx-auto relative z-10">
        {step === "form" ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Link
              href={isDirectCheckout ? `/products/${id}` : "/products"}
              className="inline-flex items-center gap-2 text-[#e75a40] text-sm font-black uppercase tracking-widest mb-8 hover:translate-x-[-4px] transition-transform"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <h1 className="text-4xl font-black uppercase tracking-tighter text-black leading-none">
                Konfirmasi <br />{" "}
                <span className="text-[#e75a40]">Pesananmu</span>
              </h1>
              <div className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-black/5 flex items-center gap-3">
                <div className="flex -space-x-4">
                  {displayItems.slice(0, 3).map((item, idx) => (
                    <div
                      key={item.id}
                      className="w-10 h-10 rounded-xl bg-white p-1 shadow-sm border border-black/5 relative overflow-hidden"
                      style={{ zIndex: 10 - idx }}
                    >
                      <Image
                        src={item.img}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                  {displayItems.length > 3 && (
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center text-[10px] font-black border border-white z-0">
                      +{displayItems.length - 3}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                    {displayItems.length} Item Terpilih
                  </p>
                  <p className="text-sm font-black text-black">
                    {formatPrice(displayTotal)}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pesanan Section */}
              <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-black/5">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-[#e75a40]" />
                    <h2 className="font-black text-black uppercase tracking-wider text-xs">
                      Identitas Pengambil
                    </h2>
                  </div>
                  <span className="text-[10px] font-black text-gray-500 uppercase">
                    Wajib Diisi
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">
                      Nama Lengkap
                    </label>
                    <input
                      required
                      placeholder="Nama Anda"
                      type="text"
                      className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-[#e75a40] focus:bg-white rounded-2xl px-6 font-bold text-black outline-none transition-all placeholder:text-gray-300"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">
                      Kelas / Unit
                    </label>
                    <input
                      required
                      placeholder="Contoh: XI RPL 1"
                      type="text"
                      className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-[#e75a40] focus:bg-white rounded-2xl px-6 font-bold text-black outline-none transition-all placeholder:text-gray-300"
                      value={formData.class}
                      onChange={(e) =>
                        setFormData({ ...formData, class: e.target.value })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">
                      No. WhatsApp Aktif
                    </label>
                    <input
                      required
                      placeholder="08xxxxxxxxxx"
                      type="tel"
                      className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-[#e75a40] focus:bg-white rounded-2xl px-6 font-bold text-black outline-none transition-all placeholder:text-gray-300"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Section */}
              <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-black/5">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#e75a40]" />
                    <h2 className="font-black text-black uppercase tracking-wider text-xs">
                      Jadwal Pengambilan
                    </h2>
                  </div>
                  <Info className="w-4 h-4 text-gray-300" />
                </div>

                <div className="mb-8">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-4">
                    Pilih Hari
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((day) => (
                      <button
                        key={day.id}
                        type="button"
                        disabled={day.disabled}
                        onClick={() =>
                          setFormData({ ...formData, day: day.id })
                        }
                        className={`px-4 py-3 rounded-xl font-bold text-xs transition-all border-2 ${
                          day.disabled
                            ? "bg-red-50 text-red-500 border-red-100 cursor-not-allowed grayscale"
                            : formData.day === day.id
                              ? "bg-black text-white border-black shadow-lg"
                              : "bg-gray-50 text-gray-400 border-transparent hover:border-gray-200"
                        }`}
                      >
                        {day.label}
                        {day.disabled && (
                          <span className="block text-[8px] font-black uppercase opacity-50">
                            Libur
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-4">
                    Pilih Sesi
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setFormData({ ...formData, time: time })}
                        className={`px-3 py-4 rounded-xl font-bold text-[10px] text-center transition-all border-2 ${
                          formData.time === time
                            ? "bg-[#e75a40] text-white border-[#e75a40] shadow-md"
                            : "bg-gray-50 text-gray-400 border-transparent hover:border-gray-200"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delivery Section */}
              <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-black/5">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                  <Navigation className="w-5 h-5 text-[#e75a40]" />
                  <h2 className="font-black text-black uppercase tracking-wider text-xs">
                    Lokasi Penyerahan
                  </h2>
                </div>

                <div className="mb-8">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-4">
                    Titik Kumpul (Tikum)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIKUM_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData({ ...formData, tikum: opt })}
                        className={`px-2 py-4 rounded-xl font-bold text-[10px] text-center transition-all border-2 ${
                          formData.tikum === opt
                            ? "bg-black text-white border-black shadow-md"
                            : "bg-gray-50 text-gray-400 border-transparent hover:border-gray-200"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-4">
                    Metode Pembayaran
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Cash", "Transfer"].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, payment: method })
                        }
                        className={`h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all border-2 ${
                          formData.payment === method
                            ? "bg-[#e75a40] text-white border-[#e75a40] shadow-lg shadow-[#e75a40]/30"
                            : "bg-gray-50 text-gray-400 border-transparent hover:border-gray-200"
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full h-20 bg-black text-white rounded-3xl font-black text-xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4 mt-12 group ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    Konfirmasi Pesanan
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-in zoom-in-95 fade-in duration-700">
            {/* Success Heading */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-black mb-3 uppercase tracking-tighter">
                Nota <span className="text-[#e75a40]">Digital</span>
              </h1>
              <p className="text-gray-400 font-bold max-w-xs mx-auto text-sm leading-relaxed">
                Pesanan sedang diproses. <br />
                Simpan atau tunjukkan nota ini ke admin saat mengambil
                pesananmu.
              </p>
            </div>

            {/* HIGH FIDELITY RECEIPT CARD */}
            <div
              ref={receiptRef}
              className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden border border-black/5 mb-10 relative"
            >
              {/* Receipt Top Header */}
              <div className="h-6 bg-[#e75a40] block relative">
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
              </div>

              <div className="p-8 md:p-12">
                {/* Branding Section */}
                <div className="flex flex-col items-center text-center mb-10 border-b border-dashed border-gray-200 pb-10">
                  <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center p-4 mb-4 shadow-sm border border-black/5">
                    <Image
                      src="/logo/logo_lumeria.webp"
                      alt="Lumeriá"
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-2xl font-black text-black tracking-tight mb-1">
                    LUMERIÁ OFFICIAL
                  </h2>
                  <p className="text-[9px] text-[#e75a40] font-black uppercase tracking-[0.5em] mb-4">
                    Bakery & Snacks Co.
                  </p>

                  <div className="bg-gray-50 px-5 py-2 rounded-full border border-gray-100 flex items-center gap-4">
                    <div className="text-left">
                      <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">
                        ORDER ID
                      </p>
                      <p className="text-sm font-black text-black uppercase tracking-wider">
                        {orderId}
                      </p>
                    </div>
                    <button
                      onClick={handleCopyId}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-400 hover:text-black"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Customer Data Grid */}
                <div className="grid grid-cols-2 gap-y-8 mb-12">
                  <div className="space-y-1">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                      <User className="w-3 h-3 text-[#e75a40]" /> Pemesan
                    </p>
                    <p className="text-sm font-black text-black uppercase leading-tight">
                      {formData.name}
                    </p>
                    <p className="text-[10px] text-gray-500 font-bold">
                      {formData.class}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1.5 justify-end">
                      <CreditCard className="w-3 h-3 text-[#e75a40]" />{" "}
                      Pembayaran
                    </p>
                    <p className="text-sm font-black text-black uppercase">
                      {formData.payment}
                    </p>
                    <p className="text-[10px] bg-green-50 text-green-600 font-black px-2 py-0.5 rounded-md inline-block">
                      UNPAID
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[#e75a40]" /> Jadwal
                      Ambil
                    </p>
                    <p className="text-sm font-black text-black uppercase">
                      {formData.day}
                    </p>
                    <p className="text-[10px] text-gray-500 font-black uppercase">
                      {formData.time}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1.5 justify-end">
                      <MapPin className="w-3 h-3 text-[#e75a40]" /> Titik Kumpul
                    </p>
                    <p className="text-sm font-black text-black uppercase leading-tight">
                      {formData.tikum}
                    </p>
                    <p className="text-[10px] text-gray-500 font-bold">
                      Lantai 1
                    </p>
                  </div>
                </div>

                {/* ITEM BREAKDOWN */}
                <div className="space-y-4 mb-10">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Detail Pesanan
                  </p>

                  {displayItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border border-gray-100 rounded-3xl bg-gray-50/50"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-sm shrink-0 border border-black/5 flex items-center justify-center">
                        <Image
                          src={item.img}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-black leading-tight uppercase text-sm">
                          {item.name}
                        </h4>
                        <p className="text-[11px] font-bold text-[#e75a40]">
                          Qty: {item.quantity} Unit
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-black">
                          {formatPrice(item.priceNumber * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Prices Table */}
                  <div className="px-4 py-6 border-y border-dashed border-gray-200 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-bold">
                        Subtotal Produk
                      </span>
                      <span className="text-black font-black">
                        {formatPrice(displayTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-bold">
                        Biaya Layanan
                      </span>
                      <span className="text-black font-black">Rp 0</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-bold">
                        Biaya Pengiriman
                      </span>
                      <span className="text-green-500 font-black uppercase text-[10px]">
                        Gratis Ongkir
                      </span>
                    </div>
                  </div>

                  {/* GRAND TOTAL */}
                  <div className="flex justify-between items-center p-4 pt-6">
                    <span className="text-sm font-black text-black uppercase tracking-widest">
                      Total Bayar
                    </span>
                    <span className="text-2xl font-black text-[#e75a40]">
                      {formatPrice(displayTotal)}
                    </span>
                  </div>
                </div>

                {/* Barcode & Footer */}
                <div className="flex flex-col items-center pt-10 border-t border-dashed border-gray-200">
                  <div className="w-full h-12 bg-[url('https://www.transparenttextures.com/patterns/barcode-1.png')] opacity-10 mb-6 grayscale group-hover:opacity-20 transition-opacity"></div>
                  <div className="flex items-center gap-2 text-gray-300 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500/50" />
                    <p className="text-[10px] font-black tracking-[0.6em] uppercase text-gray-400">
                      Authentic Order
                    </p>
                    <CheckCircle2 className="w-4 h-4 text-green-500/50" />
                  </div>
                  <p className="text-[9px] text-gray-300 font-medium">
                    Digital Receipt generated on{" "}
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* ZIGZAG BOTTOM EDGE */}
              <div className="flex w-full overflow-hidden leading-none h-4 relative -mt-0.5">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[1.5rem] h-6 bg-white rotate-45 -translate-y-3 shadow-md border border-black/5"
                  ></div>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS (FINAL) */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => window.print()}
                  className="flex-1 h-16 bg-white border-2 border-black/5 text-gray-700 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  Print Nota
                </button>
                <Link
                  href="/products"
                  className="flex-1 h-16 bg-black text-white rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-sm"
                >
                  Pesan Lagi
                </Link>
              </div>
              <a
                href={`https://wa.me/6281219186721?text=Permisi%20min%20Lumeri%C3%A1%2C%20saya%20ingin%20mengonfirmasi%20pesanan%20saya%20dengan%20ID%20${orderId}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-16 bg-[#25D366] text-white rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-sm"
              >
                <Phone className="w-4 h-4" />
                Hubungi Kami (Chat WhatsApp)
              </a>
            </div>

            <button
              onClick={() => setStep("form")}
              className="w-full mt-10 text-gray-400 font-bold hover:text-black transition-colors flex items-center justify-center gap-2 py-4"
            >
              Ubah Data Pesanan
            </button>
          </div>
        )}
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[#e75a40]/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-[#1b2b5b]/5 rounded-full blur-[100px]"></div>
      </div>

      <Footer />
    </div>
  );
}
