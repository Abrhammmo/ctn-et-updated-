import React from 'react';
import { motion } from 'motion/react';
import { Search, Database, ChevronRight } from 'lucide-react';
import { Language, ClinicalTrial } from '../types';

interface TrialRegistryProps {
  lang: Language;
  t: any;
  trials: ClinicalTrial[];
}

export default function TrialRegistry({ lang, t, trials }: TrialRegistryProps) {
  return (
    <motion.section 
      key="trials"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-4 py-16"
    >
      <div className="flex justify-center mb-8">
        <img 
          src="/logo.png" 
          alt="CTN-ET Logo" 
          className="h-20 w-auto object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className={`text-4xl font-bold text-slate-900 mb-2 ${lang === 'am' ? 'font-amharic' : ''}`}>{t.trials.title}</h2>
          <p className="text-slate-500 font-medium">Browse and search for ongoing clinical studies in Ethiopia.</p>
        </div>
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm"
            placeholder={t.trials.search}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trials.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-300">
            <Database size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No trials found. Check back later.</p>
          </div>
        ) : (
          trials.map((trial) => (
            <motion.div 
              key={trial.id}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                  {trial.phase}
                </span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                  trial.status === 'RECRUITING' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-600'
                }`}>
                  {trial.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 leading-tight">{trial.title}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">{trial.description}</p>
              
              <div className="mt-auto pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">{t.trials.start}</p>
                  <p className="text-sm font-semibold text-slate-700">{trial.start_date}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">{t.trials.end}</p>
                  <p className="text-sm font-semibold text-slate-700">{trial.end_date}</p>
                </div>
              </div>

              <button className="mt-8 w-full py-3 rounded-xl border-2 border-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
                View Details
                <ChevronRight size={18} />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </motion.section>
  );
}
