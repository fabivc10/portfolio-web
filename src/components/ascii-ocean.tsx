"use client";

import { useEffect, useRef } from "react";

/**
 * Fondo animado: tiburones, tortugas marinas y pulpos en arte ASCII sobre una grilla.
 * Canvas fijo detrás de todo el contenido. Respeta prefers-reduced-motion
 * (dibuja un solo frame) y lee los colores de variables CSS.
 *
 * Los tiburones acechan el cursor con PSO (Particle Swarm Optimization): cada tiburón
 * es una partícula que busca el mínimo de una función objetivo dinámica (estar en un
 * anillo alrededor del cursor sin amontonarse), guiada por su mejor posición personal
 * y la mejor de sus vecinos. La velocidad del PSO solo da la dirección deseada; el giro
 * y la aceleración siguen limitados para que se mueva como un animal.
 */

const RAMP = " .:;tX%S8@";

type Kind = "shark" | "turtle" | "octopus";

/** Orden de aparición: con pocas criaturas siempre hay tiburones y una tortuga. */
const KINDS: Kind[] = ["shark", "turtle", "shark", "octopus", "shark", "shark", "turtle", "octopus"];

/** Estado PSO de un tiburón */
type Swarm = {
  vx: number; // velocidad de la partícula (px/s)
  vy: number;
  bx: number; // mejor posición personal (pbest)
  by: number;
  bf: number; // su aptitud (menor es mejor)
  r1: number; // coeficientes aleatorios: se renuevan cada ~0.5–1 s (no cada cuadro → sin temblor)
  r2: number;
  reroll: number;
  side: 1 | -1; // sentido en que rodea al cursor
};

type Fish = {
  kind: Kind;
  x: number;
  y: number;
  angle: number;
  /** Velocidad angular suavizada (rad/s): curva el cuerpo al girar */
  omega: number;
  base: number; // velocidad de crucero en px/s
  speed: number;
  len: number; // en celdas
  width: number; // medio ancho máximo en celdas
  phase: number;
  seed: number;
  /** Rumbo de intención (rad): deriva lento y es lo que el pez "quiere" seguir */
  heading: number;
  /** Impulso de aleta (0–1): decae y se renueva cada pocos segundos */
  burst: number;
  nextBurst: number;
  /** Susto (0–1): el pez huye rápido y gira cerrado */
  startle: number;
  /** Acechando el cursor: se dibuja visible también en la columna central del texto */
  hunting: boolean;
  warm: boolean;
  trail: { x: number; y: number; life: number }[];
  pso: Swarm;
  /** Columna del tiburón: cadena "follow-the-leader" de SPINE+1 puntos [x0,y0,x1,y1…] */
  spine: Float32Array;
};

/** Segmentos de la columna del tiburón */
const SPINE = 24;
/** Ángulo máximo entre segmentos (rad): evita que el cuerpo se doble en giros cerrados */
const JOINT_MAX = 0.085;

// Parámetros del PSO
const PSO = { inertia: 1.3, c1: 1.4, c2: 1.7, gain: 1.1, vmax: 140, crowd: 280 };

function hash(a: number, b: number, c: number) {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

export function AsciiOcean() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let W = 0;
    let H = 0;
    let C = 16;
    let cols = 0;
    let rows = 0;
    // Buffers de la grilla (se recrean al cambiar el tamaño): intensidad acumulada,
    // peso (cobertura) y si la celda es de un pez cálido. `touched` evita recorrer toda la grilla.
    let acc = new Float32Array(0);
    let wsum = new Float32Array(0);
    let warmBuf = new Uint8Array(0);
    let touched = new Int32Array(0);
    let nTouched = 0;
    const fishes: Fish[] = [];
    let raf = 0;
    let last = performance.now();
    const pointer = { x: -9999, y: -9999, moved: 0 };
    const scare = { x: 0, y: 0, t: -99 };

    let colors = readColors();

    function readColors() {
      const cs = getComputedStyle(document.documentElement);
      const get = (n: string) => cs.getPropertyValue(n).trim();
      return {
        cool: get("--fish-cool") || "70 82 104",
        warm: get("--fish-warm") || "112 96 72",
        inkDark: get("--fish-ink-dark") || "#2a2d33",
        inkLight: get("--fish-ink-light") || "#f2f3f5",
        dust: get("--fish-dust") || "rgba(80,86,98,0.45)",
        accent: get("--accent") || "#ff5a36",
        alpha: parseFloat(get("--fish-alpha")) || 1,
      };
    }

    function spawn(i: number): Fish {
      const kind = KINDS[i % KINDS.length];
      const angle = Math.random() * Math.PI * 2;
      // len: tiburón = largo del cuerpo; tortuga = largo del caparazón; pulpo = radio del manto (celdas)
      const len =
        kind === "shark" ? 13 + Math.random() * 8 : kind === "turtle" ? 12 + Math.random() * 3 : 3.6 + Math.random();
      const base =
        kind === "shark" ? 34 + Math.random() * 30 : kind === "turtle" ? 20 + Math.random() * 8 : 26 + Math.random() * 10;
      return {
        kind,
        x: W * (0.1 + Math.random() * 0.8),
        y: H * (0.1 + Math.random() * 0.8),
        angle,
        omega: 0,
        base,
        speed: base,
        len,
        width: len * (0.12 + Math.random() * 0.05),
        phase: Math.random() * 10,
        seed: Math.random() * 100,
        heading: angle,
        burst: Math.random(),
        nextBurst: Math.random() * 3,
        startle: 0,
        hunting: false,
        warm: kind !== "shark" || i === 4,
        trail: [],
        spine: new Float32Array((SPINE + 1) * 2),
        pso: {
          vx: 0,
          vy: 0,
          bx: 0,
          by: 0,
          bf: Infinity,
          r1: Math.random(),
          r2: Math.random(),
          reroll: 0,
          side: Math.random() < 0.5 ? 1 : -1,
        },
      };
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      C = W < 640 ? 11 : 15;
      cols = Math.ceil(W / C) + 1;
      rows = Math.ceil(H / C) + 1;
      acc = new Float32Array(cols * rows);
      wsum = new Float32Array(cols * rows);
      warmBuf = new Uint8Array(cols * rows);
      touched = new Int32Array(cols * rows);
      canvas!.width = Math.floor(W * dpr);
      canvas!.height = Math.floor(H * dpr);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      document.documentElement.style.setProperty("--cell", `${C}px`);
      const target = Math.max(3, Math.min(8, Math.round((W * H) / 230000)));
      while (fishes.length < target) {
        const f = spawn(fishes.length);
        resetSpine(f);
        fishes.push(f);
      }
      fishes.length = target;
    }

    /** Columna recta detrás de la cabeza */
    function resetSpine(f: Fish) {
      const seg = (f.len * C) / SPINE;
      for (let i = 0; i <= SPINE; i++) {
        f.spine[i * 2] = f.x - Math.cos(f.angle) * seg * i;
        f.spine[i * 2 + 1] = f.y - Math.sin(f.angle) * seg * i;
      }
    }

    /**
     * Follow-the-leader con restricción de distancia y de ángulo: cada punto sigue al anterior
     * a distancia fija, así el cuerpo recorre exactamente la trayectoria de la cabeza.
     */
    function updateSpine(f: Fish) {
      const sp = f.spine;
      const seg = (f.len * C) / SPINE;
      sp[0] = f.x;
      sp[1] = f.y;
      let prevDir = f.angle + Math.PI; // dirección "hacia atrás" del segmento anterior
      for (let i = 1; i <= SPINE; i++) {
        const dx = sp[i * 2] - sp[i * 2 - 2];
        const dy = sp[i * 2 + 1] - sp[i * 2 - 1];
        let a = Math.atan2(dy, dx);
        const diff = angleDiff(a, prevDir);
        if (diff > JOINT_MAX) a = prevDir + JOINT_MAX;
        else if (diff < -JOINT_MAX) a = prevDir - JOINT_MAX;
        sp[i * 2] = sp[i * 2 - 2] + Math.cos(a) * seg;
        sp[i * 2 + 1] = sp[i * 2 - 1] + Math.sin(a) * seg;
        prevDir = a;
      }
    }

    /** Diferencia angular normalizada a [-π, π] */
    function angleDiff(a: number, b: number) {
      return Math.atan2(Math.sin(a - b), Math.cos(a - b));
    }

    /** Radio de acecho: mayor que el cuerpo, para que la órbita no lo enrolle sobre el cursor */
    function ringOf(f: Fish) {
      return f.len * C * 0.75 + 110 + (f.seed % 1) * 70;
    }

    /** Función objetivo del acecho (menor es mejor): anillo alrededor del cursor + no amontonarse */
    function fitness(self: Fish, qx: number, qy: number) {
      const ring = ringOf(self);
      const dr = (Math.hypot(qx - pointer.x, qy - pointer.y) - ring) / ring;
      let crowd = 0;
      for (const o of fishes) {
        if (o === self || o.kind !== "shark") continue;
        const k = 1 - Math.hypot(qx - o.x, qy - o.y) / PSO.crowd;
        if (k > 0) crowd += k * k;
      }
      return dr * dr + crowd * 1.2;
    }

    /** Un paso del PSO para todos los tiburones (topología en anillo: cada uno ve a sus 2 vecinos) */
    function psoStep(dt: number) {
      const sharks = fishes.filter((f) => f.kind === "shark");
      if (pointer.x < -9000 || sharks.length === 0) {
        for (const f of sharks) f.pso.bf = Infinity; // sin cursor: se olvida la memoria
        return;
      }
      // 1) Entorno dinámico: se reevalúa el pbest con la función actual y se compara con
      //    la posición actual y una sonda un poco más adelante (exploración)
      for (const f of sharks) {
        const p = f.pso;
        if (p.bf !== Infinity) p.bf = fitness(f, p.bx, p.by);
        const probeX = f.x + Math.cos(f.angle) * f.base;
        const probeY = f.y + Math.sin(f.angle) * f.base;
        for (const [qx, qy] of [
          [f.x, f.y],
          [probeX, probeY],
        ]) {
          const fq = fitness(f, qx, qy);
          if (fq < p.bf) {
            p.bf = fq;
            p.bx = qx;
            p.by = qy;
          }
        }
      }
      // 2) Actualización de velocidad: v ← inercia·v + c1·r1·(pbest − x) + c2·r2·(lbest − x)
      const n = sharks.length;
      sharks.forEach((f, i) => {
        const p = f.pso;
        let best = p;
        for (const j of [i - 1, i + 1]) {
          const nb = sharks[(j + n) % n].pso;
          if (nb.bf < best.bf) best = nb;
        }
        p.reroll -= dt;
        if (p.reroll <= 0) {
          p.r1 = Math.random();
          p.r2 = Math.random();
          p.reroll = 0.5 + Math.random() * 0.5;
        }
        // Forma continua en el tiempo (independiente de los fps)
        p.vx += (PSO.c1 * p.r1 * (p.bx - f.x) + PSO.c2 * p.r2 * (best.bx - f.x)) * PSO.gain * dt;
        p.vy += (PSO.c1 * p.r1 * (p.by - f.y) + PSO.c2 * p.r2 * (best.by - f.y)) * PSO.gain * dt;
        const damp = Math.exp(-dt * PSO.inertia);
        p.vx *= damp;
        p.vy *= damp;
        // El lbest de un vecino está en SU anillo: se suma la atracción a mi propio anillo
        const dx = pointer.x - f.x;
        const dy = pointer.y - f.y;
        const d = Math.hypot(dx, dy) || 1;
        const ring = ringOf(f);
        const off = (d - ring) / ring;
        p.vx += (dx / d) * off * 160 * dt;
        p.vy += (dy / d) * off * 160 * dt;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > PSO.vmax) {
          p.vx *= PSO.vmax / sp;
          p.vy *= PSO.vmax / sp;
        }
      });
    }

    function step(f: Fish, dt: number, t: number) {
      // 1) Intención: el rumbo deriva despacio y con suavidad (no depende del ángulo actual,
      //    así el pez mantiene una dirección varios segundos en vez de serpentear al azar)
      f.heading += (Math.sin(t * 0.11 + f.seed) * 0.32 + Math.sin(t * 0.23 + f.seed * 2.1) * 0.18) * dt;
      let ax = Math.cos(f.heading);
      let ay = Math.sin(f.heading);

      // 2) Bordes con anticipación: mira ~2 s adelante y gira antes de llegar
      const look = f.base * 2;
      const px = f.x + Math.cos(f.angle) * look;
      const py = f.y + Math.sin(f.angle) * look;
      const pad = Math.min(W, H) * 0.12;
      let ex = 0;
      let ey = 0;
      if (px < pad) ex += (pad - px) / pad;
      if (px > W - pad) ex -= (px - (W - pad)) / pad;
      if (py < pad) ey += (pad - py) / pad;
      if (py > H - pad) ey -= (py - (H - pad)) / pad;
      if (ex || ey) {
        const k = Math.min(1, Math.hypot(ex, ey));
        ax += ex * 2.2;
        ay += ey * 2.2;
        // La intención se alinea con el giro: al salir del borde no vuelve a meterse
        f.heading += angleDiff(Math.atan2(ay, ax), f.heading) * Math.min(1, dt * 1.5 * k);
      }

      // 3) Cardumen suave: separación solo de cerca y una alineación leve
      for (const o of fishes) {
        if (o === f) continue;
        const ox = f.x - o.x;
        const oy = f.y - o.y;
        const d = Math.hypot(ox, oy) || 1;
        if (d < 120) {
          const k = (1 - d / 120) ** 2;
          ax += (ox / d) * 1.4 * k;
          ay += (oy / d) * 1.4 * k;
        } else if (d < 260) {
          const k = (1 - d / 260) * 0.18;
          ax += Math.cos(o.angle) * k;
          ay += Math.sin(o.angle) * k;
        }
      }

      // 4) Cursor: cada especie reacciona distinto
      const hasPointer = pointer.x > -9000;
      const dx = f.x - pointer.x;
      const dy = f.y - pointer.y;
      const d = Math.hypot(dx, dy) || 1;
      let stalking = false;
      if (hasPointer && f.kind === "shark" && d < Math.max(W, H)) {
        // Acecho guiado por PSO (ver psoStep). Domina sobre el deambular.
        const p = f.pso;
        const pv = Math.hypot(p.vx, p.vy);
        if (pv > 1) {
          ax = ax * 0.25 + (p.vx / pv) * 2.4;
          ay = ay * 0.25 + (p.vy / pv) * 2.4;
        }
        // Cerca del anillo: sesgo tangencial → lo rodea en vez de quedarse quieto
        const ring = ringOf(f);
        const near = 1 - Math.min(1, Math.abs(d - ring) / (ring * 0.6));
        ax += (-dy / d) * p.side * 1.1 * near;
        ay += (dx / d) * p.side * 1.1 * near;
        stalking = true;
      } else if (hasPointer && f.kind === "octopus" && d < 210) {
        // El pulpo se aleja con un chorro
        ax += (dx / d) * 3;
        ay += (dy / d) * 3;
        if (f.burst < 0.3) {
          f.burst = 1;
          f.nextBurst = 1.6;
        }
      } else if (hasPointer && f.kind === "turtle" && d < 130) {
        // La tortuga apenas se aparta
        ax += (dx / d) * 0.8;
        ay += (dy / d) * 0.8;
      }
      // Mientras acecha, la intención sigue al cuerpo: al soltar el cursor no da un giro brusco
      f.hunting = stalking;
      if (stalking) f.heading += angleDiff(f.angle, f.heading) * Math.min(1, dt * 2);

      // 5) Clic reciente: se dispersan alejándose del punto
      if (t - scare.t < 1.2) {
        const sx = f.x - scare.x;
        const sy = f.y - scare.y;
        const sd = Math.hypot(sx, sy) || 1;
        if (sd < 380) {
          const k = 1 - sd / 380;
          ax += (sx / sd) * 5 * k;
          ay += (sy / sd) * 5 * k;
          f.startle = Math.max(f.startle, k);
          f.heading = Math.atan2(sy, sx);
        }
      }

      // Giro proporcional y limitado: suave en crucero, cerrado al asustarse
      const diff = angleDiff(Math.atan2(ay, ax), f.angle);
      const agility = f.kind === "turtle" ? 0.55 : f.kind === "octopus" ? 0.8 : stalking ? 1.25 : 0.9;
      const maxTurn = agility + f.startle * 3.2; // rad/s
      const rate = Math.max(-maxTurn, Math.min(maxTurn, diff * 1.6));
      f.angle += rate * dt;
      f.omega += (rate - f.omega) * Math.min(1, dt * 3);

      f.startle *= Math.exp(-dt * 1.2);
      let target: number;
      if (f.kind === "turtle") {
        // Brazada: avanza en la fase de empuje de las aletas
        f.phase += dt * 2.3;
        target = f.base * (0.7 + 0.45 * Math.max(0, -Math.cos(f.phase)) + f.startle * 1.5);
      } else if (f.kind === "octopus") {
        // Propulsión a chorro: impulso fuerte → planeo largo
        f.nextBurst -= dt;
        if (f.nextBurst <= 0) {
          f.burst = 1;
          f.nextBurst = 2 + Math.random() * 1.2;
        }
        f.burst *= Math.exp(-dt * 1.6);
        f.phase += dt * 2;
        target = f.base * (0.25 + f.burst * 2.2 + f.startle * 1.5);
      } else {
        // Tiburón: crucero continuo (sin impulsos/planeos de pez de arrecife). Varía la velocidad
        // de forma suave y acelera si el cursor se aleja de su anillo de acecho.
        const chase = stalking ? Math.min(1, Math.max(0, (d - ringOf(f) * 1.3) / 350)) : 0;
        const cruise = 0.75 + 0.12 * Math.sin(t * 0.21 + f.seed);
        target = f.base * ((stalking ? 0.65 : cruise) + chase * 2.6 + f.startle * 2.2);
      }
      f.speed += (target - f.speed) * Math.min(1, dt * (f.kind === "shark" ? 1.2 : 2));
      if (f.kind === "shark") {
        // La velocidad cambia la FRECUENCIA del coletazo, no la amplitud. La fase se acumula,
        // así un cambio de frecuencia no "rebobina" la onda. ~0.8 Hz en crucero.
        const hz = 0.35 + 0.6 * (f.speed / f.base);
        f.phase += dt * Math.PI * 2 * hz;
      }

      f.x += Math.cos(f.angle) * f.speed * dt;
      f.y += Math.sin(f.angle) * f.speed * dt;
      if (f.kind === "shark") updateSpine(f);

      // Red de seguridad (p. ej. tras achicar la ventana)
      const m = f.len * C * 2;
      if (f.x < -m || f.x > W + m || f.y < -m || f.y > H + m) {
        f.x = W / 2 + (Math.random() - 0.5) * W * 0.6;
        f.y = H / 2 + (Math.random() - 0.5) * H * 0.6;
        f.trail = [];
        resetSpine(f);
      }

      // Estela de puntos
      const tail = f.trail[f.trail.length - 1];
      if (!tail || Math.hypot(tail.x - f.x, tail.y - f.y) > C * 1.4) {
        f.trail.push({ x: f.x, y: f.y, life: 1 });
        if (f.trail.length > 14) f.trail.shift();
      }
      for (const p of f.trail) p.life -= dt * 0.35;
      f.trail = f.trail.filter((p) => p.life > 0);
    }

    // Reparte un punto de muestra entre las 4 celdas vecinas (bilineal): al moverse, la
    // intensidad pasa gradualmente de una celda a otra en vez de saltar de golpe.
    function splat(px: number, py: number, v: number, flags: number) {
      const fx = px / C - 0.5;
      const fy = py / C - 0.5;
      const x0 = Math.floor(fx);
      const y0 = Math.floor(fy);
      const tx = fx - x0;
      const ty = fy - y0;
      for (let j = 0; j < 2; j++) {
        const cy = y0 + j;
        if (cy < 0 || cy >= rows) continue;
        const wy = j ? ty : 1 - ty;
        for (let i = 0; i < 2; i++) {
          const cx = x0 + i;
          if (cx < 0 || cx >= cols) continue;
          const w = (i ? tx : 1 - tx) * wy;
          if (w <= 0) continue;
          const k = cy * cols + cx;
          if (wsum[k] === 0) touched[nTouched++] = k;
          acc[k] += v * w;
          wsum[k] += w;
          warmBuf[k] |= flags;
        }
      }
    }

    /** Bits por celda: 1 = color cálido, 2 = tiburón acechando */
    const flagsOf = (f: Fish) => (f.warm ? 1 : 0) | (f.hunting ? 2 : 0);

    /**
     * Atenuación en la columna central (escritorio), donde va el texto: 1 en los bordes,
     * 0.3 en el centro. Los tiburones que acechan casi no se atenúan.
     */
    function dimAt(x: number, hunting: boolean) {
      if (W < 768) return 1; // en móvil la atenuación es global (CSS)
      const u = x / W;
      const k = u < 0.24 ? 1 - (u / 0.24) * 0.7 : u > 0.76 ? 0.3 + ((u - 0.76) / 0.24) * 0.7 : 0.3;
      return hunting ? Math.max(k, 0.85) : k;
    }

    function rasterize(f: Fish) {
      if (f.kind === "turtle") rasterTurtle(f);
      else if (f.kind === "octopus") rasterOctopus(f);
      else rasterShark(f);
      // Estela: nube suave de puntos
      for (const p of f.trail) splat(p.x, p.y, 0.5 * p.life, flagsOf(f));
    }

    /** Recorre un disco/elipse en coordenadas locales (u: hacia adelante, w: lateral; en celdas) */
    function local(f: Fish) {
      const dirX = Math.cos(f.angle);
      const dirY = Math.sin(f.angle);
      return (u: number, w: number, v: number) =>
        splat(f.x + (dirX * u - dirY * w) * C, f.y + (dirY * u + dirX * w) * C, v, flagsOf(f));
    }

    function rasterTurtle(f: Fish) {
      const put = local(f);
      const a = f.len * 0.5; // semieje del caparazón (adelante)
      const b = f.len * 0.4; // semieje lateral
      // Caparazón con placas (patrón de escudos)
      for (let u = -a; u <= a; u += 0.5) {
        for (let w = -b; w <= b; w += 0.5) {
          const q = (u / a) ** 2 + (w / b) ** 2;
          if (q > 1) continue;
          const plates = Math.cos(u * 1.5) * Math.cos(w * 1.5);
          put(u, w, q > 0.78 ? 0.42 : 0.5 + 0.3 * (1 - q) + 0.14 * plates);
        }
      }
      // Cabeza (se balancea un poco con la brazada)
      const rH = f.len * 0.13;
      const hu = a + rH * 0.9 + Math.sin(f.phase) * 0.15;
      for (let u = -rH; u <= rH; u += 0.5)
        for (let w = -rH; w <= rH; w += 0.5) if (u * u + w * w <= rH * rH) put(hu + u, w, 0.62);
      // Aletas: delanteras largas que reman, traseras cortas
      // Aletas en forma de remo: más anchas al medio y curvadas hacia atrás
      const flipper = (rootU: number, rootW: number, ang: number, len: number, width: number, side: number) => {
        for (let s = 0; s <= 1; s += 0.4 / len) {
          const cu = rootU + Math.cos(ang) * s * len - s * s * len * 0.35;
          const cw = rootW + Math.sin(ang) * side * s * len;
          const hw = width * (0.35 + Math.sin(s * Math.PI) * 0.65) * (1 - s * 0.4);
          for (let o = -hw; o <= hw; o += 0.5) put(cu + o, cw, 0.62 - s * 0.18);
        }
      };
      for (const side of [-1, 1]) {
        // Brazada: la aleta delantera barre de adelante-afuera a atrás
        const stroke = Math.PI / 2 + 0.1 + Math.sin(f.phase) * 0.55;
        flipper(a * 0.3, side * b * 0.8, stroke, f.len * 0.5, 1.4, side);
        flipper(-a * 0.7, side * b * 0.6, Math.PI - 0.8 + Math.sin(f.phase + 1.2) * 0.2, f.len * 0.25, 0.9, side);
      }
      put(-a - 0.5, 0, 0.4); // cola
    }

    function rasterOctopus(f: Fish) {
      const put = local(f);
      const R = f.len;
      const a = R * 1.25;
      // Manto: se estira al impulsarse
      const stretch = 1 + f.burst * 0.18;
      for (let u = -a; u <= a * stretch; u += 0.5) {
        for (let w = -R; w <= R; w += 0.5) {
          const q = (u / (a * (u > 0 ? stretch : 1))) ** 2 + (w / (R / Math.sqrt(stretch))) ** 2;
          if (q > 1) continue;
          const spots = Math.cos(u * 2.1 + 1) * Math.cos(w * 2.3);
          put(u, w, 0.55 + 0.3 * (1 - q) + 0.1 * spots);
        }
      }
      // Ojos
      for (const side of [-1, 1]) put(-a * 0.35, side * R * 0.75, 0.95);
      // Tentáculos: se cierran al impulsarse y se abren al planear
      const kappa = f.omega / Math.max(f.speed, 1);
      const open = 0.15 + 0.85 * (1 - Math.min(1, f.burst * 1.4));
      // Vista cenital: 6 brazos visibles (los otros 2 quedan debajo del manto)
      for (let i = 0; i < 6; i++) {
        const rootW = (i / 5 - 0.5) * 2 * R * 0.9;
        const T = R * 3.8 * (0.85 + 0.15 * Math.sin(i * 1.7 + f.seed));
        for (let s = 0; s <= 1; s += 0.5 / T) {
          const cu = -a * 0.55 - s * T;
          const wave = Math.sin(f.phase * 1.8 - s * 5 + i * 0.9) * s * R * 0.35;
          const bend = Math.max(-0.3, Math.min(0.3, (kappa * (s * T * C) ** 2) / (2 * T * C))) * T;
          const cw = rootW * (1 + s * open * 4) + wave + bend;
          const hw = 0.55 * (1 - s) + 0.3;
          for (let o = -hw; o <= hw; o += 0.5) put(cu, cw + o, 0.75 - s * 0.4);
        }
      }
    }

    /** Perfil (medio ancho, en fracción del largo) del tiburón visto desde arriba */
    function sharkWidth(s: number) {
      if (s < 0.14) return 0.1 * Math.sqrt(s / 0.14); // hocico puntiagudo
      if (s < 0.38) return 0.1 + 0.012 * Math.sin(((s - 0.14) / 0.24) * Math.PI); // cabeza y tronco
      if (s < 0.86) return 0.1 * (1 - ((s - 0.38) / 0.48) ** 1.4 * 0.84); // se afina al pedúnculo
      return 0.015;
    }

    /**
     * Tiburón (vista cenital). Técnica de motores de juego (vertex animation de peces):
     * onda que viaja de la cabeza a la cola, enmascarada con smoothstep para que solo se
     * mueva el tercio trasero (nado thunniforme), más un leve contragiro de la cabeza.
     * El cuerpo se apoya en la columna follow-the-leader.
     */
    function rasterShark(f: Fish) {
      const sp = f.spine;
      const L = f.len * C;
      const put = (px: number, py: number, v: number) => splat(px, py, v, flagsOf(f));
      const steps = Math.ceil(f.len * 2.2);
      const smooth = (e0: number, e1: number, x: number) => {
        const k = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
        return k * k * (3 - 2 * k);
      };
      // Punto y tangente de la columna en s ∈ [0,1]
      const at = (s: number) => {
        const fi = Math.min(SPINE - 1e-4, s * SPINE);
        const i = Math.floor(fi);
        const t = fi - i;
        const x0 = sp[i * 2];
        const y0 = sp[i * 2 + 1];
        const x1 = sp[i * 2 + 2];
        const y1 = sp[i * 2 + 3];
        const tx = x0 - x1;
        const ty = y0 - y1;
        const tl = Math.hypot(tx, ty) || 1;
        return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, tx: tx / tl, ty: ty / tl };
      };
      // Onda lateral: amplitud ~0 en la cabeza, máxima en la cola (≈9% del largo)
      const lateral = (s: number) => {
        const mask = smooth(0.35, 1, s);
        const wave = Math.sin(f.phase - s * Math.PI * 1.7) * mask * 0.09;
        const headYaw = Math.sin(f.phase + Math.PI) * 0.012 * (1 - s); // contragiro de la cabeza
        return (wave + headYaw) * L;
      };

      for (let i = 0; i <= steps; i++) {
        const s = i / steps;
        const p = at(s);
        const nx = -p.ty;
        const ny = p.tx;
        const off = lateral(s);
        const cx = p.x + nx * off;
        const cy = p.y + ny * off;
        // Medio ancho en celdas; mínimo ~1 celda en el tronco para que no se vea entrecortado
        const hw = Math.max((sharkWidth(s) * 1.3 * L) / C, s > 0.06 && s < 0.82 ? 1.1 : 0);

        for (let o = -hw; o <= hw; o += 0.5) {
          const edge = hw > 0 ? Math.abs(o) / hw : 1;
          // Aleta dorsal vista desde arriba: cresta más clara en el centro del tronco
          const dorsal = s > 0.3 && s < 0.46 && edge < 0.3 ? 0.2 : 0;
          const v = (1 - edge * 0.6 + dorsal) * (1 - s * 0.25);
          put(cx + nx * o * C, cy + ny * o * C, v);
        }

        // Pectorales: rígidas, triangulares y barridas hacia atrás (no aletean)
        if (s > 0.25 && s < 0.36) {
          const k = (s - 0.25) / 0.11; // 0 en el borde de ataque, 1 en el de salida
          const span = (0.17 * (1 - k * 0.6) * L) / C;
          for (const side of [-1, 1]) {
            for (let o = hw; o < hw + span; o += 0.5) {
              const back = (o - hw) * 1.1; // barrido hacia atrás
              put(cx + nx * o * side * C - p.tx * back * C, cy + ny * o * side * C - p.ty * back * C, 0.45);
            }
          }
        }

        // Aleta caudal: medialuna que sale del pedúnculo, sigue la onda de la cola
        if (s > 0.88) {
          const k = (s - 0.88) / 0.12;
          const spread = (0.13 * Math.sin(k * Math.PI * 0.9) * L) / C;
          for (const side of [-1, 1]) {
            for (let o = 0; o <= spread; o += 0.5) {
              const sweep = o * 0.55; // puntas hacia atrás
              put(cx + nx * o * side * C - p.tx * sweep * C, cy + ny * o * side * C - p.ty * sweep * C, 0.5 - k * 0.15);
            }
          }
        }
      }
    }

    /** Cobertura que corresponde a una celda totalmente dentro del cuerpo (~4 muestras/celda) */
    const FULL = 2.2;

    function draw(t: number) {
      ctx!.clearRect(0, 0, W, H);
      nTouched = 0;
      for (const f of fishes) rasterize(f);

      ctx!.font = `500 ${Math.round(C * 0.78)}px ui-monospace, "Geist Mono", monospace`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      // Destellos naranjas: cambian cada ~2 s, no cada cuadro
      const sparkle = Math.floor(t * 0.5);

      for (let n = 0; n < nTouched; n++) {
        const k = touched[n];
        const cover = Math.min(1, wsum[k] / FULL);
        const base = acc[k] / wsum[k];
        const warm = (warmBuf[k] & 1) === 1;
        const hunting = (warmBuf[k] & 2) === 2;
        acc[k] = 0;
        wsum[k] = 0;
        warmBuf[k] = 0;

        // Intensidad continua: el borde se desvanece en vez de encenderse/apagarse
        const v = base * cover;
        if (v < 0.05) continue;
        const cx = k % cols;
        const cy = (k - cx) / cols;
        const x = cx * C;
        const y = cy * C;
        const rs = hash(cx, cy, 7); // ruido fijo por celda: textura sin parpadeo
        const dim = dimAt(x + C / 2, hunting);

        if (v < 0.3) {
          // Bordes y estela: puntitos que aparecen gradualmente
          ctx!.globalAlpha = Math.min(1, (v - 0.05) / 0.2) * dim;
          ctx!.fillStyle = colors.dust;
          ctx!.fillText(v < 0.17 ? "." : ":", x + C / 2, y + C / 2);
          ctx!.globalAlpha = 1;
          continue;
        }

        const fade = Math.min(1, (v - 0.3) / 0.12);
        const rgb = warm ? colors.warm : colors.cool;
        ctx!.fillStyle = `rgb(${rgb} / ${((0.18 + v * 0.72) * colors.alpha * fade * dim).toFixed(3)})`;
        ctx!.fillRect(x + 1, y + 1, C - 2, C - 2);

        const g = Math.min(1, v + (rs - 0.5) * 0.08);
        const ch = RAMP[Math.min(RAMP.length - 1, Math.max(1, Math.floor(g * RAMP.length)))];
        if (v > 0.5 && hash(cx, cy, sparkle) < 0.008) ctx!.fillStyle = colors.accent;
        else ctx!.fillStyle = v > 0.6 ? colors.inkLight : colors.inkDark;
        ctx!.globalAlpha = fade * dim;
        ctx!.fillText(ch, x + C / 2, y + C / 2 + 0.5);
        ctx!.globalAlpha = 1;
      }
    }

    function loop(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      psoStep(dt);
      for (const f of fishes) step(f, dt, t);
      draw(t);
      raf = requestAnimationFrame(loop);
    }

    function start() {
      cancelAnimationFrame(raf);
      if (reduce.matches) {
        draw(0);
      } else {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    }

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.moved = performance.now() / 1000;
    };
    // Un clic/toque asusta a los peces cercanos y se dispersan
    const onDown = (e: PointerEvent) => {
      scare.x = e.clientX;
      scare.y = e.clientY;
      scare.t = performance.now() / 1000;
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") pointer.x = pointer.y = -9999;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) onLeave(); // el mouse salió de la ventana
    };
    const onResize = () => {
      resize();
      if (reduce.matches) draw(0);
    };
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => {
      colors = readColors();
      if (reduce.matches) draw(0);
    };

    resize();
    start();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("mouseout", onOut);
    reduce.addEventListener("change", start);
    scheme.addEventListener("change", onScheme);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("mouseout", onOut);
      reduce.removeEventListener("change", start);
      scheme.removeEventListener("change", onScheme);
    };
  }, []);

  return (
    <div aria-hidden className="ocean pointer-events-none fixed inset-0 -z-10">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="ocean-haze absolute inset-0" />
    </div>
  );
}
