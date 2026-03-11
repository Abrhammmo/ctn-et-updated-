import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, ClipboardList, FileText, HelpCircle, CheckCircle2, Users, Mail } from 'lucide-react';
import { Language } from '../types';

interface ServicesProps {
  lang: Language;
  t: any;
  setView: (v: any) => void;
}

export default function Services({ lang, t, setView }: ServicesProps) {
  const icons = [ClipboardList, FileText, HelpCircle];

  return (
    <motion.section 
      key="services"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
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
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
          <Briefcase size={32} />
        </div>
        <h2 className={`text-4xl md:text-5xl font-bold text-slate-900 mb-6 ${lang === 'am' ? 'font-amharic' : ''}`}>{t.services.title}</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {lang === 'en' ? 'CTN-ET provides comprehensive support for clinical research across Ethiopia.' : 'CTN-ET በኢትዮጵያ ውስጥ ለክሊኒካል ምርምር አጠቃላይ ድጋፍ ይሰጣል።'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {t.services.items.map((service: any, i: number) => {
          const Icon = icons[i % icons.length];
          return (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col h-full">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
                <Icon size={32} />
              </div>
              <h3 className={`text-2xl font-bold text-slate-900 mb-4 ${lang === 'am' ? 'font-amharic' : ''}`}>{service.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-8 flex-grow">{service.description}</p>
              <div className="pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <CheckCircle2 size={18} />
                  <span>{lang === 'en' ? 'Available Service' : 'ዝግጁ አገልግሎት'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Registry Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <button 
          onClick={() => setView('volunteer')}
          className="group relative overflow-hidden bg-primary p-10 rounded-[2.5rem] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 text-left"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Users size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:bg-white group-hover:text-primary transition-all">
              <Users size={32} />
            </div>
            <h4 className={`text-3xl font-bold text-white mb-4 ${lang === 'am' ? 'font-amharic' : ''}`}>{t.nav.volunteer}</h4>
            <p className="text-white/70 text-lg mb-8 max-w-[280px]">Join our national database of clinical trial volunteers and help shape the future of medicine.</p>
            <div className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-bold shadow-lg group-hover:bg-secondary group-hover:text-white transition-all">
              <span>{lang === 'en' ? 'Register Now' : 'አሁን ይመዝገቡ'}</span>
              <CheckCircle2 size={18} />
            </div>
          </div>
        </button>

        <button 
          onClick={() => setView('trials')}
          className="group relative overflow-hidden bg-secondary p-10 rounded-[2.5rem] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 text-left"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <ClipboardList size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:bg-white group-hover:text-secondary transition-all">
              <ClipboardList size={32} />
            </div>
            <h4 className={`text-3xl font-bold text-white mb-4 ${lang === 'am' ? 'font-amharic' : ''}`}>{t.nav.trials}</h4>
            <p className="text-white/70 text-lg mb-8 max-w-[280px]">Search and explore active clinical trials in Ethiopia. Find opportunities that match your needs.</p>
            <div className="inline-flex items-center gap-2 bg-white text-secondary px-6 py-3 rounded-xl font-bold shadow-lg group-hover:bg-primary group-hover:text-white transition-all">
              <span>{lang === 'en' ? 'Explore Trials' : 'ሙከራዎችን ያስሱ'}</span>
              <ClipboardList size={18} />
            </div>
          </div>
        </button>
      </div>

      <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className={`text-3xl font-bold text-slate-900 mb-6 ${lang === 'am' ? 'font-amharic' : ''}`}>
              {lang === 'en' ? 'Why Choose CTN-ET Services?' : 'ለምን የ CTN-ET አገልግሎቶችን ይመርጣሉ?'}
            </h3>
            <div className="space-y-4">
              {[
                lang === 'en' ? 'Standardized processes across all sites' : 'በሁሉም ቦታዎች ደረጃቸውን የጠበቁ ሂደቶች',
                lang === 'en' ? 'Expert regulatory and ethical guidance' : 'የባለሙያ የቁጥጥር እና የሥነ-ምግባር መመሪያ',
                lang === 'en' ? 'Access to a national volunteer network' : 'ብሔራዊ የበጎ ፈቃደኞች መረብ ማግኘት',
                lang === 'en' ? 'High-quality data management and reporting' : 'ከፍተኛ ጥራት ያለው የውሂብ አስተዳደር እና ሪፖርት ማድረግ'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-secondary" size={20} />
                  <span className="font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100">
            <h4 className="text-xl font-bold text-slate-900 mb-4">Request Advisory</h4>
            <p className="text-slate-500 mb-6">Contact our team to discuss your clinical trial needs and how we can support your research.</p>
            <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <Mail size={24} className="text-primary" />
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Email Us</p>
                <p className="font-bold text-slate-900">{t.contact.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
