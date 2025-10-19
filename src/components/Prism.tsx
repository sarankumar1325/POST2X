"use client";
import { useRef, useEffect } from 'react';
import { Renderer, Camera, Transform, Program, Mesh, Geometry } from 'ogl';

interface PrismProps {
  animationType?: string;
  timeScale?: number;
  height?: number;
  baseWidth?: number;
  scale?: number;
  hueShift?: number;
  colorFrequency?: number;
  noise?: number;
  glow?: number;
}

export default function Prism({
  animationType = "rotate",
  timeScale = 0.5,
  height = 3.5,
  baseWidth = 5.5,
  scale = 3.6,
  hueShift = 0,
  colorFrequency = 1,
  noise = 0.5,
  glow = 1
}: PrismProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Feature detection for WebGL/WebGL2
  const canCreateWebGL = () => {
    if (typeof window === 'undefined') return false;
    try {
      const canvas = document.createElement('canvas');
      const attrs: WebGLContextAttributes = {
        alpha: true,
        antialias: false,
        desynchronized: true,
        powerPreference: 'high-performance',
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
      };
      const gl2 = canvas.getContext('webgl2', attrs);
      if (gl2) return true;
      const gl =
        canvas.getContext('webgl', attrs) ||
        // experimental-webgl isn't in TS lib types; cast getContext to a string overload safely
        ((canvas.getContext as unknown as (id: string, attributes?: WebGLContextAttributes) => unknown)(
          'experimental-webgl',
          attrs
        ) as WebGLRenderingContext | null);
      return !!gl;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    try {
      // Bail out early if WebGL isn't available (prevents console error)
      if (!canCreateWebGL()) {
        container.style.background = 'linear-gradient(45deg, #f97316, #10b981, #8b5cf6)';
        return;
      }

      const dpr = Math.min(2, (window.devicePixelRatio || 1));

      // Create renderer
      const renderer = new Renderer({ dpr, alpha: true, antialias: false });
      const gl = renderer.gl;
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      gl.canvas.style.position = 'absolute';
      gl.canvas.style.top = '0';
      gl.canvas.style.left = '0';
      container.appendChild(gl.canvas);

      // Create camera
      const camera = new Camera(gl, { fov: 35 });
      camera.position.set(0, 0, 8);

      // Create scene
      const scene = new Transform();

    // Vertex shader
    const vertex = `
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;

      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform mat3 normalMatrix;

      varying vec3 vNormal;
      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Fragment shader with animated colors
    const fragment = `
      precision highp float;

      uniform float uTime;
      uniform float uHueShift;
      uniform float uColorFrequency;
      uniform float uNoise;
      uniform float uGlow;

      varying vec3 vNormal;
      varying vec2 vUv;
      varying vec3 vPosition;

      // Noise function
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      // HSV to RGB conversion
      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDirection = normalize(vec3(0.0, 0.0, 1.0) - vPosition);

        // Create animated color based on position and time
        float hue = sin(vPosition.y * uColorFrequency + uTime * 2.0) * 0.5 + 0.5;
        hue += uHueShift;
        hue = mod(hue, 1.0);

        // Add noise
        float noise = random(vUv + uTime * 0.1) * uNoise;
        hue += noise * 0.1;

        vec3 color = hsv2rgb(vec3(hue, 0.8, 0.9));

        // Add glow effect
        float fresnel = pow(1.0 - dot(normal, viewDirection), 2.0);
        color += vec3(uGlow * fresnel * 0.5);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Create prism geometry (simplified triangular prism)
    const positions = new Float32Array([
      // Front triangle
      -baseWidth/2, -height/2, baseWidth/2,
       baseWidth/2, -height/2, baseWidth/2,
       0, height/2, baseWidth/2,

      // Right rectangle
       baseWidth/2, -height/2, baseWidth/2,
       baseWidth/2, -height/2, -baseWidth/2,
       0, height/2, baseWidth/2,
       0, height/2, baseWidth/2,
       baseWidth/2, -height/2, -baseWidth/2,
       0, height/2, -baseWidth/2,

      // Back triangle
       baseWidth/2, -height/2, -baseWidth/2,
      -baseWidth/2, -height/2, -baseWidth/2,
       0, height/2, -baseWidth/2,

      // Left rectangle
      -baseWidth/2, -height/2, -baseWidth/2,
      -baseWidth/2, -height/2, baseWidth/2,
       0, height/2, -baseWidth/2,
       0, height/2, -baseWidth/2,
      -baseWidth/2, -height/2, baseWidth/2,
       0, height/2, baseWidth/2,

      // Bottom rectangle
      -baseWidth/2, -height/2, -baseWidth/2,
       baseWidth/2, -height/2, -baseWidth/2,
       baseWidth/2, -height/2, baseWidth/2,
      -baseWidth/2, -height/2, -baseWidth/2,
       baseWidth/2, -height/2, baseWidth/2,
      -baseWidth/2, -height/2, baseWidth/2,
    ]);

    const normals = new Float32Array([
      // Front
      0, 0, 1, 0, 0, 1, 0, 0, 1,
      // Right
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
      // Back
      0, 0, -1, 0, 0, -1, 0, 0, -1,
      // Left
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
      // Bottom
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    ]);

    const uvs = new Float32Array([
      // Front
      0, 0, 1, 0, 0.5, 1,
      // Right
      0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1,
      // Back
      0, 0, 1, 0, 0.5, 1,
      // Left
      0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1,
      // Bottom
      0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1,
    ]);

    // Create geometry
    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      normal: { size: 3, data: normals },
      uv: { size: 2, data: uvs },
    });

    // Create program
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uHueShift: { value: hueShift },
        uColorFrequency: { value: colorFrequency },
        uNoise: { value: noise },
        uGlow: { value: glow },
      },
    });

    // Create mesh
    const prism = new Mesh(gl, { geometry, program });
    prism.setParent(scene);
    prism.scale.set(scale, scale, scale);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Update time uniform
      program.uniforms.uTime.value += timeScale * 0.01;

      // Rotate animation
      if (animationType === "rotate") {
        prism.rotation.y += timeScale * 0.01;
        prism.rotation.x += timeScale * 0.005;
      }

      // Render
      renderer.render({ scene, camera });
    };

    animate();

    // Handle resize
    const handleResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.perspective({ aspect: container.clientWidth / container.clientHeight });
    };

    // If container is hidden or has zero size at init, wait for a size
    const ensureSized = () => {
      if (container.clientWidth > 0 && container.clientHeight > 0) {
        handleResize();
        return true;
      }
      return false;
    };

    // Try immediately, then observe until it has size
    let ro: ResizeObserver | undefined;
    if (!ensureSized()) {
      ro = new ResizeObserver(() => {
        if (ensureSized() && ro) ro.disconnect();
      });
      ro.observe(container);
    } else {
      handleResize();
    }

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (ro) ro.disconnect();
      container.removeChild(gl.canvas);
    };
    } catch (error) {
      console.error('Failed to initialize Prism WebGL:', error);
      // Fallback: create a simple colored background
      container.style.background = 'linear-gradient(45deg, #f97316, #10b981, #8b5cf6)';
    }
  }, [animationType, timeScale, height, baseWidth, scale, hueShift, colorFrequency, noise, glow]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {/* Fallback background in case WebGL fails */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-green-500 to-purple-600 animate-pulse" />
    </div>
  );
}