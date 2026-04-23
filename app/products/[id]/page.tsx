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
  Star,
  Heart,
  Share2,
  MessageCircle,
  Info,
  ShoppingBag,
  Minus,
  Plus,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, isCartOpen } = useCart();
  const [quantity, setQuantity] = React.useState(3);
  const [dbProduct, setDbProduct] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const normalizedId = String(id || "").toLowerCase();

  const findStaticProductByCandidate = (candidate: any) => {
    if (!candidate) return null;

    const targetId = String(candidate.id || "").toLowerCase();
    const targetSlug = String(candidate.slug || "").toLowerCase();
    const targetName = String(candidate.name || "").toLowerCase();

    return PRODUCTS.find((p) => {
      const lowId = String(p.id || "").toLowerCase();
      const lowSlug = String((p as any).slug || "").toLowerCase();
      const lowName = String(p.name || "").toLowerCase();

      return (
        (targetId && lowId === targetId) ||
        (targetSlug && lowSlug === targetSlug) ||
        (targetName && lowName === targetName)
      );
    });
  };

  const staticProduct = React.useMemo(() => {
    // Pastikan urutan strict: ID > slug > nama.
    const idSearch = findStaticProductByCandidate({ id: normalizedId });
    if (idSearch) return idSearch;

    const slugSearch = findStaticProductByCandidate({ slug: normalizedId });
    if (slugSearch) return slugSearch;

    const nameSearch = findStaticProductByCandidate({ name: normalizedId });
    if (nameSearch) return nameSearch;

    if (dbProduct) {
      const dbId = findStaticProductByCandidate({ id: dbProduct.id });
      if (dbId) return dbId;

      const dbSlug = findStaticProductByCandidate({ slug: dbProduct.slug });
      if (dbSlug) return dbSlug;

      const dbName = findStaticProductByCandidate({ name: dbProduct.name });
      if (dbName) return dbName;
    }

    return null;
  }, [dbProduct, normalizedId]);

  React.useEffect(() => {
    if (!normalizedId) return;

    const fetchProduct = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        let { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .maybeSingle(); // Use maybeSingle to avoid PGRST116

        if (error) {
           // Invalid UUID error code is usually 22P02, we can just treat as not found
           if (error.code === '22P02') {
               data = null;
           } else {
               console.error("Supabase error fetching product:", error);
               data = null;
           }
        }

        if (!data) {
          data = null;
        }

        setDbProduct(data || null);
      } catch (err: any) {
        setFetchError(err?.message ?? "Gagal memuat data produk");
        setDbProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, normalizedId]);

  if (!staticProduct && !dbProduct && !loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black mb-4">Produk Tidak Ditemukan</h1>
        <Link href="/products" className="text-[#e75a40] font-bold underline">
          Kembali ke Daftar Produk
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-lg font-semibold">Memuat produk...</p>
      </div>
    );
  }

  const mergedProduct = {
    ...staticProduct,
    ...(dbProduct || {}),
    img:
      dbProduct?.image_url ||
      dbProduct?.img ||
      dbProduct?.image ||
      staticProduct?.img ||
      "/rasa-piscok/rasa-coklat.webp",
    bg: dbProduct?.bg || staticProduct?.bg || "#e75a40",
    name: dbProduct?.name || staticProduct?.name || "Produk Lumeria",
    description:
      dbProduct?.description ||
      dbProduct?.longDesc ||
      staticProduct?.desc ||
      staticProduct?.longDesc ||
      "Deskripsi produk tidak tersedia",
    price: dbProduct?.price || staticProduct?.price || "0",
    category: dbProduct?.category || staticProduct?.category || "",
    nutrition:
      staticProduct?.nutrition ||
      dbProduct?.nutrition ||
      { calories: "-", carbs: "-", fat: "-", protein: "-" },
    ingredients: staticProduct?.ingredients || dbProduct?.ingredients || [],
    benefits: staticProduct?.benefits || dbProduct?.benefits || "",
  } as any;

  if (fetchError) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold mb-3">Kesalahan memuat produk</h1>
        <p className="mb-4 text-red-500">{fetchError}</p>
        <Link href="/products" className="text-[#e75a40] font-bold underline">
          Kembali ke Daftar Produk
        </Link>
      </div>
    );
  }

  const product = mergedProduct;

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

      <main className="pt-40 md:pt-32 pb-32 md:pb-40 px-6 max-w-7xl mx-auto">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e75a40]/10 text-[#e75a40] text-xs font-black uppercase tracking-widest hover:bg-[#e75a40] hover:text-white transition-all duration-300 mb-10 group shadow-sm border border-[#e75a40]/20"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          Daftar Produk
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-24">
          {/* Left: Product Image Section */}
          <div className="flex-1">
            <div
              className="relative aspect-square rounded-[2rem] md:rounded-[3rem] overflow-hidden flex items-center justify-center p-8 md:p-12 transition-all duration-700"
              style={{ backgroundColor: `${product.bg}30` }}
            >
              {/* Floating Badge */}
              <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
                <span className="bg-white text-black font-black text-[10px] md:text-xs uppercase tracking-[0.2em] px-4 py-1.5 md:px-5 md:py-2 rounded-full shadow-lg">
                  Best Seller
                </span>
              </div>

              <Image
                src={product.img}
                alt={product.name}
                width={500}
                height={500}
                className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] transition-transform duration-700 hover:scale-110 rounded-3xl"
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
                    className="object-contain opacity-60 rounded-xl"
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
              <h1 className="text-3xl md:text-6xl font-black text-black mb-4 md:mb-6 leading-none tracking-tight">
                {product.name}
              </h1>
              <p className="text-2xl md:text-3xl font-black text-[#e75a40] mb-6 md:mb-8">
                {typeof product.price === "number"
                  ? new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(product.price)
                  : new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(
                      Number(String(product.price).replace(/[\D]/g, "")),
                    )}
              </p>
              <p className="text-gray-500 font-medium text-base md:text-lg leading-relaxed mb-8 md:mb-10">
                {product.description}
              </p>
            </div>

            {/* Stats / Nutrition Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {Object.entries(product.nutrition || {}).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center"
                >
                  <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">
                    {key}
                  </span>
                  <span className="text-base md:text-lg font-black text-black">
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

            {/* Container luar pakai w-fit supaya nggak melar ke samping */}
            <div className="flex items-center gap-4 mb-8 w-fit">
              <div className="flex items-center bg-gray-50 border-2 border-black/5 rounded-2xl p-2 shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(3, quantity - 1))}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl hover:bg-white flex items-center justify-center transition-all text-black active:scale-90"
                >
                  <Minus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
                </button>

                <span className="w-12 md:w-16 text-center text-lg md:text-xl font-black text-black">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl hover:bg-white flex items-center justify-center transition-all text-black active:scale-90"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
                </button>
              </div>

              {/* Keterangan minimal order di sebelah kanan kotak */}
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">
                  Minimal
                </span>
                <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">
                  3 Pcs
                </span>
              </div>
            </div>

            {/* Bagian ini HANYA muncul di Desktop (md: ke atas) */}
            <div className="hidden md:flex flex-col gap-6 mb-12">
              {/* Kita hapus selector quantity di sini karena sudah ada di atasnya */}

              <div className="flex flex-row gap-4">
                <Link
                  href={`/products/${id}/order?qty=${quantity}`}
                  className="flex-[1.5] h-16 bg-[#e75a40] text-white rounded-full font-black text-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 shadow-xl"
                >
                  <MessageCircle className="w-6 h-6" />
                  Pesan Sekarang
                </Link>

                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 h-16 bg-white border-2 border-black/5 text-black rounded-full font-black text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 shadow-md px-4 overflow-hidden"
                >
                  <ShoppingBag className="w-6 h-6 shrink-0" />{" "}
                  {/* shrink-0 supaya icon gak gepeng */}
                  <span className="truncate">Masukan Keranjang</span>
                </button>
              </div>
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

      {/* Shopee-style Mobile Sticky Bottom Bar */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-black/5 px-4 py-4 flex items-center gap-2 shadow-[0_-15px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 ${isCartOpen ? "translate-y-full" : "translate-y-0"}`}
      >
        <div className="flex-[5] flex gap-2">
          <Link
            href={`/products/${id}/order?qty=${quantity}`}
            className="flex-1 h-12 bg-[#e75a40] text-white rounded-full font-black text-[9px] uppercase tracking-tighter flex items-center justify-center active:scale-95 transition-transform shadow-lg shadow-[#e75a40]/20 gap-1 px-2"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Pesan</span>
          </Link>

          <button
            onClick={() => addToCart(product, quantity)}
            className="flex-1 h-12 bg-white border-2 border-black/5 text-black rounded-full font-black text-[9px] uppercase tracking-tighter flex items-center justify-center active:scale-95 transition-transform gap-1 px-2 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Keranjang</span>
          </button>
        </div>
      </div>
    </div>
  );
}
