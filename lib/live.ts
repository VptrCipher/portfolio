/** Mutable per-frame input shared with WebGL scenes. Not React state on purpose: it changes every frame. */
export const live = { px: 0, py: 0, vx: 0, vy: 0, speed: 0, scroll: 0, scrollVel: 0, touch: false };
