"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/* ===== TYPES ===== */

type Skill = {
  name: string;
  icon: ReactNode;
};

type SkillGroupProps = {
  title: string;
  skills: Skill[];
};

/* ===== COMPONENT ===== */

export default function SkillGroup({
  title,
  skills,
}: SkillGroupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      className="
        p-8 rounded-2xl
        bg-gray-900/70 backdrop-blur-md
        border border-gray-800
        hover:border-indigo-400/60
        transition-all
      "
    >
      <h3 className="text-2xl font-bold text-indigo-400 mb-8">
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {skills.map((skill, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.08, y: -5 }}
            className="
              flex items-center gap-4
              p-4 rounded-xl
              bg-black/40
              border border-gray-800
              hover:border-indigo-400
              transition
            "
          >
            <span className="text-3xl text-indigo-400">
              {skill.icon}
            </span>

            <span className="text-gray-200 font-medium">
              {skill.name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}