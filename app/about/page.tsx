"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Heart, Target, Users, Sparkles, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero reveal animation
      gsap.from(".hero-content > *", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
      });

      // Parallax-like floating images
      gsap.to(".floating-img-1", {
        y: -100,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      gsap.to(".floating-img-2", {
        y: 150,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });

      // Section fades
      [section1Ref, section2Ref, section3Ref].forEach((ref) => {
        const elements = ref.current?.querySelectorAll(".animate-up");
        if (elements && elements.length > 0) {
          gsap.from(elements, {
            y: 60,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#fdf8f5] font-sans selection:bg-black selection:text-white overflow-x-hidden"
    >
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-[#c2d8b9]/30 rounded-full blur-3xl floating-img-1"></div>
        <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] bg-[#e6ccb2]/30 rounded-full blur-3xl floating-img-2"></div>

        <div className="max-w-4xl hero-content relative z-10">
          <span className="inline-block bg-[#8b5a2b] text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full mb-8">
            Dibalik Lumeriá
          </span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-black leading-none mb-8">
            Lebih Dari Sekadar <br />{" "}
            <span className="text-[#e75a40]">Camilan Biasa</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Lumeriá lahir dari semangat kreativitas siswa RPL, menggabungkan
            cita rasa tradisional dengan sentuhan inovasi modern.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section
        ref={section1Ref}
        id="story"
        className="py-24 px-6 max-w-7xl mx-auto overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 relative animate-up">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-700 hover:scale-[1.02] flex items-center justify-center bg-white/50 p-12">
              <Image
                src="/logo/logo_lumeria.webp"
                alt="Lumeriá Logo"
                fill
                className="object-contain"
              />
            </div>
            {/* Decorative Card */}
            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-xl border border-black/5 max-w-[280px] hidden md:block">
              <p className="font-black text-black text-lg leading-snug">
                Dimulai dari tugas kelas, menjadi brand kebanggaan sekolah.
              </p>
            </div>
          </div>

          <div className="flex-1 animate-up">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-8 leading-tight">
              Awal Mula <br />{" "}
              <span className="text-[#8b5a2b]">Perjalanan Kami</span>
            </h2>
            <div className="space-y-6 text-gray-600 font-medium text-lg leading-relaxed">
              <p>
                Lumeriá bermula dari sebuah proyek kolaborasi di kelas XI RPL 1.
                Kami ingin menciptakan sesuatu yang nyata, sesuatu yang bisa
                dinikmati oleh semua orang, bukan sekadar baris kode di layar
                komputer.
              </p>
              <p>
                Dengan menggabungkan kemampuan teknis kami dalam membangun
                *branding* digital dan kecintaan kami pada camilan nusantara,
                kami menghadirkan Piscok dan Samyang Roll dengan kualitas
                premium.
              </p>
              <p>
                Setiap detail dari produk kami, mulai dari pemilihan Pisang Raja
                hingga pengembangan *website* ini, dilakukan dengan penuh
                dedikasi oleh seluruh anggota tim.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section - Rebuilt for guaranteed visibility */}
      <section
        ref={section2Ref}
        id="mission"
        className="py-32 bg-[#2a1306] px-6 relative overflow-hidden"
      >
        {/* Subtle geometric background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full border-[60px] border-white"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full border-[40px] border-white"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
          {/* Section Header */}
          <div className="text-center mb-24 max-w-3xl">
            <h2 className="text-6xl md:text-8xl font-black mb-8 uppercase tracking-tighter text-white leading-none">
              VISI & MISI
            </h2>
            <div className="w-32 h-2.5 bg-[#e75a40] mx-auto mb-8 rounded-full"></div>
            <p className="text-[#e6ccb2] font-black tracking-[0.5em] uppercase text-sm mb-4">
              Komitmen Lumeriá
            </p>
            <p className="text-white/60 text-lg font-medium">
              Mewujudkan pengalaman kuliner premium yang menggabungkan cita rasa
              tradisional dengan inovasi modern kelas dunia.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 w-full">
            {[
              {
                icon: <Target className="w-12 h-12" />,
                title: "Kualitas Premium",
                desc: "Hanya menggunakan bahan-bahan pilihan seperti Pisang Raja terbaik dan coklat batang berkualitas tinggi untuk rasa yang tak tertandingi.",
                color: "bg-[#c2d8b9]", // Matcha Green
              },
              {
                icon: <Heart className="w-12 h-12" />,
                title: "Inovasi Rasa",
                desc: "Berani bereksperimen dengan varian rasa unik seperti Matcha, Tiramisu, hingga Samyang untuk sensasi rasa yang revolusioner.",
                color: "bg-[#ffccd5]", // Strawberry Pink
              },
              {
                icon: <Users className="w-12 h-12" />,
                title: "Semangat Komunal",
                desc: "Membangun hubungan erat dengan komunitas melalui layanan pengantaran langsung yang personal dan penuh dedikasi.",
                color: "bg-[#d8b9ff]", // Lavender Purple
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative bg-[#351a0b] hover:bg-[#3d1f0d] p-12 md:p-14 rounded-[4rem] border border-white/10 hover:border-[#e75a40]/50 transition-all duration-500 shadow-2xl flex flex-col items-start text-left overflow-hidden"
              >
                {/* Decorative glow on hover */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#e75a40]/10 rounded-full blur-[60px] group-hover:bg-[#e75a40]/20 transition-all duration-700"></div>

                <div
                  className={`w-24 h-24 ${item.color} text-[#2a1306] rounded-[2.2rem] flex items-center justify-center mb-12 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}
                >
                  {item.icon}
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-6 text-white group-hover:text-[#e75a40] transition-colors leading-tight uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="text-white/80 font-medium text-xl leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second Image Highlight Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24 animate-up">
          <div className="flex-1 relative">
            <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-700 hover:scale-[1.02]">
              <Image
                src="/rasa-piscok/piscok-matcha.webp"
                alt="Product Innovation"
                fill
                className="object-contain bg-white/50 p-12"
              />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-8 leading-tight uppercase">
              Komitmen <br />{" "}
              <span className="text-[#e75a40]">Inovasi Kami</span>
            </h2>
            <p className="text-gray-500 font-medium text-lg leading-relaxed">
              Kami tidak pernah berhenti bereksperimen. Setiap produk Lumeriá
              diriset dengan teliti untuk menemukan perpaduan rasa yang paling
              pas, sehingga setiap gigitan memberikan kesan yang mendalam untuk
              Anda.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={section3Ref} className="py-32 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto bg-[#1b2b5b] rounded-[4rem] p-12 md:p-24 text-center text-white relative group animate-up">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

          <h2 className="text-4xl md:text-7xl font-black uppercase mb-8 leading-none relative z-10">
            Jadilah Bagian <br />{" "}
            <span className="text-pink-400">Dari Cerita Kami</span>
          </h2>
          <p className="text-white/70 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto relative z-10">
            Dukung karya siswa RPL dan nikmati camilan terbaik. Pesan sekarang
            untuk pengiriman langsung ke kelasmu!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <Link
              href="/products"
              className="bg-white text-[#1b2b5b] px-12 py-6 rounded-full font-black text-xl hover:scale-105 transition-transform flex items-center gap-3"
            >
              Cek Produk Kami <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
