"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Link from "next/link";

export default function QRPage() {
  const [qrUrl, setQrUrl] = useState("");
  const [url, setUrl] = useState("https://lumeria.vercel.app/");

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: "#1b2b5b",
        light: "#ffffff",
      },
    }).then(setQrUrl);
  }, [url]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf8f5] to-[#e6ccb2] py-16 px-4 flex flex-col items-center">
      <div className="max-w-md w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e75a40]/10 text-[#e75a40] text-xs font-black uppercase tracking-widest hover:bg-[#e75a40] hover:text-white transition-all duration-300 mb-8 group shadow-sm border border-[#e75a40]/20"
        >
          <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Kembali ke Beranda
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <h1 className="text-3xl font-black mb-2 text-[#1b2b5b] uppercase">Scan untuk Akses</h1>
          <p className="text-gray-500 mb-8">Pindai QR code ini dengan HP kamu</p>

          {qrUrl && (
            <div className="flex justify-center mb-8">
              <img src={qrUrl} alt="QR Code" className="rounded-2xl border-4 border-[#1b2b5b]" />
            </div>
          )}

          <div className="text-left">
            <label className="block text-sm font-bold text-gray-600 mb-2">URL:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#e75a40] focus:ring-2 focus:ring-[#e75a40]/20 outline-none transition-all"
              placeholder="Masukkan URL..."
            />
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Pastikan HP kamu terhubung ke jaringan yang sama dengan komputer ini
          </p>
        </div>
      </div>
    </div>
  );
}