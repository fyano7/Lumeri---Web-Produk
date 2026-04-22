"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Heart, Target, Users, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";


gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("team_members")
          .select("id, name, role, photo_url");

        if (error) throw error;
        if (data) setMembers(data);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []); // Kosongkan dependency agar hanya jalan sekali

  // 2. useEffect KHUSUS untuk Animasi GSAP
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

      // Parallax floating images
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
            Kenalan sama Lumeriá
          </span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-black leading-none mb-8">
            Bukan Cuma <br />{" "}
            <span className="text-[#e75a40]">Jajanan Biasa</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Lumeriá bermula dari ide iseng anak RPL yang pengen bikin camilan
            tradisional naik kelas dengan sentuhan modern yang asik.
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
              <span className="text-[#8b5a2b]">Cerita Kita</span>
            </h2>
            <div className="space-y-6 text-gray-600 font-medium text-lg leading-relaxed">
              <p>
                Lumeriá itu sebenernya buah dari kolaborasi seru di kelas XI RPL
                1. Kita nggak mau cuma jago ngetik kode di layar, tapi juga
                pengen bikin sesuatu yang nyata dan bisa dinikmati
                bareng-bareng.
              </p>
              <p>
                Berbekal skill di dunia digital buat branding dan rasa penasaran
                kita sama camilan nusantara, akhirnya lahir deh Piscok dan
                Samyang Roll versi premium ini.
              </p>
              <p>
                Kita serius banget lho ngerjainnya. Mulai dari milih Pisang Raja
                yang paling oke sampai ngerakit website ini, semuanya kita
                lakuin dengan sepenuh hati demi kepuasan kalian.
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
              Bikin pengalaman ngemil kamu jadi lebih berkelas dengan perpaduan
              rasa tradisional dan inovasi yang nggak main-main.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 w-full">
            {[
              {
                icon: <Target className="w-12 h-12" />,
                title: "Kualitas Juara",
                desc: "Kita cuma pake bahan pilihan kayak Pisang Raja terbaik dan coklat premium biar rasanya bener-bener nendang.",
                color: "bg-[#4a2c2a]", // Chocolate Brown
              },
              {
                icon: <Heart className="w-12 h-12" />,
                title: "Eksperimen Seru",
                desc: "Nggak takut buat nyoba hal baru, mulai dari Coklat Lumer, Tiramisu, sampe Samyang Roll yang bakalan bikin lidah kamu kaget!",
                color: "bg-[#ffccd5]", // Strawberry Pink
              },
              {
                icon: <Users className="w-12 h-12" />,
                title: "Solid Terus",
                desc: "Kita pengen deket sama kalian lewat pelayanan yang ramah dan gercep, dari kita buat kalian semua.",
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

      {/* Team Section */}
      <section className="pt-24 pb-12 px-6 max-w-7xl mx-auto overflow-hidden" id="team">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6 w-full">
          <div>
            <h1 className="text-5xl md:text-6xl font-black mb-2 md:mb-0 uppercase tracking-tight text-[#1b2b5b] drop-shadow-lg">
              Meet the Team
            </h1>
          </div>
          <p className="max-w-md text-gray-500 font-medium text-base md:text-lg leading-relaxed">
            Inilah para kreator di balik Lumeriá. Mereka bukan hanya jago
            ngoding, tapi juga punya peran penting di balik produk dan inovasi
            yang kamu nikmati!
          </p>
        </div>

        {loading ? (
          <div className="text-center text-xl font-bold text-[#e75a40] animate-pulse">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 w-full">
            {members.map((member) => (
              <div
                key={member.id}
                className="group bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-[#e75a40]/20 hover:scale-105 hover:shadow-3xl transition-all duration-300"
              >
                <div className="w-28 h-28 relative rounded-full overflow-hidden border-4 border-[#e75a40] mb-4 group-hover:border-[#1b2b5b] transition-all duration-300">
                  <Image
                    src={member.photo_url}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="font-black text-2xl mb-1 text-[#1b2b5b] text-center group-hover:text-[#e75a40] transition-colors">
                  {member.name}
                </div>
                <div className="inline-block bg-[#e75a40]/10 text-[#e75a40] font-semibold px-4 py-1 rounded-full text-sm text-center mt-1 uppercase tracking-wide">
                  {member.role}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Second Image Highlight Section (Inovasi) */}
      <section className="pt-12 pb-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24 animate-up">
          <div className="flex-1 relative">
            <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-700 hover:scale-[1.02]">
              <Image
                src="/rasa-piscok/rasa-coklat.webp"
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
              Kita nggak akan berhenti buat terus ngulik. Setiap produk Lumeriá
              udah lewat proses trial yang panjang biar dapet rasa yang pas
              banget di hati kamu. Pokoknya, tiap gigitan harus berkesan!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={section3Ref} className="py-32 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto bg-[#1b2b5b] rounded-[4rem] p-12 md:p-24 text-center text-white relative group animate-up">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

          <h2 className="text-4xl md:text-7xl font-black uppercase mb-8 leading-none relative z-10">
            Yuk Jadi Bagian <br />{" "}
            <span className="text-pink-400">Dari Perjalanan Kita</span>
          </h2>
          <p className="text-white/70 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto relative z-10">
            Dukung terus karya anak RPL dan cobain camilan paling hits minggu
            ini. Langsung pesan sekarang ya, biar bisa kita anterin sampai depan
            mata!
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
