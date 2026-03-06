import { Instagram, Twitter } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <div className="relative w-full z-40 bg-[#2a1306] pt-12">
      {/* Curved SVG Top Border */}
      <svg
        className="absolute top-0 left-0 w-full -translate-y-[99%] text-[#2a1306]"
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0,120 C480,0 960,0 1440,120 L1440,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>

      <footer
        id="about"
        className="bg-[#2a1306] text-[#fdf8f5] py-16 px-6 sm:px-12 md:px-24"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-6">
              <Image
                src="/logo/logo_lumeria.webp"
                alt="Lumeriá Logo"
                width={160}
                height={55}
                className="object-contain"
              />
            </div>
            <p className="text-[#fdf8f5]/70 font-medium leading-relaxed">
              Redefining the classic Indonesian street food experience with
              premium ingredients and irresistible flavors.
            </p>
          </div>

          <div className="flex gap-16">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-lg mb-2 text-[#e6ccb2]">Menu</h4>
              <a
                href="#piscok"
                className="text-[#fdf8f5]/70 hover:text-white transition-colors"
              >
                Piscok Premium
              </a>
              <a
                href="#samyang"
                className="text-[#fdf8f5]/70 hover:text-white transition-colors"
              >
                Samyang Roll
              </a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-lg mb-2 text-[#e6ccb2]">Socials</h4>
              <a
                href="https://instagram.com"
                className="text-[#fdf8f5]/70 hover:text-white transition-colors flex items-center gap-2"
              >
                <Instagram className="w-5 h-5" /> Instagram
              </a>
              <a
                href="https://twitter.com"
                className="text-[#fdf8f5]/70 hover:text-white transition-colors flex items-center gap-2"
              >
                <Twitter className="w-5 h-5" /> Twitter
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-[#fdf8f5]/10 text-center text-[#fdf8f5]/40 font-medium">
          © {new Date().getFullYear()} Lumeriá. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
