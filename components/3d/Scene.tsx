"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, ReactNode } from "react";

interface SceneProps {
  children: ReactNode;
  activeItem?: "piscok" | "samyang";
}

export default function Scene({ children, activeItem = "piscok" }: SceneProps) {
  return (
    <div
      id="canvas-container"
      className="fixed inset-0 -z-10 w-full h-screen pointer-events-none transition-transform duration-700 ease-out"
    >
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          toneMappingExposure: 1.5,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
      >
        {/* We moved light setup into the specific model components to match the user's exact lighting preferences */}
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
