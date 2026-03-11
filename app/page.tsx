"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Plus, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

// 3D Components
const Scene = dynamic(() => import("@/components/3d/Scene"), { ssr: false });
const PiscokModel = dynamic(() => import("@/components/3d/PiscokModel"), {
  ssr: false,
});
const SamyangModel = dynamic(() => import("@/components/3d/SamyangModel"), {
  ssr: false,
});

const MEMBERS_DATA = [
  {
    id: 1,
    name: "Chika",
    className: "XI RPL 1",
    role: "Pembuat logo, memasak",
  },
  {
    id: 2,
    name: "Prisa",
    className: "XI RPL 1",
    role: "Pembuat logo, memasak",
  },
  {
    id: 3,
    name: "Rafi",
    className: "XI RPL 1",
    role: "Pembeli bahan makanan dan marketing",
  },
  { id: 4, name: "Andres", className: "XI RPL 1", role: "Marketing" },
  {
    id: 5,
    name: "Haiqal",
    className: "XI RPL 1",
    role: "Pembuat poster, desain",
  },
  {
    id: 6,
    name: "Hafis",
    className: "XI RPL 1",
    role: "Juru resep dan pembeli bahan",
  },
  { id: 7, name: "Farel", className: "XI RPL 1", role: "Back end developer" },
  { id: 8, name: "Faisal", className: "XI RPL 1", role: "Front end developer" },
  { id: 9, name: "Satria", className: "XI RPL 1", role: "Marketing" },
];

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);

  const [activeProduct, setActiveProduct] = useState<"piscok" | "samyang">(
    "piscok",
  );
  const [activeFlavor, setActiveFlavor] = useState<string>("tiramisu");
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMember, setActiveMember] = useState<number | null>(null);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("products").select("*");
        if (error) throw error;
        setDbProducts(data || []);
      } catch (err) {
        console.error("Gagal tarik data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Helper untuk ambil deskripsi dari DB berdasarkan keyword
  const getProductData = (keyword: string) => {
    return (
      dbProducts.find((p) =>
        p.name?.toLowerCase().includes(keyword.toLowerCase()),
      ) || { description: "..." }
    );
  };

  const getProductRoute = (keyword: string) => {
    const item = dbProducts.find(
      (p) =>
        String(p.id).toLowerCase() === keyword.toLowerCase() ||
        String(p.slug || "").toLowerCase() === keyword.toLowerCase() ||
        p.name?.toLowerCase().includes(keyword.toLowerCase()),
    );
    if (item) return `/products/${item.slug || item.id}`;
    return `/products/${keyword}`;
  };


  useEffect(() => {
    let color = "#ffffff";
    if (activeProduct === "piscok") {
      if (activeFlavor === "coklat") color = "#3d1f1b";
      else if (activeFlavor === "strawberry") color = "#fff0f3";
      else color = "#fdf5e6";
    } else {
      color = activeFlavor === "samyang-keju" ? "#fef2f2" : "#fff7ed";
    }
    document.body.style.backgroundColor = color;
  }, [activeFlavor, activeProduct]);

  const [isCanvasVisible, setIsCanvasVisible] = useState(true);
  const topSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!topSectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => setIsCanvasVisible(entries[0].isIntersecting),
      { rootMargin: "0px 0px 1000px 0px" },
    );
    observer.observe(topSectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={container}
      className="relative w-full min-h-screen font-sans selection:bg-black selection:text-white transition-colors duration-700"
    >
      <Navbar />
      <div
        ref={topSectionRef}
        className="absolute top-0 w-full h-[200vh] pointer-events-none"
      />

      {/* 3D Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {isCanvasVisible && (
          <Scene activeItem={activeProduct}>
            {activeProduct === "piscok" ? (
              <PiscokModel flavor={activeFlavor as any} />
            ) : (
              <SamyangModel
                variant={activeFlavor.replace("samyang-", "") as any}
              />
            )}
          </Scene>
        )}
      </div>

      <main className="relative z-10 w-full pt-20 no-scrollbar">
        {/* Hero Section */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 relative">
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-serif font-black tracking-[-0.02em] mb-6 uppercase leading-none text-[#fffaf0] [-webkit-text-stroke:2px_#271a14] md:[-webkit-text-stroke:4px_#271a14] [text-shadow:4px_4px_0px_#271a14] md:[text-shadow:12px_12px_0px_#271a14]">
            {activeProduct === "piscok" ? (
              <>
                The Real
                <br />
                Crunch.
              </>
            ) : (
              <>
                The Real
                <br />
                Spice.
              </>
            )}
          </h1>

          <p className="text-xl md:text-3xl font-serif font-bold max-w-2xl text-[#271a14] mb-12 bg-white/40 backdrop-blur-md px-8 py-4 rounded-3xl border border-[#271a14]/10">
            {activeProduct === "piscok"
              ? "Piscok lumer di luar, renyah di dalam."
              : "Samyang Roll pedas mantap, krispi maksimal."}
          </p>

          {/* Switcher & Flavor Buttons */}
          <div className="flex flex-col items-center gap-10 relative z-50">
            <div className="flex items-center p-1.5 bg-black/[0.03] backdrop-blur-3xl rounded-full border border-black/10 relative w-fit">
              <div
                className={`absolute top-1.5 bottom-1.5 rounded-full bg-white shadow-md transition-all duration-700 ${activeProduct === "piscok" ? "left-1.5 w-[140px]" : "left-[145.5px] w-[160px]"}`}
              />
              <button
                onClick={() => {
                  setActiveProduct("piscok");
                  setActiveFlavor("tiramisu");
                }}
                className={`relative z-10 px-8 py-3 rounded-full font-black text-xs uppercase w-[140px] ${activeProduct === "piscok" ? "text-black" : "text-black/40"}`}
              >
                Piscok
              </button>
              <button
                onClick={() => {
                  setActiveProduct("samyang");
                  setActiveFlavor("samyang-nori");
                }}
                className={`relative z-10 px-8 py-3 rounded-full font-black text-xs uppercase w-[160px] ${activeProduct === "samyang" ? "text-black" : "text-black/40"}`}
              >
                Samyang
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 bg-white/30 p-2.5 rounded-full backdrop-blur-3xl border border-white/40">
              {activeProduct === "piscok"
                ? ["coklat", "tiramisu", "strawberry"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFlavor(f)}
                      className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-black text-[10px] uppercase transition-all duration-500 ${activeFlavor === f ? "bg-white text-black shadow-xl scale-105" : "text-black/30"}`}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            f === "coklat"
                              ? "#3d1f1b"
                              : f === "tiramisu"
                                ? "#c1a286"
                                : "#ff8da1",
                        }}
                      />
                      {f}
                    </button>
                  ))
                : ["samyang-nori", "samyang-keju"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFlavor(f)}
                      className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-black text-[10px] uppercase transition-all duration-500 ${activeFlavor === f ? "bg-red-600 text-white shadow-xl scale-105" : "text-black/30"}`}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-current" />
                      {f.replace("samyang-", "")}
                    </button>
                  ))}
            </div>
          </div>
        </section>

        {/* Dynamic Product Menu Section - FIXED HEIGHT & ARROW */}
        <section
          id="products"
          className="w-full relative z-20 pt-32 pb-0 bg-white"
        >
          <div className="mb-20 text-center px-6">
            <h2 className="text-6xl md:text-9xl font-black uppercase text-black tracking-tighter leading-none mb-4">
              Our Menu
            </h2>
            <p className="text-black/40 font-bold uppercase tracking-[0.3em] text-xs">
              Discover the lumer goodness
            </p>
          </div>

          <div className="w-full flex flex-col md:flex-row border-t border-black/5 transition-all duration-700">
            {activeProduct === "piscok" ? (
              <>
                {/* Column 1: Coklat Lumer */}
                <div
                  onClick={() => router.push(getProductRoute("coklat"))}
                  className="flex-1 w-full group relative flex flex-col items-center justify-start py-20 bg-[#3d1f1b] transition-all duration-700 cursor-pointer hover:bg-[#2d1714] min-h-[600px] md:min-h-[90vh]"
                >
                  <h3 className="relative z-20 text-4xl md:text-6xl font-black uppercase text-white mb-10 text-center tracking-tight leading-none">
                    Coklat
                    <br />
                    Lumer
                  </h3>
                  {/* Container Gambar dengan tinggi tetap agar tidak gepeng */}
                  <div className="relative w-[85%] h-[300px] md:h-[400px] z-10 transition-transform duration-700 group-hover:scale-105 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10">
                    <Image
                      src={getProductData("coklat").img || "/rasa-piscok/rasa-coklat.webp"}
                      alt="Coklat Lumer"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="relative z-20 text-white/50 text-center px-10 font-bold text-base max-w-sm mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {getProductData("coklat").description}
                  </p>
                  {/* Arrow dipastikan di atas z-indexnya */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl z-30">
                    <ArrowRight className="w-7 h-7 -rotate-45 text-black" />
                  </div>
                </div>

                {/* Column 2: Tiramisu */}
                <div
                  onClick={() => router.push(getProductRoute("tiramisu"))}
                  className="flex-1 w-full group relative flex flex-col items-center justify-start py-20 bg-white transition-all duration-700 cursor-pointer hover:bg-[#fcfcfa] md:border-x border-black/5 min-h-[600px] md:min-h-[90vh]"
                >
                  <h3 className="relative z-20 text-4xl md:text-6xl font-black uppercase text-black mb-10 text-center tracking-tight leading-none">
                    Tiramisu
                    <br />
                    Roll
                  </h3>
                  <div className="relative w-[85%] h-[300px] md:h-[400px] z-10 transition-transform duration-700 group-hover:scale-105 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-black/5">
                    <Image
                      src={getProductData("tiramisu").img || "/rasa-piscok/piscok-tiramisu.webp"}
                      alt="Tiramisu"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="relative z-20 text-black/40 text-center px-10 font-bold text-base max-w-sm mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {getProductData("tiramisu").description}
                  </p>
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl z-30">
                    <ArrowRight className="w-7 h-7 -rotate-45" />
                  </div>
                </div>

                {/* Column 3: Strawberry */}
                <div
                  onClick={() => router.push(getProductRoute("strawberry"))}
                  className="flex-1 w-full group relative flex flex-col items-center justify-start py-20 bg-[#fff0f3] transition-all duration-700 cursor-pointer hover:bg-[#ffe4e9] min-h-[600px] md:min-h-[90vh]"
                >
                  <h3 className="relative z-20 text-4xl md:text-6xl font-black uppercase text-black mb-10 text-center tracking-tight leading-none">
                    Strawberry
                    <br />& Choco
                  </h3>
                  <div className="relative w-[85%] h-[300px] md:h-[400px] z-10 transition-transform duration-700 group-hover:scale-105 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                    <Image
                      src={getProductData("strawberry").img || "/rasa-piscok/piscok-starberry.webp"}
                      alt="Strawberry"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="relative z-20 text-black/40 text-center px-10 font-bold text-base max-w-sm mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {getProductData("strawberry").description}
                  </p>
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl z-30">
                    <ArrowRight className="w-7 h-7 -rotate-45" />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Column 1: Samyang Nori */}
                <div
                  onClick={() => router.push(getProductRoute("samyang-nori"))}
                  className="flex-1 w-full group relative flex flex-col items-center justify-start py-20 bg-[#1a2f1a] transition-all duration-700 cursor-pointer hover:bg-[#142414] min-h-[600px] md:min-h-[90vh]"
                >
                  <h3 className="relative z-20 text-4xl md:text-6xl font-black uppercase text-white mb-10 text-center tracking-tight leading-none">
                    Samyang
                    <br />
                    Nori
                  </h3>
                  <div className="relative w-[85%] h-[300px] md:h-[400px] z-10 transition-transform duration-700 group-hover:scale-105 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10">
                    <Image
                      src={getProductData("samyang-nori").img || "/rasa-samyang/samyang-nori.webp"}
                      alt="Samyang Nori"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="relative z-20 text-white/50 text-center px-10 font-bold text-base max-w-sm mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {getProductData("nori").description}
                  </p>
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl z-30">
                    <ArrowRight className="w-7 h-7 -rotate-45 text-black" />
                  </div>
                </div>

                {/* Column 2: Samyang Keju */}
                <div
                  onClick={() => router.push(getProductRoute("samyang-keju"))}
                  className="flex-1 w-full group relative flex flex-col items-center justify-start py-20 bg-white transition-all duration-700 cursor-pointer hover:bg-[#fcfcfa] md:border-l border-black/5 min-h-[600px] md:min-h-[90vh]"
                >
                  <h3 className="relative z-20 text-4xl md:text-6xl font-black uppercase text-black mb-10 text-center tracking-tight leading-none">
                    Samyang
                    <br />
                    Keju
                  </h3>
                  <div className="relative w-[85%] h-[300px] md:h-[400px] z-10 transition-transform duration-700 group-hover:scale-105 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-black/5">
                    <Image
                      src={getProductData("samyang-keju").img || "/rasa-samyang/samyang-keju.webp"}
                      alt="Samyang Keju"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="relative z-20 text-black/40 text-center px-10 font-bold text-base max-w-sm mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {getProductData("keju").description}
                  </p>
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-14 h-14 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 group-hover:scale-110 transition-all duration-500 shadow-2xl z-30 text-white">
                    <ArrowRight className="w-7 h-7 -rotate-45" />
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Member Section */}

        <section className="w-full bg-white relative z-20 pt-20 pb-40 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase text-black mb-10">
            Behind Lumeriá
          </h2>

          <div
            className="relative w-full max-w-[900px] aspect-[2.4/1] mb-12 group"
            onMouseLeave={() => setActiveMember(null)}
          >
            <Image
              src="/member/member_revisi.webp"
              alt="Lumeriá Team"
              fill
              className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
            />

            <div className="absolute inset-x-0 bottom-0 h-full w-full mx-auto flex z-30">
              {MEMBERS_DATA.map((member) => (
                <div
                  key={member.id}
                  className="flex-1 h-full cursor-pointer relative"
                  onMouseEnter={() => setActiveMember(member.id)}
                  onClick={() =>
                    setSelectedMember(
                      selectedMember?.id === member.id ? null : member,
                    )
                  }
                >
                  <div
                    className={`absolute bottom-[90%] left-1/2 -translate-x-1/2 min-w-[120px] bg-black text-white px-4 py-2 rounded-xl transition-all duration-300 pointer-events-none z-40 flex flex-col items-center ${activeMember === member.id && !selectedMember ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}`}
                  >
                    <h4 className="font-bold text-sm whitespace-nowrap">
                      {member.name}
                    </h4>

                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rotate-45" />
                  </div>
                </div>
              ))}
            </div>

            {selectedMember && (
              <div className="absolute z-40 left-1/2 -translate-x-1/2 bottom-[105%] w-[calc(100vw-48px)] max-w-[450px]">
                <div className="relative bg-white/95 backdrop-blur-xl border border-black/5 rounded-3xl p-6 shadow-2xl flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="w-full text-center">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-black text-black text-lg">
                        {selectedMember.name}
                      </h4>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          setSelectedMember(null);
                        }}
                        className="text-gray-400 hover:text-black"
                      >
                        <Plus className="w-4 h-4 rotate-45" />
                      </button>
                    </div>

                    <span className="inline-block bg-[#e75a40]/10 text-[#e75a40] text-[10px] font-black px-2 py-0.5 rounded-full uppercase mb-2 border border-[#e75a40]/10">
                      {selectedMember.className}
                    </span>

                    <p className="text-gray-600 text-xs font-medium">
                      {selectedMember.role}
                    </p>
                  </div>

                  <div
                    className="absolute -bottom-2 w-4 h-4 bg-white rotate-45 border-b border-r border-black/5"
                    style={{
                      left: `${(MEMBERS_DATA.findIndex((m) => m.id === selectedMember.id) / MEMBERS_DATA.length) * 100 + 50 / MEMBERS_DATA.length}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="max-w-2xl bg-gradient-to-b from-[#fdf8f5] to-white px-10 py-10 rounded-[2rem] shadow-sm border border-[#e6ccb2]/40 text-center">
            <p className="text-xl md:text-2xl font-bold text-black/80 leading-relaxed">
              Inilah para pembuat di balik berdirinya{" "}
              <span className="text-[#8b5a2b] font-black">Lumeriá</span>. Kami
              selalu berusaha menghadirkan yang terbaik.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
