"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Plus, ArrowRight, LayoutGrid, Coffee, Flame } from "lucide-react";

// Dynamically import heavy 3D components with SSR disabled for "Cache ringan" and safe loading
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
  {
    id: 4,
    name: "Andres",
    className: "XI RPL 1",
    role: "Marketing",
  },
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
  {
    id: 7,
    name: "Farel",
    className: "XI RPL 1",
    role: "Back end developer",
  },
  {
    id: 8,
    name: "Faisal",
    className: "XI RPL 1",
    role: "Front end developer",
  },
  {
    id: 9,
    name: "Satria",
    className: "XI RPL 1",
    role: "Marketing",
  },
];

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);
  const [activeProduct, setActiveProduct] = useState<"piscok" | "samyang">(
    "piscok",
  );
  // Initialize to tiramisu (center roll in the 3D scene) or matcha
  const [activeFlavor, setActiveFlavor] = useState<
    "coklat" | "strawberry" | "tiramisu" | "samyang-nori" | "samyang-keju"
  >("tiramisu");
  const [activeMember, setActiveMember] = useState<number | null>(null);
  const [selectedMember, setSelectedMember] = useState<
    (typeof MEMBERS_DATA)[0] | null
  >(null);

  // Performance Optimization: Only mount 3D canvas when near the top
  const [isCanvasVisible, setIsCanvasVisible] = useState(true);
  const topSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!topSectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setIsCanvasVisible(entries[0].isIntersecting);
      },
      // Keep canvas mounted until we are 1000px past the trigger
      { rootMargin: "0px 0px 1000px 0px" },
    );
    observer.observe(topSectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Change body background color dynamically based on state with premium palette
  useEffect(() => {
    let color = "#ffffff"; // default
    if (activeProduct === "piscok") {
      if (activeFlavor === "coklat") color = "#3d1f1b"; // Deep Cocoa
      if (activeFlavor === "strawberry") color = "#fff0f3"; // Soft Rose
      if (activeFlavor === "tiramisu") color = "#fdf5e6"; // Creamy Tiramisu
    } else {
      if (activeFlavor === "samyang-keju")
        color = "#fef2f2"; // Pale Spicy
      else color = "#fff7ed"; // Soft Nori
    }

    document.body.style.backgroundColor = color;
  }, [activeFlavor, activeProduct]);

  // GSAP Scroll Animations for the new sections
  const sectionRef = useRef<HTMLElement>(null);

  // New section refs for sliding cards (placed above 3-column grid)
  const infoSectionRef = useRef<HTMLElement>(null);
  const infoTextRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 2. Info Cards & 3D Canvas Shift Timeline
    if (
      infoSectionRef.current &&
      infoTextRef.current &&
      cardsWrapperRef.current
    ) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: infoSectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 2, // Extra smooth dragging effect
        },
      });

      // Break timeline into steps:
      // 1. Fade out the text and start moving the 3D canvas to the side (-30vw)
      tl.to(infoTextRef.current, { opacity: 0, y: -100, duration: 1 })
        .to(
          "#canvas-container",
          { x: "-30vw", duration: 2, ease: "power1.inOut" },
          "<",
        )

        // 2. Once canvas is moved, slide the cards from right to left across the screen
        .to(
          cardsWrapperRef.current,
          {
            x: activeProduct === "piscok" ? "-180vw" : "-120vw",
            duration: 5,
            ease: "none",
          },
          "<1",
        )

        // 3. Move the product back to the center right before this section ends
        .to(
          "#canvas-container",
          { x: "0vw", duration: 1.5, ease: "power2.out" },
          "+=0.5",
        );
    }
  }, []);

  return (
    <div
      ref={container}
      className="relative w-full min-h-screen font-sans selection:bg-black selection:text-white transition-colors duration-700"
    >
      <Navbar />
      {/* Invisible anchor for canvas visibility tracking */}
      <div
        ref={topSectionRef}
        className="absolute top-0 w-full h-[200vh] pointer-events-none"
      />

      {/* 3D Canvas Background (Fixed + Lazy Loaded) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {isCanvasVisible && (
          <Scene activeItem={activeProduct}>
            {activeProduct === "piscok" ? (
              <PiscokModel
                flavor={
                  activeFlavor as
                    | "coklat"
                    | "strawberry"
                    | "tiramisu"
                    | "piscok-mix"
                }
              />
            ) : (
              <SamyangModel
                variant={activeFlavor as "nori" | "keju" | "samyang-mix"}
              />
            )}
          </Scene>
        )}
      </div>

      {/* Main Content Overlay */}
      <main className="relative z-10 w-full pt-20 no-scrollbar">
        {/* --- Hero Section --- */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10 pointer-events-none" />

          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-serif font-black tracking-[-0.02em] mb-6 uppercase leading-none transition-all duration-700 text-[#fffaf0] [-webkit-text-stroke:2px_#271a14] md:[-webkit-text-stroke:4px_#271a14] [text-shadow:4px_4px_0px_#271a14] md:[text-shadow:12px_12px_0px_#271a14]">
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

          <p className="text-xl md:text-3xl font-serif font-bold max-w-2xl text-[#271a14] mb-12 tracking-tight bg-white/40 backdrop-blur-md px-8 py-4 rounded-3xl border border-[#271a14]/10 shadow-xl">
            {activeProduct === "piscok"
              ? "Piscok lumer di luar, renyah di dalam. Rasakan sensasi Lumeriá hari ini."
              : "Samyang Roll pedas mantap, krispi maksimal. Rasakan ledakan rasa Lumeriá hari ini."}
          </p>

          <div className="flex flex-col items-center gap-10 relative z-50">
            {/* Product Toggle (Improved Glassmorphism) */}
            <div className="flex items-center p-1.5 bg-black/[0.03] backdrop-blur-3xl rounded-full border border-black/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] relative w-fit">
              <div
                className={`absolute top-1.5 bottom-1.5 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  activeProduct === "piscok"
                    ? "left-1.5 w-[140px]"
                    : "left-[calc(1.5px+140px+4px)] w-[160px]"
                }`}
              />
              <button
                onClick={() => {
                  setActiveProduct("piscok");
                  setActiveFlavor("tiramisu");
                }}
                className={`relative z-10 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-colors duration-300 w-[140px] ${
                  activeProduct === "piscok" ? "text-black" : "text-black/40"
                }`}
              >
                Piscok
              </button>
              <button
                onClick={() => {
                  setActiveProduct("samyang");
                  setActiveFlavor("samyang-nori");
                }}
                className={`relative z-10 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-colors duration-300 w-[160px] ${
                  activeProduct === "samyang" ? "text-black" : "text-black/40"
                }`}
              >
                Samyang
              </button>
            </div>

            {/* Flavor Switcher (Premium Dots/Buttons) */}
            <div className="flex flex-wrap items-center justify-center gap-4 bg-white/30 p-2.5 rounded-full backdrop-blur-3xl border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
              {activeProduct === "piscok" ? (
                <>
                  {[
                    { id: "coklat", label: "Coklat", color: "#3d1f1b" },
                    {
                      id: "tiramisu",
                      label: "Tiramisu",
                      color: "#c1a286",
                    },
                    { id: "strawberry", label: "Strawberry", color: "#ff8da1" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setActiveFlavor(f.id as any)}
                      className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${
                        activeFlavor === f.id
                          ? "bg-white text-black shadow-xl scale-105"
                          : "text-black/30 hover:text-black/60"
                      }`}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full shadow-inner"
                        style={{ backgroundColor: f.color }}
                      />
                      {f.label}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { id: "samyang-nori", label: "Nori", color: "#1a2f1a" },
                    { id: "samyang-keju", label: "Keju", color: "#dc2626" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setActiveFlavor(f.id as any)}
                      className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${
                        activeFlavor === f.id
                          ? "bg-red-600 text-white shadow-xl scale-105"
                          : "text-black/30 hover:text-black/60"
                      }`}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full shadow-inner ${activeFlavor === f.id ? "bg-white" : ""}`}
                        style={{
                          backgroundColor: activeFlavor === f.id ? "" : f.color,
                        }}
                      />
                      {f.label}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>
        {/* --- SIMPLIFIED: Product Menu (Consolidated) --- */}
        <section
          id="products"
          className="w-full relative z-20 pt-32 pb-0 overflow-hidden bg-white"
        >
          <div className="mb-20 text-center px-6">
            <h2 className="text-6xl md:text-9xl font-black uppercase text-black tracking-tighter leading-none mb-4">
              Our Menu
            </h2>
            <p className="text-black/40 font-bold uppercase tracking-[0.3em] text-xs md:text-sm">
              Discover the lumer goodness
            </p>
          </div>

          <div className="w-full h-auto md:h-[90vh] flex flex-col md:flex-row border-t border-black/5 transition-all duration-700">
            {activeProduct === "piscok" ? (
              <>
                {/* Column 1: Coklat Lumer */}
                <div
                  onClick={() => router.push("/products/coklat")}
                  className="flex-1 w-full group relative flex flex-col items-center justify-center py-24 bg-[#3d1f1b] transition-all duration-700 overflow-hidden cursor-pointer hover:bg-[#2d1714]"
                >
                  <h3 className="relative z-20 text-4xl md:text-6xl font-black uppercase text-white mb-10 text-center tracking-tight leading-none">
                    Coklat
                    <br />
                    Lumer
                  </h3>
                  <div className="relative w-[80%] md:w-[70%] aspect-square z-10 transition-transform duration-700 group-hover:scale-110 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10">
                    <Image
                      src="/rasa-piscok/rasa-coklat.webp"
                      alt="Coklat Lumer"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="relative z-20 text-white/50 text-center px-10 font-bold text-base max-w-sm mt-12 mb-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Double chocolate premium yang lumer parah, varian paling
                    favorit pecandu coklat sejati.
                  </p>
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-500 shadow-2xl z-20">
                    <ArrowRight className="w-8 h-8 -rotate-45" />
                  </div>
                </div>

                {/* Column 2: Tiramisu (WHITE) */}
                <div
                  onClick={() => router.push("/products/tiramisu")}
                  className="flex-1 w-full group relative flex flex-col items-center justify-center py-24 bg-white transition-all duration-700 overflow-hidden cursor-pointer hover:bg-[#fcfcfa] md:border-x border-black/5"
                >
                  <h3 className="relative z-20 text-4xl md:text-6xl font-black uppercase text-black mb-10 text-center tracking-tight leading-none">
                    Tiramisu
                    <br />
                    Roll
                  </h3>
                  <div className="relative w-[80%] md:w-[70%] aspect-square z-10 transition-transform duration-700 group-hover:scale-110 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-black/5">
                    <Image
                      src="/rasa-piscok/piscok-tiramisu.webp"
                      alt="Tiramisu"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="relative z-20 text-black/40 text-center px-10 font-bold text-base max-w-sm mt-12 mb-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Perpaduan aroma kopi dan krim mewah yang bikin kamu berasa
                    lagi nongkrong asik di cafe.
                  </p>
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-16 h-16 bg-black rounded-full flex items-center justify-center group-hover:bg-black group-hover:scale-110 transition-all duration-500 shadow-2xl z-20 text-white border border-black/10">
                    <ArrowRight className="w-8 h-8 -rotate-45" />
                  </div>
                </div>

                {/* Column 3: Strawberry */}
                <div
                  onClick={() => router.push("/products/strawberry")}
                  className="flex-1 w-full group relative flex flex-col items-center justify-center py-24 bg-[#fff0f3] transition-all duration-700 overflow-hidden cursor-pointer hover:bg-[#ffe4e9]"
                >
                  <h3 className="relative z-20 text-4xl md:text-6xl font-black uppercase text-black mb-10 text-center tracking-tight leading-none">
                    Strawberry
                    <br />& Choco
                  </h3>
                  <div className="relative w-[80%] md:w-[70%] aspect-square z-10 transition-transform duration-700 group-hover:scale-110 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                    <Image
                      src="/rasa-piscok/piscok-starberry.webp"
                      alt="Strawberry"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="relative z-20 text-black/40 text-center px-10 font-bold text-base max-w-sm mt-12 mb-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Manis seger buah stroberi ketemu lumeran coklat pekat,
                    definisi mood booster paling nampol!
                  </p>
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-16 h-16 bg-black rounded-full flex items-center justify-center group-hover:bg-black group-hover:scale-110 transition-all duration-500 shadow-2xl z-20 text-white border border-black/10">
                    <ArrowRight className="w-8 h-8 -rotate-45" />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Column 1: Samyang Nori */}
                <div
                  onClick={() => router.push("/products/samyang-nori")}
                  className="flex-1 w-full group relative flex flex-col items-center justify-center py-24 bg-[#1a2f1a] transition-all duration-700 overflow-hidden cursor-pointer hover:bg-[#142414]"
                >
                  <h3 className="relative z-20 text-4xl md:text-6xl font-black uppercase text-white mb-10 text-center tracking-tight leading-none">
                    Samyang
                    <br />
                    Nori
                  </h3>
                  <div className="relative w-[90%] md:w-[80%] aspect-video z-10 transition-transform duration-700 group-hover:scale-110 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10">
                    <Image
                      src="/rasa-samyang/samyang-nori.webp"
                      alt="Samyang Nori"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="relative z-20 text-white/50 text-center px-10 font-bold text-base max-w-sm mt-12 mb-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Kombinasi pedas Samyang dan gurihnya rumput laut (nori) yang
                    krispi di luar.
                  </p>
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-500 shadow-2xl z-20">
                    <ArrowRight className="w-8 h-8 -rotate-45" />
                  </div>
                </div>

                {/* Column 2: Samyang Keju (WHITE) */}
                <div
                  onClick={() => router.push("/products/samyang-keju")}
                  className="flex-1 w-full group relative flex flex-col items-center justify-center py-24 bg-white transition-all duration-700 overflow-hidden cursor-pointer hover:bg-[#fcfcfa] md:border-l border-black/5"
                >
                  <h3 className="relative z-20 text-4xl md:text-6xl font-black uppercase text-black mb-10 text-center tracking-tight leading-none">
                    Samyang
                    <br />
                    Keju
                  </h3>
                  <div className="relative w-[90%] md:w-[80%] aspect-video z-10 transition-transform duration-700 group-hover:scale-110 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-black/5">
                    <Image
                      src="/rasa-samyang/samyang-keju.webp"
                      alt="Samyang Keju"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="relative z-20 text-black/40 text-center px-10 font-bold text-base max-w-sm mt-12 mb-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Pedas membara Samyang bertemu lumeran keju gurih. Perpaduan
                    maut buat pecinta pedas.
                  </p>
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 group-hover:scale-110 transition-all duration-500 shadow-2xl z-20 text-white">
                    <ArrowRight className="w-8 h-8 -rotate-45" />
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* --- NEW: Member / Creators Section --- */}
        <section className="w-full bg-white relative z-20 pt-20 pb-40 flex flex-col items-center">
          <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-4xl md:text-5xl font-black uppercase text-black mb-10 tracking-tight">
              Behind Lumeriá
            </h2>

            {/* Interactive Image Container */}
            <div
              className="relative w-full max-w-[900px] aspect-[2.4/1] mb-12 group"
              onMouseLeave={() => setActiveMember(null)}
            >
              <Image
                src="/member/member_revisi.webp"
                alt="Lumeriá Makers and Members"
                fill
                className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Invisible Hover Columns over characters */}
              <div className="absolute inset-x-0 bottom-0 h-full w-full mx-auto flex z-30">
                {MEMBERS_DATA.map((member) => (
                  <div
                    key={member.id}
                    className="flex-1 h-full cursor-pointer relative"
                    onMouseEnter={() => setActiveMember(member.id)}
                    onClick={() => {
                      if (selectedMember?.id === member.id) {
                        setSelectedMember(null);
                      } else {
                        setSelectedMember(member);
                      }
                    }}
                  >
                    {/* Hover Tooltip (Name only when hovering now) */}
                    <div
                      className={`absolute bottom-[90%] left-1/2 -translate-x-1/2 min-w-[120px] bg-black text-white px-4 py-2 rounded-xl shadow-xl transition-all duration-300 pointer-events-none z-40 flex flex-col items-center
                        ${
                          activeMember === member.id && !selectedMember
                            ? "opacity-100 translate-y-0 scale-100"
                            : "opacity-0 translate-y-4 scale-95"
                        }`}
                    >
                      <h4 className="font-bold text-sm whitespace-nowrap">
                        {member.name}
                      </h4>
                      {/* Tooltip Arrow */}
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rotate-45"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Bubble Member Detail */}
              {selectedMember && (
                <div
                  className="absolute z-40 transition-all duration-500 ease-out"
                  style={{
                    left: "50%",
                    bottom: "105%",
                    transform: "translateX(-50%)",
                    width: "calc(100vw - 48px)",
                    maxWidth: "450px",
                  }}
                >
                  {/* On Desktop, we can use a more specific position if we want, but centered is safest for not cutting off. 
                      However, let's try to keep it centered globally in this section for mobile safety. */}
                  <div className="relative bg-white/95 backdrop-blur-xl border border-black/5 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="w-full text-center">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-black text-black text-lg leading-tight">
                          {selectedMember.name}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMember(null);
                          }}
                          className="text-gray-400 hover:text-black transition-colors"
                        >
                          <Plus className="w-4 h-4 rotate-45" />
                        </button>
                      </div>
                      <span className="inline-block bg-[#e75a40]/10 text-[#e75a40] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mb-2 border border-[#e75a40]/10">
                        {selectedMember.className}
                      </span>
                      <p className="text-gray-600 text-xs font-medium leading-relaxed">
                        {selectedMember.role}
                      </p>
                    </div>

                    {/* Bubble Tail - Points to the specific character */}
                    <div
                      className="absolute -bottom-2 w-4 h-4 bg-white/95 rotate-45 border-b border-r border-black/5 shadow-sm transition-all duration-500 ease-out"
                      style={{
                        left: `${(MEMBERS_DATA.findIndex((m) => m.id === selectedMember.id) / MEMBERS_DATA.length) * 100 + 50 / MEMBERS_DATA.length}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Description Text */}
            <div className="max-w-2xl bg-gradient-to-b from-[#fdf8f5] to-white px-10 py-10 rounded-[2rem] shadow-sm border border-[#e6ccb2]/40 relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#8b5a2b] text-white text-sm font-bold px-6 py-2 rounded-full uppercase tracking-widest shadow-lg">
                The Core Team
              </div>
              <p className="text-xl md:text-2xl font-bold text-black/80 leading-relaxed">
                Inilah para pembuat di balik berdirinya{" "}
                <span className="text-[#8b5a2b] font-black">Lumeriá</span>. Kami
                selalu berusaha menghadirkan lumeran dan kerenyahan terbaik di
                setiap gigitan untuk Anda.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
