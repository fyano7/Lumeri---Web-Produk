"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── VOX HELPER ──
function createVox(
  x: number,
  y: number,
  z: number,
  col: number,
  rough = 0.8,
  metal = 0,
  sx = 1,
  sy = 1,
  sz = 1,
) {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(sx, sy, sz),
    new THREE.MeshStandardMaterial({
      color: col,
      roughness: rough,
      metalness: metal,
    }),
  );
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

const COL = {
  noodleBase: 0xc84400,
  noodleMid: 0xe05500,
  noodleTop: 0xff6600,
  noodleHi: 0xff8833,
  sauce: 0xdd3300,
  cheeseWhite: 0xfff0bb,
  cheeseYellow: 0xffe080,
  sesame: 0xddcc77,
  nori: 0x1a2a18,
  chili: 0xff1100,
};

function makeRamenBlock(ox: number, oy: number, oz: number) {
  const G = new THREE.Group();

  const shape: [number, number, number][] = [];
  for (let x = 0; x < 6; x++)
    for (let y = 0; y < 3; y++)
      for (let z = 0; z < 4; z++) {
        const topCorner =
          y === 2 && (x === 0 || x === 5) && (z === 0 || z === 3);
        if (!topCorner) shape.push([x, y, z]);
      }

  shape.forEach(([x, y, z]) => {
    let c;
    if (y === 2) {
      c =
        (x + z) % 3 === 0
          ? COL.noodleHi
          : (x + z) % 3 === 1
            ? COL.noodleTop
            : COL.noodleMid;
    } else if (y === 1) {
      c = (x * z) % 2 === 0 ? COL.noodleMid : COL.noodleBase;
    } else {
      c = COL.noodleBase;
    }
    G.add(createVox(x, y, z, c, 0.72));
  });

  for (let x = 0; x < 6; x++)
    for (let z = 0; z < 4; z++) {
      if (
        (x === 0 && z === 0) ||
        (x === 5 && z === 0) ||
        (x === 0 && z === 3) ||
        (x === 5 && z === 3)
      )
        continue;
      const c = (x + z) % 2 === 0 ? COL.noodleHi : COL.sauce;
      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(0.95, 0.25, 0.95),
        new THREE.MeshStandardMaterial({
          color: c,
          roughness: 0.35,
          metalness: 0.05,
        }),
      );
      slab.position.set(x, 3.12, z);
      slab.castShadow = true;
      G.add(slab);
    }

  const cheesePatch = [
    [3, 0],
    [3, 1],
    [4, 0],
    [4, 1],
    [4, 2],
    [5, 1],
  ];
  cheesePatch.forEach(([cx, cz]) => {
    const ht = 0.3 + Math.random() * 0.15;
    const c = (cx + cz) % 2 === 0 ? COL.cheeseWhite : COL.cheeseYellow;
    const ch = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, ht, 1.0),
      new THREE.MeshStandardMaterial({
        color: c,
        roughness: 0.3,
        metalness: 0.0,
      }),
    );
    ch.position.set(cx, 3.15 + ht / 2, cz);
    ch.castShadow = true;
    G.add(ch);
  });

  [
    [1, 1],
    [2, 2],
    [1, 3],
    [3, 0],
    [5, 2],
  ].forEach(([sx, sz]) => {
    G.add(
      createVox(sx + 0.2, 3.45, sz + 0.2, COL.sesame, 0.6, 0, 0.35, 0.35, 0.35),
    );
  });

  const noriM = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.2, 0.6),
    new THREE.MeshStandardMaterial({ color: COL.nori, roughness: 0.9 }),
  );
  noriM.position.set(2, 3.55, 2);
  G.add(noriM);

  G.add(createVox(2.3, 3.65, 1.8, COL.chili, 0.6, 0, 0.3, 0.3, 0.3));
  G.add(createVox(1.5, 3.62, 2.4, COL.chili, 0.6, 0, 0.25, 0.25, 0.25));

  G.position.set(ox, oy, oz);
  return G;
}

export default function SamyangModel() {
  const groupRef = useRef<THREE.Group>(null);

  const sceneGroup = useMemo(() => {
    const ROOT = new THREE.Group();

    // RACK
    const RACK = new THREE.Group();
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.4,
      metalness: 0.85,
    });

    for (let x = -11; x <= 11; x += 1.4) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.18, 24),
        wireMat,
      );
      bar.position.set(x, 0, 0);
      bar.receiveShadow = true;
      RACK.add(bar);
    }
    for (let z = -11; z <= 11; z += 1.4) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(24, 0.18, 0.18),
        wireMat,
      );
      bar.position.set(0, 0, z);
      bar.receiveShadow = true;
      RACK.add(bar);
    }
    [
      [-10, -10],
      [10, -10],
      [-10, 10],
      [10, 10],
    ].forEach(([x, z]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.5, 0.5), wireMat);
      leg.position.set(x, -0.85, z);
      leg.receiveShadow = true;
      RACK.add(leg);
    });
    RACK.position.y = 0.5;
    ROOT.add(RACK);

    // BLOCKS
    const layout = [
      [-10, -7],
      [-1, -7],
      [8, -7],
      [-10, 3],
      [-1, 3],
      [8, 3],
    ];
    layout.forEach(([bx, bz]) => {
      const block = makeRamenBlock(bx, 1.0, bz);
      block.rotation.y = (Math.random() - 0.5) * 0.15;
      ROOT.add(block);
    });

    return ROOT;
  }, []);

  // Continuous rotation & float tied to scroll
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5 - 2;

      if (typeof window !== "undefined") {
        const scrollY = window.scrollY;
        // Base auto-spin + scroll spin multiplier
        groupRef.current.rotation.y =
          state.clock.elapsedTime * 0.1 + scrollY * 0.003;
        groupRef.current.rotation.x = scrollY * 0.0008;
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} color={0xff6622} />
      <directionalLight
        position={[15, 25, 12]}
        intensity={1.5}
        color={0xfff0cc}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight
        position={[-12, 10, -12]}
        intensity={0.5}
        color={0xff3300}
      />
      <pointLight
        position={[0, 8, 0]}
        intensity={1.2}
        distance={40}
        color={0xff4400}
      />

      <group scale={0.3} rotation={[0.4, 0, 0]}>
        <primitive object={sceneGroup} ref={groupRef} />
      </group>
    </>
  );
}
