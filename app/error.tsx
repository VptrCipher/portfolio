'use client';

import React from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section" role="alert">
      <div className="container">
        <p className="eyebrow">SURFACE ERROR BOUNDARY</p>
        <h2>Unable to render surface section</h2>
        <p className="muted">{error.message || 'An unexpected rendering error occurred.'}</p>
        <button type="button" className="btn btn-primary" onClick={() => reset()}>
          Retry render
        </button>
      </div>
    </section>
  );
}
