import React from 'react';

export interface ProvenanceFactItem {
  id: string;
  statement: string;
  status: string;
  source: string;
}

export function ProvenanceLedger({ facts }: { facts: readonly ProvenanceFactItem[] }) {
  return (
    <section id="docs" className="section" aria-labelledby="heading-spec">
      <div className="container">
        <p className="eyebrow">03 · SPECIFICATION &amp; PROVENANCE LEDGER</p>
        <h2 id="heading-spec">Scope &amp; verification table</h2>
        <div className="table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Statement</th>
                <th scope="col">Status</th>
                <th scope="col">Source</th>
              </tr>
            </thead>
            <tbody>
              {facts.map((f) => (
                <tr key={f.id}>
                  <td><code>{f.id}</code></td>
                  <td>{f.statement}</td>
                  <td>{f.status}</td>
                  <td>{f.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
