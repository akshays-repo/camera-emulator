// Cartoon-style animated scene renderer.
// Bold outlines, flat fills, cel-shading — all drawn on a 2D canvas.

export interface SceneInfo {
  id: string;
  label: string;
  hint: string;
}

export const SCENES: SceneInfo[] = [
  { id: 'helicopter', label: 'Helicopter', hint: '4 RPS rotor' },
  { id: 'racing',     label: 'Race Track', hint: 'Fast cars'   },
  { id: 'waterfall',  label: 'Waterfall',  hint: 'Silky water' },
  { id: 'city',       label: 'City Night', hint: 'Light trails' },
  { id: 'fan',        label: 'Ceiling Fan', hint: '3 RPS fan'  },
];

const _bgCache = new Map<string, HTMLCanvasElement>();
function bgKey(id: string, W: number, H: number) { return `${id}:${W}x${H}`; }
function ensureBg(
  id: string, W: number, H: number,
  paint: (ctx: CanvasRenderingContext2D, W: number, H: number) => void,
): HTMLCanvasElement {
  const k = bgKey(id, W, H);
  if (_bgCache.has(k)) return _bgCache.get(k)!;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  paint(c.getContext('2d')!, W, H);
  _bgCache.set(k, c);
  return c;
}
export function invalidateBackground() { _bgCache.clear(); }

// ── Shared helpers ────────────────────────────────────────────────────────────

function outline(ctx: CanvasRenderingContext2D, color = '#1a1a2e', width = 3) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ── Cloud helper ─────────────────────────────────────────────────────────────

function drawCartoonCloud(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, scale: number,
) {
  ctx.save();
  ctx.translate(cx, cy);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.07)';
  ctx.beginPath();
  ctx.ellipse(4, 6, scale * 0.9, scale * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body fill
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0,        0,          scale * 0.55, 0, Math.PI * 2);
  ctx.arc(scale * 0.65, -scale * 0.1, scale * 0.45, 0, Math.PI * 2);
  ctx.arc(-scale * 0.58, scale * 0.05, scale * 0.38, 0, Math.PI * 2);
  ctx.arc(scale * 0.25, -scale * 0.38, scale * 0.38, 0, Math.PI * 2);
  ctx.fill();

  // Outline
  ctx.strokeStyle = '#c8d4e8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0,        0,          scale * 0.55, Math.PI * 0.4, Math.PI * 1.8);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(scale * 0.65, -scale * 0.1, scale * 0.45, Math.PI * 0.6, Math.PI * 1.9);
  ctx.stroke();

  // Shine dot
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath();
  ctx.arc(-scale * 0.18, -scale * 0.22, scale * 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ── Cartoon tree ─────────────────────────────────────────────────────────────

function drawCartoonTree(
  ctx: CanvasRenderingContext2D,
  x: number, baseY: number, r: number,
) {
  // Trunk
  ctx.fillStyle = '#7c5230';
  roundRect(ctx, x - r * 0.18, baseY - r * 0.5, r * 0.36, r * 0.55, r * 0.1);
  ctx.fill(); outline(ctx, '#4a2e10', 2);

  // Shadow sphere
  ctx.fillStyle = '#2d6e26';
  ctx.beginPath(); ctx.arc(x + r * 0.1, baseY - r * 1.1, r * 0.88, 0, Math.PI * 2); ctx.fill();
  // Main foliage
  ctx.fillStyle = '#4caf50';
  ctx.beginPath(); ctx.arc(x, baseY - r * 1.2, r * 0.88, 0, Math.PI * 2); ctx.fill();
  outline(ctx, '#2e7d32', 3);
  // Shine
  ctx.fillStyle = '#81c784';
  ctx.beginPath(); ctx.arc(x - r * 0.28, baseY - r * 1.5, r * 0.3, 0, Math.PI * 2); ctx.fill();
}

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 1 — HELICOPTER
// ═══════════════════════════════════════════════════════════════════════════

function paintHelicopterBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.62);
  sky.addColorStop(0,   '#1565c0');
  sky.addColorStop(0.5, '#42a5f5');
  sky.addColorStop(1,   '#b3e5fc');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H * 0.62);

  // Sun
  ctx.fillStyle = '#ffeb3b';
  ctx.beginPath(); ctx.arc(W * 0.82, H * 0.12, H * 0.052, 0, Math.PI * 2); ctx.fill();
  outline(ctx, '#f9a825', 3);
  // Sun rays
  ctx.strokeStyle = '#ffee58'; ctx.lineWidth = 2.5;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(W * 0.82 + Math.cos(a) * H * 0.068, H * 0.12 + Math.sin(a) * H * 0.068);
    ctx.lineTo(W * 0.82 + Math.cos(a) * H * 0.1,   H * 0.12 + Math.sin(a) * H * 0.1);
    ctx.stroke();
  }

  // Hills
  const hillColors = ['#388e3c', '#43a047', '#66bb6a'];
  const hillData: [number, number, number, number][] = [
    [0, H * 0.62, W, H * 0.22],
    [-W * 0.1, H * 0.55, W * 0.65, H * 0.18],
    [W * 0.45, H * 0.57, W * 0.7, H * 0.15],
  ];
  hillData.forEach(([hx, hy, hw, hh], i) => {
    ctx.fillStyle = hillColors[i];
    ctx.beginPath();
    ctx.ellipse(hx + hw / 2, hy + hh * 0.6, hw / 2, hh * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    if (i === 0) outline(ctx, '#2e7d32', 3);
  });

  // Ground
  const ground = ctx.createLinearGradient(0, H * 0.7, 0, H);
  ground.addColorStop(0, '#4caf50');
  ground.addColorStop(1, '#388e3c');
  ctx.fillStyle = ground;
  ctx.fillRect(0, H * 0.7, W, H * 0.3);

  // Road
  ctx.fillStyle = '#546e7a';
  ctx.fillRect(0, H * 0.76, W, H * 0.1);
  ctx.strokeStyle = '#ffeb3b'; ctx.lineWidth = 3; ctx.setLineDash([W * 0.06, W * 0.04]);
  ctx.beginPath(); ctx.moveTo(0, H * 0.81); ctx.lineTo(W, H * 0.81); ctx.stroke();
  ctx.setLineDash([]);
  // Road outline
  ctx.strokeStyle = '#37474f'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, H * 0.76); ctx.lineTo(W, H * 0.76); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, H * 0.86); ctx.lineTo(W, H * 0.86); ctx.stroke();

  // Trees
  const treeXs = [0.04, 0.12, 0.22, 0.65, 0.75, 0.87, 0.95];
  treeXs.forEach(tx => drawCartoonTree(ctx, W * tx, H * 0.72, H * 0.055));

  // Wind turbine
  ctx.fillStyle = '#eceff1';
  ctx.fillRect(W * 0.17 - 4, H * 0.44, 8, H * 0.28);
  outline(ctx, '#90a4ae', 2);
  ctx.fillStyle = '#90a4ae';
  ctx.beginPath(); ctx.arc(W * 0.17, H * 0.44, 8, 0, Math.PI * 2); ctx.fill();
}

function drawHelicopterScene(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  ctx.drawImage(ensureBg('helicopter', W, H, paintHelicopterBg), 0, 0);

  // Clouds
  drawCartoonCloud(ctx, ((W * 0.15 + t * 18) % (W + 200)) - 100, H * 0.14, 44);
  drawCartoonCloud(ctx, ((W * 0.55 + t * 12) % (W + 200)) - 100, H * 0.09, 36);
  drawCartoonCloud(ctx, ((W * 0.78 + t * 15) % (W + 200)) - 100, H * 0.19, 30);

  // Turbine blades
  const ta = t * 2 * Math.PI * 2;
  ctx.save(); ctx.translate(W * 0.17, H * 0.44);
  for (let i = 0; i < 3; i++) {
    ctx.save(); ctx.rotate(ta + (i * Math.PI * 2) / 3);
    ctx.fillStyle = '#f5f5f5';
    ctx.beginPath(); ctx.ellipse(0, -H * 0.065, 5, H * 0.065, 0, 0, Math.PI * 2); ctx.fill();
    outline(ctx, '#b0bec5', 2);
    ctx.restore();
  }
  ctx.restore();

  // Car on road
  const carX = ((t * 90 + W * 0.2) % (W + 160)) - 160;
  const carY = H * 0.795;
  ctx.save(); ctx.translate(carX, carY);
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath(); ctx.ellipse(0, 18, 44, 8, 0, 0, Math.PI * 2); ctx.fill();
  // Body
  ctx.fillStyle = '#ef5350';
  roundRect(ctx, -44, -16, 88, 22, 5); ctx.fill(); outline(ctx, '#b71c1c', 3);
  // Roof
  ctx.fillStyle = '#e53935';
  roundRect(ctx, -28, -32, 56, 18, 7); ctx.fill(); outline(ctx, '#b71c1c', 3);
  // Windows
  ctx.fillStyle = '#b3e5fc';
  roundRect(ctx, -24, -30, 22, 13, 3); ctx.fill(); outline(ctx, '#0288d1', 2);
  roundRect(ctx, 2, -30, 22, 13, 3); ctx.fill(); outline(ctx, '#0288d1', 2);
  // Wheels
  [-28, 28].forEach(wx => {
    ctx.fillStyle = '#212121';
    ctx.beginPath(); ctx.arc(wx, 7, 12, 0, Math.PI * 2); ctx.fill();
    outline(ctx, '#000', 2);
    ctx.fillStyle = '#9e9e9e';
    ctx.beginPath(); ctx.arc(wx, 7, 5, 0, Math.PI * 2); ctx.fill();
  });
  ctx.restore();

  // Helicopter
  const hcx = W * 0.52, hcy = H * 0.3, sc = W / 800;
  const mainAngle = t * 4 * Math.PI * 2;
  const tailAngle = t * 18 * Math.PI * 2;

  // Ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath(); ctx.ellipse(hcx + 10 * sc, H * 0.61, 80 * sc, 10 * sc, 0, 0, Math.PI * 2); ctx.fill();

  // Tail boom
  ctx.fillStyle = '#607d8b';
  ctx.beginPath();
  ctx.moveTo(hcx - 20 * sc, hcy + 5 * sc);
  ctx.lineTo(hcx - 120 * sc, hcy + 12 * sc);
  ctx.lineTo(hcx - 120 * sc, hcy + 22 * sc);
  ctx.lineTo(hcx - 20 * sc, hcy + 20 * sc);
  ctx.closePath(); ctx.fill(); outline(ctx, '#37474f', 3);

  // Tail fin
  ctx.fillStyle = '#546e7a';
  ctx.beginPath();
  ctx.moveTo(hcx - 118 * sc, hcy + 12 * sc);
  ctx.lineTo(hcx - 132 * sc, hcy - 8 * sc);
  ctx.lineTo(hcx - 108 * sc, hcy + 12 * sc);
  ctx.closePath(); ctx.fill(); outline(ctx, '#37474f', 2);

  // Tail rotor hub
  ctx.fillStyle = '#78909c';
  ctx.beginPath(); ctx.arc(hcx - 120 * sc, hcy + 17 * sc, 9 * sc, 0, Math.PI * 2); ctx.fill();
  outline(ctx, '#37474f', 2);

  // Tail rotor blades
  ctx.save(); ctx.translate(hcx - 120 * sc, hcy + 17 * sc); ctx.rotate(tailAngle);
  ctx.fillStyle = '#1a1a1a';
  for (let i = 0; i < 2; i++) {
    ctx.save(); ctx.rotate(i * Math.PI);
    roundRect(ctx, -18 * sc, -3 * sc, 36 * sc, 6 * sc, 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // Main body
  ctx.fillStyle = '#5c6bc0';
  ctx.beginPath();
  ctx.ellipse(hcx - 4 * sc, hcy, 60 * sc, 28 * sc, 0, 0, Math.PI * 2);
  ctx.fill(); outline(ctx, '#283593', 3);

  // Body shine
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.ellipse(hcx - 14 * sc, hcy - 12 * sc, 30 * sc, 10 * sc, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Cockpit window
  ctx.fillStyle = '#81d4fa';
  ctx.beginPath();
  ctx.ellipse(hcx + 30 * sc, hcy - 5 * sc, 26 * sc, 18 * sc, 0.2, 0, Math.PI * 2);
  ctx.fill(); outline(ctx, '#0277bd', 3);
  // Window glint
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath();
  ctx.ellipse(hcx + 20 * sc, hcy - 12 * sc, 8 * sc, 5 * sc, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Skids
  ctx.strokeStyle = '#546e7a'; ctx.lineWidth = 4 * sc; ctx.lineCap = 'round';
  const skids: [number, number, number, number][] = [
    [hcx - 38 * sc, hcy + 22 * sc, hcx + 30 * sc, hcy + 22 * sc],
    [hcx - 28 * sc, hcy + 32 * sc, hcx + 40 * sc, hcy + 32 * sc],
  ];
  skids.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1 + 10 * sc, y1 - 10 * sc); ctx.lineTo(x1, y2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2 - 10 * sc, y1 - 10 * sc); ctx.lineTo(x2, y2); ctx.stroke();
  });

  // Mast + main rotor hub
  ctx.fillStyle = '#546e7a';
  ctx.fillRect(hcx - 4 * sc, hcy - 56 * sc, 8 * sc, 30 * sc);
  ctx.beginPath(); ctx.arc(hcx, hcy - 56 * sc, 8 * sc, 0, Math.PI * 2); ctx.fill();
  outline(ctx, '#37474f', 2);

  // Main rotor blades
  ctx.save(); ctx.translate(hcx, hcy - 56 * sc); ctx.rotate(mainAngle);
  for (let i = 0; i < 2; i++) {
    ctx.save(); ctx.rotate(i * Math.PI);
    ctx.fillStyle = '#263238';
    roundRect(ctx, -110 * sc, -7 * sc, 220 * sc, 14 * sc, 4);
    ctx.fill(); outline(ctx, '#000', 2);
    ctx.restore();
  }
  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 2 — RACE TRACK
// ═══════════════════════════════════════════════════════════════════════════

function paintRacingBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.3);
  sky.addColorStop(0, '#4fc3f7'); sky.addColorStop(1, '#b3e5fc');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H * 0.3);

  // Grandstands
  ctx.fillStyle = '#eceff1'; ctx.fillRect(0, H * 0.08, W, H * 0.22);
  ctx.fillStyle = '#cfd8dc'; ctx.fillRect(0, H * 0.08, W, H * 0.03);
  // Crowd dots
  const colors = ['#ef5350', '#42a5f5', '#ffca28', '#66bb6a', '#ab47bc'];
  for (let i = 0; i < 120; i++) {
    ctx.fillStyle = colors[i % 5];
    ctx.beginPath();
    ctx.arc(
      (i / 120) * W + (i % 3) * 6,
      H * 0.12 + (i % 6) * 8,
      4, 0, Math.PI * 2,
    );
    ctx.fill();
  }
  // Stands outline
  ctx.strokeStyle = '#90a4ae'; ctx.lineWidth = 2;
  ctx.strokeRect(0, H * 0.08, W, H * 0.22);

  // Grass strips
  ctx.fillStyle = '#66bb6a'; ctx.fillRect(0, H * 0.3, W, H * 0.1);
  ctx.fillStyle = '#81c784'; ctx.fillRect(0, H * 0.32, W, H * 0.03);
  ctx.fillStyle = '#66bb6a'; ctx.fillRect(0, H * 0.63, W, H * 0.12);
  ctx.fillStyle = '#81c784'; ctx.fillRect(0, H * 0.65, W, H * 0.03);

  // Track
  const track = ctx.createLinearGradient(0, H * 0.4, 0, H * 0.63);
  track.addColorStop(0,   '#616161');
  track.addColorStop(0.5, '#424242');
  track.addColorStop(1,   '#616161');
  ctx.fillStyle = track; ctx.fillRect(0, H * 0.4, W, H * 0.23);

  // Track kerbs
  const kerbW = W / 18;
  for (let i = 0; i < 18; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#f44336' : '#ffffff';
    ctx.fillRect(i * kerbW, H * 0.4, kerbW, H * 0.018);
    ctx.fillRect(i * kerbW, H * 0.612, kerbW, H * 0.018);
  }

  // Lane markings
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.setLineDash([W * 0.05, W * 0.04]);
  ctx.beginPath(); ctx.moveTo(0, H * 0.515); ctx.lineTo(W, H * 0.515); ctx.stroke();
  ctx.setLineDash([]);

  // Pit wall
  ctx.fillStyle = '#78909c'; ctx.fillRect(0, H * 0.74, W, H * 0.04);
  ctx.strokeStyle = '#546e7a'; ctx.lineWidth = 2;
  ctx.strokeRect(0, H * 0.74, W, H * 0.04);

  // Tarmac runoff
  ctx.fillStyle = '#757575'; ctx.fillRect(0, H * 0.78, W, H * 0.22);

  // Start/finish banner
  const bx = W * 0.44, bw = W * 0.12, by = H * 0.3, bh = H * 0.4;
  const sqSz = bh / 10;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 3; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? '#000' : '#fff';
      ctx.fillRect(bx + c * sqSz * 0.8, by + r * sqSz, sqSz * 0.8, sqSz);
    }
  }
  ctx.strokeStyle = '#212121'; ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, bw * 0.24, bh);

  // Tire barriers
  for (let i = 0; i < Math.ceil(W / 20); i++) {
    ctx.fillStyle = i % 2 === 0 ? '#d32f2f' : '#ffffff';
    ctx.beginPath();
    ctx.arc(i * 20 + 10, H * 0.645 + 8, 9, 0, Math.PI * 2);
    ctx.fill(); outline(ctx, '#111', 2);
  }
}

const RACE_CARS_DEF = [
  { color: '#f44336', accent: '#b71c1c', trim: '#ffeb3b', speed: 280, phase: 0.0,  lane: 0.44 },
  { color: '#1e88e5', accent: '#0d47a1', trim: '#ffffff', speed: 260, phase: 0.38, lane: 0.57 },
  { color: '#fdd835', accent: '#f57f17', trim: '#e53935', speed: 305, phase: 0.68, lane: 0.455 },
  { color: '#00c853', accent: '#1b5e20', trim: '#ffffff', speed: 242, phase: 0.18, lane: 0.56 },
];

function drawRacingScene(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  ctx.drawImage(ensureBg('racing', W, H, paintRacingBg), 0, 0);
  const sc = W / 900;

  for (const car of RACE_CARS_DEF) {
    const x = ((car.phase * W + t * car.speed * sc * 0.95) % (W + 220)) - 220;
    const y = H * car.lane;
    const persp = 0.85 + (car.lane - 0.44) * 0.28;
    ctx.save(); ctx.translate(x, y); ctx.scale(persp, persp);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(0, 16 * sc, 50 * sc, 7 * sc, 0, 0, Math.PI * 2); ctx.fill();

    // Diffuser
    ctx.fillStyle = '#212121';
    roundRect(ctx, -46 * sc, -4 * sc, 92 * sc, 8 * sc, 2); ctx.fill();

    // Body
    ctx.fillStyle = car.color;
    roundRect(ctx, -46 * sc, -10 * sc, 92 * sc, 20 * sc, 4); ctx.fill();
    outline(ctx, car.accent, 3);

    // Cockpit
    ctx.fillStyle = car.accent;
    roundRect(ctx, -14 * sc, -24 * sc, 30 * sc, 16 * sc, [10 * sc, 10 * sc, 0, 0] as unknown as number);
    ctx.fill(); outline(ctx, '#000', 2);

    // Visor
    ctx.fillStyle = '#b3e5fc';
    roundRect(ctx, -10 * sc, -22 * sc, 20 * sc, 10 * sc, 3); ctx.fill();
    outline(ctx, '#0277bd', 2);

    // Front wing
    ctx.fillStyle = car.trim;
    ctx.beginPath();
    ctx.moveTo(38 * sc, -6 * sc); ctx.lineTo(56 * sc, -5 * sc);
    ctx.lineTo(56 * sc, 5 * sc); ctx.lineTo(38 * sc, 5 * sc);
    ctx.closePath(); ctx.fill(); outline(ctx, car.accent, 2);

    // Rear wing
    ctx.fillStyle = car.trim;
    ctx.fillRect(-56 * sc, -26 * sc, 18 * sc, 5 * sc);
    ctx.fillRect(-50 * sc, -26 * sc, 3 * sc, 18 * sc);
    outline(ctx, car.accent, 2);

    // Wheels
    const wheelPositions = [-30 * sc, 28 * sc];
    wheelPositions.forEach(wx => {
      ctx.fillStyle = '#212121';
      ctx.beginPath(); ctx.arc(wx, 10 * sc, 11 * sc, 0, Math.PI * 2); ctx.fill();
      outline(ctx, '#000', 2);
      // Rim
      ctx.fillStyle = '#e0e0e0';
      ctx.beginPath(); ctx.arc(wx, 10 * sc, 5 * sc, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = car.color;
      for (let s = 0; s < 5; s++) {
        const sa = (s / 5) * Math.PI * 2 + t * 8;
        ctx.fillStyle = '#bdbdbd';
        ctx.beginPath();
        ctx.moveTo(wx, 10 * sc);
        ctx.lineTo(wx + Math.cos(sa) * 9 * sc, 10 * sc + Math.sin(sa) * 9 * sc);
        ctx.lineWidth = 2; ctx.strokeStyle = '#9e9e9e'; ctx.stroke();
      }
    });

    ctx.restore();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 3 — WATERFALL
// ═══════════════════════════════════════════════════════════════════════════

function paintWaterfallBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.35);
  sky.addColorStop(0, '#1a237e'); sky.addColorStop(1, '#42a5f5');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H * 0.35);

  // Distant mountains
  const mtColors = ['#5c6bc0', '#7986cb', '#9fa8da'];
  const mountains = [
    [0, H * 0.35, W * 0.5, H * 0.22],
    [W * 0.3, H * 0.35, W * 0.5, H * 0.28],
    [W * 0.6, H * 0.35, W * 0.55, H * 0.18],
  ];
  mountains.forEach(([mx, my, mw, mh], i) => {
    ctx.fillStyle = mtColors[i];
    ctx.beginPath();
    ctx.moveTo(mx, my + mh);
    ctx.lineTo(mx + mw / 2, my);
    ctx.lineTo(mx + mw, my + mh);
    ctx.closePath(); ctx.fill();
    // Snow cap
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(mx + mw / 2, my);
    ctx.lineTo(mx + mw * 0.4, my + mh * 0.2);
    ctx.lineTo(mx + mw * 0.6, my + mh * 0.2);
    ctx.closePath(); ctx.fill();
  });

  // Left cliff
  ctx.fillStyle = '#6d4c41';
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(W * 0.28, 0);
  ctx.lineTo(W * 0.3, H * 0.82);
  ctx.bezierCurveTo(W * 0.32, H * 0.9, W * 0.22, H * 0.95, 0, H);
  ctx.closePath(); ctx.fill(); outline(ctx, '#4e342e', 4);
  // Cliff texture lines
  ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(W * 0.04 + i * W * 0.03, H * (0.1 + i * 0.1));
    ctx.lineTo(W * 0.12 + i * W * 0.025, H * (0.25 + i * 0.09));
    ctx.stroke();
  }
  // Cliff top greenery
  ctx.fillStyle = '#388e3c';
  ctx.beginPath(); ctx.ellipse(W * 0.14, 0, W * 0.16, H * 0.06, 0, 0, Math.PI * 2); ctx.fill();

  // Right cliff
  ctx.fillStyle = '#795548';
  ctx.beginPath();
  ctx.moveTo(W, 0); ctx.lineTo(W * 0.68, 0);
  ctx.lineTo(W * 0.66, H * 0.78);
  ctx.bezierCurveTo(W * 0.64, H * 0.9, W * 0.76, H * 0.95, W, H);
  ctx.closePath(); ctx.fill(); outline(ctx, '#4e342e', 4);
  // Right cliff greenery
  ctx.fillStyle = '#388e3c';
  ctx.beginPath(); ctx.ellipse(W * 0.84, 0, W * 0.18, H * 0.06, 0, 0, Math.PI * 2); ctx.fill();

  // Waterfall channel (dark bg)
  ctx.fillStyle = '#0d47a1';
  ctx.fillRect(W * 0.3, 0, W * 0.36, H * 0.78);

  // Trees on clifftop
  [0.04, 0.10, 0.18].forEach(tx => drawCartoonTree(ctx, W * tx, H * 0.01, H * 0.055));
  [0.7, 0.78, 0.86, 0.93].forEach(tx => drawCartoonTree(ctx, W * tx, H * 0.01, H * 0.05));

  // Pool
  const pool = ctx.createRadialGradient(W * 0.48, H * 0.88, 0, W * 0.48, H * 0.88, W * 0.22);
  pool.addColorStop(0,   '#4dd0e1');
  pool.addColorStop(0.4, '#0288d1');
  pool.addColorStop(1,   '#01579b');
  ctx.fillStyle = pool;
  ctx.beginPath(); ctx.ellipse(W * 0.48, H * 0.9, W * 0.22, H * 0.11, 0, 0, Math.PI * 2);
  ctx.fill(); outline(ctx, '#0277bd', 3);

  // Pool foam ring
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(W * 0.48, H * 0.9, W * 0.13, H * 0.065, 0, 0, Math.PI * 2); ctx.stroke();

  // Rocks
  const rocks = [[0.26, 0.89, 0.04], [0.66, 0.88, 0.032], [0.37, 0.97, 0.028], [0.58, 0.96, 0.025]];
  rocks.forEach(([rx, ry, rs]) => {
    ctx.fillStyle = '#78909c';
    ctx.beginPath();
    ctx.ellipse(W * rx, H * ry, W * rs * 1.8, H * rs, 0.2, 0, Math.PI * 2);
    ctx.fill(); outline(ctx, '#546e7a', 3);
    // Rock shine
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.ellipse(W * rx - W * rs * 0.4, H * ry - H * rs * 0.3, W * rs * 0.5, H * rs * 0.3, 0.2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawWaterfallScene(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  ctx.drawImage(ensureBg('waterfall', W, H, paintWaterfallBg), 0, 0);

  const wfLeft = W * 0.3, wfW = W * 0.36, wfBottom = H * 0.78;
  const numStreams = 14;

  // Water streams — each is a rounded ribbon
  for (let i = 0; i < numStreams; i++) {
    const sx = wfLeft + (i + 0.5) * (wfW / numStreams);
    const sw = (wfW / numStreams) * 0.6;
    const speed = 380 + Math.sin(i * 1.8) * 100;
    const segH = H * 0.13;
    const offset = (t * speed + (i / numStreams) * wfBottom * 2) % wfBottom;

    // Water color layers
    const alpha = 0.55 + Math.sin(i * 1.3) * 0.2;
    ctx.fillStyle = `rgba(144,202,249,${alpha})`;
    for (let seg = 0; seg < 5; seg++) {
      const sy = (offset + seg * segH * 1.1) % wfBottom;
      if (sy + segH < wfBottom) {
        roundRect(ctx, sx - sw / 2, sy, sw, segH, sw * 0.3);
        ctx.fill();
      }
    }
    // White highlight streak
    ctx.fillStyle = `rgba(255,255,255,${alpha * 0.5})`;
    const hy = (offset + segH * 0.5) % wfBottom;
    roundRect(ctx, sx - sw * 0.15, hy, sw * 0.3, segH * 0.5, sw * 0.15);
    ctx.fill();
  }

  // Waterfall outline/edge
  ctx.strokeStyle = 'rgba(100,181,246,0.8)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(wfLeft, 0); ctx.lineTo(wfLeft, wfBottom); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(wfLeft + wfW, 0); ctx.lineTo(wfLeft + wfW, wfBottom); ctx.stroke();

  // Mist at bottom
  const mistPulse = 0.3 + Math.sin(t * 1.6) * 0.08;
  const mist = ctx.createRadialGradient(W * 0.48, H * 0.78, 0, W * 0.48, H * 0.78, W * 0.26);
  mist.addColorStop(0,   `rgba(255,255,255,${mistPulse + 0.3})`);
  mist.addColorStop(0.4, `rgba(200,235,255,${mistPulse})`);
  mist.addColorStop(1,   'rgba(180,220,255,0)');
  ctx.fillStyle = mist;
  ctx.beginPath(); ctx.ellipse(W * 0.48, H * 0.79, W * 0.26, H * 0.1, 0, 0, Math.PI * 2); ctx.fill();

  // Spray dots
  for (let i = 0; i < 30; i++) {
    const px = W * (0.26 + 0.44 * ((i * 0.137 + t * 0.8) % 1));
    const py = H * (0.72 + 0.1 * ((i * 0.271 + t * 1.2 + i * 0.05) % 1));
    const pa = 0.3 + 0.6 * ((i * 0.317 + t * 2) % 1);
    const pr = 1.5 + ((i * 0.41 + t * 0.5) % 1) * 3;
    ctx.fillStyle = `rgba(255,255,255,${pa})`;
    ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.fill();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 4 — CITY NIGHT
// ═══════════════════════════════════════════════════════════════════════════

function seededRng(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5;
  return x - Math.floor(x);
}

function paintCityBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  // Night sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.58);
  sky.addColorStop(0, '#0a0a1a');
  sky.addColorStop(0.6, '#0d1b3e');
  sky.addColorStop(1, '#1a2a4a');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H * 0.58);

  // Stars
  for (let i = 0; i < 100; i++) {
    const sx = seededRng(i * 2.1) * W;
    const sy = seededRng(i * 3.7) * H * 0.48;
    const sr = seededRng(i * 5.3) * 1.5 + 0.5;
    ctx.fillStyle = `rgba(255,255,255,${0.4 + seededRng(i * 7.1) * 0.6})`;
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
  }

  // Moon
  ctx.fillStyle = '#fff9c4';
  ctx.beginPath(); ctx.arc(W * 0.8, H * 0.1, H * 0.046, 0, Math.PI * 2); ctx.fill();
  outline(ctx, '#f9a825', 2);
  // Moon craters
  ctx.fillStyle = '#fff176';
  ctx.beginPath(); ctx.arc(W * 0.793, H * 0.088, H * 0.012, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(W * 0.812, H * 0.112, H * 0.008, 0, Math.PI * 2); ctx.fill();
  // Moon glow
  const moonGlow = ctx.createRadialGradient(W * 0.8, H * 0.1, 0, W * 0.8, H * 0.1, H * 0.18);
  moonGlow.addColorStop(0, 'rgba(255,253,200,0.2)');
  moonGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = moonGlow; ctx.fillRect(W * 0.58, 0, W * 0.44, H * 0.3);

  // Buildings
  const bldgs = [
    { x: 0,    w: .07, h: .54, c: '#0d1b3e' },
    { x: .05,  w: .05, h: .70, c: '#0a1428' },
    { x: .08,  w: .06, h: .44, c: '#111e3a' },
    { x: .13,  w: .04, h: .60, c: '#0d1b3e' },
    { x: .16,  w: .05, h: .49, c: '#0a1428' },
    { x: .20,  w: .04, h: .65, c: '#111e3a' },
    { x: .23,  w: .07, h: .39, c: '#0d1b3e' },
    { x: .29,  w: .05, h: .72, c: '#0a1428' },
    { x: .33,  w: .04, h: .46, c: '#111e3a' },
    { x: .36,  w: .08, h: .36, c: '#0d1b3e' },
    { x: .43,  w: .05, h: .62, c: '#0a1428' },
    { x: .47,  w: .05, h: .51, c: '#111e3a' },
    { x: .51,  w: .06, h: .42, c: '#0d1b3e' },
    { x: .56,  w: .04, h: .68, c: '#0a1428' },
    { x: .59,  w: .05, h: .41, c: '#111e3a' },
    { x: .63,  w: .04, h: .57, c: '#0d1b3e' },
    { x: .66,  w: .07, h: .45, c: '#0a1428' },
    { x: .72,  w: .05, h: .63, c: '#111e3a' },
    { x: .76,  w: .05, h: .49, c: '#0d1b3e' },
    { x: .80,  w: .04, h: .41, c: '#0a1428' },
    { x: .83,  w: .05, h: .57, c: '#111e3a' },
    { x: .87,  w: .06, h: .44, c: '#0d1b3e' },
    { x: .92,  w: .08, h: .60, c: '#0a1428' },
  ];

  for (const [bi, b] of bldgs.entries()) {
    const bx = b.x * W, bw = b.w * W, bh = b.h * H, by = H * 0.58 - bh;
    ctx.fillStyle = b.c;
    roundRect(ctx, bx, by, bw, bh + 2, 2); ctx.fill();
    outline(ctx, '#162040', 2);

    // Windows
    const cols = Math.max(1, Math.floor(bw / 11));
    const rows = Math.max(1, Math.floor(bh / 15));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (seededRng(bi * 200 + r * 13 + c) > 0.35) {
          const warmCool = seededRng(bi * 50 + r * 7 + c);
          ctx.fillStyle = warmCool > 0.6
            ? `rgba(255,230,140,${0.7 + seededRng(bi + r + c) * 0.3})`
            : `rgba(160,200,255,${0.5 + seededRng(bi + r + c) * 0.4})`;
          roundRect(ctx, bx + 4 + c * 11, by + 5 + r * 15, 6, 9, 1);
          ctx.fill();
        }
      }
    }

    // Antenna / spire on tall buildings
    if (b.h > 0.58) {
      ctx.strokeStyle = '#304060'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx + bw / 2, by);
      ctx.lineTo(bx + bw / 2, by - H * 0.05);
      ctx.stroke();
      // Blinking light
      const blink = Math.sin(Date.now() / 1000 * 3 + bi) > 0;
      if (blink) {
        ctx.fillStyle = '#ff1744';
        ctx.beginPath(); ctx.arc(bx + bw / 2, by - H * 0.05, 3, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  // Street
  const street = ctx.createLinearGradient(0, H * 0.58, 0, H);
  street.addColorStop(0, '#1a1a2e');
  street.addColorStop(1, '#0d0d1a');
  ctx.fillStyle = street; ctx.fillRect(0, H * 0.58, W, H * 0.42);

  // Sidewalks
  ctx.fillStyle = '#222236'; ctx.fillRect(0, H * 0.58, W, H * 0.05);
  ctx.fillStyle = '#222236'; ctx.fillRect(0, H * 0.84, W, H * 0.05);

  // Road lanes
  ctx.strokeStyle = '#ffd600'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, H * 0.72); ctx.lineTo(W, H * 0.72); ctx.stroke();
  ctx.setLineDash([W * 0.06, W * 0.04]);
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, H * 0.65); ctx.lineTo(W, H * 0.65); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, H * 0.79); ctx.lineTo(W, H * 0.79); ctx.stroke();
  ctx.setLineDash([]);

  // Street lamps
  const lampXs = [0.08, 0.26, 0.44, 0.62, 0.8];
  lampXs.forEach(lx => {
    const lpx = W * lx;
    ctx.strokeStyle = '#37474f'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(lpx, H * 0.58); ctx.lineTo(lpx, H * 0.46); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lpx, H * 0.46); ctx.lineTo(lpx + 18, H * 0.452); ctx.stroke();
    const lg = ctx.createRadialGradient(lpx + 18, H * 0.452, 0, lpx + 18, H * 0.452, H * 0.14);
    lg.addColorStop(0,   'rgba(255,240,150,0.45)');
    lg.addColorStop(0.4, 'rgba(255,220,80,0.15)');
    lg.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = lg;
    ctx.fillRect(lpx - H * 0.1, H * 0.38, H * 0.24, H * 0.24);
    ctx.fillStyle = '#fff9c4';
    ctx.beginPath(); ctx.arc(lpx + 18, H * 0.452, 4, 0, Math.PI * 2); ctx.fill();
    outline(ctx, '#f9a825', 1);
  });
}

const CITY_CARS_DEF = [
  { speed: 185, phase: 0.0,  lane: 0.645, dir:  1, color: '#ef5350', accent: '#b71c1c' },
  { speed: 220, phase: 0.5,  lane: 0.665, dir:  1, color: '#ab47bc', accent: '#6a1b9a' },
  { speed: 165, phase: 0.76, lane: 0.775, dir: -1, color: '#26a69a', accent: '#00695c' },
  { speed: 200, phase: 0.25, lane: 0.795, dir: -1, color: '#ffa726', accent: '#e65100' },
];

function drawCityScene(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  ctx.drawImage(ensureBg('city', W, H, paintCityBg), 0, 0);
  const sc = W / 900;

  for (const car of CITY_CARS_DEF) {
    const raw = (car.phase * W + t * car.speed * sc + W * 4) % (W + 140);
    const x = car.dir > 0 ? raw - 140 : W - (raw - 140);
    const y = H * car.lane;
    ctx.save(); ctx.translate(x, y); if (car.dir < 0) ctx.scale(-1, 1);

    // Headlight cone
    const hgl = ctx.createRadialGradient(45 * sc, 0, 0, 45 * sc, 0, 65 * sc);
    hgl.addColorStop(0, 'rgba(255,252,200,0.8)');
    hgl.addColorStop(1, 'rgba(255,252,200,0)');
    ctx.fillStyle = hgl; ctx.fillRect(20 * sc, -48 * sc, 100 * sc, 96 * sc);

    // Tail-light glow
    const tgl = ctx.createRadialGradient(-40 * sc, 0, 0, -40 * sc, 0, 45 * sc);
    tgl.addColorStop(0, 'rgba(255,30,30,0.8)');
    tgl.addColorStop(1, 'rgba(255,30,30,0)');
    ctx.fillStyle = tgl; ctx.fillRect(-95 * sc, -40 * sc, 75 * sc, 80 * sc);

    // Body
    ctx.fillStyle = car.color;
    roundRect(ctx, -40 * sc, -11 * sc, 80 * sc, 22 * sc, 5); ctx.fill();
    outline(ctx, car.accent, 3);

    // Roof
    ctx.fillStyle = car.accent;
    roundRect(ctx, -24 * sc, -24 * sc, 46 * sc, 15 * sc, [7 * sc, 7 * sc, 0, 0] as unknown as number);
    ctx.fill(); outline(ctx, '#000', 2);

    // Windows
    ctx.fillStyle = '#b3e5fc';
    roundRect(ctx, -20 * sc, -22 * sc, 19 * sc, 11 * sc, 2); ctx.fill();
    roundRect(ctx,   2 * sc, -22 * sc, 17 * sc, 11 * sc, 2); ctx.fill();
    outline(ctx, '#0277bd', 1.5);

    // Headlights
    ctx.fillStyle = '#fff9c4';
    ctx.beginPath(); ctx.ellipse(37 * sc, -3 * sc, 5 * sc, 4 * sc, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(37 * sc,  3 * sc, 5 * sc, 3 * sc, 0, 0, Math.PI * 2); ctx.fill();

    // Tail lights
    ctx.fillStyle = '#ff1744';
    ctx.beginPath(); ctx.ellipse(-37 * sc, -3 * sc, 5 * sc, 4 * sc, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-37 * sc,  3 * sc, 5 * sc, 3 * sc, 0, 0, Math.PI * 2); ctx.fill();

    // Wheels
    [-26 * sc, 26 * sc].forEach(wx => {
      ctx.fillStyle = '#212121';
      ctx.beginPath(); ctx.arc(wx, 10 * sc, 10 * sc, 0, Math.PI * 2); ctx.fill();
      outline(ctx, '#000', 2);
      ctx.fillStyle = '#9e9e9e';
      ctx.beginPath(); ctx.arc(wx, 10 * sc, 4 * sc, 0, Math.PI * 2); ctx.fill();
    });

    ctx.restore();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 5 — CEILING FAN
// ═══════════════════════════════════════════════════════════════════════════

const FAN_RPS = 3;

function paintFanBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  // Ceiling
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, W, H * 0.5);
  // Ceiling moulding
  ctx.fillStyle = '#e8e2d8';
  ctx.fillRect(0, H * 0.48, W, H * 0.03);
  outline(ctx, '#c8c0b0', 2);

  // Walls (perspective)
  ctx.fillStyle = '#e8ddd0';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W * 0.1, H * 0.1); ctx.lineTo(W * 0.1, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
  outline(ctx, '#c8b8a8', 2);
  ctx.fillStyle = '#ddd0c0';
  ctx.beginPath(); ctx.moveTo(W, 0); ctx.lineTo(W * 0.9, H * 0.1); ctx.lineTo(W * 0.9, H); ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
  outline(ctx, '#c8b8a8', 2);

  // Back wall — warm beige with wainscoting
  ctx.fillStyle = '#d4c8b8'; ctx.fillRect(W * 0.1, H * 0.5, W * 0.8, H * 0.5);
  ctx.fillStyle = '#c4b8a6'; ctx.fillRect(W * 0.1, H * 0.72, W * 0.8, H * 0.04);
  ctx.fillStyle = '#d8ccc0'; ctx.fillRect(W * 0.1, H * 0.5, W * 0.8, H * 0.22);

  // Wainscoting panels
  ctx.strokeStyle = '#b8a898'; ctx.lineWidth = 2;
  for (let p = 0; p < 4; p++) {
    const px = W * 0.1 + p * W * 0.2 + W * 0.02;
    ctx.strokeRect(px, H * 0.52, W * 0.16, H * 0.18);
  }

  // Floor — hardwood
  const floorGrad = ctx.createLinearGradient(0, H * 0.82, 0, H);
  floorGrad.addColorStop(0, '#c8965a');
  floorGrad.addColorStop(1, '#a87840');
  ctx.fillStyle = floorGrad; ctx.fillRect(0, H * 0.82, W, H * 0.18);
  // Floorboards
  ctx.strokeStyle = 'rgba(100,60,20,0.18)'; ctx.lineWidth = 1;
  for (let row = 0; row < 5; row++) {
    ctx.beginPath();
    ctx.moveTo(0, H * 0.82 + row * H * 0.038);
    ctx.lineTo(W, H * 0.82 + row * H * 0.038);
    ctx.stroke();
  }
  // Baseboard
  ctx.fillStyle = '#e8ddd0'; ctx.fillRect(W * 0.1, H * 0.78, W * 0.8, H * 0.04);
  outline(ctx, '#c8b8a8', 2);

  // Sofa — cartoon sectional
  ctx.fillStyle = '#5c7a9e';
  roundRect(ctx, W * 0.06, H * 0.84, W * 0.58, H * 0.16, 8); ctx.fill(); outline(ctx, '#3a5878', 3);
  // Sofa back
  ctx.fillStyle = '#6a8ab0';
  roundRect(ctx, W * 0.06, H * 0.77, W * 0.58, H * 0.09, 6); ctx.fill(); outline(ctx, '#3a5878', 3);
  // Sofa arms
  ctx.fillStyle = '#4a6a8e';
  roundRect(ctx, W * 0.06, H * 0.77, W * 0.04, H * 0.23, 5); ctx.fill(); outline(ctx, '#3a5878', 3);
  roundRect(ctx, W * 0.6, H * 0.77, W * 0.04, H * 0.23, 5); ctx.fill(); outline(ctx, '#3a5878', 3);
  // Sofa cushions
  ctx.fillStyle = '#7a9cc0';
  roundRect(ctx, W * 0.12, H * 0.85, W * 0.14, H * 0.11, 5); ctx.fill(); outline(ctx, '#3a5878', 2);
  roundRect(ctx, W * 0.28, H * 0.85, W * 0.14, H * 0.11, 5); ctx.fill(); outline(ctx, '#3a5878', 2);
  roundRect(ctx, W * 0.44, H * 0.85, W * 0.12, H * 0.11, 5); ctx.fill(); outline(ctx, '#3a5878', 2);
  // Cushion button dots
  [[0.19, 0.905], [0.35, 0.905], [0.5, 0.905]].forEach(([cx, cy]) => {
    ctx.fillStyle = '#4a6a8e';
    ctx.beginPath(); ctx.arc(W * cx, H * cy, 4, 0, Math.PI * 2); ctx.fill();
  });

  // Coffee table
  ctx.fillStyle = '#8b6340';
  roundRect(ctx, W * 0.18, H * 0.93, W * 0.3, H * 0.06, 4); ctx.fill(); outline(ctx, '#5d3f20', 3);
  // Table legs
  ctx.fillStyle = '#7a5530';
  [[0.2, 0.99], [0.46, 0.99]].forEach(([lx, ly]) => {
    ctx.fillRect(W * lx, H * ly - H * 0.05, 8, H * 0.05);
  });
  // Table items — book + mug
  ctx.fillStyle = '#ef5350';
  roundRect(ctx, W * 0.22, H * 0.918, W * 0.08, H * 0.025, 2); ctx.fill(); outline(ctx, '#b71c1c', 2);
  ctx.fillStyle = '#fff9c4';
  ctx.beginPath(); ctx.arc(W * 0.4, H * 0.925, 10, 0, Math.PI * 2); ctx.fill(); outline(ctx, '#f9a825', 2);

  // Side table + lamp
  ctx.fillStyle = '#7a5530';
  roundRect(ctx, W * 0.74, H * 0.78, W * 0.1, H * 0.04, 3); ctx.fill(); outline(ctx, '#5d3f20', 2);
  // Lamp base
  ctx.fillStyle = '#b8a060';
  ctx.fillRect(W * 0.787, H * 0.72, 10, H * 0.06); outline(ctx, '#8b7840', 2);
  // Lampshade
  ctx.fillStyle = '#f0d070';
  ctx.beginPath();
  ctx.moveTo(W * 0.76, H * 0.72); ctx.lineTo(W * 0.815, H * 0.72);
  ctx.lineTo(W * 0.83, H * 0.62); ctx.lineTo(W * 0.745, H * 0.62);
  ctx.closePath(); ctx.fill(); outline(ctx, '#c8a030', 2);
  // Lamp glow
  const lampGlow = ctx.createRadialGradient(W * 0.787, H * 0.74, 0, W * 0.787, H * 0.74, W * 0.18);
  lampGlow.addColorStop(0,   'rgba(255,230,120,0.4)');
  lampGlow.addColorStop(0.5, 'rgba(255,220,80,0.15)');
  lampGlow.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = lampGlow; ctx.fillRect(W * 0.6, H * 0.55, W * 0.38, H * 0.45);

  // Picture frame on wall
  ctx.fillStyle = '#c8a868';
  roundRect(ctx, W * 0.17, H * 0.53, W * 0.2, H * 0.2, 3); ctx.fill(); outline(ctx, '#8b6830', 3);
  // Picture — landscape painting style
  ctx.fillStyle = '#4a8bbf';
  ctx.fillRect(W * 0.19, H * 0.545, W * 0.16, H * 0.17);
  ctx.fillStyle = '#66bb6a';
  ctx.beginPath(); ctx.ellipse(W * 0.27, H * 0.68, W * 0.06, H * 0.04, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff9c4';
  ctx.beginPath(); ctx.arc(W * 0.31, H * 0.56, 8, 0, Math.PI * 2); ctx.fill();

  // Fan downrod
  ctx.fillStyle = '#bdbdbd';
  ctx.fillRect(W * 0.498, 0, 5, H * 0.13); outline(ctx, '#9e9e9e', 2);
  // Motor housing — cartoon pill shape
  ctx.fillStyle = '#eeeeee';
  ctx.beginPath(); ctx.ellipse(W * 0.5, H * 0.13, W * 0.035, H * 0.03, 0, 0, Math.PI * 2); ctx.fill();
  outline(ctx, '#bdbdbd', 3);
  ctx.fillStyle = '#e0e0e0';
  ctx.beginPath(); ctx.ellipse(W * 0.5, H * 0.13, W * 0.02, H * 0.017, 0, 0, Math.PI * 2); ctx.fill();
  // Light kit
  ctx.fillStyle = '#fffde7';
  ctx.beginPath(); ctx.ellipse(W * 0.5, H * 0.165, W * 0.026, H * 0.024, 0, 0, Math.PI * 2); ctx.fill();
  outline(ctx, '#f9a825', 2);
  const fanLight = ctx.createRadialGradient(W * 0.5, H * 0.17, 0, W * 0.5, H * 0.17, W * 0.45);
  fanLight.addColorStop(0,   'rgba(255,252,220,0.6)');
  fanLight.addColorStop(0.3, 'rgba(255,248,200,0.25)');
  fanLight.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = fanLight; ctx.fillRect(0, 0, W, H * 0.58);
}

function drawFanScene(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  ctx.drawImage(ensureBg('fan', W, H, paintFanBg), 0, 0);

  const cx = W * 0.5, cy = H * 0.13;
  const angle = t * FAN_RPS * Math.PI * 2;
  const bladeL = W * 0.2;
  const bladeW = H * 0.038;

  ctx.save(); ctx.translate(cx, cy);

  // Blade shadows on ceiling
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 4; i++) {
    ctx.save(); ctx.rotate(angle + i * Math.PI / 2);
    ctx.fillStyle = '#000';
    roundRect(ctx, W * 0.06 + 5, -bladeW / 2 + 5, bladeL - 6, bladeW - 4, bladeW * 0.4);
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;

  // Blades
  for (let i = 0; i < 4; i++) {
    ctx.save(); ctx.rotate(angle + i * Math.PI / 2);
    // Arm
    ctx.fillStyle = '#bdbdbd';
    ctx.fillRect(0, -4, W * 0.07, 8); outline(ctx, '#9e9e9e', 2);
    // Blade — cartoon wood style
    const bg = ctx.createLinearGradient(W * 0.06, -bladeW / 2, W * 0.06, bladeW / 2);
    bg.addColorStop(0,   '#d4a060');
    bg.addColorStop(0.4, '#e8c080');
    bg.addColorStop(1,   '#c09050');
    ctx.fillStyle = bg;
    roundRect(ctx, W * 0.065, -bladeW / 2, bladeL, bladeW, [0, bladeW * 0.5, bladeW * 0.5, 0] as unknown as number);
    ctx.fill(); outline(ctx, '#8b6030', 3);
    // Wood grain lines
    ctx.strokeStyle = 'rgba(120,80,30,0.18)'; ctx.lineWidth = 1;
    for (let g = 1; g < 5; g++) {
      const gx = W * 0.065 + g * bladeL * 0.18;
      ctx.beginPath(); ctx.moveTo(gx, -bladeW / 2 + 2); ctx.lineTo(gx, bladeW / 2 - 2); ctx.stroke();
    }
    // Blade shine
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    roundRect(ctx, W * 0.08, -bladeW / 2 + 3, bladeL * 0.6, bladeW * 0.3, 2);
    ctx.fill();
    ctx.restore();
  }

  // Center cap
  ctx.fillStyle = '#e0e0e0';
  ctx.beginPath(); ctx.arc(0, 0, W * 0.018, 0, Math.PI * 2); ctx.fill();
  outline(ctx, '#9e9e9e', 3);
  ctx.fillStyle = '#f5f5f5';
  ctx.beginPath(); ctx.arc(0, 0, W * 0.009, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

// ── Public draw entry point ─────────────────────────────────────────────────

export function drawScene(
  sceneId: string,
  ctx: CanvasRenderingContext2D,
  W: number, H: number, t: number,
): void {
  switch (sceneId) {
    case 'racing':    drawRacingScene(ctx, W, H, t);    return;
    case 'waterfall': drawWaterfallScene(ctx, W, H, t); return;
    case 'city':      drawCityScene(ctx, W, H, t);      return;
    case 'fan':       drawFanScene(ctx, W, H, t);       return;
    default:          drawHelicopterScene(ctx, W, H, t); return;
  }
}
