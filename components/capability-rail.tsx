import React from 'react';

export interface CapabilityItem {
  index: string;
  title: string;
  detail: string;
  status: string;
}

export function CapabilityRail({
  projectName,
  items,
}: {
  projectName: string;
  items: readonly CapabilityItem[];
}) {
  return (
    <section id="capabilities" className="section" aria-labelledby="heading-capabilities">
      <div className="container">
        <p className="eyebrow">02 · VERIFIED CAPABILITIES</p>
        <h2 id="heading-capabilities">What {projectName} includes</h2>
        <ol className="rail-list">
          {items.map((f) => (
            <li key={f.index} className="rail-item">
              <span className="rail-num">
                {f.index} · {f.status.toUpperCase()}
              </span>
              <h3>{f.title}</h3>
              <p className="muted">{f.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
