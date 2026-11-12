'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function SignalField() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = host.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
    camera.position.set(0, 0, 10);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(root.clientWidth, root.clientHeight);
    renderer.setClearColor(0x000000, 0);
    root.appendChild(renderer.domElement);

    const sculpture = new THREE.Group();
    scene.add(sculpture);
    const cols = 54;
    const rows = 28;
    const clothGeometry = new THREE.PlaneGeometry(6.5, 3.7, cols, rows);
    const clothMaterial = new THREE.MeshPhysicalMaterial({
      color: '#657dcb', emissive: '#202d62', emissiveIntensity: 0.42,
      side: THREE.DoubleSide, metalness: 0.36, roughness: 0.28,
      transparent: true, opacity: 0.34, clearcoat: 0.9, clearcoatRoughness: 0.24,
    });
    const cloth = new THREE.Mesh(clothGeometry, clothMaterial);
    cloth.rotation.set(-0.42, -0.24, 0.13);
    cloth.position.set(0, 0.02, -0.15);
    sculpture.add(cloth);
    const clothPositions = clothGeometry.attributes.position.array as Float32Array;
    const linePairs: number[] = [];
    const stride = cols + 1;
    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        const at = row * stride + col;
        if (col < cols) linePairs.push(at, at + 1);
        if (row < rows) linePairs.push(at, at + stride);
      }
    }
    const latticePositions = new Float32Array(linePairs.length * 3);
    const latticeGeometry = new THREE.BufferGeometry();
    latticeGeometry.setAttribute('position', new THREE.BufferAttribute(latticePositions, 3));
    const lattice = new THREE.LineSegments(latticeGeometry, new THREE.LineBasicMaterial({
      color: '#9dd4c4', transparent: true, opacity: 0.24, blending: THREE.AdditiveBlending,
    }));
    lattice.rotation.copy(cloth.rotation);
    lattice.position.copy(cloth.position);
    sculpture.add(lattice);
    const count = 9;
    const nodes: THREE.Mesh[] = [];
    const nodeGeometry = new THREE.IcosahedronGeometry(0.075, 2);
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const y = (t - 0.5) * 4.4;
      const x = Math.sin(t * Math.PI * 2.35) * 1.05;
      const z = Math.cos(t * Math.PI * 2.35) * 0.85;
      const material = new THREE.MeshStandardMaterial({
        color: i === 4 ? '#ff744d' : i % 3 === 0 ? '#a6d7c8' : '#8aa4ff',
        emissive: i === 4 ? '#5b2118' : '#15254d',
        roughness: 0.26,
        metalness: 0.58,
      });
      const node = new THREE.Mesh(nodeGeometry, material);
      node.position.set(x, y, z);
      node.scale.setScalar(i === 4 ? 1.8 : i % 2 === 0 ? 1.15 : 0.82);
      sculpture.add(node);
      nodes.push(node);
      if (i > 0) {
        const prev = nodes[i - 1].position;
        const points = [prev.clone(), node.position.clone()];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        sculpture.add(new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: i === 4 ? '#ff967d' : '#536ba8', transparent: true, opacity: 0.7 })));
      }
    }
    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(2.15, 0.009, 8, 180),
      new THREE.MeshBasicMaterial({ color: '#a6d7c8', transparent: true, opacity: 0.58 }),
    );
    orbit.rotation.set(0.88, 0.32, -0.48);
    sculpture.add(orbit);
    const light = new THREE.PointLight('#89a6ff', 24, 18);
    light.position.set(-2.8, 2.4, 4);
    scene.add(light);
    scene.add(new THREE.AmbientLight('#ffffff', 1.3));
    let frame = 0;
    let raf = 0;
    let pointerX = 0;
    let pointerY = 0;
    const onPointer = (event: PointerEvent) => {
      const box = root.getBoundingClientRect();
      pointerX = ((event.clientX - box.left) / box.width - 0.5) * 0.28;
      pointerY = ((event.clientY - box.top) / box.height - 0.5) * 0.2;
    };
    const resize = () => {
      const w = root.clientWidth || 1;
      const h = root.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    root.addEventListener('pointermove', onPointer, { passive: true });
    const draw = () => {
      frame += 1;
      const t = reduced ? 0.8 : frame * 0.008;
      for (let i = 0; i < clothPositions.length / 3; i++) {
        const x = (i % stride) / cols - 0.5;
        const y = Math.floor(i / stride) / rows - 0.5;
        const dx = x - pointerX * 1.15;
        const dy = y - pointerY * 1.15;
        const radius = Math.sqrt(dx * dx + dy * dy);
        const pointerRipple = Math.sin(radius * 25 - t * 1.6) * Math.exp(-radius * 7) * 0.15;
        const wave = Math.sin(x * 11 + t) * 0.19 + Math.sin(y * 9 - t * 0.7) * 0.1 + Math.cos((x + y) * 12 - t * 0.65) * 0.11;
        clothPositions[i * 3 + 2] = wave + (reduced ? 0 : pointerRipple);
      }
      clothGeometry.attributes.position.needsUpdate = true;
      clothGeometry.computeVertexNormals();
      for (let i = 0; i < linePairs.length; i++) {
        const source = linePairs[i] * 3;
        const target = i * 3;
        latticePositions[target] = clothPositions[source];
        latticePositions[target + 1] = clothPositions[source + 1];
        latticePositions[target + 2] = clothPositions[source + 2];
      }
      latticeGeometry.attributes.position.needsUpdate = true;
      sculpture.rotation.y += reduced ? 0 : 0.0015;
      sculpture.rotation.x += (pointerY - sculpture.rotation.x) * 0.018;
      sculpture.rotation.z += (pointerX - sculpture.rotation.z) * 0.018;
      nodes.forEach((node, i) => {
        if (!reduced) node.scale.setScalar((i === 4 ? 1.8 : i % 2 === 0 ? 1.15 : 0.82) * (1 + Math.sin(frame * 0.02 + i) * 0.04));
      });
      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting && !reduced) draw();
    }, { threshold: 0.05 });
    visibility.observe(root);
    if (reduced) draw();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      visibility.disconnect();
      root.removeEventListener('pointermove', onPointer);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
          obj.geometry.dispose();
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          materials.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return <div className="signal-field" ref={host} aria-hidden="true"><div className="signal-field__fallback" /></div>;
}

export default SignalField;
