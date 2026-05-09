export type Block =
  | { type: 'p';       text: string }
  | { type: 'h2';      text: string }
  | { type: 'h3';      text: string }
  | { type: 'code';    lang: string; text: string }
  | { type: 'table';   headers: string[]; rows: string[][] }
  | { type: 'ul';      items: string[] }
  | { type: 'callout'; text: string };

export interface Post {
  slug:        string;
  title:       string;
  description: string;
  category:    'Photography' | 'Developer';
  readTime:    number;
  date:        string;
  blocks:      Block[];
}

export const POSTS: Post[] = [
  // ─── 1 ───────────────────────────────────────────────────────────────────
  {
    slug:        'exposure-triangle-explained',
    title:       'The Exposure Triangle Finally Explained (With a Tool That Shows You In Real Time)',
    description: 'ISO, aperture, and shutter speed are described endlessly — but almost never shown. Here\'s how to actually feel the difference.',
    category:    'Photography',
    readTime:    6,
    date:        '2026-05-09',
    blocks: [
      { type: 'p', text: 'Every photography guide explains the exposure triangle. Almost none of them show it. ISO, aperture, and shutter speed are described endlessly in text and diagrams — and still, most beginners finish the article and go back to Auto mode. The reason is simple: you can\'t feel numbers. You have to see them change.' },
      { type: 'h2', text: 'What the exposure triangle actually is' },
      { type: 'p', text: 'The three controls on any camera — ISO, aperture, shutter speed — all change the same thing: how much light reaches the sensor. Change any one of them and your photo gets brighter or darker. The triangle is the relationship between them.' },
      { type: 'ul', items: [
        'ISO — sensor sensitivity. Low ISO (100) = clean image, needs lots of light. High ISO (3200+) = usable in the dark, but introduces visible grain.',
        'Aperture — size of the hole in the lens. Smaller f-numbers (f/1.8) mean a bigger opening and more light. f/16 is nearly closed.',
        'Shutter speed — how long the sensor is exposed. 1/1000s freezes a sprinting athlete. 1s turns a waterfall into silk.',
      ]},
      { type: 'h2', text: 'The problem with learning from text' },
      { type: 'p', text: 'Reading "increasing ISO brightens the image but adds noise" is true. But it doesn\'t land until you drag a dial from ISO 100 to ISO 6400 and watch grain appear in the shadows in real time. This is exactly why Camera Simulator exists — adjust all three controls and immediately see the result across five animated scenes. No camera. No app install. No signup.' },
      { type: 'h2', text: 'The exercise that made it click' },
      { type: 'p', text: 'Set the Waterfall scene. Set shutter to 1/1000s. The water looks frozen, like individual drops mid-air. Now slowly drag the shutter dial down to 1/8s, then 1s. Watch the water become progressively silkier until it turns into a smooth white curtain — exactly how long-exposure waterfall photography works. The EV meter at the bottom shows whether your combo is balanced.' },
      { type: 'h2', text: 'Three exercises to try right now' },
      { type: 'ul', items: [
        'ISO noise test — Lock shutter at 1/125s and aperture at f/5.6. Sweep ISO from 100 to 6400. Note exactly when grain becomes visible.',
        'Aperture brightness — Lock everything else. Move aperture from f/1.8 to f/16. Count how many stops darker it gets (6 stops = 64× less light).',
        'Shutter + motion — Switch to Helicopter. Drag shutter from 1/1000s to 1/4s. Watch rotor blades go from sharp to a translucent disc.',
      ]},
      { type: 'callout', text: 'Open the simulator alongside any photography tutorial and use it as your interactive diagram. The emulator is free at camerasimulator.online/emulator — no signup required.' },
    ],
  },

  // ─── 2 ───────────────────────────────────────────────────────────────────
  {
    slug:        'photography-skills-without-camera',
    title:       '5 Photography Skills You Can Learn Before You Own a Camera',
    description: 'The camera is not the barrier. Understanding is. And understanding doesn\'t require owning hardware.',
    category:    'Photography',
    readTime:    5,
    date:        '2026-05-09',
    blocks: [
      { type: 'p', text: 'The most common reason people don\'t learn photography: "I\'ll start when I get a better camera." The camera is not the barrier. Understanding is. And understanding doesn\'t require owning hardware. Here are five real photographic skills you can develop right now — on any device, for free.' },
      { type: 'h2', text: '1. Reading exposure' },
      { type: 'p', text: 'Every photo is either correctly exposed, overexposed (too bright, washed out), or underexposed (too dark, crushed shadows). Learning to diagnose this by eye takes practice. You can get that practice by adjusting settings in a simulator and training your eye to recognize the result. Camera Simulator has an EV meter that shows you the exposure balance as you work — move any dial and the meter responds instantly.' },
      { type: 'h2', text: '2. Understanding depth of field' },
      { type: 'p', text: 'Wide apertures (f/1.8) blur the background. Narrow apertures (f/11) keep everything sharp. Portrait photographers shoot wide open; landscape photographers stop down. Knowing this before you buy a lens saves expensive mistakes. You\'ll understand exactly why a portrait lens at f/1.4 costs more — and whether you actually need it.' },
      { type: 'h2', text: '3. Predicting motion blur' },
      { type: 'p', text: 'Is 1/250s fast enough to freeze a child running? What shutter speed makes a river look silky? These aren\'t things you can guess — they\'re things you need to feel. A simulator with an animated waterfall or a helicopter with spinning rotors gives you that reference before you ever stand next to a real waterfall.' },
      { type: 'h2', text: '4. Composing a shot mentally' },
      { type: 'p', text: 'Composition is completely independent of camera settings. Study the rule of thirds, leading lines, and negative space using any image — including screenshots from a simulator, stock photos, or paintings. Keep a notes file of compositions you want to recreate. This is a skill that transfers instantly to any camera the moment you pick one up.' },
      { type: 'h2', text: '5. Learning your light sources' },
      { type: 'p', text: 'Natural light changes through the day. Golden hour (just after sunrise, just before sunset) is soft and warm. Midday is harsh and creates unflattering shadows. You can study this by observing light around you — no camera needed. When you do get a camera, you\'ll already know to wake up early.' },
      { type: 'callout', text: 'Start with the free simulator at camerasimulator.online — it covers skills 1, 2, and 3 in a single session. No account, no install.' },
    ],
  },

  // ─── 3 ───────────────────────────────────────────────────────────────────
  {
    slug:        'slow-shutter-speed-guide',
    title:       'What Slow Shutter Speed Actually Looks Like (And How to Use It)',
    description: 'Silk waterfalls, light trails, spinning rotors — long exposure is dramatic. Here\'s how to visualize it before you set up a tripod.',
    category:    'Photography',
    readTime:    5,
    date:        '2026-05-09',
    blocks: [
      { type: 'p', text: 'Long exposure photography produces some of the most dramatic images in existence — silk waterfalls, star trails, car light streaks painting city streets with color. The technique itself is simple. The tricky part is visualizing what different shutter speeds will do before you set up a tripod at midnight.' },
      { type: 'h2', text: 'The shutter speed scale you need to know' },
      { type: 'table', headers: ['Speed', 'What it does'], rows: [
        ['1/1000s', 'Freezes fast motion completely'],
        ['1/250s',  'Stops most motion, slight softening on fast subjects'],
        ['1/60s',   'Rotor arcs become visible, water starts to blur'],
        ['1/8s',    'Waterfalls go silky, helicopter becomes a translucent disc'],
        ['1s+',     'Light trails, star movement, full long-exposure effect'],
      ]},
      { type: 'h2', text: 'How to practice without a camera' },
      { type: 'p', text: 'Camera Simulator was built specifically to show these effects in real time. Switch to the City Night scene and drag the shutter dial from 1/500s down to 1/4s — car headlights and taillights stretch into trails exactly like real night photography. Switch to Waterfall and watch the transition from sharp drops to a smooth curtain at 1s.' },
      { type: 'h2', text: 'The trade-off nobody tells beginners' },
      { type: 'p', text: 'Slow shutter = more light + motion blur. This sounds great until you realize: you need a stable surface (tripod or wall), anything moving in frame will blur including yourself pressing the button (use a 2-second timer or cable release), and bright daylight plus a slow shutter equals completely overexposed frames unless you use a neutral density filter.' },
      { type: 'ul', items: [
        'Use a tripod or brace against a wall — even slight camera shake shows at 1/30s',
        'Use your camera\'s 2-second timer to avoid shaking it when you press the shutter',
        'In bright conditions you\'ll need an ND filter to get slow shutter without blowing highlights',
        'The City Night scene in the simulator shows light trails — exactly what you\'ll get on a real street at night',
      ]},
      { type: 'h2', text: 'Scenes that teach shutter speed best' },
      { type: 'p', text: 'The Waterfall scene shows the classic long-exposure effect — drag the shutter from 1/1000s to 1/4s and the water transitions from frozen droplets to a silky curtain. The Helicopter scene shows circular motion blur on the rotor blades — at 1s the blades completely disappear into a translucent disc, which is exactly what you see in long-exposure helicopter photography.' },
      { type: 'callout', text: 'Try it at camerasimulator.online/emulator — switch scenes with the row of buttons and drag the shutter dial to feel the difference at each speed.' },
    ],
  },

  // ─── 4 ───────────────────────────────────────────────────────────────────
  {
    slug:        'webgl-iso-noise-shaders',
    title:       'How I Simulated ISO Noise and Exposure with WebGL Fragment Shaders in the Browser',
    description: 'Real-time film grain, gamma-correct exposure curves, and motion-blur accumulation — all in the browser at 60fps using Three.js.',
    category:    'Developer',
    readTime:    8,
    date:        '2026-05-09',
    blocks: [
      { type: 'p', text: 'Camera Simulator is a real-time photography learning tool that lets users adjust ISO, aperture, and shutter speed and see the photographic result immediately. The core challenge: how do you simulate film grain, exposure curves, and motion blur in the browser at 60fps? The answer: WebGL fragment shaders composited over a Canvas 2D scene.' },
      { type: 'h2', text: 'Architecture overview' },
      { type: 'ul', items: [
        'Canvas 2D draws the animated scene each frame',
        'Three.js reads the canvas as a CanvasTexture',
        'Pass 1: Exposure fragment shader (gamma-corrected brightness)',
        'Pass 2: ISO noise fragment shader (time-seeded random grain)',
        'WebGLRenderer outputs to screen',
      ]},
      { type: 'h2', text: 'The exposure shader' },
      { type: 'p', text: 'The key insight is working in linear light space — you need to undo the gamma encoding before applying the exposure multiplier, then re-apply gamma for display. Skipping this causes the highlights to clip incorrectly and midtones to shift unnaturally.' },
      { type: 'code', lang: 'glsl', text: `uniform sampler2D tDiffuse;
uniform float uExposure;
varying vec2 vUv;

void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  // linearize (undo gamma)
  vec3 linear = pow(color.rgb, vec3(2.2));
  // apply exposure multiplier
  vec3 exposed = clamp(linear * uExposure, 0.0, 1.0);
  // re-apply gamma for display
  gl_FragColor = vec4(pow(exposed, vec3(1.0 / 2.2)), color.a);
}` },
      { type: 'p', text: 'The exposure value comes from the EV formula: EV = log2((N² / t) / (ISO / 100)), where N is the f-number and t is shutter speed in seconds. The exposure multiplier is then 2^(EV_target - EV_actual), keeping the math physically accurate to real camera behavior.' },
      { type: 'h2', text: 'The ISO noise shader' },
      { type: 'p', text: 'Real camera noise has two components: luma noise (brightness variation) and chroma noise (color variation, especially in R and B channels). Separating them is what makes the result look like actual sensor noise rather than uniform grey static.' },
      { type: 'code', lang: 'glsl', text: `uniform sampler2D tDiffuse;
uniform float uISO;
uniform float uTime;
varying vec2 vUv;

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec4 color = texture2D(tDiffuse, vUv);

  // noise only visible above ISO 800
  float nf = clamp((uISO - 800.0) / 5600.0, 0.0, 1.0);
  nf = pow(nf, 1.5); // perceptual curve

  if (nf < 0.01) { gl_FragColor = color; return; }

  float luma    = rand(vUv + mod(uTime, 100.0)) * 2.0 - 1.0;
  float chromaR = rand(vUv * 1.3 + mod(uTime * 1.1, 100.0)) * 2.0 - 1.0;
  float chromaB = rand(vUv * 0.7 + mod(uTime * 0.9, 100.0)) * 2.0 - 1.0;

  float amt = nf * 0.10;
  color.r = clamp(color.r + luma * amt + chromaR * amt * 0.4, 0.0, 1.0);
  color.g = clamp(color.g + luma * amt, 0.0, 1.0);
  color.b = clamp(color.b + luma * amt + chromaB * amt * 0.4, 0.0, 1.0);

  gl_FragColor = color;
}` },
      { type: 'h2', text: 'Motion blur: accumulated canvas frames' },
      { type: 'p', text: 'Shutter speed affects how much motion is captured during the exposure window. For slow shutters, multiple canvas frames are rendered across the simulated exposure window and averaged together using globalAlpha compositing.' },
      { type: 'code', lang: 'typescript', text: `const samples = Math.max(1, Math.round(shutterSeconds * 120));
ctx.clearRect(0, 0, W, H);

for (let i = 0; i < samples; i++) {
  const sampleT = t - shutterSeconds + (i / samples) * shutterSeconds;
  ctx.globalAlpha = 1 / samples;
  drawScene(sceneId, ctx, W, H, sampleT);
}
ctx.globalAlpha = 1;` },
      { type: 'p', text: 'At 1/1000s this is a single sample — instant. At 1s it accumulates 120 samples, producing natural motion blur on anything that moved between the first and last frame. The helicopter rotor becomes a translucent disc; the waterfall becomes a smooth curtain.' },
      { type: 'h2', text: 'Performance notes' },
      { type: 'p', text: 'The bottleneck is Canvas 2D, not WebGL. The shader passes are essentially free at this resolution. Two optimizations matter: cache the static background on a separate canvas (hills, buildings, road — anything that doesn\'t animate) and only redraw the moving elements on top each frame. This dropped the helicopter scene from ~4ms to ~0.3ms per frame for background rendering.' },
      { type: 'callout', text: 'Live demo at camerasimulator.online/emulator — open DevTools Performance panel while dragging the ISO dial to see the shader in action.' },
    ],
  },

  // ─── 5 ───────────────────────────────────────────────────────────────────
  {
    slug:        'nextjs-static-export-lessons',
    title:       'Building a Next.js 16 Static Export App with PWA, SEO, and WebGL — What I Learned',
    description: 'Non-obvious gotchas with output: export, Three.js SSR, Zustand hydration, and robots.txt that cost me hours.',
    category:    'Developer',
    readTime:    7,
    date:        '2026-05-09',
    blocks: [
      { type: 'p', text: 'Camera Simulator is a static Next.js app (App Router, output: \'export\') that uses Three.js WebGL shaders, Zustand state management, Capacitor for mobile, and full SEO metadata. Here are the non-obvious things that caught me — mostly underdocumented edge cases in the static export path.' },
      { type: 'h2', text: 'output: export breaks route handlers for robots.txt and sitemap.xml' },
      { type: 'p', text: 'The App Router\'s robots.ts and sitemap.ts file conventions generate /robots.txt and /sitemap.xml at runtime. With output: export, those routes are not written to the out/ directory. The files simply don\'t exist in the static build, so Googlebot gets a 404 and reports the site as blocked.' },
      { type: 'code', lang: 'typescript', text: `// ❌ This looks right but doesn't work with output: 'export'
// app/robots.ts
export default function robots() {
  return { rules: { userAgent: '*', allow: '/' } };
}` },
      { type: 'p', text: 'The fix is simple — put them directly in public/ as real files. They get copied verbatim into the export output:' },
      { type: 'code', lang: 'text', text: `# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml` },
      { type: 'h2', text: 'Three.js must always be dynamically imported' },
      { type: 'p', text: 'Three.js touches window and document on import. Server-rendering it throws a ReferenceError. Every component that imports Three.js must be wrapped in dynamic() with ssr: false.' },
      { type: 'code', lang: 'typescript', text: `// ❌ breaks SSR build
import * as THREE from 'three';

// ✅ correct approach
const CameraPreview = dynamic(
  () => import('@/components/CameraPreview'),
  { ssr: false }
);` },
      { type: 'h2', text: 'CanvasTexture needs needsUpdate = true every frame' },
      { type: 'p', text: 'This is not obvious from the Three.js docs. If you create a CanvasTexture from a canvas element that changes every frame, you must manually set needsUpdate = true in your animation loop — otherwise Three.js caches the first frame and the texture never updates.' },
      { type: 'code', lang: 'typescript', text: `const texture = new THREE.CanvasTexture(canvas);

// animation loop:
function animate() {
  requestAnimationFrame(animate);
  texture.needsUpdate = true; // ← required every frame
  renderer.render(scene, camera);
}` },
      { type: 'h2', text: 'Zustand persist + static export hydration mismatch' },
      { type: 'p', text: 'If you use zustand/middleware/persist with localStorage, the server renders with default state but the client immediately rehydrates from localStorage — causing a flash and a React hydration warning. Fix it with skipHydration and a manual rehydrate call:' },
      { type: 'code', lang: 'typescript', text: `const useStore = create(
  persist(
    (set) => ({ iso: 400, aperture: 5.6 }),
    { name: 'camera-store', skipHydration: true }
  )
);

// In your root layout or top-level component:
useEffect(() => {
  useStore.persist.rehydrate();
}, []);` },
      { type: 'h2', text: 'iOS safe area + viewport meta' },
      { type: 'p', text: 'For a full-screen camera UI that works on iPhones with a home indicator, you need both the viewport export and CSS env() variables:' },
      { type: 'code', lang: 'typescript', text: `// app/layout.tsx
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,   // prevents double-tap zoom
  themeColor: '#0d0d0d',
};` },
      { type: 'code', lang: 'css', text: `.bottom-bar {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}` },
      { type: 'callout', text: 'Full project live at camerasimulator.online — built with Next.js 16, Three.js, Zustand, Tailwind, and Capacitor.' },
    ],
  },

  // ─── 6 ───────────────────────────────────────────────────────────────────
  {
    slug:        'canvas-cartoon-rendering',
    title:       'Cartoon Scene Rendering with Canvas 2D: Outlines, Cel Shading, and 60fps Animation',
    description: 'Five animated scenes — helicopter, waterfall, race track, city night, ceiling fan — drawn entirely with Canvas 2D. No images, no SVG, no libraries.',
    category:    'Developer',
    readTime:    7,
    date:        '2026-05-09',
    blocks: [
      { type: 'p', text: 'The scenes in Camera Simulator are drawn entirely with Canvas 2D — no image assets, no SVG, no external libraries. Just ctx.fillStyle, ctx.beginPath(), and math. Here\'s the system that makes five animated scenes look like polished cartoon illustrations at 60fps.' },
      { type: 'h2', text: 'The outline trick' },
      { type: 'p', text: 'Real cel-shading uses a separate render pass for outlines. In Canvas 2D, the trick is simpler: draw the filled shape, then stroke() on top. The key is that stroke() operates on whatever path is currently active — so you don\'t need to re-specify it.' },
      { type: 'code', lang: 'typescript', text: `function outline(
  ctx: CanvasRenderingContext2D,
  color = '#1a1a2e',
  width = 3,
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke(); // strokes the current active path
}

// Usage:
ctx.fillStyle = '#4caf50';
ctx.beginPath();
ctx.arc(x, y, r, 0, Math.PI * 2);
ctx.fill();
outline(ctx, '#2e7d32', 3); // outlines the same circle` },
      { type: 'h2', text: 'Cel shading: the three-layer trick' },
      { type: 'p', text: 'Real lighting is expensive. Cel shading fakes it with three concentric layers: a dark shadow shape offset slightly down-right, the main flat-colored shape, and a bright highlight dot in the top-left. That\'s the entire technique.' },
      { type: 'code', lang: 'typescript', text: `// Shadow layer (offset, darker)
ctx.fillStyle = '#2d6e26';
ctx.beginPath();
ctx.arc(x + r * 0.1, y + r * 0.1, r * 0.88, 0, Math.PI * 2);
ctx.fill();

// Main lit layer
ctx.fillStyle = '#4caf50';
ctx.beginPath();
ctx.arc(x, y, r * 0.88, 0, Math.PI * 2);
ctx.fill();
outline(ctx, '#2e7d32', 3);

// Highlight dot (top-left)
ctx.fillStyle = '#81c784';
ctx.beginPath();
ctx.arc(x - r * 0.28, y - r * 0.28, r * 0.3, 0, Math.PI * 2);
ctx.fill();` },
      { type: 'h2', text: 'Background caching for performance' },
      { type: 'p', text: 'Static elements (sky, hills, buildings, floor) are expensive to redraw every frame but never change. Cache them on a secondary offscreen canvas and stamp them with a single drawImage() call each frame. Only the animated elements (rotors, cars, water streams) are redrawn.' },
      { type: 'code', lang: 'typescript', text: `const _bgCache = new Map<string, HTMLCanvasElement>();

function ensureBg(
  id: string, W: number, H: number,
  paint: (ctx: CanvasRenderingContext2D, W: number, H: number) => void,
): HTMLCanvasElement {
  const key = \`\${id}:\${W}x\${H}\`;
  if (_bgCache.has(key)) return _bgCache.get(key)!;

  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  paint(c.getContext('2d')!, W, H);
  _bgCache.set(key, c);
  return c;
}

// Each frame — background is free:
ctx.drawImage(ensureBg('helicopter', W, H, paintBg), 0, 0);
// then only draw moving elements on top` },
      { type: 'p', text: 'This dropped the helicopter scene from ~4ms/frame to ~0.3ms/frame for the background portion — a 13× speedup that keeps the whole pipeline comfortably under the 16ms frame budget even on mid-range phones.' },
      { type: 'h2', text: 'Fake perspective with a single scale' },
      { type: 'p', text: 'Racing cars in the background lane should appear smaller than cars in the foreground. Setting up a full perspective matrix is overkill for a 2D canvas. One multiply is enough:' },
      { type: 'code', lang: 'typescript', text: `for (const car of RACE_CARS) {
  const x = ((car.phase * W + t * car.speed) % (W + 220)) - 220;
  const y = H * car.lane;

  // cars in far lane (lower y) get scale ~0.85
  // cars in near lane (higher y) get scale ~1.0
  const scale = 0.85 + (car.lane - 0.44) * 0.28;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  drawCar(ctx, car);
  ctx.restore();
}` },
      { type: 'h2', text: 'Animating water streams' },
      { type: 'p', text: 'The waterfall is the trickiest scene. Each stream is a column of rounded rectangles scrolling downward at slightly different speeds, with a bright highlight stripe on the leading edge. Offsetting each stream by its index creates the natural variation of a real waterfall.' },
      { type: 'code', lang: 'typescript', text: `for (let i = 0; i < numStreams; i++) {
  const speed = 380 + Math.sin(i * 1.8) * 100; // vary per stream
  const offset = (t * speed + (i / numStreams) * totalHeight) % totalHeight;

  ctx.fillStyle = \`rgba(144,202,249,\${0.55 + Math.sin(i * 1.3) * 0.2})\`;

  for (let seg = 0; seg < 5; seg++) {
    const sy = (offset + seg * segHeight) % totalHeight;
    roundRect(ctx, sx, sy, streamWidth, segHeight, streamWidth * 0.3);
    ctx.fill();
  }
}` },
      { type: 'callout', text: 'All five scenes are live at camerasimulator.online/emulator — open DevTools and watch the canvas render in real time while you adjust the shutter speed.' },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find(p => p.slug === slug);
}
