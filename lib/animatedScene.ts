// Multi-scene animated canvas renderer.
// Each scene demonstrates shutter-speed blur differently.

export interface SceneInfo {
  id: string;
  label: string;
  hint: string;
}

export const SCENES: SceneInfo[] = [
  { id: 'helicopter', label: 'Helicopter', hint: '4 RPS rotor' },
  { id: 'racing',     label: 'Race Track', hint: 'Fast cars' },
  { id: 'waterfall',  label: 'Waterfall',  hint: 'Silky water' },
  { id: 'city',       label: 'City Night', hint: 'Light trails' },
  { id: 'fan',        label: 'Ceiling Fan',hint: '3 RPS fan' },
];

// ── Background cache keyed by "sceneId:WxH" ──────────────────────────────────
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
    default:          drawHelicopterScene(ctx, W, H, t);return;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 1 — HELICOPTER
// ═══════════════════════════════════════════════════════════════════════════════

const MAIN_RPS = 4;
const TAIL_RPS = 20;
const TURB_RPS = 2;
const CAR_PX_S = 80;

function paintHelicopterBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const HOR = H * 0.58;
  const sky = ctx.createLinearGradient(0, 0, 0, HOR);
  sky.addColorStop(0,   '#0d47a1');
  sky.addColorStop(0.6, '#42a5f5');
  sky.addColorStop(1,   '#81d4fa');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, HOR);

  const sg = ctx.createRadialGradient(W*0.84, H*0.1, 0, W*0.84, H*0.1, H*0.2);
  sg.addColorStop(0,    'rgba(255,252,180,0.7)');
  sg.addColorStop(0.35, 'rgba(255,236,100,0.25)');
  sg.addColorStop(1,    'rgba(255,236,100,0)');
  ctx.fillStyle = sg; ctx.fillRect(0, 0, W, HOR);
  ctx.fillStyle = '#fff9c4';
  ctx.beginPath(); ctx.arc(W*0.84, H*0.1, H*0.038, 0, Math.PI*2); ctx.fill();

  ctx.fillStyle = '#2e7d32';
  ctx.beginPath();
  ctx.moveTo(0, HOR);
  ctx.bezierCurveTo(W*0.15, HOR-H*0.12, W*0.35, HOR-H*0.06, W*0.5, HOR-H*0.09);
  ctx.bezierCurveTo(W*0.65, HOR-H*0.12, W*0.82, HOR-H*0.04, W, HOR-H*0.1);
  ctx.lineTo(W, HOR); ctx.closePath(); ctx.fill();

  const grd = ctx.createLinearGradient(0, HOR, 0, H);
  grd.addColorStop(0, '#43a047');
  grd.addColorStop(1, '#2e7d32');
  ctx.fillStyle = grd;
  ctx.fillRect(0, HOR, W, H - HOR);

  ctx.fillStyle = '#546e7a';
  ctx.beginPath();
  ctx.moveTo(0, H*0.78); ctx.lineTo(W, H*0.71);
  ctx.lineTo(W, H*0.79); ctx.lineTo(0, H*0.87);
  ctx.closePath(); ctx.fill();

  ctx.strokeStyle = '#ffeb3b'; ctx.lineWidth = 2; ctx.setLineDash([30, 28]);
  ctx.beginPath(); ctx.moveTo(0, H*0.825); ctx.lineTo(W, H*0.75); ctx.stroke();
  ctx.setLineDash([]);

  for (const tx of [0.04, 0.12, 0.22, 0.33, 0.63, 0.73, 0.87, 0.94])
    drawHelicopterTree(ctx, W*tx, HOR, H*0.055);
}

function drawHelicopterTree(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(x - r*0.12, y - r*0.4, r*0.24, r*0.4);
  ctx.fillStyle = '#1b5e20';
  ctx.beginPath(); ctx.arc(x, y - r, r, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#2e7d32';
  ctx.beginPath(); ctx.arc(x - r*0.2, y - r*1.1, r*0.75, 0, Math.PI*2); ctx.fill();
}

function drawHelicopterCar(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const spd = CAR_PX_S * (W / 1024);
  const x = ((t * spd + W*0.25) % (W + 180)) - 180;
  const y = H * 0.775 + (x / W) * H * 0.06;
  const sc = 0.82 + (x / W) * 0.18;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.fillStyle = '#c62828';
  ctx.beginPath(); (ctx as any).roundRect(-42, -20, 84, 20, 3); ctx.fill();
  ctx.fillStyle = '#b71c1c';
  ctx.beginPath(); (ctx as any).roundRect(-27, -34, 52, 16, 4); ctx.fill();
  ctx.fillStyle = 'rgba(144,202,249,0.8)';
  ctx.beginPath(); (ctx as any).roundRect(-24, -32, 20, 12, 2); ctx.fill();
  ctx.beginPath(); (ctx as any).roundRect( 4,  -32, 20, 12, 2); ctx.fill();
  [-24, 24].forEach(wx => {
    ctx.fillStyle = '#212121';
    ctx.beginPath(); ctx.arc(wx, 0, 10, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#757575';
    ctx.beginPath(); ctx.arc(wx, 0, 4,  0, Math.PI*2); ctx.fill();
  });
  ctx.restore();
}

function drawWindTurbine(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const x = W * 0.17, top = H * 0.48, h = H * 0.11;
  const angle = t * TURB_RPS * Math.PI * 2;
  ctx.fillStyle = '#90a4ae';
  ctx.beginPath();
  ctx.moveTo(x - W*0.006, top + h); ctx.lineTo(x + W*0.006, top + h);
  ctx.lineTo(x + W*0.003, top); ctx.lineTo(x - W*0.003, top);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#cfd8dc';
  ctx.beginPath(); ctx.arc(x, top, W*0.008, 0, Math.PI*2); ctx.fill();
  ctx.save(); ctx.translate(x, top);
  for (let i = 0; i < 3; i++) {
    ctx.rotate(angle + (i * Math.PI * 2) / 3);
    ctx.fillStyle = '#eceff1';
    ctx.beginPath();
    ctx.ellipse(0, -H*0.055, W*0.006, H*0.055, 0, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}

function drawHelicopter(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const cx = W * 0.52, cy = H * 0.3, sc = W / 1024;
  const mainAngle = t * MAIN_RPS * Math.PI * 2;
  const tailAngle = t * TAIL_RPS * Math.PI * 2;

  ctx.fillStyle = 'rgba(0,0,0,0.07)';
  ctx.beginPath();
  ctx.ellipse(cx + 15*sc, H*0.59, 70*sc, 10*sc, 0, 0, Math.PI*2); ctx.fill();

  ctx.fillStyle = '#37474f';
  ctx.fillRect(cx - 3*sc, cy - 55*sc, 6*sc, 20*sc);

  ctx.save(); ctx.translate(cx, cy - 52*sc); ctx.rotate(mainAngle);
  ctx.fillStyle = '#1a1a1a';
  const BL = 105*sc, BW = 8*sc;
  ctx.beginPath(); (ctx as any).roundRect(-BL, -BW/2, BL*2, BW, 3); ctx.fill();
  ctx.rotate(Math.PI/2);
  ctx.beginPath(); (ctx as any).roundRect(-BL*0.92, -BW/2, BL*2*0.92, BW, 3); ctx.fill();
  ctx.restore();

  const fg = ctx.createLinearGradient(cx-55*sc, cy-32*sc, cx+55*sc, cy+22*sc);
  fg.addColorStop(0,   '#607d8b');
  fg.addColorStop(0.4, '#b0bec5');
  fg.addColorStop(1,   '#455a64');
  ctx.fillStyle = fg;
  ctx.beginPath(); ctx.ellipse(cx-4*sc, cy-6*sc, 55*sc, 27*sc, 0, 0, Math.PI*2); ctx.fill();

  ctx.fillStyle = 'rgba(100,181,246,0.65)';
  ctx.strokeStyle = '#546e7a'; ctx.lineWidth = 1.5*sc;
  ctx.beginPath();
  ctx.ellipse(cx+28*sc, cy-10*sc, 23*sc, 16*sc, 0.3, 0, Math.PI*2);
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#546e7a';
  ctx.beginPath();
  ctx.moveTo(cx-28*sc, cy-2*sc); ctx.lineTo(cx-115*sc, cy+14*sc);
  ctx.lineTo(cx-113*sc, cy+20*sc); ctx.lineTo(cx-24*sc, cy+7*sc);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle = '#455a64';
  ctx.beginPath();
  ctx.moveTo(cx-113*sc, cy+17*sc); ctx.lineTo(cx-126*sc, cy-4*sc);
  ctx.lineTo(cx-105*sc, cy+16*sc); ctx.closePath(); ctx.fill();

  ctx.fillStyle = '#37474f';
  ctx.beginPath(); ctx.arc(cx-118*sc, cy+10*sc, 9*sc, 0, Math.PI*2); ctx.fill();

  ctx.save(); ctx.translate(cx-118*sc, cy+10*sc); ctx.rotate(tailAngle);
  ctx.fillStyle = '#111';
  const TR = 18*sc, TW = 3.5*sc;
  ctx.beginPath(); (ctx as any).roundRect(-TR, -TW/2, TR*2, TW, 1); ctx.fill();
  ctx.rotate(Math.PI/2);
  ctx.beginPath(); (ctx as any).roundRect(-TR, -TW/2, TR*2, TW, 1); ctx.fill();
  ctx.restore();

  ctx.strokeStyle = '#37474f'; ctx.lineWidth = 3*sc; ctx.lineCap = 'round';
  const sk: [number,number,number,number][] = [
    [cx-38*sc, cy+20*sc, cx+28*sc, cy+20*sc],
    [cx-28*sc, cy+30*sc, cx+38*sc, cy+30*sc],
  ];
  sk.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1+10*sc, cy+10*sc); ctx.lineTo(x1, y2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2-10*sc, cy+10*sc); ctx.lineTo(x2, y2); ctx.stroke();
  });
}

function drawHelicopterScene(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  ctx.drawImage(ensureBg('helicopter', W, H, paintHelicopterBg), 0, 0);
  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  const c1x = ((W*0.15 + t*9)  % (W+220)) - 110;
  const c2x = ((W*0.52 + t*6)  % (W+170)) - 85;
  const c3x = ((W*0.76 + t*7)  % (W+190)) - 95;
  [[c1x,H*0.16,100],[c2x,H*0.09,72],[c3x,H*0.2,58]].forEach(([cx,cy,r]) => {
    ctx.beginPath();
    ctx.arc(cx as number, cy as number, (r as number)*0.46, 0, Math.PI*2);
    ctx.arc(cx as number+(r as number)*0.4, cy as number-(r as number)*0.1, (r as number)*0.38, 0, Math.PI*2);
    ctx.arc(cx as number+(r as number)*0.7, cy as number, (r as number)*0.3, 0, Math.PI*2);
    ctx.fill();
  });
  drawWindTurbine(ctx, W, H, t);
  drawHelicopterCar(ctx, W, H, t);
  drawHelicopter(ctx, W, H, t);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 2 — RACE TRACK
// ═══════════════════════════════════════════════════════════════════════════════

function paintRacingBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const sky = ctx.createLinearGradient(0, 0, 0, H*0.28);
  sky.addColorStop(0, '#8fafd4'); sky.addColorStop(1, '#c5d8e8');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H*0.28);

  // Grandstands
  ctx.fillStyle = '#c8c8c8'; ctx.fillRect(0, H*0.1, W, H*0.2);
  for (let i = 0; i < 90; i++) {
    const cx2 = (i / 90) * W + (i%3)*3;
    const cy2 = H*0.13 + (i%5)*10;
    ctx.fillStyle = ['#e74c3c','#3498db','#f39c12','#2ecc71','#9b59b6'][i%5];
    ctx.fillRect(cx2, cy2, 5, 8);
  }

  // Grass
  ctx.fillStyle = '#5d8a3c'; ctx.fillRect(0, H*0.3, W, H*0.1);
  ctx.fillStyle = '#4a7a2f'; ctx.fillRect(0, H*0.62, W, H*0.1);

  // Track
  const track = ctx.createLinearGradient(0, H*0.4, 0, H*0.62);
  track.addColorStop(0, '#4a4a4a'); track.addColorStop(0.5, '#3a3a3a'); track.addColorStop(1, '#4a4a4a');
  ctx.fillStyle = track; ctx.fillRect(0, H*0.4, W, H*0.22);

  // Lane line
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.setLineDash([22, 22]);
  ctx.beginPath(); ctx.moveTo(0, H*0.51); ctx.lineTo(W, H*0.51); ctx.stroke();
  ctx.setLineDash([]);

  // Pit lane borders
  ctx.strokeStyle = '#ffee00'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, H*0.4); ctx.lineTo(W, H*0.4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, H*0.62); ctx.lineTo(W, H*0.62); ctx.stroke();

  // Tire barriers
  for (let i = 0; i < Math.ceil(W/22); i++) {
    ctx.fillStyle = i%2 === 0 ? '#cc0000' : '#ffffff';
    ctx.fillRect(i*22, H*0.72, 22, H*0.018);
  }

  ctx.fillStyle = '#404040'; ctx.fillRect(0, H*0.72+H*0.018, W, H);
}

const RACE_CARS = [
  { color: '#e74c3c', accent: '#c0392b', speed: 280, phase: 0.0,  lane: 0.44 },
  { color: '#3498db', accent: '#2980b9', speed: 255, phase: 0.37, lane: 0.58 },
  { color: '#f1c40f', accent: '#d4ac0d', speed: 305, phase: 0.68, lane: 0.45 },
  { color: '#2ecc71', accent: '#27ae60', speed: 240, phase: 0.18, lane: 0.57 },
];

function drawRacingScene(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  ctx.drawImage(ensureBg('racing', W, H, paintRacingBg), 0, 0);
  const sc = W / 1024;
  for (const car of RACE_CARS) {
    const spd = car.speed * sc;
    const x = ((car.phase * W + t * spd) % (W + 200)) - 200;
    const y = H * car.lane;
    const persp = 0.88 + (car.lane - 0.44) * 0.25;
    ctx.save(); ctx.translate(x, y); ctx.scale(persp, persp);
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath(); ctx.ellipse(0, 14*sc, 44*sc, 6*sc, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = car.color;
    ctx.beginPath(); (ctx as any).roundRect(-44*sc, -8*sc, 88*sc, 18*sc, 2); ctx.fill();
    ctx.fillStyle = car.accent;
    ctx.beginPath(); (ctx as any).roundRect(-12*sc, -20*sc, 28*sc, 14*sc, [8*sc, 8*sc, 0, 0]); ctx.fill();
    ctx.fillStyle = 'rgba(20,100,200,0.72)';
    ctx.beginPath(); (ctx as any).roundRect(-8*sc, -18*sc, 18*sc, 9*sc, 3); ctx.fill();
    // front wing
    ctx.fillStyle = car.accent;
    ctx.beginPath();
    ctx.moveTo(37*sc, -4*sc); ctx.lineTo(50*sc, -4*sc); ctx.lineTo(52*sc, 0);
    ctx.lineTo(50*sc, 4*sc); ctx.lineTo(37*sc, 4*sc); ctx.closePath(); ctx.fill();
    // rear wing
    ctx.fillRect(-52*sc, -22*sc, 14*sc, 4*sc);
    ctx.fillRect(-46*sc, -22*sc, 2*sc, 14*sc);
    [-30*sc, 28*sc].forEach(wx => {
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.ellipse(wx, 9*sc, 9*sc, 9*sc, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#555';
      ctx.beginPath(); ctx.ellipse(wx, 9*sc, 4*sc, 4*sc, 0, 0, Math.PI*2); ctx.fill();
    });
    ctx.restore();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 3 — WATERFALL
// ═══════════════════════════════════════════════════════════════════════════════

function drawPineTree(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.fillStyle = '#1e3312';
  ctx.beginPath(); ctx.moveTo(x, y-r*2); ctx.lineTo(x-r*0.55, y-r*0.7); ctx.lineTo(x+r*0.55, y-r*0.7); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2d4a1e';
  ctx.beginPath(); ctx.moveTo(x, y-r*1.4); ctx.lineTo(x-r*0.72, y); ctx.lineTo(x+r*0.72, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1a3010';
  ctx.fillRect(x-r*0.1, y, r*0.2, r*0.4);
}

function paintWaterfallBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const sky = ctx.createLinearGradient(0, 0, 0, H*0.35);
  sky.addColorStop(0, '#1e3c72'); sky.addColorStop(1, '#4a8bbf');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H*0.35);

  // Distant mountain
  ctx.fillStyle = '#4a6045';
  ctx.beginPath(); ctx.moveTo(0, H*0.35);
  ctx.bezierCurveTo(W*0.2, H*0.08, W*0.45, H*0.18, W*0.65, H*0.12);
  ctx.bezierCurveTo(W*0.82, H*0.06, W*0.95, H*0.22, W, H*0.3);
  ctx.lineTo(W, H*0.35); ctx.closePath(); ctx.fill();

  // Left cliff
  ctx.fillStyle = '#5a5148';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W*0.3, 0);
  ctx.lineTo(W*0.3, H*0.85); ctx.lineTo(W*0.36, H); ctx.lineTo(0, H);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#4a4038';
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(W*0.05+i*W*0.03, H*(0.1+i*0.08));
    ctx.lineTo(W*0.1+i*W*0.025, H*(0.2+i*0.07));
    ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.stroke();
  }

  // Right cliff
  ctx.fillStyle = '#504540';
  ctx.beginPath(); ctx.moveTo(W, 0); ctx.lineTo(W*0.62, 0);
  ctx.lineTo(W*0.62, H*0.8); ctx.lineTo(W*0.58, H); ctx.lineTo(W, H);
  ctx.closePath(); ctx.fill();

  // Channel behind waterfall
  ctx.fillStyle = '#1e3a5a';
  ctx.fillRect(W*0.3, 0, W*0.32, H*0.76);

  // Pine trees
  for (const tx of [0.04, 0.1, 0.17, 0.24]) drawPineTree(ctx, W*tx, H*0.015, H*0.065);
  for (const tx of [0.65, 0.72, 0.8, 0.88, 0.95]) drawPineTree(ctx, W*tx, H*0.02, H*0.06);

  // Pool
  const pool = ctx.createRadialGradient(W*0.46, H*0.88, 0, W*0.46, H*0.88, W*0.2);
  pool.addColorStop(0, '#7ac4e8'); pool.addColorStop(0.5, '#3d8ab5'); pool.addColorStop(1, '#1e4f70');
  ctx.fillStyle = pool;
  ctx.beginPath(); ctx.ellipse(W*0.46, H*0.9, W*0.2, H*0.1, 0, 0, Math.PI*2); ctx.fill();

  // Rocks
  ctx.fillStyle = '#6b5b4e';
  [[0.27,0.88,0.04],[0.64,0.87,0.032],[0.36,0.97,0.025],[0.56,0.96,0.022]].forEach(([rx,ry,rs]) => {
    ctx.beginPath(); ctx.ellipse(W*rx, H*ry, W*rs*1.6, H*rs, 0, 0, Math.PI*2); ctx.fill();
  });
}

function drawWaterfallScene(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  ctx.drawImage(ensureBg('waterfall', W, H, paintWaterfallBg), 0, 0);

  const wfLeft = W*0.3, wfW = W*0.32, wfBottom = H*0.77;
  const numStreams = 20;

  for (let i = 0; i < numStreams; i++) {
    const sx = wfLeft + (i / numStreams) * wfW;
    const sw = wfW / numStreams * 0.72;
    const speed = 360 + Math.sin(i * 2.5) * 90;
    const segH = H * 0.075;
    const offset = (t * speed + (i / numStreams) * wfBottom) % wfBottom;
    const alpha = 0.45 + Math.sin(i * 1.9) * 0.18;
    ctx.fillStyle = `rgba(190,225,255,${alpha})`;
    for (let seg = 0; seg < 6; seg++) {
      const sy = (offset + seg * segH) % wfBottom;
      if (sy < wfBottom) ctx.fillRect(sx, sy, sw, Math.min(segH*0.78, wfBottom-sy));
    }
  }

  // Mist
  const mistA = 0.28 + Math.sin(t*1.4)*0.07;
  const mist = ctx.createRadialGradient(W*0.46, H*0.78, 0, W*0.46, H*0.78, W*0.22);
  mist.addColorStop(0, `rgba(255,255,255,${mistA+0.22})`);
  mist.addColorStop(0.5, `rgba(200,230,255,${mistA})`);
  mist.addColorStop(1, 'rgba(180,220,255,0)');
  ctx.fillStyle = mist;
  ctx.beginPath(); ctx.ellipse(W*0.46, H*0.78, W*0.22, H*0.1, 0, 0, Math.PI*2); ctx.fill();

  // Spray particles
  for (let i = 0; i < 35; i++) {
    const px = W*(0.27 + 0.38*((i*0.137 + t*0.7) % 1));
    const py = H*(0.72 + 0.1*((i*0.271 + t*1.1 + i*0.06) % 1));
    const pa = 0.2 + 0.5*((i*0.317 + t*1.8) % 1);
    const pr = 1 + ((i*0.41 + t) % 1)*2;
    ctx.fillStyle = `rgba(255,255,255,${pa})`;
    ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI*2); ctx.fill();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 4 — CITY NIGHT
// ═══════════════════════════════════════════════════════════════════════════════

function seededRng(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5;
  return x - Math.floor(x);
}

function paintCityBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  // Night sky
  ctx.fillStyle = '#05091a'; ctx.fillRect(0, 0, W, H*0.58);

  // Stars
  for (let i = 0; i < 90; i++) {
    const sx = seededRng(i*2.1)*W, sy = seededRng(i*3.7)*H*0.5;
    ctx.fillStyle = `rgba(255,255,255,${0.3+seededRng(i*7.1)*0.6})`;
    ctx.beginPath(); ctx.arc(sx, sy, seededRng(i*5.3)*1.3, 0, Math.PI*2); ctx.fill();
  }

  // Moon
  ctx.fillStyle = '#fffde0';
  ctx.beginPath(); ctx.arc(W*0.8, H*0.1, H*0.042, 0, Math.PI*2); ctx.fill();
  const moonGlow = ctx.createRadialGradient(W*0.8, H*0.1, 0, W*0.8, H*0.1, H*0.14);
  moonGlow.addColorStop(0, 'rgba(255,253,200,0.18)'); moonGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = moonGlow; ctx.fillRect(W*0.6, 0, W*0.4, H*0.28);

  // Buildings
  const bldgs = [
    {x:0,w:.08,h:.56},{x:.06,w:.05,h:.72},{x:.09,w:.07,h:.46},{x:.14,w:.04,h:.62},
    {x:.16,w:.06,h:.51},{x:.21,w:.05,h:.67},{x:.25,w:.08,h:.41},{x:.32,w:.05,h:.74},
    {x:.36,w:.04,h:.48},{x:.39,w:.09,h:.38},{x:.47,w:.06,h:.64},{x:.52,w:.05,h:.53},
    {x:.56,w:.07,h:.44},{x:.62,w:.04,h:.70},{x:.65,w:.06,h:.43},{x:.70,w:.05,h:.59},
    {x:.74,w:.08,h:.47},{x:.81,w:.05,h:.65},{x:.85,w:.06,h:.51},{x:.90,w:.05,h:.43},
    {x:.94,w:.06,h:.59},
  ];
  for (const [bi, b] of bldgs.entries()) {
    const bx=b.x*W, bw=b.w*W, bh=b.h*H, by=H*0.58-bh;
    ctx.fillStyle = '#0a1220'; ctx.fillRect(bx, by, bw, bh+2);
    const cols = Math.max(1, Math.floor(bw/13)), rows = Math.max(1, Math.floor(bh/17));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (seededRng(bi*200+r*13+c) > 0.38) {
          ctx.fillStyle = seededRng(bi*50+r*7+c) > 0.65
            ? 'rgba(255,238,170,0.8)' : 'rgba(170,200,255,0.6)';
          ctx.fillRect(bx+4+c*13, by+5+r*17, 7, 10);
        }
      }
    }
  }

  // Street
  ctx.fillStyle = '#161620'; ctx.fillRect(0, H*0.58, W, H*0.42);
  ctx.fillStyle = '#20202c'; ctx.fillRect(0, H*0.58, W, H*0.05);
  ctx.fillStyle = '#20202c'; ctx.fillRect(0, H*0.84, W, H*0.05);

  // Center line
  ctx.strokeStyle = '#b89000'; ctx.lineWidth = 2; ctx.setLineDash([26,20]);
  ctx.beginPath(); ctx.moveTo(0, H*0.72); ctx.lineTo(W, H*0.72); ctx.stroke();
  ctx.setLineDash([]);

  // Street lamps
  for (const lx of [0.1, 0.3, 0.5, 0.7, 0.9]) {
    const lpx = W*lx;
    ctx.strokeStyle = '#404060'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(lpx, H*0.58); ctx.lineTo(lpx, H*0.47); ctx.lineTo(lpx+15, H*0.465); ctx.stroke();
    const lg = ctx.createRadialGradient(lpx+15, H*0.465, 0, lpx+15, H*0.465, H*0.1);
    lg.addColorStop(0, 'rgba(255,240,150,0.35)'); lg.addColorStop(1, 'rgba(255,240,150,0)');
    ctx.fillStyle = lg; ctx.fillRect(lpx-H*0.08, H*0.41, H*0.2, H*0.2);
    ctx.fillStyle = '#fff9a0';
    ctx.beginPath(); ctx.arc(lpx+15, H*0.465, 3, 0, Math.PI*2); ctx.fill();
  }
}

const CITY_CARS = [
  { speed:185, phase:0.0,  lane:0.66, dir: 1 },
  { speed:220, phase:0.5,  lane:0.68, dir: 1 },
  { speed:160, phase:0.76, lane:0.79, dir:-1 },
  { speed:200, phase:0.25, lane:0.81, dir:-1 },
];
const CITY_PEDS = [
  { speed:22, phase:0.32, lane:0.616, dir: 1 },
  { speed:26, phase:0.71, lane:0.622, dir:-1 },
  { speed:19, phase:0.12, lane:0.862, dir: 1 },
  { speed:24, phase:0.58, lane:0.868, dir:-1 },
];

function drawCityScene(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  ctx.drawImage(ensureBg('city', W, H, paintCityBg), 0, 0);
  const sc = W / 1024;

  // Pedestrians
  for (const p of CITY_PEDS) {
    const raw = (p.phase*W + t*p.speed + W*4) % (W+60);
    const x = p.dir > 0 ? raw - 60 : W - (raw - 60);
    const y = H * p.lane;
    ctx.save(); ctx.translate(x, y); if (p.dir < 0) ctx.scale(-1,1);
    ctx.fillStyle = '#111120';
    ctx.fillRect(-5, -24, 10, 18);
    ctx.beginPath(); ctx.arc(0, -29, 5, 0, Math.PI*2); ctx.fill();
    const la = Math.sin(t*5 + p.phase*10) * 0.45;
    ctx.strokeStyle = '#111120'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0,-8); ctx.lineTo(-5+Math.sin(la)*5, 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,-8); ctx.lineTo( 5-Math.sin(la)*5, 8); ctx.stroke();
    ctx.restore();
  }

  // Cars
  for (const car of CITY_CARS) {
    const raw = (car.phase*W + t*car.speed + W*4) % (W+130);
    const x = car.dir > 0 ? raw - 130 : W - (raw - 130);
    const y = H * car.lane;
    ctx.save(); ctx.translate(x, y); if (car.dir < 0) ctx.scale(-1,1);

    // headlight glow
    const hgl = ctx.createRadialGradient(40*sc,0,0,40*sc,0,50*sc);
    hgl.addColorStop(0,'rgba(255,250,220,0.7)'); hgl.addColorStop(1,'rgba(255,250,220,0)');
    ctx.fillStyle = hgl; ctx.fillRect(20*sc,-40*sc,90*sc,80*sc);

    // taillight glow
    const tgl = ctx.createRadialGradient(-40*sc,0,0,-40*sc,0,35*sc);
    tgl.addColorStop(0,'rgba(255,30,30,0.65)'); tgl.addColorStop(1,'rgba(255,30,30,0)');
    ctx.fillStyle = tgl; ctx.fillRect(-90*sc,-35*sc,70*sc,70*sc);

    ctx.fillStyle = '#1a1a2a';
    ctx.beginPath(); (ctx as any).roundRect(-38*sc,-10*sc,76*sc,20*sc,3); ctx.fill();
    ctx.fillStyle = '#14141e';
    ctx.beginPath(); (ctx as any).roundRect(-24*sc,-22*sc,44*sc,14*sc,[6*sc,6*sc,0,0]); ctx.fill();

    ctx.fillStyle = 'rgba(255,250,220,0.95)';
    ctx.beginPath(); ctx.ellipse(36*sc,-2,4*sc,3*sc,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,50,50,0.95)';
    ctx.beginPath(); ctx.ellipse(-36*sc,-2,4*sc,3*sc,0,0,Math.PI*2); ctx.fill();

    ctx.restore();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 5 — CEILING FAN
// ═══════════════════════════════════════════════════════════════════════════════

const FAN_RPS = 3;

function paintFanBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  // Ceiling
  ctx.fillStyle = '#f0ece4'; ctx.fillRect(0, 0, W, H*0.52);
  // Soft ceiling light
  const cl = ctx.createRadialGradient(W*0.5,H*0.18,0,W*0.5,H*0.18,W*0.45);
  cl.addColorStop(0,'rgba(255,252,230,0.55)'); cl.addColorStop(1,'rgba(255,252,230,0)');
  ctx.fillStyle=cl; ctx.fillRect(0,0,W,H*0.55);

  // Side walls (perspective)
  ctx.fillStyle = '#e0d8cc';
  ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(W*0.09,H*0.1); ctx.lineTo(W*0.09,H); ctx.lineTo(0,H); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#d8d0c4';
  ctx.beginPath(); ctx.moveTo(W,0); ctx.lineTo(W*0.91,H*0.1); ctx.lineTo(W*0.91,H); ctx.lineTo(W,H); ctx.closePath(); ctx.fill();

  // Back wall
  ctx.fillStyle = '#ccc4b4'; ctx.fillRect(W*0.09, H*0.52, W*0.82, H*0.48);

  // Floor
  const floor = ctx.createLinearGradient(0, H*0.84, 0, H);
  floor.addColorStop(0,'#c4a87a'); floor.addColorStop(1,'#b09060');
  ctx.fillStyle=floor; ctx.fillRect(0,H*0.84,W,H*0.16);
  ctx.fillStyle='#f0ece4'; ctx.fillRect(W*0.09,H*0.82,W*0.82,H*0.025);
  ctx.strokeStyle='rgba(120,80,40,0.18)'; ctx.lineWidth=1;
  for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(0,H*0.84+i*H*0.026);ctx.lineTo(W,H*0.84+i*H*0.026);ctx.stroke();}

  // Picture frame
  ctx.fillStyle='#c8b89a'; ctx.fillRect(W*0.19,H*0.57,W*0.18,H*0.18);
  ctx.strokeStyle='#8b7355'; ctx.lineWidth=3; ctx.strokeRect(W*0.19,H*0.57,W*0.18,H*0.18);
  ctx.fillStyle='#b0a090'; ctx.fillRect(W*0.22,H*0.60,W*0.12,H*0.12);

  // Side table + lamp
  ctx.fillStyle='#7a5c18'; ctx.fillRect(W*0.77,H*0.79,W*0.1,H*0.05);
  ctx.fillRect(W*0.785,H*0.84,W*0.014,H*0.01); ctx.fillRect(W*0.848,H*0.84,W*0.014,H*0.01);
  ctx.fillStyle='#b89850'; ctx.fillRect(W*0.815,H*0.74,W*0.013,H*0.05);
  ctx.fillStyle='#f0d080';
  ctx.beginPath(); ctx.moveTo(W*0.795,H*0.74); ctx.lineTo(W*0.842,H*0.74); ctx.lineTo(W*0.855,H*0.65); ctx.lineTo(W*0.78,H*0.65); ctx.closePath(); ctx.fill();
  const lampG = ctx.createRadialGradient(W*0.82,H*0.74,0,W*0.82,H*0.74,W*0.14);
  lampG.addColorStop(0,'rgba(255,228,140,0.35)'); lampG.addColorStop(1,'rgba(255,228,140,0)');
  ctx.fillStyle=lampG; ctx.fillRect(W*0.65,H*0.58,W*0.3,H*0.32);

  // Sofa
  ctx.fillStyle='#6b7a8d'; ctx.fillRect(W*0.1,H*0.88,W*0.52,H*0.12);
  ctx.fillStyle='#7a8a9e'; ctx.fillRect(W*0.1,H*0.83,W*0.52,H*0.06);
  ctx.fillStyle='#556070';
  ctx.fillRect(W*0.1,H*0.83,W*0.032,H*0.17);
  ctx.fillRect(W*0.588,H*0.83,W*0.032,H*0.17);

  // Fan downrod
  ctx.fillStyle='#999'; ctx.fillRect(W*0.498,H*0.005,W*0.004,H*0.12);
  // Motor housing
  ctx.fillStyle='#aaa'; ctx.beginPath(); ctx.ellipse(W*0.5,H*0.13,W*0.03,H*0.026,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#ccc'; ctx.beginPath(); ctx.ellipse(W*0.5,H*0.13,W*0.018,H*0.016,0,0,Math.PI*2); ctx.fill();
  // Light kit
  ctx.fillStyle='#fffadc'; ctx.beginPath(); ctx.ellipse(W*0.5,H*0.17,W*0.024,H*0.022,0,0,Math.PI*2); ctx.fill();
  const fl = ctx.createRadialGradient(W*0.5,H*0.17,0,W*0.5,H*0.17,W*0.4);
  fl.addColorStop(0,'rgba(255,252,220,0.55)'); fl.addColorStop(0.35,'rgba(255,252,220,0.18)'); fl.addColorStop(1,'rgba(255,252,220,0)');
  ctx.fillStyle=fl; ctx.fillRect(0,0,W,H*0.55);
}

function drawFanScene(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  ctx.drawImage(ensureBg('fan', W, H, paintFanBg), 0, 0);

  const cx = W*0.5, cy = H*0.13;
  const angle = t * FAN_RPS * Math.PI * 2;
  const bladeL = W*0.19, bladeW = H*0.036;

  ctx.save(); ctx.translate(cx, cy);

  // Ceiling shadow (subtle)
  ctx.globalAlpha = 0.07;
  for (let i = 0; i < 4; i++) {
    ctx.save(); ctx.rotate(angle + i*Math.PI/2);
    ctx.fillStyle = '#000';
    ctx.beginPath(); (ctx as any).roundRect(W*0.056+4, -bladeW/2+4, bladeL-6, bladeW-6, [0,bladeW/2,bladeW/2,0]); ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;

  // Blades
  for (let i = 0; i < 4; i++) {
    ctx.save(); ctx.rotate(angle + i*Math.PI/2);
    // Arm
    ctx.fillStyle='#aaa'; ctx.fillRect(-W*0.004,-H*0.004,W*0.062,H*0.008);
    // Blade
    const bg = ctx.createLinearGradient(W*0.056,-bladeW/2,W*0.056,bladeW/2);
    bg.addColorStop(0,'#c8a870'); bg.addColorStop(0.5,'#e0c890'); bg.addColorStop(1,'#b8985e');
    ctx.fillStyle=bg;
    ctx.beginPath(); (ctx as any).roundRect(W*0.056,-bladeW/2,bladeL,bladeW,[0,bladeW/2,bladeW/2,0]); ctx.fill();
    ctx.strokeStyle='rgba(120,80,30,0.14)'; ctx.lineWidth=1;
    for(let g=1;g<5;g++){ctx.beginPath();ctx.moveTo(W*0.056+g*bladeL*0.18,-bladeW/2);ctx.lineTo(W*0.056+g*bladeL*0.18,bladeW/2);ctx.stroke();}
    ctx.restore();
  }

  // Center cap
  ctx.fillStyle='#bbb'; ctx.beginPath(); ctx.arc(0,0,W*0.016,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#ddd'; ctx.beginPath(); ctx.arc(0,0,W*0.008,0,Math.PI*2); ctx.fill();

  ctx.restore();
}
