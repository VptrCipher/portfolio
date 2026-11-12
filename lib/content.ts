/**
 * Central, typed content. Every claim here is grounded in PRODUCT.md and
 * PROJECT-REPO-AUDIT.md (public repositories). Do not add employment, awards,
 * certificates, metrics, an email address or a resume unless they are real.
 */
export interface Project {
  id: string;
  slug?: string;
  name: string;
  kind: string;
  status: string;
  featured: boolean;
  summary: string;
  repo: string;
  stack: string[];
  contribution: string;
  image?: string;
  accent: 'cyan' | 'violet';
  /** One-word status for the project rows; must agree with `status`. */
  tag: string;
}

export const person = {
  name: 'Noah Jonathan J.',
  short: 'Noah',
  location: 'Bengaluru, India',
  role: 'AI & Data Science student · software builder',
  headline: ['The Digital', 'Architect.'],
  lede: 'I build intelligent software and turn ambitious ideas into things you can use. Learning in public, one working project at a time.',
  github: 'https://github.com/VptrCipher',
  linkedin: 'https://www.linkedin.com/in/noah-jonathan-ja050080/',
} as const;

export const projects: Project[] = [
  {
    id: '01', slug: 'sayit', name: 'SayIt', kind: 'AI developer tool · Desktop application',
    status: 'Public Windows x64 and Linux x86_64 releases; macOS distribution deferred.',
    featured: true, accent: 'cyan', tag: 'Released',
    summary: 'A local-first voice workspace: push-to-talk capture and on-device speech recognition in one quiet desktop flow.',
    repo: 'https://github.com/VptrCipher/SayIt', stack: ['Python', 'PySide6', 'Sherpa-ONNX', 'Briefcase'],
    contribution: 'Co-built. See the repository for authorship and history.', image: '/projects/sayit/sayit-home-idle.png',
  },
  {
    id: '02', slug: 'shadowsync', name: 'ShadowSync AI', kind: 'Procurement intelligence · Forked prototype',
    status: 'Prototype. No deployment, savings or impact is claimed.',
    featured: true, accent: 'violet', tag: 'Prototype',
    summary: 'Compares transactions with procurement records to surface unmatched purchases, with an explainable anomaly trace.',
    repo: 'https://github.com/VptrCipher/Shadow-Supply-Chain', stack: ['FastAPI', 'SQLAlchemy', 'scikit-learn', 'Groq / Cohere (optional)'],
    contribution: 'Forked repository; see the source history for authorship.',
  },
  { id: '03', name: 'Agusta', kind: 'Security operations · Active prototype', status: 'Under development.', featured: false, accent: 'cyan', tag: 'Active', summary: 'A security operations dashboard.', repo: 'https://github.com/VptrCipher/Agusta', stack: ['Django', 'React', 'PostgreSQL'], contribution: 'See repository.' },
  { id: '04', name: 'ImaginePRO', kind: 'AI video workspace · Work in progress', status: 'Work in progress.', featured: false, accent: 'violet', tag: 'In progress', summary: 'A local-first video editing workspace exploring AI-assisted creation.', repo: 'https://github.com/VptrCipher/ImaginePRO_', stack: ['Python', 'React'], contribution: 'See repository.' },
  { id: '05', name: 'Deadline-Radr', kind: 'Web app · Experiment', status: 'Archive.', featured: false, accent: 'cyan', tag: 'Archive', summary: 'A browser assignment tracker with an animated canvas.', repo: 'https://github.com/VptrCipher/Deadline-Radr', stack: ['JavaScript', 'Canvas', 'GSAP'], contribution: 'See repository.' },
];

export interface SkillNode { id: string; label: string; group: string; evidence: string }
export const skillGroups = ['Languages', 'AI & data', 'Application engineering', 'Tooling'] as const;
export const skills: SkillNode[] = [
  { id: 'python', label: 'Python', group: 'Languages', evidence: 'SayIt, ShadowSync AI, ImaginePRO' },
  { id: 'js', label: 'JavaScript', group: 'Languages', evidence: 'Deadline-Radr' },
  { id: 'ts', label: 'TypeScript', group: 'Languages', evidence: 'This portfolio' },
  { id: 'speech', label: 'On-device speech recognition', group: 'AI & data', evidence: 'SayIt (Sherpa-ONNX)' },
  { id: 'anomaly', label: 'Anomaly scoring', group: 'AI & data', evidence: 'ShadowSync AI (scikit-learn)' },
  { id: 'llm', label: 'LLM API integration', group: 'AI & data', evidence: 'ShadowSync AI (optional Groq / Cohere)' },
  { id: 'react', label: 'React', group: 'Application engineering', evidence: 'Agusta, ImaginePRO, this portfolio' },
  { id: 'next', label: 'Next.js', group: 'Application engineering', evidence: 'This portfolio' },
  { id: 'fastapi', label: 'FastAPI', group: 'Application engineering', evidence: 'ShadowSync AI' },
  { id: 'django', label: 'Django', group: 'Application engineering', evidence: 'Agusta' },
  { id: 'pyside', label: 'PySide6', group: 'Application engineering', evidence: 'SayIt' },
  { id: 'three', label: 'Three.js / WebGL', group: 'Tooling', evidence: 'This portfolio' },
  { id: 'gsap', label: 'GSAP', group: 'Tooling', evidence: 'Deadline-Radr, this portfolio' },
  { id: 'packaging', label: 'Desktop packaging', group: 'Tooling', evidence: 'SayIt (Briefcase)' },
];

export const education = {
  degree: 'B.E. Artificial Intelligence & Data Science',
  school: 'CMR Institute of Technology',
  university: 'Visvesvaraya Technological University',
  place: 'Bengaluru, India',
  status: 'In progress',
} as const;

export const about = {
  paragraphs: [
    'I am an AI & Data Science student at CMR Institute of Technology, drawn to the space between intelligent systems and careful product engineering.',
    'I learn by making tools that solve real problems, then reading the result honestly: what works, what is a prototype, what is still unknown.',
  ],
  principles: [
    ['Evidence first', 'Every project here links to its public repository. Status is stated as it is.'],
    ['Local-first by taste', 'I keep gravitating to software that respects the person using it.'],
    ['Learning in public', 'Experiments stay visible, including the unfinished ones.'],
  ],
} as const;

export const nav = [['Work', '#work'], ['About', '#about'], ['Toolkit', '#toolkit'], ['Path', '#path'], ['Contact', '#contact']] as const;

/**
 * Optional portrait for the hero. None was supplied, so none is shown and none is generated.
 * To enable: put a photo you own in public/ and set { src: '/portrait.png', alt: 'Noah Jonathan J.' }.
 */
export const portrait: { src: string; alt: string } | null = null;

/** Hero figures. Each is a count of what this site lists, not a performance or impact metric. */
export const heroStats = [
  [String(projects.length).padStart(2, '0'), 'Projects, each linked to a public repository'],
  ['02', 'Desktop release targets for SayIt (Windows, Linux)'],
  [String(skills.length), 'Tools listed, each tied to a project'],
] as const;

/** About copy for the poster layout; phrases in `marks` get the red highlight. */
export const story = {
  text: 'I am an AI & Data Science student in Bengaluru, drawn to the space between intelligent systems and careful product engineering. I learn by building tools that solve real problems, then reading the result honestly: what works, what is a prototype, and what is still unknown.',
  marks: ['intelligent systems', 'careful product engineering', 'reading the result honestly'],
} as const;
