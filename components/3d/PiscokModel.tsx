"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

interface PiscokModelProps {
  flavor?: "matcha" | "strawberry" | "tiramisu";
}

// ─── Textures ─────────────────────────────────────────────────────────────
function makeCrepeTexture() {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createLinearGradient(0, 0, 512, 512);
  g.addColorStop(0, "#e8b040");
  g.addColorStop(0.5, "#f0c050");
  g.addColorStop(1, "#d8a030");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x += 10) {
    const d = Math.sin((x / 512) * Math.PI * 50) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(${d > 0.5 ? "180,100,20" : "255,210,80"},${0.1 + d * 0.08})`;
    ctx.fillRect(x, 0, 5, 512);
  }
  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.ellipse(
      Math.random() * 512,
      Math.random() * 512,
      Math.random() * 18 + 3,
      Math.random() * 10 + 2,
      Math.random() * Math.PI,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = `rgba(100,45,5,${Math.random() * 0.15})`;
    ctx.fill();
  }
  for (let i = 0; i < 2500; i++) {
    ctx.fillStyle = `rgba(${Math.random() > 0.5 ? "100,45,5" : "240,180,60"},${Math.random() * 0.08})`;
    ctx.fillRect(
      Math.random() * 512,
      Math.random() * 512,
      Math.random() * 3,
      Math.random() * 3,
    );
  }
  return new THREE.CanvasTexture(c);
}

function makeWoodTexture() {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#c07840";
  ctx.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 120; i++) {
    const y = Math.random() * 1024;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 1024; x += 10)
      ctx.lineTo(
        x,
        y + Math.sin(x * 0.012 + i * 0.3) * 6 + (Math.random() - 0.5) * 2,
      );
    ctx.strokeStyle = `rgba(${Math.random() > 0.5 ? "60,25,5" : "180,110,40"},${0.15 + Math.random() * 0.2})`;
    ctx.lineWidth = Math.random() * 2 + 0.4;
    ctx.stroke();
  }
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = `rgba(200,120,40,${Math.random() * 0.06})`;
    ctx.fillRect(
      Math.random() * 1024,
      Math.random() * 1024,
      Math.random() * 6,
      Math.random() * 2,
    );
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}

// ─── KEY CONSTANTS ────────────────────────────────────────────────────────
const ROLL_R = 3.8;
const ROLL_HALF = 7.5;
const PLATE_Y = 2.2;

// Helpers
function makeRollGeo(segs = 42) {
  const geo = new THREE.CylinderGeometry(
    ROLL_R,
    ROLL_R,
    ROLL_HALF * 2,
    segs,
    16,
  );
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / ROLL_HALF;
    const bulge = 1 + (1 - y * y) * 0.05;
    const taper = 1 - Math.pow(Math.abs(y), 5) * 0.07;
    const organic =
      1 + Math.sin(Math.atan2(pos.getZ(i), pos.getX(i)) * 3 + y * 2) * 0.012;
    const s = bulge * taper * organic;
    pos.setX(i, pos.getX(i) * s);
    pos.setZ(i, pos.getZ(i) * s);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

function rollSurface(ax: number, angle: number) {
  return new THREE.Vector3(
    ax,
    Math.cos(angle) * ROLL_R,
    Math.sin(angle) * ROLL_R,
  );
}

export default function PiscokModel({ flavor = "tiramisu" }: PiscokModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<any>(null);

  // Initialize materials once
  if (!materialsRef.current && typeof document !== "undefined") {
    const crepeTex = makeCrepeTexture();
    const woodTex = makeWoodTexture();

    // Shared Materials
    const chocDark = new THREE.MeshStandardMaterial({
      color: 0x2a0e04,
      roughness: 0.38,
      metalness: 0.06,
    });
    const nutM = new THREE.MeshStandardMaterial({
      color: 0xb07830,
      roughness: 0.82,
    });
    const sesameM = new THREE.MeshStandardMaterial({
      color: 0xf0e490,
      roughness: 0.88,
    });
    const chocShavM = new THREE.MeshStandardMaterial({
      color: 0x200a03,
      roughness: 0.42,
      metalness: 0.04,
    });
    const strawRM = new THREE.MeshStandardMaterial({
      color: 0xe82828,
      roughness: 0.55,
    });
    const leafM = new THREE.MeshStandardMaterial({
      color: 0x228822,
      roughness: 0.8,
    });

    materialsRef.current = {
      crepeMat: new THREE.MeshStandardMaterial({
        map: crepeTex,
        roughness: 0.78,
        metalness: 0.0,
      }),
      woodMat: new THREE.MeshStandardMaterial({
        map: woodTex,
        color: 0xb87040,
        roughness: 0.65,
        metalness: 0.04,
      }),
      innerWoodMat: new THREE.MeshStandardMaterial({
        map: woodTex,
        color: 0xd09050,
        roughness: 0.6,
        metalness: 0.03,
      }),
      chocDark,
      nutM,
      sesameM,
      chocShavM,
      strawRM,
      leafM,
      mGlaze: new THREE.MeshStandardMaterial({
        color: 0x5ab828,
        roughness: 0.16,
        metalness: 0.05,
        transparent: true,
        opacity: 0.96,
      }),
      cGlaze: new THREE.MeshStandardMaterial({
        color: 0x6b3010,
        roughness: 0.16,
        metalness: 0.05,
        transparent: true,
        opacity: 0.96,
      }),
      sGlaze: new THREE.MeshStandardMaterial({
        color: 0xe03060,
        roughness: 0.16,
        metalness: 0.05,
        transparent: true,
        opacity: 0.96,
      }),
    };
  }

  // Build the full scene based on user's exact coordinate logic
  const sceneGroup = useMemo(() => {
    if (!materialsRef.current) return new THREE.Group();
    const scene = new THREE.Group();
    const mats = materialsRef.current;

    // Build Glaze
    const buildGlaze = (
      group: THREE.Group,
      mat: THREE.Material,
      plateRelY: number,
    ) => {
      // Cap on top
      const capAngles = [-0.45, -0.25, 0, 0.25, 0.45];
      for (let xi = 0; xi < 9; xi++) {
        const ax = -ROLL_HALF * 0.82 + xi * ((ROLL_HALF * 1.64) / 8);
        capAngles.forEach((a) => {
          const sp = rollSurface(ax, a);
          const r = 0.55 + Math.cos(a) * 0.3 + (Math.random() - 0.5) * 0.12;
          const m = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), mat);
          m.position.set(sp.x, sp.y + r * 0.55, sp.z + r * 0.2);
          m.castShadow = true;
          group.add(m);
        });
      }
      // Drips
      const dripXPositions = [-5.5, -3.0, -0.5, 2.0, 4.5, 6.5];
      dripXPositions.forEach((ax) => {
        const startAngle = 0.3 + Math.random() * 0.15;
        for (let s = 0; s <= 7; s++) {
          const t = s / 7;
          const angle = startAngle + t * (Math.PI * 0.5);
          const sp = rollSurface(ax, angle);
          const r = 0.35 * (1 - t * 0.45) * (0.8 + Math.random() * 0.25);
          const blob = new THREE.Mesh(
            new THREE.SphereGeometry(Math.max(r, 0.1), 9, 7),
            mat,
          );
          blob.position.set(
            sp.x,
            sp.y + Math.cos(angle) * r * 0.7,
            sp.z + Math.sin(angle) * r * 0.7,
          );
          blob.castShadow = true;
          group.add(blob);
        }
        const hangStartY = -ROLL_R,
          hangStartZ = ROLL_R,
          hangEnd = plateRelY + 0.08;
        const vLen = hangStartY - hangEnd;
        if (vLen > 0) {
          const vSteps = Math.ceil(vLen / 0.55) + 1;
          for (let s = 0; s <= vSteps; s++) {
            const t = s / vSteps;
            const r = (0.32 - t * 0.18) * (0.85 + Math.random() * 0.2);
            const blob = new THREE.Mesh(
              new THREE.SphereGeometry(Math.max(r, 0.08), 9, 7),
              mat,
            );
            blob.position.set(
              ax,
              hangStartY - t * vLen,
              hangStartZ + (Math.random() - 0.5) * 0.1,
            );
            blob.castShadow = true;
            group.add(blob);
          }
          const tip = new THREE.Mesh(
            new THREE.SphereGeometry(0.22 + Math.random() * 0.08, 9, 7),
            mat,
          );
          tip.scale.y = 1.5;
          tip.position.set(ax, hangEnd + 0.18, hangStartZ);
          group.add(tip);
        }
        // Small Puddle
        const pool = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), mat);
        pool.scale.set(
          1.0 + Math.random() * 0.8,
          0.12,
          0.8 + Math.random() * 0.6,
        );
        pool.position.set(
          ax + (Math.random() - 0.5) * 0.5,
          plateRelY + 0.03,
          hangStartZ + 0.5,
        );
        pool.receiveShadow = true;
        group.add(pool);
      });
      // Big puddle
      for (let i = 0; i < 5; i++) {
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(2.5 + Math.random() * 1.0, 16, 12),
          mat,
        );
        m.scale.set(1.4 + Math.random() * 0.5, 0.1, 1.0 + Math.random() * 0.4);
        m.position.set(
          -4 + i * 3.5 + (Math.random() - 0.5),
          plateRelY + 0.02,
          ROLL_R + 0.8 + Math.random() * 0.8,
        );
        m.receiveShadow = true;
        group.add(m);
      }
    };

    // Build Open Ends
    const buildOpenEnds = (group: THREE.Group) => {
      [-ROLL_HALF, ROLL_HALF].forEach((ax) => {
        const side = ax < 0 ? -1 : 1;
        const disc = new THREE.Mesh(
          new THREE.CircleGeometry(ROLL_R * 0.96, 32),
          mats.chocDark,
        );
        disc.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;
        disc.position.x = ax + side * 0.05;
        group.add(disc);
        for (let i = 0; i < 6; i++) {
          const r = 0.7 + Math.random() * 1.0;
          const geo = new THREE.SphereGeometry(r, 12, 10);
          const p2 = geo.attributes.position;
          for (let v = 0; v < p2.count; v++) {
            p2.setX(v, p2.getX(v) * (0.5 + Math.random() * 0.5));
            p2.setY(v, p2.getY(v) * (0.8 + Math.random() * 0.3));
            p2.setZ(v, p2.getZ(v) * (0.8 + Math.random() * 0.3));
          }
          p2.needsUpdate = true;
          geo.computeVertexNormals();
          const blob = new THREE.Mesh(geo, mats.chocDark);
          blob.position.set(
            ax + side * 0.5,
            (Math.random() - 0.5) * 2.2,
            (Math.random() - 0.5) * 2.2,
          );
          group.add(blob);
        }
      });
    };

    // Toppings
    const addMatchaToppings = (group: THREE.Group) => {
      for (let i = 0; i < 28; i++) {
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.27 + Math.random() * 0.12, 8, 6),
          mats.nutM,
        );
        m.scale.set(
          1.65 + Math.random() * 0.5,
          0.72,
          0.85 + Math.random() * 0.25,
        );
        const ax = (Math.random() - 0.5) * 14,
          zOff = (Math.random() - 0.5) * 3.0;
        const surfY = Math.sqrt(Math.max(0, ROLL_R * ROLL_R - zOff * zOff));
        m.position.set(ax, surfY + 0.18, zOff);
        m.rotation.set(
          (Math.random() - 0.5) * 0.5,
          Math.random() * Math.PI,
          (Math.random() - 0.5) * 0.4,
        );
        m.castShadow = true;
        group.add(m);
      }
      for (let i = 0; i < 55; i++) {
        const s = new THREE.Mesh(
          new THREE.SphereGeometry(0.09, 5, 4),
          mats.sesameM,
        );
        s.scale.set(1.8, 0.44, 1.0);
        const ax = (Math.random() - 0.5) * 14,
          zOff = (Math.random() - 0.5) * 3.5;
        const surfY = Math.sqrt(Math.max(0, ROLL_R * ROLL_R - zOff * zOff));
        s.position.set(ax, surfY + 0.06, zOff);
        s.rotation.z = Math.random() * Math.PI;
        group.add(s);
      }
    };

    const addChocToppings = (group: THREE.Group) => {
      // Use exact same geometry distribution as Matcha, just different materials
      for (let i = 0; i < 28; i++) {
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.27 + Math.random() * 0.12, 8, 6),
          mats.chocShavM, // Chocolate shavings/chunks
        );
        m.scale.set(
          1.65 + Math.random() * 0.5,
          0.72,
          0.85 + Math.random() * 0.25,
        );
        const ax = (Math.random() - 0.5) * 14,
          zOff = (Math.random() - 0.5) * 3.0;
        const surfY = Math.sqrt(Math.max(0, ROLL_R * ROLL_R - zOff * zOff));
        m.position.set(ax, surfY + 0.18, zOff);
        m.rotation.set(
          (Math.random() - 0.5) * 0.5,
          Math.random() * Math.PI,
          (Math.random() - 0.5) * 0.4,
        );
        m.castShadow = true;
        group.add(m);
      }
      for (let i = 0; i < 55; i++) {
        const s = new THREE.Mesh(
          new THREE.SphereGeometry(0.09, 5, 4),
          mats.nutM, // Nuts instead of sesame
        );
        s.scale.set(1.8, 0.44, 1.0);
        const ax = (Math.random() - 0.5) * 14,
          zOff = (Math.random() - 0.5) * 3.5;
        const surfY = Math.sqrt(Math.max(0, ROLL_R * ROLL_R - zOff * zOff));
        s.position.set(ax, surfY + 0.06, zOff);
        s.rotation.z = Math.random() * Math.PI;
        group.add(s);
      }
    };

    const addStrawToppings = (group: THREE.Group) => {
      const defs = [
        { ax: -5.5, zOff: -0.3, half: false, ry: 0.1 },
        { ax: -2.5, zOff: 0.8, half: true, ry: -0.15 },
        { ax: 0.5, zOff: -0.5, half: true, ry: 0.12 },
        { ax: 3.5, zOff: 0.4, half: false, ry: -0.1 },
        { ax: 6.0, zOff: -0.4, half: true, ry: 0.18 },
      ];
      defs.forEach((d) => {
        const surfY = Math.sqrt(Math.max(0, ROLL_R * ROLL_R - d.zOff * d.zOff));
        const baseY = surfY + 1.1;
        const sGeo = new THREE.SphereGeometry(1.15, 16, 14);
        const sp = sGeo.attributes.position;
        for (let v = 0; v < sp.count; v++) {
          const yn = sp.getY(v) / 1.15;
          const t = (1 - yn * 0.18) * (0.88 + Math.random() * 0.045);
          sp.setX(v, sp.getX(v) * t);
          sp.setZ(v, sp.getZ(v) * t);
        }
        sp.needsUpdate = true;
        sGeo.computeVertexNormals();
        const straw = new THREE.Mesh(sGeo, mats.strawRM);
        straw.scale.set(0.9, 1.12, 0.9);
        straw.position.set(d.ax, baseY, d.zOff);
        straw.rotation.y = d.ry;
        straw.castShadow = true;
        group.add(straw);
        for (let i = 0; i < 10; i++) {
          const ang = Math.random() * Math.PI * 2,
            el = (Math.random() - 0.3) * Math.PI * 0.42;
          const sd = new THREE.Mesh(
            new THREE.SphereGeometry(0.065, 4, 3),
            new THREE.MeshStandardMaterial({ color: 0xf0d040, roughness: 0.9 }),
          );
          sd.position.set(
            d.ax + Math.cos(ang) * Math.cos(el) * 1.04,
            baseY + Math.sin(el) * 1.25,
            d.zOff + Math.sin(ang) * Math.cos(el) * 1.04,
          );
          group.add(sd);
        }
        for (let p = 0; p < 5; p++) {
          const ang = (p / 5) * Math.PI * 2;
          const lGeo = new THREE.SphereGeometry(0.38, 7, 5);
          const lp = lGeo.attributes.position;
          for (let v = 0; v < lp.count; v++) {
            lp.setX(v, lp.getX(v) * 0.35);
            lp.setZ(v, lp.getZ(v) * 0.35);
          }
          lp.needsUpdate = true;
          const lf = new THREE.Mesh(lGeo, mats.leafM);
          lf.position.set(
            d.ax + Math.cos(ang) * 0.45,
            baseY + 1.2,
            d.zOff + Math.sin(ang) * 0.45,
          );
          group.add(lf);
        }
        if (d.half) {
          const face = new THREE.Mesh(
            new THREE.CircleGeometry(1.0, 18),
            new THREE.MeshStandardMaterial({
              color: 0xe84040,
              roughness: 0.46,
              side: THREE.DoubleSide,
            }),
          );
          face.position.set(d.ax + 0.06, baseY, d.zOff);
          face.rotation.y = Math.PI / 2 + 0.06;
          group.add(face);
        }
      });
      for (let i = 0; i < 24; i++) {
        const geo = new THREE.TorusGeometry(
          0.22 + Math.random() * 0.08,
          0.09 + Math.random() * 0.03,
          6,
          10,
        );
        const tp = geo.attributes.position;
        for (let v = 0; v < tp.count; v++) {
          tp.setX(v, tp.getX(v) * (0.88 + Math.random() * 0.22));
          tp.setY(v, tp.getY(v) * (0.88 + Math.random() * 0.22));
        }
        tp.needsUpdate = true;
        geo.computeVertexNormals();
        const m = new THREE.Mesh(
          geo,
          new THREE.MeshStandardMaterial({
            color: 0xc89040 + Math.floor(Math.random() * 6) * 0x040402,
            roughness: 0.8,
          }),
        );
        const ax = (Math.random() - 0.5) * 13,
          zOff = (Math.random() - 0.5) * 3.2;
        const surfY = Math.sqrt(Math.max(0, ROLL_R * ROLL_R - zOff * zOff));
        m.position.set(ax, surfY + 0.12 + Math.random() * 0.22, zOff);
        m.rotation.set(
          Math.random() * 0.5,
          Math.random() * Math.PI,
          Math.random() * 0.5,
        );
        m.castShadow = true;
        group.add(m);
      }
      for (let i = 0; i < 16; i++) {
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.15 + Math.random() * 0.09, 6, 4),
          mats.nutM,
        );
        m.scale.set(1.5 + Math.random() * 0.4, 0.55, 1.0);
        const ax = (Math.random() - 0.5) * 13,
          zOff = (Math.random() - 0.5) * 3.0;
        const surfY = Math.sqrt(Math.max(0, ROLL_R * ROLL_R - zOff * zOff));
        m.position.set(ax, surfY + 0.07, zOff);
        m.rotation.z = Math.random() * Math.PI;
        group.add(m);
      }
    };

    const buildRoll = (glazeMat: any, toppingFn: any) => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(makeRollGeo(), mats.crepeMat);
      body.rotation.z = Math.PI / 2;
      body.castShadow = true;
      body.receiveShadow = true;
      g.add(body);
      buildOpenEnds(g);
      buildGlaze(g, glazeMat, -ROLL_R);
      toppingFn(g);
      return g;
    };

    const GY = PLATE_Y + ROLL_R;

    const r1 = buildRoll(mats.mGlaze, addMatchaToppings);
    r1.position.set(-8.5, GY, -1.5);
    r1.rotation.y = 0.18;
    scene.add(r1);

    const r2 = buildRoll(mats.cGlaze, addChocToppings);
    r2.position.set(0, GY, 0);
    r2.rotation.y = 0.0;
    scene.add(r2);

    const r3 = buildRoll(mats.sGlaze, addStrawToppings);
    r3.position.set(8.5, GY, -1.5);
    r3.rotation.y = -0.18;
    scene.add(r3);

    // Plate
    const platePts = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      platePts.push(
        new THREE.Vector2(19.5 + Math.sin(t * Math.PI) * 1.6, t * 2.4 - 0.3),
      );
    }
    platePts.push(new THREE.Vector2(0, 2.1));
    const plateGeo = new THREE.LatheGeometry(
      [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(19.2, 0),
        new THREE.Vector2(20.2, 0.5),
        new THREE.Vector2(20.5, 1.5),
        new THREE.Vector2(20.0, 2.4),
        new THREE.Vector2(18.8, 2.4),
        new THREE.Vector2(0, 2.1),
      ],
      72,
    );
    const plateMesh = new THREE.Mesh(plateGeo, mats.woodMat);
    plateMesh.castShadow = true;
    plateMesh.receiveShadow = true;
    scene.add(plateMesh);

    const innerP = new THREE.Mesh(
      new THREE.CylinderGeometry(18.5, 18.5, 0.22, 72),
      mats.innerWoodMat,
    );
    innerP.position.y = PLATE_Y - 0.1;
    innerP.receiveShadow = true;
    scene.add(innerP);

    // Crumbs on plate
    const cColors = [0xb07028, 0xd09030, 0x705018, 0xc8a048, 0x2a1008];
    for (let i = 0; i < 70; i++) {
      const ang = Math.random() * Math.PI * 2,
        r = Math.random() * 15 + 1;
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.1 + Math.random() * 0.19, 5, 4),
        new THREE.MeshStandardMaterial({
          color: cColors[Math.floor(Math.random() * 5)],
          roughness: 0.9,
        }),
      );
      m.scale.set(
        1.4 + Math.random() * 0.8,
        0.38 + Math.random() * 0.18,
        1.0 + Math.random() * 0.3,
      );
      m.position.set(Math.cos(ang) * r, PLATE_Y + 0.05, Math.sin(ang) * r);
      m.rotation.set(0, Math.random() * Math.PI, (Math.random() - 0.5) * 0.2);
      m.receiveShadow = true;
      scene.add(m);
    }

    return scene;
  }, []);

  // Animate the camera or group position based on the selected flavor
  // Matcha (left roll) is at x = -8.5
  // Tiramisu (center roll) is at x = 0
  // Strawberry (right roll) is at x = 8.5
  // To center a roll, we shift the entire group in the opposite direction
  useEffect(() => {
    if (groupRef.current) {
      let targetX = 0;
      if (flavor === "matcha")
        targetX = 8.5; // center the left roll
      else if (flavor === "strawberry")
        targetX = -8.5; // center the right roll
      else if (flavor === "tiramisu") targetX = 0; // center the middle roll

      gsap.to(groupRef.current.position, {
        x: targetX,
        duration: 1.2,
        ease: "power3.inOut",
      });
    }
  }, [flavor]);

  // Gentle float & Scroll-based rotation
  useFrame((state) => {
    if (groupRef.current) {
      // Base float
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2 - 2;

      // Scroll-based rotation ("muter log")
      if (typeof window !== "undefined") {
        const scrollY = window.scrollY;
        // Smooth base rotation + fast scroll rotation
        groupRef.current.rotation.y =
          state.clock.elapsedTime * 0.05 + scrollY * 0.002;
        groupRef.current.rotation.z = scrollY * 0.0005; // slight tilt on scroll
      }
    }
  });

  return (
    <>
      <ambientLight intensity={1.1} color={0xfff3dd} />
      <directionalLight
        position={[20, 55, 30]}
        intensity={3.0}
        color={0xfffbf0}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-bias={-0.0004}
      />
      <directionalLight
        position={[-25, 18, 15]}
        intensity={0.6}
        color={0xc8e0ff}
      />
      <directionalLight
        position={[0, 6, -25]}
        intensity={0.35}
        color={0xffddaa}
      />
      {/* We wrap the whole scene in a scaling group to fit the camera view */}
      <group scale={0.2} rotation={[0.4, 0, 0]}>
        <primitive object={sceneGroup} ref={groupRef} />
      </group>
    </>
  );
}
