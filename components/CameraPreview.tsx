'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useCameraStore } from '@/lib/cameraStore';
import { computeExposure } from '@/lib/exposureEngine';
import { drawScene, invalidateBackground } from '@/lib/animatedScene';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const noiseFrag = `
uniform sampler2D tDiffuse;
uniform float uISO;
uniform float uTime;
varying vec2 vUv;
float rand(vec2 co) { return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453); }
void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  float nf = clamp((uISO - 800.0) / 5600.0, 0.0, 1.0);
  nf = pow(nf, 1.5);
  if (nf < 0.01) { gl_FragColor = color; return; }
  float luma    = rand(vUv + mod(uTime, 100.0)) * 2.0 - 1.0;
  float chromaR = rand(vUv * 1.3 + mod(uTime * 1.1, 100.0)) * 2.0 - 1.0;
  float chromaB = rand(vUv * 0.7 + mod(uTime * 0.9, 100.0)) * 2.0 - 1.0;
  float amt = nf * 0.10;
  color.r = clamp(color.r + luma * amt + chromaR * amt * 0.4, 0.0, 1.0);
  color.g = clamp(color.g + luma * amt, 0.0, 1.0);
  color.b = clamp(color.b + luma * amt + chromaB * amt * 0.4, 0.0, 1.0);
  gl_FragColor = color;
}`;

const exposureFrag = `
uniform sampler2D tDiffuse;
uniform float uExposure;
varying vec2 vUv;
void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  vec3 linear  = pow(color.rgb, vec3(2.2));
  vec3 exposed = clamp(linear * uExposure, 0.0, 1.0);
  gl_FragColor = vec4(pow(exposed, vec3(1.0 / 2.2)), color.a);
}`;

interface Props {
  rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>;
}

export default function CameraPreview({ rendererRef }: Props) {
  const mountRef    = useRef<HTMLDivElement>(null);
  const noiseMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const expMatRef   = useRef<THREE.ShaderMaterial | null>(null);
  const animRef     = useRef<number>(0);

  const shutterRef  = useRef(1 / 125);
  const isoRef      = useRef(400);
  const exposureRef = useRef(1.0);
  const sceneIdRef  = useRef('helicopter');

  const { aperture, shutter, iso, sceneId } = useCameraStore();

  useEffect(() => { shutterRef.current = shutter; },  [shutter]);
  useEffect(() => { isoRef.current     = iso;     },  [iso]);
  useEffect(() => { sceneIdRef.current = sceneId; },  [sceneId]);

  useEffect(() => {
    const exp = computeExposure(iso, shutter, aperture);
    exposureRef.current = exp;
    if (expMatRef.current) expMatRef.current.uniforms.uExposure.value = exp;
  }, [iso, shutter, aperture]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth  || 512;
    const H = mount.clientHeight || 384;

    const tempCanvas  = document.createElement('canvas');
    const accumCanvas = document.createElement('canvas');
    tempCanvas.width  = accumCanvas.width  = W;
    tempCanvas.height = accumCanvas.height = H;
    const tempCtx  = tempCanvas.getContext('2d')!;
    const accumCtx = accumCanvas.getContext('2d')!;

    const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const scene3 = new THREE.Scene();
    const geo    = new THREE.PlaneGeometry(2, 2);
    const rt1    = new THREE.WebGLRenderTarget(W, H);

    const sceneTex = new THREE.CanvasTexture(accumCanvas);

    const noiseMat = new THREE.ShaderMaterial({
      vertexShader, fragmentShader: noiseFrag,
      uniforms: { tDiffuse: { value: sceneTex }, uISO: { value: 400 }, uTime: { value: 0 } },
    });
    noiseMatRef.current = noiseMat;

    const expMat = new THREE.ShaderMaterial({
      vertexShader, fragmentShader: exposureFrag,
      uniforms: { tDiffuse: { value: rt1.texture }, uExposure: { value: 1.0 } },
    });
    expMatRef.current = expMat;

    const mesh1 = new THREE.Mesh(geo, noiseMat);
    const mesh2 = new THREE.Mesh(geo, expMat);

    const startTime = Date.now();

    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      const elapsed     = (Date.now() - startTime) / 1000;
      const shutter     = shutterRef.current;
      const currentScene = sceneIdRef.current;

      const numSamples = Math.min(20, Math.max(1, Math.round(shutter * 60)));

      for (let i = 0; i < numSamples; i++) {
        const sampleT = elapsed - shutter * 0.5 + (i + 0.5) * (shutter / numSamples);
        tempCtx.clearRect(0, 0, W, H);
        drawScene(currentScene, tempCtx, W, H, sampleT);
        accumCtx.globalAlpha = (i === 0) ? 1 : 1 / (i + 1);
        accumCtx.drawImage(tempCanvas, 0, 0);
      }
      accumCtx.globalAlpha = 1;
      sceneTex.needsUpdate = true;

      noiseMat.uniforms.uISO.value  = isoRef.current;
      noiseMat.uniforms.uTime.value = elapsed;

      scene3.clear(); scene3.add(mesh1);
      renderer.setRenderTarget(rt1);
      renderer.render(scene3, camera);

      scene3.clear(); scene3.add(mesh2);
      renderer.setRenderTarget(null);
      renderer.render(scene3, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver(() => {
      const nw = mount.clientWidth, nh = mount.clientHeight;
      if (!nw || !nh) return;
      renderer.setSize(nw, nh);
      rt1.setSize(nw, nh);
      tempCanvas.width  = accumCanvas.width  = nw;
      tempCanvas.height = accumCanvas.height = nh;
      invalidateBackground();
    });
    resizeObserver.observe(mount);

    return () => {
      cancelAnimationFrame(animRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
      rt1.dispose();
      sceneTex.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      rendererRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', background: '#0a0a0a' }}
    />
  );
}
