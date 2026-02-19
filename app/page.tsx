"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import ProjectCard from "./components/ProjectCard";
import {
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaServer
} from "react-icons/fa";

import {
  SiJavascript,
  SiC,
  SiCplusplus,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiGit,
} from "react-icons/si";

import { FaJava } from "react-icons/fa";

import SkillGroup from "./components/SkillGroup";

export default function Home() {
  const [active, setActive] = useState("home");
 useEffect(() => {
  const handleScroll = () => {
    const sections = document.querySelectorAll<HTMLElement>("section[id]");

    let currentSection = "home";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop - sectionHeight / 3) {
        const id = section.getAttribute("id");
        if (id) currentSection = id;
      }
    });

    // ⭐ FIX FOR LAST SECTION (CONTACT)
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 50
    ) {
      currentSection = "contact";
    }

    setActive(currentSection);
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  // ⭐ CURSOR GLOW LOGIC
const [position, setPosition] = useState({ x: 0, y: 0 });

useEffect(() => {
  const move = (e: MouseEvent) => {
    setPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  window.addEventListener("mousemove", move);

  return () => window.removeEventListener("mousemove", move);
}, []);
  return (
    <main className="relative min-h-[90vh] bg-black text-white pt-24 overflow-hidden">
      
      {/* ===== GLOBAL BACKGROUND EFFECT ===== */}
      <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">

        {/* Gradient Base */}
        <div className="
          absolute inset-0
          bg-gradient-to-b
          from-[#05070f]
          via-[#02030a]
          to-black
        " />

        {/* Aurora Glow 1 */}
        <div className="
          absolute top-[-200px] left-[-200px]
          w-[900px] h-[900px]
          bg-indigo-600/20
          blur-[260px]
          animate-pulse
        "/>

        {/* Aurora Glow 2 */}
        <div className="
          absolute bottom-[-250px] right-[-200px]
          w-[900px] h-[900px]
          bg-cyan-500/20
          blur-[260px]
          animate-pulse
        "/>

        {/* ⭐ TECH GRID OVERLAY */}
        <div
          className="
            absolute inset-0
            bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),
                linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
            bg-[size:60px_60px]
          "
        />

      </div>

      {/* CURSOR GLOW */}
      <div
        className="pointer-events-none fixed w-72 h-72 bg-purple-500 opacity-20 blur-3xl rounded-full"
        style={{
          left: position.x - 150,
          top: position.y - 150,
        }}
      ></div>

      {/* Moving Aurora */}
      <div
        className="
          pointer-events-none fixed inset-0 -z-10
          opacity-30
        "
      >
        <div className="
          absolute w-[600px] h-[600px]
          bg-indigo-500
          blur-[220px]
          animate-[float1_18s_ease-in-out_infinite]
        "/>

        <div className="
          absolute w-[500px] h-[500px]
          bg-cyan-400
          blur-[220px]
          animate-[float2_22s_ease-in-out_infinite]
        "/>
      </div>

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[120px] animate-pulse"></div>

        <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-blue-500 opacity-20 blur-[120px] animate-pulse"></div>

      </div>

          {/* CINEMATIC LIGHTING */}
          <div className="pointer-events-none absolute inset-0 -z-10">

            <div className="absolute right-[-200px] top-[-100px]
            w-[800px] h-[800px]
            bg-yellow-500 opacity-20 blur-[220px]"></div>

            <div className="absolute left-[-200px] bottom-[-200px]
            w-[800px] h-[800px]
            bg-purple-600 opacity-20 blur-[220px]"></div>

          </div>


     {/* ================= NAVBAR ================= */}
<nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/40 border-b border-gray-800">
  <div className="flex justify-between items-center px-10 py-5">

    {/* LOGO */}
    <h2 className="text-lg font-semibold tracking-wide">
      Noah Jonathan J
    </h2>

    {/* NAV LINKS */}
    <div className="flex gap-10">

      {["home", "about", "education", "projects", "contact"].map((item) => (
        <a
          key={item}
          href={`#${item}`}
          className={`
            relative pb-2 capitalize
            transition-all duration-300
            ${
              active === item
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }
          `}
        >
          {item}

          {/* GRADIENT UNDERLINE */}
          <span
            className={`
              absolute left-0 bottom-0 h-[2px]
              bg-gradient-to-r
              from-indigo-400 via-cyan-400 to-purple-400
              transition-all duration-300
              ${
                active === item
                  ? "w-full opacity-100"
                  : "w-0 opacity-0"
              }
            `}
          />
        </a>
      ))}

    </div>
  </div>
</nav>

       {/* ================= HERO SECTION ================= */}
<motion.section
  id="home"
  initial={{ opacity: 0, y: 120 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1.1, ease: "easeOut" }}
  className="relative min-h-screen flex items-center justify-center px-6 md:px-10 overflow-hidden"
>

{/* ================= SCENE BACKGROUND ================= */}

{/* Grid */}
<div
  className="
  absolute inset-0 -z-20
  bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),
      linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
  bg-[size:60px_60px]
"
/>

{/* Ambient Lights */}
<div className="absolute -z-20 top-[-300px] left-[-250px]
w-[900px] h-[900px]
bg-indigo-600/20 blur-[240px] rounded-full" />

<div className="absolute -z-20 bottom-[-300px] right-[-250px]
w-[900px] h-[900px]
bg-cyan-500/20 blur-[240px] rounded-full" />

{/* Center cinematic glow */}
<div className="absolute -z-20 left-1/2 -translate-x-1/2
w-[1000px] h-[800px]
bg-gradient-to-r from-indigo-500/20 via-cyan-400/10 to-purple-500/20
blur-[200px]" />


{/* ================= HERO CARD ================= */}
<div
  className="
  relative w-full max-w-[1550px]
  grid md:grid-cols-2 items-center gap-20

  px-16 md:px-24 py-24

  rounded-[42px]
  border border-white/10
  backdrop-blur-2xl
  bg-gradient-to-r
  from-white/[0.06]
  via-white/[0.03]
  to-transparent

  shadow-[0_0_140px_rgba(99,102,241,0.25)]
"
>

{/* Floating Decoration */}
<div className="absolute top-16 right-24 w-5 h-5 bg-indigo-500 rotate-45 animate-pulse" />

<div className="absolute bottom-20 left-24 w-10 h-10 rounded-full
bg-gradient-to-r from-purple-500 to-cyan-400
opacity-70 blur-md animate-bounce" />


{/* ================= LEFT SIDE ================= */}
<div>

<h1 className="text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
  Hi, I’m{" "}
  <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
    Noah Jonathan J
  </span>
</h1>

<TypeAnimation
  sequence={[
    "Frontend Developer",
    1500,
    "React Developer",
    1500,
    "Next.js Developer",
    1500,
    "UI Engineer",
    1500,
  ]}
  wrapper="span"
  speed={50}
  repeat={Infinity}
  className="text-xl text-gray-300 mt-6 block font-medium"
/>

{/* Buttons */}
<div className="mt-10 flex gap-6 flex-wrap">

<a
href="#projects"
className="
px-7 py-3
rounded-lg
font-semibold
bg-gradient-to-r from-indigo-500 to-cyan-400
hover:scale-105
transition
shadow-lg
"
>
View Projects
</a>

<a
href="#contact"
className="
px-7 py-3
rounded-lg
border border-gray-600
hover:border-indigo-400
hover:text-indigo-300
transition
"
>
Contact Me
</a>

</div>

</div>


{/* ================= RIGHT SIDE ================= */}
<motion.div
initial={{ opacity: 0, x: 80 }}
animate={{ opacity: 1, x: 0, y: [0, -18, 0] }}
transition={{
duration: 1,
y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
}}
className="relative flex justify-center items-center"
>

{/* Hero Glow */}
<div className="
absolute w-[700px] h-[700px]
bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500
opacity-25 blur-[220px] rounded-full
" />

{/* Floating Tech Badge */}
<div className="
absolute top-10 right-16
w-32 h-32
rounded-full
border border-indigo-400/30
backdrop-blur-md
flex items-center justify-center
opacity-80
z-0
">
  <span className="text-xs text-indigo-300 tracking-widest">
    DEV • UI • AI
  </span>
</div>

<Image
src="/images/hero.png"
alt="Hero"
width={560}
height={560}
className="
relative z-10
drop-shadow-[0_60px_140px_rgba(0,0,0,0.9)]
"
/>

</motion.div>

</div>
</motion.section>


      
{/* ================= ABOUT SECTION ================= */}
<motion.section
  id="about"
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.9 }}
  viewport={{ once: false, amount: 0.3 }}
  className="relative pt-20 pb-32 px-6 md:px-10 border-t border-gray-800 overflow-hidden"
>

  {/* BACKGROUND LIGHTING */}
  <div className="pointer-events-none absolute inset-0 -z-10">

    <div className="
      absolute right-[-250px] top-[-150px]
      w-[750px] h-[750px]
      bg-indigo-600/20 blur-[220px]
    "/>

    <div className="
      absolute left-[-250px] bottom-[-200px]
      w-[750px] h-[750px]
      bg-cyan-500/20 blur-[220px]
    "/>

  </div>

  <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_1fr_1.4fr] gap-14 items-center">

    {/* ================= LEFT — TEXT ================= */}
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <span className="text-indigo-400 text-sm uppercase tracking-widest">
        Frontend Developer
      </span>

      <div className="mb-8">
        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mt-2">
          About Me
        </h2>

        <div className="w-24 h-1 bg-indigo-400 rounded-full mt-4"/>
      </div>

      <p className="text-gray-300 leading-8 text-lg leading-relaxed max-w-xl">
        I'm a frontend developer focused on crafting modern,
        interactive and high-performance web applications.
        I specialize in clean UI, smooth animations and
        exceptional user experiences using React and Next.js.
      </p>

      <p className="text-gray-400 mt-8 max-w-lg">
        Currently building modern web experiences and exploring
        advanced UI engineering, performance optimization,
        and scalable frontend architecture.
      </p>

      {/* SKILLS */}
      <div className="flex flex-wrap gap-3 mt-8">
        {["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"].map(
          (skill) => (
            <span
              key={skill}
              className="
                px-4 py-2 text-sm
                border border-gray-700
                rounded-full
                text-gray-300
                hover:border-indigo-400
                hover:text-indigo-300
                hover:bg-indigo-500/10
                transition
              "
            >
              {skill}
            </span>
          )
        )}
      </div>
    </motion.div>

    {/* ================= CENTER — PROFILE IMAGE ================= */}
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center relative"
    >

      {/* Glow */}
      <div className="
        absolute w-[380px] h-[380px]
        bg-indigo-500/30 blur-[160px]
        rounded-full
      "/>

      <div className="
        relative p-2
        rounded-2xl
        border border-indigo-400/30
        bg-gradient-to-br from-black via-gray-900 to-black
        shadow-[0_0_80px_rgba(99,102,241,0.25)]
      ">
        <img
          src="/images/profile.png"
          alt="Profile"
          className="w-[280px] h-[280px] object-cover rounded-xl"
        />
      </div>

    </motion.div>

    {/* ================= RIGHT — STATS ================= */}
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >

      {[
        { title: "5+", subtitle: "Projects Built" },
        { title: "3+", subtitle: "Technologies Mastered" },
        { title: "Frontend", subtitle: "Specialization" },
        { title: "Open Source", subtitle: "Learner" },
      ].map((card, i) => (

        <motion.div
          key={i}
          whileHover={{ y: -10, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="
            group relative
            flex flex-col justify-center
            min-h-[200px]
            px-8 py-8
            bg-gray-900/70 backdrop-blur-md
            rounded-2xl
            border border-gray-800
            hover:border-indigo-400/60
            transition-all
            overflow-hidden
          "
        >

          {/* Hover Glow */}
          <div className="
            absolute inset-0 opacity-0
            group-hover:opacity-100
            bg-gradient-to-br
            from-indigo-500/20
            via-cyan-400/10
            to-purple-500/20
            blur-2xl
            transition
          "/>

          <h3 className="text-3xl md:text-4xl font-bold text-indigo-400 leading-tight">
            {card.title}
          </h3>

          <p className="text-gray-400 mt-2 relative">
            {card.subtitle}
          </p>

        </motion.div>

      ))}

    </motion.div>

  </div>
</motion.section>
      
{/* ================= SKILLS SECTION ================= */}
<motion.section
  id="skills"
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: false }}
  transition={{ duration: 0.8 }}
  className="relative py-32 px-6 md:px-10 border-t border-gray-800 overflow-hidden"
>

{/* Background Glow */}
<div className="pointer-events-none absolute inset-0 -z-10">
  <div className="absolute top-[-200px] right-[-200px]
    w-[750px] h-[750px]
    bg-indigo-600/20 blur-[240px]" />

  <div className="absolute bottom-[-250px] left-[-200px]
    w-[750px] h-[750px]
    bg-cyan-500/20 blur-[240px]" />
</div>

<div className="max-w-7xl mx-auto">

{/* Title */}
<div className="mb-16">
  <h2 className="text-5xl font-extrabold">Skills & Expertise</h2>
  <div className="w-24 h-1 bg-indigo-400 mt-4 rounded-full" />
</div>

<div className="grid lg:grid-cols-2 gap-10">

{/* Programming Languages */}
<SkillGroup
  title="Programming Languages"
  skills={[
    { name: "JavaScript", icon: <SiJavascript /> },
      { name: "Java", icon: <FaJava /> },
      { name: "C", icon: <SiC /> },
      { name: "C++", icon: <SiCplusplus /> },
    ]}
  />

 {/* Development Stack */}
  <SkillGroup
    title="Development Stack"
    skills={[
      { name: "React", icon: <SiReact /> },
      { name: "Next.js", icon: <SiNextdotjs /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss /> },
      { name: "Git", icon: <SiGit /> },
    ]}
  />

</div>
</div>
</motion.section>

    {/* ================= GITHUB ACTIVITY ================= */}
<motion.section
  id="github"
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: false, amount: 0.3 }}
  className="relative py-32 px-6 md:px-10 border-t border-gray-800 overflow-hidden"
>

  {/* ===== Background Glow ===== */}
  <div className="pointer-events-none absolute inset-0 -z-10">

    <div className="
      absolute top-[-200px] right-[-200px]
      w-[750px] h-[750px]
      bg-indigo-600/20 blur-[240px]
    "/>

    <div className="
      absolute bottom-[-200px] left-[-200px]
      w-[750px] h-[750px]
      bg-cyan-500/20 blur-[240px]
    "/>

  </div>

  {/* ===== Title ===== */}
  <motion.h2
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false }}
    transition={{ duration: 0.6 }}
    className="text-5xl font-extrabold text-center mb-20"
  >
    GitHub Activity
  </motion.h2>

  <div className="max-w-7xl mx-auto">

    {/* ===== Stats Cards ===== */}
    <div className="grid md:grid-cols-2 gap-10">

      {/* GitHub Stats */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="
          relative group
          bg-gray-900/60
          backdrop-blur-md
          border border-gray-800
          rounded-2xl
          p-6
          overflow-hidden
          hover:border-indigo-400/60
          transition-all duration-300
          hover:scale-[1.02]
        "
      >

        {/* Hover Glow */}
        <div className="
          absolute inset-0 opacity-0
          group-hover:opacity-100
          bg-gradient-to-br
          from-indigo-500/20
          via-cyan-400/10
          to-purple-500/20
          blur-2xl
          transition
        "/>

        <img
           src="https://github-readme-stats-sigma-five.vercel.app/api?username=VptrCipher&show_icons=true&include_all_commits=true&count_private=true&theme=tokyonight&hide_border=true&bg_color=00000000"
          alt="GitHub Stats"
          loading="lazy"
          className="w-full"
        />
      </motion.div>

      {/* GitHub Streak */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ delay: 0.2 }}
        className="
          bg-gray-900/60
          backdrop-blur-md
          border border-gray-800
          rounded-2xl
          p-6
          hover:border-indigo-400/60
          transition-all
          hover:scale-[1.02]
        "
      >
        <img
          src="https://streak-stats.demolab.com?user=VptrCipher&theme=tokyonight&hide_border=true&background=00000000"
          alt="GitHub Streak"
          className="w-full"
        />
      </motion.div>

    </div>

    {/* ===== Contribution Graph ===== */}
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ delay: 0.3 }}
      className="
        mt-16
        bg-gray-900/60
        backdrop-blur-md
        border border-gray-800
        rounded-2xl
        p-6
        hover:border-indigo-400/60
        transition-all
        hover:scale-[1.01]
      "
    >
      <img
        src="https://github-readme-activity-graph.vercel.app/graph?username=VptrCipher&theme=tokyo-night&hide_border=true"
        alt="Contribution Graph"
        className="w-full"
      />
    </motion.div>

  </div>

</motion.section>


{/* ================= EDUCATION SECTION ================= */}
<motion.section
  id="education"
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: false }}
  className="relative py-32 px-6 md:px-10 border-t border-gray-800 overflow-hidden"
>

{/* BACKGROUND GLOW */}
<div className="pointer-events-none absolute inset-0 -z-10">
  <div className="absolute left-[-250px] top-[-200px] w-[700px] h-[700px] bg-indigo-600/20 blur-[220px]" />
  <div className="absolute right-[-250px] bottom-[-200px] w-[700px] h-[700px] bg-cyan-500/20 blur-[220px]" />
</div>

<div className="max-w-6xl mx-auto">

<h2 className="text-5xl font-extrabold mb-20">
  Education
</h2>

{/* TIMELINE */}
<div className="relative border-l border-gray-700 space-y-20">

{/* ================= COLLEGE ================= */}
<div className="relative pl-12 grid md:grid-cols-2 gap-10 items-center">

{/* Timeline Dot */}
<div className="absolute -left-[9px] top-3 w-4 h-4 bg-indigo-400 rounded-full" />

{/* TEXT */}
<div>
  <h3 className="text-2xl font-semibold">
    B.Tech — Artificial Intelligence & Data Science Engineering
  </h3>

  <p className="text-indigo-400 mt-2">
    CMRIT • 2024 — 2028
  </p>

  <p className="text-gray-400 mt-4 leading-relaxed">
    Pursuing a Bachelor of Technology in Artificial Intelligence & Data Science Engineering with a strong focus on software engineering, data structures, machine learning fundamentals, and modern web technologies. Actively building practical projects that integrate AI concepts with scalable frontend development while strengthening problem-solving and system design skills.
  </p>
</div>

{/* IMAGE */}
<div className="relative group">
  <div className="absolute inset-0 bg-indigo-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition" />

  <img
    src="/images/cmrit.png"
    alt="CMRIT"
    className="relative rounded-2xl border border-gray-800 shadow-lg"
  />
</div>

</div>


{/* ================= SCHOOL ================= */}
<div className="relative pl-12 grid md:grid-cols-2 gap-10 items-center">

{/* Timeline Dot */}
<div className="absolute -left-[9px] top-3 w-4 h-4 bg-cyan-400 rounded-full" />

{/* TEXT */}
<div>
  <h3 className="text-2xl font-semibold">
    Higher Secondary Education
  </h3>

  <p className="text-cyan-400 mt-2">
    New Horizon PU College • 2020 — 2022
  </p>

  <p className="text-gray-400 mt-4 leading-relaxed">
    Completed Higher Secondary Education with a focus on Mathematics, Computer Science, and Physics, establishing strong analytical thinking, problem-solving abilities, and foundational programming knowledge that led to pursuing a career in software development.
  </p>
</div>

{/* IMAGE */}
<div className="relative group">
  <div className="absolute inset-0 bg-cyan-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition" />

  <img
    src="/images/school.png"
    alt="School"
    className="relative rounded-2xl border border-gray-800 shadow-lg"
  />
</div>

</div>

</div>
</div>
</motion.section>


      {/* ================= PROJECTS SECTION ================= */}
<motion.section
  id="projects"
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: false, amount: 0.3 }}
  className="relative py-32 px-6 md:px-10 border-t border-gray-800 overflow-hidden"
>

{/* Background Glow */}
<div className="pointer-events-none absolute inset-0 -z-10">

  <div className="absolute right-[-250px] top-[-200px]
    w-[750px] h-[750px]
    bg-indigo-600/20 blur-[240px]" />

  <div className="absolute left-[-250px] bottom-[-200px]
    w-[750px] h-[750px]
    bg-cyan-500/20 blur-[240px]" />

</div>

<div className="max-w-7xl mx-auto">

<h2 className="text-5xl font-extrabold mb-16">
  Featured Projects
</h2>

<div className="grid lg:grid-cols-2 gap-12">

<ProjectCard
  title="Modern Portfolio"
  description="Personal developer portfolio built with Next.js, Framer Motion and Tailwind CSS featuring advanced UI animations."
  image="/images/project1.png"
  tech={["Next.js", "Tailwind", "Framer Motion"]}
  live="#"
  github="#"
/>

<ProjectCard
  title="AI Stock Predictor"
  description="AI-powered stock prediction web application that analyzes historical market trends and predicts stock movements using machine learning models and real-time financial data visualization."
  image="/images/project2.png"
  tech={[
    "JavaScript",
    "Machine Learning",
    "Data Visualization",
    "HTML",
    "CSS"
  ]}
  live="https://vptrcipher.github.io/ai_predictor/"
  github="https://github.com/VptrCipher/ai_predictor"
/>

</div>

</div>
</motion.section>

     {/* ================= CONTACT SECTION ================= */}
<motion.section
  id="contact"
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.9 }}
  viewport={{ once: false, amount: 0.3 }}
  className="relative py-32 px-10 border-t border-gray-800 overflow-hidden"
>

  {/* Background Glow */}
  <div className="pointer-events-none absolute inset-0 -z-10">

    <div className="
      absolute left-[-250px] top-[-150px]
      w-[750px] h-[750px]
      bg-indigo-600/20 blur-[220px]
    "/>

    <div className="
      absolute right-[-250px] bottom-[-150px]
      w-[750px] h-[750px]
      bg-cyan-500/20 blur-[220px]
    "/>

  </div>

  <div className="max-w-5xl mx-auto text-center">

    {/* Heading */}
    <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
      Let’s Build Something Amazing
    </h2>

    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
      I'm open to internships, freelance opportunities and collaborations.
      If you have an idea or opportunity — let's make it real.
    </p>

    {/* CTA BUTTONS */}
    <div className="flex justify-center gap-6 flex-wrap mt-12">

      <a
        href="mailto:noahjonathan656@gmail.com"
        className="
          px-8 py-4
          bg-indigo-500
          rounded-lg
          font-semibold
          hover:bg-indigo-400
          transition
          shadow-lg
        "
      >
        Email Me
      </a>

      <a
        href="https://github.com/VptrCipher"
        target="_blank"
        className="
          px-8 py-4
          border border-gray-700
          rounded-lg
          hover:border-indigo-400
          transition
        "
      >
        GitHub
      </a>

      <a
        href="https://linkedin.com/in/noah-jonathan-ja050080/"
        target="_blank"
        className="
          px-8 py-4
          border border-gray-700
          rounded-lg
          hover:border-indigo-400
          transition
        "
      >
        LinkedIn
      </a>

    </div>

    {/* Footer Signature */}
    <p className="text-gray-500 text-sm mt-20">
      © {new Date().getFullYear()} Noah Jonathan J — Built with Next.js & Tailwind
    </p>

  </div>
</motion.section>

    </main>
  );
}