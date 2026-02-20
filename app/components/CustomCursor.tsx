"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 }); // fix #3: start offscreen
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false); // hide until first mouse move

  useEffect(() => {
    // fix #4: don't run on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const addHover = () => setHovering(true);
    const removeHover = () => setHovering(false);

    // fix #2: use event delegation on document instead of per-element listeners
    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button")) addHover();
    };
    const handleMouseOut = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button")) removeHover();
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", handleMouseOver);  // fix #1 & #2
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", handleMouseOver); // fix #1: proper cleanup
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []); // visible in dep array not needed since we use the setter pattern

  if (!visible) return null;

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