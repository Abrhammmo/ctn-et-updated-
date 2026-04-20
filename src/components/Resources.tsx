import React from "react";
import { motion } from "motion/react";
import { Language } from "../types";

interface ResourcesProps {
  lang: Language;
  t: any;
}

export default function Resources({ lang, t }: ResourcesProps) {
  const headingClass = lang === "am" ? "font-amharic" : "";

  return (
    <motion.section
      key="resources"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto px-4 py-16"
    >
      <div className="flex justify-center mb-8">
        <h2
          className={`text-4xl md:text-5xl font-bold text-slate-900 ${headingClass}`}
        >
          Resources
        </h2>
      </div>

      <div className="text-slate-600 text-lg text-center">
        <p>This page is reserved for resources and will be populated soon.</p>
      </div>
    </motion.section>
  );
}
