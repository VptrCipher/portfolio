import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const cases = {
  sayit: {
    name: 'SayIt', number: '01', type: 'AI DEVELOPER TOOL · DESKTOP APP', title: 'A quieter way to get words out.',
    summary: 'SayIt is a local-first dictation and voice-productivity workspace. It brings push-to-talk capture and on-device speech recognition into a desktop flow, with optional online enhancement capabilities documented by the project.',
    status: 'Public Windows x64 and Linux x86_64 releases. macOS packaging exists in CI; public distribution is deferred.',
    repo: 'https://github.com/VptrCipher/SayIt',
    stack: ['Python', 'PySide6', 'Sherpa-ONNX', 'Briefcase'],
    challenge: 'Speech tools are easy to try and harder to trust. This project explores a desktop workflow where recording, model choice, and transcript handling live in one place, with local recognition at its core.',
    approach: 'The codebase separates the desktop UI from speech-recognition backends and model/runtime configuration. That makes the user flow legible while keeping hardware and model capabilities explicit.',
    features: ['Push-to-talk recording workflow', 'On-device speech recognition with selectable models', 'Model loading and persistence', 'Transcript history and privacy controls', 'Cross-platform capability abstraction'],
    images: ['sayit-home-idle.png', 'sayit-recording.png', 'sayit-result.png'],
    caption: 'Repository screenshots · SayIt desktop UI',
  },
  shadowsync: {
    name: 'ShadowSync AI', number: '02', type: 'PROCUREMENT INTELLIGENCE · FORKED PROTOTYPE', title: 'Make the invisible path visible.',
    summary: 'A prototype that compares financial transactions with procurement records to surface unmatched purchases for review. The project explores anomaly scoring and explainable decision traces around off-workflow spend.',
    status: 'Prototype / forked repository. No deployment, measured savings, or verified environmental impact is claimed.',
    repo: 'https://github.com/VptrCipher/Shadow-Supply-Chain',
    stack: ['FastAPI', 'SQLAlchemy', 'scikit-learn', 'Groq / Cohere integrations'],
    challenge: 'A purchase can be financially real yet invisible to the expected procurement workflow. Detecting that gap requires comparing transactions with purchasing context, then showing people why something was flagged.',
    approach: 'The repository combines procurement-record matching with a multi-feature anomaly score and a traceable result category. AI copilot integrations are present in code, but the output remains a review aid in a prototype—not a decision authority.',
    features: ['Transaction matching against procurement records', 'Unmatched purchase flagging', 'Multi-feature anomaly scoring', 'Vendor and category context', 'Prototype AI copilot integration'],
    images: [],
    caption: 'Conceptual system map · constructed for this portfolio; not an application screenshot',
  },
} as const;

export function generateStaticParams() { return Object.keys(cases).map((slug) => ({ slug })); }
export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in cases)) notFound();
  const project = cases[slug as keyof typeof cases];
  return <article className={`case-study case-study--${slug}`}>
    <div className="case-top"><Link href="/#work">← SELECTED WORK</Link><span>{project.number} / 02</span></div>
    <header className="case-hero"><p className="eyebrow">{project.type}</p><h1>{project.title}</h1><p className="case-summary">{project.summary}</p><a href={project.repo} target="_blank" rel="noreferrer" className="button button--light">View public repository ↗</a></header>
    {slug === 'sayit' ? <div className="case-media case-media--sayit"><Image src={`/projects/sayit/${project.images[0]}`} alt="SayIt home screen" fill priority sizes="100vw"/><span>{project.caption}</span></div> : <div className="case-media case-media--shadow"><div className="case-flow"><div className="flow-card"><span>01 · INPUT</span><b>Financial<br/>transaction</b><i>payment record</i></div><div className="flow-link">···········<span>›</span></div><div className="flow-card"><span>02 · MATCH</span><b>Procurement<br/>records</b><i>vendor · item · PO</i></div><div className="flow-link">···········<span>›</span></div><div className="flow-card flow-card--flag"><span>03 · REVIEW</span><b>Anomaly<br/>trace</b><i>human review</i></div></div><span>{project.caption}</span></div>}
    <div className="case-meta"><div><span>STATUS</span><p>{project.status}</p></div><div><span>CONTRIBUTION</span><p>Co-built / collaborative work. See the linked repository for authorship and source history.</p></div><div><span>TOOLS</span><p>{project.stack.join(' · ')}</p></div></div>
    <section className="case-story"><div className="case-aside"><span>01 / CONTEXT</span><span>THE QUESTION</span></div><div><h2>{slug === 'sayit' ? 'Voice can be a fast path into the tools we already use.' : 'What if the transaction never made it into the workflow?'}</h2><p>{project.challenge}</p></div></section>
    <section className="case-story"><div className="case-aside"><span>02 / APPROACH</span><span>HOW IT WORKS</span></div><div><h2>Make the system understandable.</h2><p>{project.approach}</p><ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div></section>
    {slug === 'sayit' && <section className="case-gallery"><p className="case-gallery-label">THROUGH THE APP <span>02–03 / CAPTURE → RESULT</span></p>{project.images.slice(1).map((image, i) => <figure key={image}><Image src={`/projects/sayit/${image}`} alt={i === 0 ? 'SayIt recording screen' : 'SayIt transcript result screen'} width={1500} height={950} sizes="(max-width: 760px) 100vw, 70vw"/><figcaption>{i === 0 ? 'Recording state' : 'Transcript result'} <span>REPOSITORY SCREENSHOT</span></figcaption></figure>)}</section>}
    <section className="case-status"><span>CURRENT STATUS</span><p>{project.status}</p><a href={project.repo} target="_blank" rel="noreferrer">Explore the source ↗</a></section>
    <footer className="case-next"><span>KEEP EXPLORING</span><Link href={slug === 'sayit' ? '/work/shadowsync' : '/work/sayit'}>Next case study <span>↗</span></Link><Link href="/#work">All selected work <span>↗</span></Link></footer>
  </article>;
}
