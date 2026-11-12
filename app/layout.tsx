import React from 'react';
import '@fontsource/anton/400.css';
import '@fontsource-variable/manrope';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './globals.css';
import './beyond.css';
import { Runtime } from '../components/xp/runtime';
import { Loader } from '../components/xp/loader';
import { SiteNav } from '../components/xp/chrome';
import { AgentCursors, YouTag } from '../components/xp/cursors';

export const metadata = {
  title: 'Noah Jonathan J. — The Digital Architect',
  description: 'Interactive portfolio of Noah Jonathan J., an AI & Data Science student building intelligent software. Projects linked to public repositories.',
  openGraph: { title: 'Noah Jonathan J. — The Digital Architect', description: 'AI, software engineering and creative technology.', type: 'website' },
};

export const viewport = { themeColor: '#070505' };

// Runs before first paint so returning visitors never see the intro.
// The intro only plays on the home page; deep links to case studies never see it.
const seenScript = `try{if(location.pathname!=='/'||localStorage.getItem('nj-xp-seen-v2')==='1')document.documentElement.dataset.seen='1'}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-surface-mode="experience" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: seenScript }} /></head>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Runtime />
        <Loader />
        <SiteNav />
        <AgentCursors />
        <YouTag />
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
