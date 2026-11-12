'use client';

import React, { useRef, useState } from 'react';

const TRACES: Record<'cold' | 'warm', string> = {
  cold: "[cold] initializing noah-jonathan-j-selected-work pipeline (concept kinetic-type, rev 1)...\n[cold] stage 01 · SayIt → baseline evaluation (full check)\n[cold] stage 02 · ShadowSync AI → isolated channel initialized\n[cold] stage 03 · Agusta → cryptographic proof sealed to ledger.",
  warm: "[warm] verifying noah-jonathan-j-selected-work state digest (attested session)...\n[warm] stage 01 · SayIt → VERIFIED / CACHE HIT (digest match)\n[warm] stage 02 · ShadowSync AI → VERIFIED / CACHE HIT (zero-copy active)\n[warm] stage 03 · Agusta → verified signature; zero unverified operations.",
};

export function TraceReplayBox() {
  const [mode, setMode] = useState<'cold' | 'warm'>('cold');
  return (
    <div className="terminal-box" role="region" aria-label="Interactive execution trace">
      <div className="terminal-toolbar">
        <span>trace-viewer · noah-jonathan-j-selected-work verification pipeline (rev 1)</span>
        <div className="mode-toggle" role="group" aria-label="Execution trace mode">
          <button
            type="button"
            className="mode-btn"
            id="trace-cold-btn"
            aria-pressed={mode === 'cold'}
            onClick={() => setMode('cold')}
          >
            Cold verification pass
          </button>
          <button
            type="button"
            className="mode-btn"
            id="trace-warm-btn"
            aria-pressed={mode === 'warm'}
            onClick={() => setMode('warm')}
          >
            Verified warm state
          </button>
        </div>
      </div>
      <pre id="trace-output" aria-live="polite" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
        {TRACES[mode]}
      </pre>
    </div>
  );
}

export function QuickActionsMenu({ onOpenDialog }: { onOpenDialog: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="menu-wrap" style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        id="quick-menu-trigger"
        className="btn btn-secondary"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="quick-menu-list"
        onClick={() => setOpen((v) => !v)}
      >
        Inspect Artefacts ▾
      </button>
      {open && (
        <ul
          id="quick-menu-list"
          role="menu"
          aria-label="Specification quick actions"
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            marginTop: '0.25rem',
            listStyle: 'none',
            padding: '0.4rem',
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-sm)',
            minWidth: '13rem',
            zIndex: 30,
          }}
        >
          <li role="none">
            <button
              type="button"
              role="menuitem"
              id="menu-open-dialog"
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start' }}
              onClick={() => {
                setOpen(false);
                onOpenDialog();
              }}
            >
              Open Provenance Modal
            </button>
          </li>
          <li role="none" style={{ marginTop: '0.25rem' }}>
            <a
              role="menuitem"
              href="#docs"
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start' }}
              onClick={() => setOpen(false)}
            >
              Jump to Facts Table
            </a>
          </li>
        </ul>
      )}
    </div>
  );
}

export function SpecDialogModal({
  projectName,
  revision,
  includeDropdown = true,
}: {
  projectName: string;
  revision: number;
  includeDropdown?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openModal = () => {
    if (dialogRef.current && typeof dialogRef.current.showModal === 'function') {
      dialogRef.current.showModal();
    }
  };
  const closeModal = () => {
    if (dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close();
      triggerRef.current?.focus();
    }
  };

  return (
    <>
      <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          ref={triggerRef}
          type="button"
          id="open-spec-dialog"
          className="btn btn-secondary"
          aria-haspopup="dialog"
          aria-controls="spec-dialog"
          onClick={openModal}
        >
          Verify Provenance
        </button>
        {includeDropdown && <QuickActionsMenu onOpenDialog={openModal} />}
      </div>
      <dialog
        ref={dialogRef}
        id="spec-dialog"
        aria-labelledby="spec-dialog-title"
        style={{
          background: 'var(--surface-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          maxWidth: '32rem',
        }}
      >
        <h2 id="spec-dialog-title" className="h3">
          {projectName} — Provenance &amp; DesignSpec (rev {revision})
        </h2>
        <p className="muted">
          Every token and capability on this surface is linked to an auditable source in DESIGN-SPEC.json and PRODUCT.md.
        </p>
        <div className="cta-row">
          <button type="button" id="close-spec-dialog" className="btn btn-primary" onClick={closeModal}>
            Close dialog
          </button>
        </div>
      </dialog>
    </>
  );
}

export function PrimaryCtaForm({ ctaLabel }: { ctaLabel: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState(`Enter a valid work email to ${ctaLabel.toLowerCase()}.`);

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const trimmed = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!valid) {
      setState('error');
      setMessage('Please enter a valid email address (for example, alex@company.dev).');
      return;
    }
    setState('loading');
    setMessage('Recording request...');
    setTimeout(() => {
      setState('success');
      setMessage(`Recorded for ${trimmed} (local prototype confirmation — backend API integration boundary).`);
      setEmail('');
    }, 60);
  };

  return (
    <form id="primary-cta-form" className="signup-form" noValidate onSubmit={handleSubmit}>
      <label htmlFor="cta-email" className="eyebrow" style={{ width: '100%', marginBottom: '0.2rem' }}>
        Work email address
      </label>
      <input
        id="cta-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        className="input-field"
        placeholder="you@company.dev"
        aria-describedby="cta-feedback"
        aria-invalid={state === 'error' ? 'true' : undefined}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button id="cta-submit" type="submit" className="btn btn-primary" disabled={state === 'loading'}>
        {ctaLabel}
      </button>
      <p id="cta-feedback" className="form-feedback muted" role="status" aria-live="polite" data-state={state}>
        {message}
      </p>
    </form>
  );
}
