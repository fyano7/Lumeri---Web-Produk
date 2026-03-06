"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Scene from "@/components/3d/Scene";
import PiscokModel from "@/components/3d/PiscokModel";
import SamyangModel from "@/components/3d/SamyangModel";
import { Leaf, Coffee, Flame, Plus, ArrowRight } from "lucide-react";

const MEMBERS_DATA = [
  {
    id: 1,
    name: "Chika",
    className: "XI RPL 1",
    role: "Pembuat logo, memasak",
    image: "/member-foto/orang-1.webp",
  },
  {
    id: 2,
    name: "Prisa",
    className: "XI RPL 1",
    role: "Pembuat logo, memasak",
    image: "/member-foto/orang-1.webp",
  },
  {
    id: 3,
    name: "Rafi",
    className: "XI RPL 1",
    role: "Pembeli bahan makanan dan marketing",
    image: "/member-foto/orang-1.webp",
  },
  {
    id: 4,
    name: "Andres",
    className: "XI RPL 1",
    role: "Marketing",
    image: "/member-foto/orang-1.webp",
  },
  {
    id: 5,
    name: "Haiqal",
    className: "XI RPL 1",
    role: "Pembuat poster, desain",
    image: "/member-foto/orang-1.webp",
  },
  {
    id: 6,
    name: "Hafis",
    className: "XI RPL 1",
    role: "Juru resep dan pembeli bahan",
    image: "/member-foto/orang-1.webp",
  },
  {
    id: 7,
    name: "Farel",
    className: "XI RPL 1",
    role: "Back end developer",
    image: "/member-foto/orang-1.webp",
  },
  {
    id: 8,
    name: "Faisal",
    className: "XI RPL 1",
    role: "Front end developer",
    image: "/member-foto/orang-1.webp",
  },
];

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const [activeProduct, setActiveProduct] = useState<"piscok" | "samyang">(
    "piscok",
  );
  // Initialize to tiramisu (center roll in the 3D scene) or matcha
  const [activeFlavor, setActiveFlavor] = useState<
    "matcha" | "strawberry" | "tiramisu"
  >("tiramisu");
  const [activeMember, setActiveMember] = useState<number | null>(null);
  const [selectedMember, setSelectedMember] = useState<
    (typeof MEMBERS_DATA)[0] | null
  >(null);

  // Change body background color dynamically based on state
  useEffect(() => {
    let color = "var(--background)";
    if (activeProduct === "piscok") {
      if (activeFlavor === "matcha") color = "var(--color-matcha)";
      if (activeFlavor === "strawberry") color = "var(--color-strawberry)";
      if (activeFlavor === "tiramisu") color = "var(--color-tiramisu)";
    } else {
      color = "var(--color-samyang)";
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
          scrub: 1, // Smooth dragging effect
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
          { x: "-120vw", duration: 4, ease: "none" },
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

      {/* 3D Canvas Background (Fixed) */}
      <Scene activeItem={activeProduct}>
        {activeProduct === "piscok" ? (
          <PiscokModel flavor={activeFlavor} />
        ) : (
          <SamyangModel />
        )}
      </Scene>

      {/* Main Content Overlay */}
      <main className="relative z-10 w-full pt-32 no-scrollbar">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 mt-10">
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-[-0.04em] text-foreground mb-6 uppercase leading-none mix-blend-color-burn">
            The Real
            <br />
            Crunch.
          </h1>
          <p className="text-xl md:text-3xl font-medium max-w-2xl text-foreground/80 mix-blend-color-burn">
            Piscok lumer di luar, renyah di dalam. Rasakan sensasi Lumeriá hari
            ini.
          </p>
        </section>

        {/* Interactive Product Section */}
        <section
          id="piscok"
          className="min-h-[90vh] flex flex-col items-center justify-start pt-20 px-6"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-12 text-foreground mix-blend-color-burn uppercase">
            Explore Flavors
          </h2>

          {/* Flavor Switcher Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 bg-white/40 p-2 md:p-3 rounded-full backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] md:mb-32">
            <button
              onClick={() => {
                setActiveProduct("piscok");
                setActiveFlavor("matcha");
              }}
              className={`flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold transition-all duration-300 ${
                activeProduct === "piscok" && activeFlavor === "matcha"
                  ? "bg-white text-green-700 shadow-lg scale-105"
                  : "hover:bg-white/60 text-black/70"
              }`}
            >
              <Leaf className="w-5 h-5" />
              Matcha
            </button>
            <button
              onClick={() => {
                setActiveProduct("piscok");
                setActiveFlavor("tiramisu");
              }}
              className={`flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold transition-all duration-300 ${
                activeProduct === "piscok" && activeFlavor === "tiramisu"
                  ? "bg-white text-amber-900 shadow-lg scale-105"
                  : "hover:bg-white/60 text-black/70"
              }`}
            >
              <Coffee className="w-5 h-5" />
              Choco / Tiramisu
            </button>
            <button
              onClick={() => {
                setActiveProduct("piscok");
                setActiveFlavor("strawberry");
              }}
              className={`flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold transition-all duration-300 ${
                activeProduct === "piscok" && activeFlavor === "strawberry"
                  ? "bg-white text-pink-600 shadow-lg scale-105"
                  : "hover:bg-white/60 text-black/70"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-pink-500 shadow-inner" />
              Strawberry
            </button>
          </div>
        </section>

        {/* Samyang Section */}
        <section
          id="samyang"
          className="min-h-screen flex flex-col items-center justify-center py-20 px-6 text-center"
        >
          <div
            className={`bg-white/30 p-8 md:p-16 rounded-[4rem] backdrop-blur-xl border border-white/40 max-w-5xl w-full flex flex-col items-center shadow-2xl transition-all duration-700 ${activeProduct === "samyang" ? "transform-none opacity-100" : "translate-y-10 opacity-80 hover:opacity-100"}`}
          >
            <h2 className="text-5xl md:text-8xl font-black mb-6 text-foreground uppercase tracking-tighter">
              Spicy Craving?
            </h2>
            <p className="text-xl md:text-3xl font-medium max-w-2xl text-foreground/80 mb-12">
              Bosan yang manis? Cobain Samyang Roll kita. Gurih, pedas, nagih
              banget.
            </p>

            <button
              onClick={() => setActiveProduct("samyang")}
              className={`flex items-center gap-3 px-10 py-5 rounded-full font-black text-xl transition-all duration-500 ${
                activeProduct === "samyang"
                  ? "bg-red-600 text-white shadow-[0_0_40px_rgba(220,38,38,0.5)] scale-110"
                  : "bg-black text-white hover:bg-black/80 hover:scale-105"
              }`}
            >
              <Flame
                className={`w-6 h-6 ${activeProduct === "samyang" ? "text-yellow-300 animate-pulse" : "text-red-500"}`}
              />
              {activeProduct === "samyang"
                ? "Samyang Roll Active"
                : "Switch to Samyang Roll"}
            </button>
          </div>
        </section>

        {/* --- RE-ADDED: Sliding Info Cards Section --- */}
        <section
          ref={infoSectionRef}
          className="relative w-full h-[300vh] bg-transparent z-10"
        >
          <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
            {/* Intro Text */}
            <div
              ref={infoTextRef}
              className="absolute w-full px-6 text-center transform-gpu z-10 pointer-events-none"
            >
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase text-foreground leading-[1] tracking-tightmix-blend-color-burn drop-shadow-lg">
                PISCOK ? SAMYANG ?<br />
                APA SIH ITU?
              </h2>
              <p className="mt-8 text-xl md:text-2xl opacity-70 font-medium mix-blend-color-burn">
                (mari kita bahas yang sebenarnya)
              </p>
            </div>

            {/* Sliding Cards Container */}
            <div
              ref={cardsWrapperRef}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full flex items-center gap-16 md:gap-32 px-10 md:px-32 w-max z-20"
            >
              {/* Connecting Rope/String (SVG) */}
              <div className="absolute top-1/2 left-0 w-full h-[6px] -translate-y-1/2 -z-10 opacity-50">
                <svg width="100%" height="20" preserveAspectRatio="none">
                  <path
                    d="M 0 10 Q 150 20 300 10 T 600 10 T 900 10 T 1200 10 T 1500 10"
                    stroke="#8b5a2b"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="10, 5"
                  />
                </svg>
              </div>

              {/* Card 1: Matcha */}
              <div className="relative w-[300px] md:w-[400px] aspect-[3/4] bg-[#fdf8f5] rounded-xl shadow-2xl p-6 md:p-8 flex flex-col items-center justify-between border-2 border-[#d4bca0] transform rotate-3 before:content-[''] before:absolute before:-top-4 before:left-1/2 before:-translate-x-1/2 before:w-8 before:h-8 before:bg-[#8b5a2b] before:rounded-full before:shadow-inner before:border-4 before:border-[#fdf8f5] hover:scale-105 transition-transform duration-300">
                <div className="w-full text-[#2a1306] text-center border-b-2 border-dashed border-[#d4bca0] pb-4 mb-4 font-black uppercase tracking-widest text-xl">
                  Matcha
                </div>
                <div className="relative w-full aspect-square bg-[#c2d8b9]/30 rounded-lg border border-[#c2d8b9] flex items-center justify-center p-4">
                  {/* Background Watermark Logo */}
                  <div className="absolute inset-x-4 inset-y-8 opacity-20 pointer-events-none flex items-center justify-center mix-blend-multiply">
                    <Image
                      src="/logo/logo_lumeria.png"
                      alt="Lumeriá Watermark"
                      fill
                      className="object-contain"
                    />
                  </div>
                  {/* Normal Product Image */}
                  <Image
                    src="/rasa-piscok/piscok-matcha.webp"
                    alt="Matcha Flavor"
                    fill
                    className="object-contain drop-shadow-xl p-4 scale-125 transition-transform duration-500 hover:scale-150"
                  />
                </div>
                <p className="text-center font-medium text-[#2a1306]/80 text-base md:text-lg mt-6 leading-snug">
                  Paduan manisnya coklat premium dengan wangi dan pahitnya teh
                  hijau khas Jepang.
                </p>
              </div>

              {/* Card 2: Tiramisu */}
              <div className="relative w-[300px] md:w-[400px] aspect-[3/4] bg-[#fdf8f5] rounded-xl shadow-2xl p-6 md:p-8 flex flex-col items-center justify-between border-2 border-[#d4bca0] transform -rotate-2 mt-20 before:content-[''] before:absolute before:-top-4 before:left-1/2 before:-translate-x-1/2 before:w-8 before:h-8 before:bg-[#8b5a2b] before:rounded-full before:shadow-inner before:border-4 before:border-[#fdf8f5] hover:scale-105 transition-transform duration-300">
                <div className="w-full text-[#2a1306] text-center border-b-2 border-dashed border-[#d4bca0] pb-4 mb-4 font-black uppercase tracking-widest text-xl">
                  Tiramisu
                </div>
                <div className="relative w-full aspect-square bg-[#e6ccb2]/30 rounded-lg border border-[#d4bca0] flex items-center justify-center p-4">
                  <Image
                    src="/rasa-piscok/piscok-tiramisu.webp"
                    alt="Tiramisu Flavor"
                    fill
                    className="object-contain drop-shadow-xl p-4 scale-[1.15] transition-transform duration-500 hover:scale-[1.25]"
                  />
                </div>
                <p className="text-center font-medium text-[#2a1306]/80 text-base md:text-lg mt-6 leading-snug">
                  Cita rasa kopi dan krim lembut ala dessert Italia dalam setiap
                  gigitan krispi.
                </p>
              </div>

              {/* Card 3: Strawberry */}
              <div className="relative w-[300px] md:w-[400px] aspect-[3/4] bg-[#fdf8f5] rounded-xl shadow-2xl p-6 md:p-8 flex flex-col items-center justify-between border-2 border-[#d4bca0] transform rotate-2 mb-10 before:content-[''] before:absolute before:-top-4 before:left-1/2 before:-translate-x-1/2 before:w-8 before:h-8 before:bg-[#8b5a2b] before:rounded-full before:shadow-inner before:border-4 before:border-[#fdf8f5] hover:scale-105 transition-transform duration-300">
                <div className="w-full text-[#2a1306] text-center border-b-2 border-dashed border-[#d4bca0] pb-4 mb-4 font-black uppercase tracking-widest text-xl">
                  Strawberry
                </div>
                <div className="relative w-full aspect-square bg-[#ffccd5]/30 rounded-lg border border-[#ffccd5] flex items-center justify-center p-4">
                  <Image
                    src="/rasa-piscok/piscok-starberry.webp"
                    alt="Strawberry Flavor"
                    fill
                    className="object-contain drop-shadow-xl p-4 scale-[1.15] transition-transform duration-500 hover:scale-[1.25]"
                  />
                </div>
                <p className="text-center font-medium text-[#2a1306]/80 text-base md:text-lg mt-6 leading-snug">
                  Manis asamnya stroberi segar berpadu sempurna dengan lumeran
                  coklat pekat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- NEW: 3-Column Product Showcase (Image 4) --- */}
        <section
          id="products"
          className="w-full relative z-20 bg-white pt-24 pb-0 overflow-hidden"
        >
          <div className="w-full flex flex-col md:flex-row h-auto md:h-[85vh]">
            {/* Column 1: Matcha */}
            <div className="flex-1 group relative flex flex-col items-center justify-center py-20 bg-[#c2d8b9] transition-colors duration-500 overflow-hidden cursor-pointer border-r border-black/5">
              {/* Background Animated SVG/Element on Hover (Removed) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 scale-50 group-hover:scale-100 pointer-events-none"></div>
              <h3 className="absolute top-10 text-3xl font-black uppercase text-black z-10">
                Matcha
              </h3>

              <div className="relative w-[80%] aspect-[4/3] z-10 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110">
                <Image
                  src="/rasa-piscok/piscok-matcha.webp"
                  alt="Matcha"
                  fill
                  className="object-contain scale-110"
                />
              </div>

              <div className="absolute bottom-10 left-10 w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300 shadow-xl z-20">
                <ArrowRight className="w-5 h-5 -rotate-45" />
              </div>
            </div>

            {/* Column 2: Tiramisu */}
            <div className="flex-1 group relative flex flex-col items-center justify-center py-20 bg-[#e6ccb2] transition-colors duration-500 overflow-hidden cursor-pointer border-r border-black/5">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 scale-50 group-hover:scale-100 pointer-events-none"></div>
              <h3 className="absolute top-10 text-3xl font-black uppercase text-black z-10">
                Tiramisu
              </h3>

              <div className="relative w-[80%] aspect-[4/3] z-10 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110">
                <Image
                  src="/rasa-piscok/piscok-tiramisu.webp"
                  alt="Tiramisu"
                  fill
                  className="object-contain scale-110"
                />
              </div>

              <div className="absolute bottom-10 left-10 w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300 shadow-xl z-20">
                <ArrowRight className="w-5 h-5 -rotate-45" />
              </div>
            </div>

            {/* Column 3: Strawberry */}
            <div className="flex-1 group relative flex flex-col items-center justify-center py-20 bg-[#ffccd5] transition-colors duration-500 overflow-hidden cursor-pointer border-r border-black/5">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 scale-50 group-hover:scale-100 pointer-events-none">
                <div className="w-[400px] h-[400px] bg-pink-400/30 rounded-full blur-3xl animate-pulse" />
              </div>
              <h3 className="absolute top-10 text-3xl font-black uppercase text-black z-10 text-center">
                Strawberry
                <br />& Choco
              </h3>

              <div className="relative w-[80%] aspect-[4/3] z-10 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110">
                <Image
                  src="/rasa-piscok/piscok-starberry.webp"
                  alt="Strawberry"
                  fill
                  className="object-contain scale-110"
                />
              </div>

              <div className="absolute bottom-10 flex flex-col items-center w-full z-20">
                <button className="bg-white text-black font-bold px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                  Discover this product <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
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
                src="/member/member_lumeria.webp"
                alt="Lumeria Makers and Members"
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
                    onClick={() => setSelectedMember(member)}
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

        {/* Member Profile detail Modal overlay */}
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-6 transition-all duration-500 ${
            selectedMember
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
          ></div>

          {/* Modal Card */}
          <div
            className={`relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col items-center transform transition-transform duration-500 ${
              selectedMember
                ? "scale-100 translate-y-0"
                : "scale-90 translate-y-10"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <Plus className="w-5 h-5 text-black rotate-45" />
            </button>

            <div className="w-full h-48 bg-gradient-to-br from-[#e6ccb2] to-[#c2d8b9] relative">
              {/* Decorative background shapes */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-10 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-xl"></div>
                <div className="absolute bottom-0 left-10 w-40 h-40 bg-white rounded-full mix-blend-overlay filter blur-xl"></div>
              </div>
            </div>

            {/* Profile Avatar inside Modal */}
            <div className="relative w-32 h-32 aspect-square rounded-[2rem] border-8 border-white bg-gray-100 shadow-xl overflow-hidden -mt-16 z-10 shrink-0 flex items-center justify-center">
              {selectedMember && (
                <Image
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  fill
                  className="object-contain"
                />
              )}
            </div>

            <div className="px-8 pb-10 pt-4 text-center">
              <h3 className="text-3xl font-black text-black mb-1">
                {selectedMember?.name}
              </h3>
              <span className="inline-block bg-amber-100 text-amber-800 text-sm font-bold px-4 py-1.5 rounded-full mb-6">
                {selectedMember?.className}
              </span>

              <div className="bg-[#fdf8f5] rounded-2xl p-6 border border-[#e6ccb2]/30 shadow-inner">
                <p className="text-xs uppercase tracking-widest text-[#8b5a2b] font-bold mb-2">
                  Role / Contribution
                </p>
                <p className="text-base text-black/80 font-medium leading-relaxed">
                  {selectedMember?.role}
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
