'use client';

import dynamic from 'next/dynamic';

const SignalField = dynamic(() => import('./signal-field').then((module) => module.SignalField), {
  ssr: false,
  loading: () => <div className="signal-field" aria-hidden="true"><div className="signal-field__fallback" /></div>,
});

export function LazySignalField() {
  return <SignalField />;
}
