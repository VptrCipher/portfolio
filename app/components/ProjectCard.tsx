"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Props {
  title: string;
  description: string;
  image: string;
  tech: string[];
  live?: string;
  github?: string;
}

export default function ProjectCard({
  title,
  description,
  image,
  tech,
  live,
  github,
}: Props) {
  return (
    <motion.div
      whileHover={{ y: -12 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="
        group relative overflow-hidden
        rounded-2xl
        border border-gray-800
        bg-gray-900/70 backdrop-blur-md
        hover:border-indigo-400/60
        transition-all
      "
    >
      {/* IMAGE */}
      <div className="relative h-60 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition duration-700"
        />

        {/* overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="p-6 space-y-4">

        <h3 className="text-2xl font-bold">{title}</h3>

        <p className="text-gray-400">{description}</p>

        {/* TECH STACK */}
        <div className="flex flex-wrap gap-2">
          {tech.map((t) => (
            <span
              key={t}
              className="
                text-xs px-3 py-1 rounded-full
                bg-gray-800 text-gray-300
              "
            >
              {t}
            </span>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 pt-2">

          {live && (
            <a
              href={live}
              target="_blank"
              className="
                px-4 py-2 rounded-lg
                bg-indigo-500 hover:bg-indigo-400
                text-white text-sm
                transition
              "
            >
              Live Demo
            </a>
          )}

          {github && (
            <a
              href={github}
              target="_blank"
              className="
                px-4 py-2 rounded-lg
                border border-gray-600
                hover:border-white
                text-sm transition
              "
            >
              GitHub
            </a>
          )}

        </div>
      </div>
    </motion.div>
  );
}