import { create } from 'zustand';

export type Tier = 'ultra' | 'balanced' | 'eco';
export type TierSetting = Tier | 'auto';

interface State {
  tier: Tier;
  setting: TierSetting;
  reduced: boolean;
  webgl: boolean;
  ready: boolean;
  fps: number;
  setTier: (t: Tier) => void;
  setSetting: (s: TierSetting) => void;
  setReduced: (v: boolean) => void;
  setWebgl: (v: boolean) => void;
  setReady: (v: boolean) => void;
  setFps: (v: number) => void;
}

export const useStore = create<State>((set) => ({
  tier: 'balanced', setting: 'auto', reduced: false, webgl: true, ready: false, fps: 0,
  setTier: (tier) => set({ tier }), setSetting: (setting) => set({ setting }), setReduced: (reduced) => set({ reduced }),
  setWebgl: (webgl) => set({ webgl }), setReady: (ready) => set({ ready }), setFps: (fps) => set({ fps }),
}));

export interface TierConfig { dpr: [number, number]; particles: number; bloom: boolean; grain: boolean; segments: number; lines: boolean }
export const tiers: Record<Tier, TierConfig> = {
  ultra: { dpr: [1, 2], particles: 6000, bloom: true, grain: true, segments: 128, lines: true },
  balanced: { dpr: [1, 1.5], particles: 2500, bloom: true, grain: true, segments: 80, lines: true },
  eco: { dpr: [1, 1], particles: 600, bloom: false, grain: false, segments: 40, lines: false },
};

/** Initial guess only; the runtime controller measures real frame times afterwards. */
export function initialTier(): Tier {
  if (typeof navigator === 'undefined') return 'balanced';
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 4;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (nav.connection?.saveData || cores <= 2 || mem <= 2) return 'eco';
  if (coarse || cores <= 4) return 'balanced';
  return 'ultra';
}

export function detectWebgl(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}
