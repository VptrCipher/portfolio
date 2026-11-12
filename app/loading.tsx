import React from 'react';

export default function Loading() {
  return (
    <section className="section" role="status" aria-live="polite">
      <div className="container">
        <p className="eyebrow">LOADING SURFACE…</p>
        <p className="muted">Preparing verified specification and interactive trace controls.</p>
      </div>
    </section>
  );
}
