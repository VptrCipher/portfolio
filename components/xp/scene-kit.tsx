'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { tiers, useStore, type Tier } from '../../lib/store';

const GrainVignette = {
  uniforms: { tDiffuse: { value: null as THREE.Texture | null }, uTime: { value: 0 }, uGrain: { value: 0.05 }, uVignette: { value: 0.55 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uTime; uniform float uGrain; uniform float uVignette; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      float v = smoothstep(0.95, 0.25, distance(vUv, vec2(0.5)));
      c.rgb *= mix(1.0 - uVignette, 1.0, v);
      c.rgb += (h(vUv * 900.0 + uTime) - 0.5) * uGrain;
      gl_FragColor = c;
    }`,
};

/**
 * Custom composer (three/examples) instead of the postprocessing package, which
 * declares a peer range that excludes the repo-pinned three. Bloom, grain, vignette.
 */
export function Effects({ tier }: { tier: Tier }) {
  const { gl, scene, camera, size } = useThree();
  const cfg = tiers[tier];
  const composer = useRef<EffectComposer | null>(null);
  const grain = useRef<ShaderPass | null>(null);

  useEffect(() => {
    if (!cfg.bloom && !cfg.grain) { composer.current = null; return; }
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    if (cfg.bloom) c.addPass(new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 0.26, 0.5, 0.9));
    if (cfg.grain) { const g = new ShaderPass(GrainVignette); grain.current = g; c.addPass(g); }
    c.addPass(new OutputPass());
    composer.current = c;
    return () => { c.dispose(); composer.current = null; grain.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera, cfg.bloom, cfg.grain]);

  useEffect(() => { composer.current?.setSize(size.width, size.height); }, [size.width, size.height]);

  useFrame((state, dt) => {
    const c = composer.current;
    if (!c) { gl.render(scene, camera); return; }
    if (grain.current) grain.current.uniforms.uTime.value = state.clock.elapsedTime * 60;
    c.render(dt);
  }, 1);
  return null;
}

/**
 * Measures real frame times inside the scene and moves between tiers with hysteresis:
 * two slow windows to step down, five fast windows plus a cool-down to step up.
 * Does nothing when the visitor chose a fixed tier.
 */
export function TierController() {
  const frames = useRef(0);
  const acc = useRef(0);
  const slow = useRef(0);
  const fast = useRef(0);
  const cooldown = useRef(0);
  useFrame((_, dt) => {
    const s = useStore.getState();
    if (dt > 0.25) return; // tab switch or stall; not a rendering cost
    acc.current += dt; frames.current++;
    if (acc.current < 1) return;
    const fps = frames.current / acc.current;
    frames.current = 0; acc.current = 0;
    s.setFps(Math.round(fps));
    if (s.setting !== 'auto') return;
    cooldown.current = Math.max(0, cooldown.current - 1);
    if (fps < 40) { slow.current++; fast.current = 0; } else if (fps > 56) { fast.current++; slow.current = 0; } else { slow.current = 0; fast.current = 0; }
    const order: Tier[] = ['eco', 'balanced', 'ultra'];
    const i = order.indexOf(s.tier);
    if (slow.current >= 2 && i > 0) { s.setTier(order[i - 1]); slow.current = 0; cooldown.current = 8; }
    else if (fast.current >= 5 && cooldown.current === 0 && i < order.length - 1) { s.setTier(order[i + 1]); fast.current = 0; cooldown.current = 8; }
  });
  return null;
}

/** Resolves manual override vs automatic tier. */
export function useActiveTier(): Tier {
  const tier = useStore((s) => s.tier);
  const setting = useStore((s) => s.setting);
  return setting === 'auto' ? tier : setting;
}

interface SceneProps { children: ReactNode; active: boolean; camera?: [number, number, number]; fov?: number; control?: boolean }

/** A canvas that renders only while `active`, with tier-driven pixel ratio and effects. */
export function Scene({ children, active, camera = [0, 0, 6], fov = 45, control = true }: SceneProps) {
  const tier = useActiveTier();
  const cfg = tiers[tier];
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={cfg.dpr}
      camera={{ position: camera, fov }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
    >
      {children}
      {control && <TierController />}
      <Effects tier={tier} />
    </Canvas>
  );
}
