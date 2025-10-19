"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './PixelBlast.module.css';

type PixelBlastVariant = 'square' | 'circle' | 'triangle' | 'diamond';

type PixelBlastProps = {
  variant?: PixelBlastVariant;
  pixelSize?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  antialias?: boolean;
  patternScale?: number;
  patternDensity?: number;
  liquid?: boolean;
  liquidStrength?: number;
  liquidRadius?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleIntensityScale?: number;
  rippleThickness?: number;
  rippleSpeed?: number;
  liquidWobbleSpeed?: number;
  autoPauseOffscreen?: boolean;
  speed?: number;
  transparent?: boolean;
  edgeFade?: number;
  noiseAmount?: number;
};

type PBUniforms = {
  uResolution: { value: THREE.Vector2 };
  uTime: { value: number };
  uColor: { value: THREE.Color };
  uClickPos: { value: THREE.Vector2[] };
  uClickTimes: { value: Float32Array };
  uShapeType: { value: number };
  uPixelSize: { value: number };
  uScale: { value: number };
  uDensity: { value: number };
  uPixelJitter: { value: number };
  uEnableRipples: { value: number };
  uRippleSpeed: { value: number };
  uRippleThickness: { value: number };
  uRippleIntensity: { value: number };
  uEdgeFade: { value: number };
};

const SHAPE_MAP: Record<PixelBlastVariant, number> = {
  square: 0,
  circle: 1,
  triangle: 2,
  diamond: 3
};

const VERTEX_SRC = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;

uniform vec3  uColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int   uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;

uniform int   uShapeType;
const int SHAPE_SQUARE   = 0;
const int SHAPE_CIRCLE   = 1;
const int SHAPE_TRIANGLE = 2;
const int SHAPE_DIAMOND  = 3;

const int   MAX_CLICKS = 10;

uniform vec2  uClickPos  [MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2. + a.y * a.y * .75);
}
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

#define FBM_OCTAVES     5
#define FBM_LACUNARITY  1.25
#define FBM_GAIN        1.0

float hash11(float n){ return fract(sin(n)*43758.5453); }

float vnoise(vec3 p){
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0  = mix(x00, x10, w.y);
  float y1  = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t){
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < FBM_OCTAVES; ++i){
    sum  += amp * vnoise(p * freq);
    freq *= FBM_LACUNARITY;
    amp  *= FBM_GAIN;
  }
  return sum * 0.5 + 0.5;
}

float maskCircle(vec2 p, float cov){
  float r = sqrt(cov) * .25;
  float d = length(p - 0.5) - r;
  float aa = 0.5 * fwidth(d);
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov){
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d  = p.y - r*(1.0 - p.x);
  float aa = fwidth(d);
  return cov * clamp(0.5 - d/aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov){
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

void main(){
  float pixelSize = uPixelSize;
  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
  float aspectRatio = uResolution.x / uResolution.y;

  vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fract(fragCoord / pixelSize);

  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(uv, uTime * 0.05);
  base = base * 0.5 - 0.65;

  float feed = base + (uDensity - 0.5) * 0.3;

  float speed     = uRippleSpeed;
  float thickness = uRippleThickness;
  const float dampT     = 1.0;
  const float dampR     = 10.0;

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i){
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      float cellPixelSize = 8.0 * pixelSize;
      vec2 cuv = (((pos - uResolution * .5 - cellPixelSize * .5) / (uResolution))) * vec2(aspectRatio, 1.0);
      float t = max(uTime - uClickTimes[i], 0.0);
      float r = distance(uv, cuv);
      float waveR = speed * t;
      float ring  = exp(-pow((r - waveR) / thickness, 2.0));
      float atten = exp(-dampT * t) * exp(-dampR * r);
      feed = max(feed, ring * atten * uRippleIntensity);
    }
  }

  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
  float bw = step(0.5, feed + bayer);

  float h = fract(sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) * 43758.5453);
  float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;
  float coverage = bw * jitterScale;
  float M;
  if      (uShapeType == SHAPE_CIRCLE)   M = maskCircle (pixelUV, coverage);
  else if (uShapeType == SHAPE_TRIANGLE) M = maskTriangle(pixelUV, pixelId, coverage);
  else if (uShapeType == SHAPE_DIAMOND)  M = maskDiamond(pixelUV, coverage);
  else                                   M = coverage;

  if (uEdgeFade > 0.0) {
    vec2 norm = gl_FragCoord.xy / uResolution;
    float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y));
    float fade = smoothstep(0.0, uEdgeFade, edge);
    M *= fade;
  }

  vec3 color = uColor;
  fragColor = vec4(color, M);
}
`;

const MAX_CLICKS = 10;

const PixelBlast: React.FC<PixelBlastProps> = ({
  variant = 'square',
  pixelSize = 3,
  color = '#f97316',
  className,
  style,
  antialias = true,
  patternScale = 2,
  patternDensity = 1,
  liquid = false,
  liquidStrength = 0.1,
  liquidRadius = 1,
  pixelSizeJitter = 0,
  enableRipples = true,
  rippleIntensityScale = 1,
  rippleThickness = 0.1,
  rippleSpeed = 0.3,
  liquidWobbleSpeed = 4.5,
  autoPauseOffscreen = true,
  speed = 0.5,
  transparent = true,
  edgeFade = 0.5,
  noiseAmount = 0
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const visibilityRef = useRef({ visible: true });
  const speedRef = useRef(speed);

  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    material: THREE.ShaderMaterial;
    clock: THREE.Clock;
    clickIx: number;
    uniforms: PBUniforms;
    resizeObserver?: ResizeObserver;
    raf?: number;
    quad?: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    timeOffset?: number;
  } | null>(null);
  type ReinitCfg = { antialias: boolean; liquid: boolean; noiseAmount: number };
  const prevConfigRef = useRef<ReinitCfg | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    speedRef.current = speed;
    const needsReinitKeys: (keyof ReinitCfg)[] = ['antialias', 'liquid', 'noiseAmount'];
    const cfg: ReinitCfg = { antialias, liquid, noiseAmount };
    let mustReinit = false;
    if (!threeRef.current) mustReinit = true;
    else if (prevConfigRef.current) {
      for (const k of needsReinitKeys)
        if (prevConfigRef.current[k] !== cfg[k]) { mustReinit = true; break; }
    }

    // Handlers references available for cleanup
    let onVis: (() => void) | null = null;
    let onLost: ((e: Event) => void) | null = null;
    let onRestored: (() => void) | null = null;

  if (mustReinit) {
      if (threeRef.current) {
        const t = threeRef.current;
        t.resizeObserver?.disconnect();
        cancelAnimationFrame(t.raf!);
        t.quad?.geometry.dispose();
        t.material.dispose();
        t.renderer.dispose();
        if (t.renderer.domElement.parentElement === container)
          container.removeChild(t.renderer.domElement);
        threeRef.current = null;
      }

  try {
        // Feature detect WebGL2/WebGL
        const canCreateWebGL = () => {
          try {
            const testCanvas = document.createElement('canvas');
            const webgl2 = testCanvas.getContext('webgl2', { desynchronized: true, powerPreference: 'high-performance' });
            const webgl1 = testCanvas.getContext('webgl', { desynchronized: true, powerPreference: 'high-performance' });
            const getCtx = testCanvas.getContext as unknown as (contextId: string, options?: unknown) => unknown;
            const exp = typeof getCtx === 'function' ? getCtx.call(testCanvas, 'experimental-webgl', { desynchronized: true, powerPreference: 'high-performance' }) : null;
            return !!(webgl2 || webgl1 || exp);
          } catch {
            return false;
          }
        };
        if (!canCreateWebGL()) {
          // Fallback: simple gradient background
          container.style.background = 'linear-gradient(135deg, rgba(17,24,39,0.9), rgba(34,211,238,0.2))';
          return;
        }
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2', { antialias, alpha: true });
        if (!gl) return;

        const renderer = new THREE.WebGLRenderer({
          canvas,
          context: gl as WebGL2RenderingContext,
          antialias,
          alpha: true
        });
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        // Clamp DPR later based on container size and GPU limits
        renderer.setPixelRatio(1);
        container.appendChild(renderer.domElement);

        const uniforms = {
          uResolution: { value: new THREE.Vector2(0, 0) },
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
          uClickPos: {
            value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1))
          },
          uClickTimes: { value: new Float32Array(MAX_CLICKS) },
          uShapeType: { value: SHAPE_MAP[variant] ?? 0 },
          uPixelSize: { value: pixelSize * renderer.getPixelRatio() },
          uScale: { value: patternScale },
          uDensity: { value: patternDensity },
          uPixelJitter: { value: pixelSizeJitter },
          uEnableRipples: { value: enableRipples ? 1 : 0 },
          uRippleSpeed: { value: rippleSpeed },
          uRippleThickness: { value: rippleThickness },
          uRippleIntensity: { value: rippleIntensityScale },
          uEdgeFade: { value: edgeFade }
        };

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const material = new THREE.ShaderMaterial({
          vertexShader: VERTEX_SRC,
          fragmentShader: FRAGMENT_SRC,
          uniforms,
          transparent: true,
          glslVersion: THREE.GLSL3,
          depthTest: false,
          depthWrite: false
        });

        const quadGeom = new THREE.PlaneGeometry(2, 2);
        const quad = new THREE.Mesh(quadGeom, material);
        scene.add(quad);

        const clock = new THREE.Clock();

        const setSize = () => {
          const w = container.clientWidth;
          const h = container.clientHeight;
          if (!w || !h) return; // Defer sizing until visible

          // Compute safe DPR based on MAX_RENDERBUFFER_SIZE / max dimension
          const glCtx = renderer.getContext();
          const maxRB = glCtx.getParameter(glCtx.MAX_RENDERBUFFER_SIZE) as number;
          const desiredDpr = Math.min(2, window.devicePixelRatio || 1);
          const maxDprByRB = Math.max(1, Math.floor(maxRB / Math.max(w, h)));
          const safeDpr = Math.max(1, Math.min(desiredDpr, maxDprByRB));
          if (renderer.getPixelRatio() !== safeDpr) renderer.setPixelRatio(safeDpr);

          renderer.setSize(w, h, false);
          uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height);
          // No postprocessing composer in this lightweight variant
          uniforms.uPixelSize.value = pixelSize * renderer.getPixelRatio();
        };

        // Only size if container has non-zero size
        if (container.clientWidth && container.clientHeight) setSize();
        const ro = new ResizeObserver(setSize);
        ro.observe(container);

        const randomFloat = () => {
          if (typeof window !== 'undefined' && 'crypto' in window && window.crypto && 'getRandomValues' in window.crypto) {
            const u32 = new Uint32Array(1);
            window.crypto.getRandomValues(u32);
            return u32[0] / 0xffffffff;
          }
          return Math.random();
        };

        const timeOffset = randomFloat() * 1000;

        const onPointerDown = (e: PointerEvent) => {
          const rect = renderer.domElement.getBoundingClientRect();
          const scaleX = renderer.domElement.width / rect.width;
          const scaleY = renderer.domElement.height / rect.height;
          const fx = (e.clientX - rect.left) * scaleX;
          const fy = (rect.height - (e.clientY - rect.top)) * scaleY;

          const ix = threeRef.current?.clickIx ?? 0;
          uniforms.uClickPos.value[ix].set(fx, fy);
          uniforms.uClickTimes.value[ix] = uniforms.uTime.value;
          if (threeRef.current) threeRef.current.clickIx = (ix + 1) % MAX_CLICKS;
        };

        renderer.domElement.addEventListener('pointerdown', onPointerDown, { passive: true });

        let raf = 0;
        const animate = () => {
          // Skip rendering if not visible or zero-sized
          if (!visibilityRef.current.visible || !container.clientWidth || !container.clientHeight) {
            raf = requestAnimationFrame(animate);
            return;
          }
          uniforms.uTime.value = timeOffset + clock.getElapsedTime() * speedRef.current;
          renderer.render(scene, camera);
          raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);

        // Pause when tab hidden; resume when visible
        onVis = () => {
          visibilityRef.current.visible = document.visibilityState === 'visible';
        };
  document.addEventListener('visibilitychange', onVis);

        // Handle WebGL context lost/restored
        onLost = (e: Event) => {
          e.preventDefault();
          cancelAnimationFrame(raf);
        };
        onRestored = () => {
          setSize();
          raf = requestAnimationFrame(animate);
        };
  renderer.domElement.addEventListener('webglcontextlost', onLost as EventListener, { passive: false });
  renderer.domElement.addEventListener('webglcontextrestored', onRestored as EventListener);

        threeRef.current = {
          renderer,
          scene,
          camera,
          material,
          clock,
          clickIx: 0,
          uniforms,
          resizeObserver: ro,
          raf,
          quad,
          timeOffset
        };

      } catch (error) {
        console.error('Failed to initialize PixelBlast:', error);
      }
    }

    prevConfigRef.current = cfg;

    return () => {
      if (threeRef.current && !mustReinit) {
        const t = threeRef.current;
        t.resizeObserver?.disconnect();
        cancelAnimationFrame(t.raf!);
        t.quad?.geometry.dispose();
        t.material.dispose();
        t.renderer.dispose();
        if (onVis) document.removeEventListener('visibilitychange', onVis);
        if (t.renderer?.domElement && onLost)
          t.renderer.domElement.removeEventListener('webglcontextlost', onLost as EventListener);
        if (t.renderer?.domElement && onRestored)
          t.renderer.domElement.removeEventListener('webglcontextrestored', onRestored as EventListener);
        if (t.renderer.domElement.parentElement === container)
          container.removeChild(t.renderer.domElement);
        threeRef.current = null;
      }
    };
  }, [
    antialias, liquid, noiseAmount, pixelSize, patternScale, patternDensity,
    enableRipples, rippleIntensityScale, rippleThickness, rippleSpeed,
    pixelSizeJitter, edgeFade, transparent, liquidStrength, liquidRadius,
    liquidWobbleSpeed, autoPauseOffscreen, variant, color, speed
  ]);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className ?? ''}`}
      style={style}
      aria-label="PixelBlast interactive background"
    />
  );
};

export default PixelBlast;
