'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { live } from '../../lib/live';
import { tiers, useStore } from '../../lib/store';
import { Scene, useActiveTier } from './scene-kit';

const vert = /* glsl */ `
uniform float uTime; uniform float uMove; uniform vec2 uPointer; uniform float uEnergy;
varying vec2 vWorld; varying float vH; varying float vDepth;
void main(){
  vec3 p = position;
  // Ridges rise toward the sides; the centre lane stays flat so the type reads.
  float side = smoothstep(2.2, 9.0, abs(p.x));
  float z = p.y + uMove;
  float ridge = (sin(p.x * .9 + z * .45) * .5 + .5) * (sin(z * .23 - p.x * .31) * .5 + .5);
  float h = side * ridge * 1.7;
  // Pointer: a soft swell that follows the cursor across the floor.
  float d = distance(vec2(p.x, p.y), uPointer);
  h += exp(-d * d * .35) * (.35 + uEnergy * 1.1) * sin(d * 2.4 - uTime * 3.0);
  vec4 world = modelMatrix * vec4(p.x, p.y, h, 1.0);
  vWorld = vec2(p.x, z); vH = h;
  vec4 mv = viewMatrix * world; vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

const frag = /* glsl */ `
uniform vec3 uColor; uniform float uTime;
varying vec2 vWorld; varying float vH; varying float vDepth;
float line(vec2 c, float w){ vec2 g = abs(fract(c - .5) - .5) / fwidth(c); return 1.0 - min(min(g.x, g.y) / w, 1.0); }
void main(){
  float l = line(vWorld, 1.0);
  float fog = smoothstep(30.0, 3.0, vDepth);
  float glow = .18 + vH * .35;
  vec3 col = uColor * (l * 1.6 + glow * .12) + vec3(1.0, .55, .45) * l * smoothstep(1.2, 2.6, vH) * .6;
  float a = (l * .7 + .04) * fog;
  gl_FragColor = vec4(col * fog, a);
}`;

function Floor() {
  const tier = useActiveTier();
  const reduced = useStore((s) => s.reduced);
  const seg = tiers[tier].segments;
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uMove: { value: 0 }, uPointer: { value: new THREE.Vector2(0, -9) }, uEnergy: { value: 0 },
    uColor: { value: new THREE.Color('#ff2b2b') },
  }), []);
  useFrame((state, dt) => {
    const u = mat.current?.uniforms; if (!u) return;
    const k = 1 - Math.pow(0.04, dt);
    u.uTime.value = state.clock.elapsedTime;
    // Drift forward; scrolling adds speed in either direction.
    if (!reduced) u.uMove.value += dt * (0.9 + live.scrollVel * 40);
    u.uEnergy.value += (live.speed - u.uEnergy.value) * k;
    // Local +y runs away from the camera: map the pointer onto the floor 6 to 14 units ahead.
    const target = new THREE.Vector2(live.px * 6, -12 + (live.py + 1) * 4);
    (u.uPointer.value as THREE.Vector2).lerp(target, k);
    camera.position.x += (live.px * 0.6 - camera.position.x) * k;
    camera.position.y += (1.35 + live.py * 0.25 - camera.position.y) * k;
    camera.lookAt(0, 0.6, -10);
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -12]}>
      <planeGeometry args={[44, 40, seg, seg]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent depthWrite={false} />
    </mesh>
  );
}

export default function GridScene({ active }: { active: boolean }) {
  return (
    <Scene active={active} camera={[0, 1.35, 6]} fov={60}>
      <Floor />
    </Scene>
  );
}
