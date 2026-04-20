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

      <div className="text-slate-600 text-lg text-center mb-12">
        <p>This page is reserved for resources and will be populated soon.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="h-40 bg-slate-50 rounded-lg mb-4 flex items-center justify-center text-slate-400">
              <span className="font-semibold">Placeholder {i}</span>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              Resource title {i}
            </h4>
            <p className="text-slate-600 text-sm">
              Short description for this resource placeholder. Content coming
              soon.
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
