import React from 'react';

export interface DatasheetRootProps {
  children: React.ReactNode;
  ariaLabel?: string;
}

function Root({ children, ariaLabel = 'Technical specification summary' }: DatasheetRootProps) {
  return (
    <aside className="datasheet-card" aria-label={ariaLabel}>
      {children}
    </aside>
  );
}

function Header({ eyebrow }: { eyebrow: string }) {
  return <p className="eyebrow">{eyebrow}</p>;
}

function SpecList({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <dl>
      {items.map((item) => (
        <React.Fragment key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

function Diagram({ label }: { label: string }) {
  return (
    <svg
      id="svg-system-diagram"
      viewBox="0 0 360 76"
      width="100%"
      height="76"
      role="img"
      aria-label={label}
      style={{ marginTop: '1rem', display: 'block', maxWidth: '460px' }}
    >
      <rect x="2" y="14" width="102" height="48" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="53" y="42" textAnchor="middle" fontSize="11" fill="currentColor">SayIt</text>
      <line x1="104" y1="38" x2="129" y2="38" stroke="currentColor" strokeWidth="1.5" />
      <rect x="129" y="14" width="102" height="48" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="180" y="42" textAnchor="middle" fontSize="11" fill="currentColor">ShadowSync</text>
      <line x1="231" y1="38" x2="256" y2="38" stroke="currentColor" strokeWidth="1.5" />
      <rect x="256" y="14" width="102" height="48" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="307" y="42" textAnchor="middle" fontSize="11" fill="currentColor">Agusta</text>
    </svg>
  );
}

export const DatasheetPanel = {
  Root,
  Header,
  SpecList,
  Diagram,
};
