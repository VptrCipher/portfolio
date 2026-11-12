import React from 'react';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">404 · ROUTE NOT FOUND</p>
        <h1>Requested specification route does not exist</h1>
        <a className="btn btn-primary" href="/">Return to overview</a>
      </div>
    </section>
  );
}
