"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const addHover = () => setHovering(true);
    const removeHover = () => setHovering(false);

    window.addEventListener("mousemove", move);

    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        animate={{
          x: position.x - 8,
          y: position.y - 8,
          scale: hovering ? 1.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className="
        fixed top-0 left-0
        w-4 h-4
        rounded-full
        bg-gradient-to-r
        from-indigo-400 via-cyan-400 to-purple-400
        pointer-events-none
        z-[9999]
        mix-blend-difference
      "
      />

      {/* Glow Trail */}
      <motion.div
        animate={{
          x: position.x - 20,
          y: position.y - 20,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="
        fixed top-0 left-0
        w-10 h-10
        rounded-full
        bg-indigo-500/20
        blur-xl
        pointer-events-none
        z-[9998]
      "
      />
    </>
  );
}