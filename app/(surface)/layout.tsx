import React from 'react';

export default function SurfaceGroupLayout({ children }: { children: React.ReactNode }) {
  return <div data-route-group="surface">{children}</div>;
}
