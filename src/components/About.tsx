import React from 'react';
import { motion } from 'motion/react';
import { Target, Compass, ShieldCheck, HelpCircle, Calendar, TrendingUp, Mail, Globe, Microscope, Handshake, Heart } from 'lucide-react';
import { Language } from '../types';

interface AboutProps {
  lang: Language;
  t: any;
}

export default function About({ lang, t }: AboutProps) {
  const valueIcons = [Globe, Microscope, Handshake, Heart];

  return (
    <motion.section 
      key="about"
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
      <div className="text-center mb-16">
        <h2 className={`text-4xl md:text-5xl font-bold text-slate-900 mb-6 ${lang === 'am' ? 'font-amharic' : ''}`}>{t.about.title}</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">{t.about.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
            <Target size={32} />
          </div>
          <h3 className={`text-2xl font-bold text-slate-900 mb-4 ${lang === 'am' ? 'font-amharic' : ''}`}>{t.about.vision.title}</h3>
          <p className="text-slate-600 leading-relaxed">{t.about.vision.text}</p>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
          <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6">
            <Compass size={32} />
          </div>
          <h3 className={`text-2xl font-bold text-slate-900 mb-4 ${lang === 'am' ? 'font-amharic' : ''}`}>{t.about.mission.title}</h3>
          <p className="text-slate-600 leading-relaxed">{t.about.mission.text}</p>
        </div>
      </div>

      <div className="mb-16">
        <h3 className={`text-3xl font-bold mb-10 text-center text-slate-900 ${lang === 'am' ? 'font-amharic' : ''}`}>{t.about.values.title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.about.values.items.map((item: string, i: number) => {
            const Icon = valueIcons[i % valueIcons.length];
            return (
              <div key={i} className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100 text-center hover:border-primary transition-all group">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                  <Icon size={32} />
                </div>
                <p className="font-bold text-slate-900 text-lg">{item}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <HelpCircle size={28} />
              </div>
              <h3 className={`text-2xl font-bold text-slate-900 ${lang === 'am' ? 'font-amharic' : ''}`}>{t.about.why.title}</h3>
            </div>
            <p className="text-slate-600 mb-6">{t.about.why.text}</p>
            <ul className="space-y-3">
              {t.about.why.items.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                <Calendar size={28} />
              </div>
              <h3 className={`text-2xl font-bold text-slate-900 ${lang === 'am' ? 'font-amharic' : ''}`}>{t.about.whyNow.title}</h3>
            </div>
            <ul className="space-y-4">
              {t.about.whyNow.items.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <TrendingUp size={28} />
              </div>
              <h3 className={`text-2xl font-bold text-slate-900 ${lang === 'am' ? 'font-amharic' : ''}`}>{t.about.targets.title}</h3>
            </div>
            <ul className="space-y-4">
              {t.about.targets.items.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-primary text-white p-8 rounded-[2rem] shadow-xl">
            <h3 className={`text-2xl font-bold mb-4 ${lang === 'am' ? 'font-amharic' : ''}`}>{t.about.benefits.title}</h3>
            <p className="text-white/80 mb-6">{t.about.benefits.text}</p>
            <ul className="space-y-4 mb-8">
              {t.about.benefits.items.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <ShieldCheck size={20} className="shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-6 border-t border-white/20 flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Mail size={20} />
              </div>
              <p className="font-bold">{t.contact.email}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
