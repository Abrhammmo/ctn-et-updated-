import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  ClipboardList, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Activity, 
  Globe, 
  CheckCircle2, 
  Newspaper, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  X,
  Clock,
  MapPin
} from 'lucide-react';
import { Language } from '../types';

interface HomeProps {
  lang: Language;
  setView: (v: any) => void;
  volunteerCount: number;
  trialCount: number;
  t: any;
  news: any[];
  events: any[];
  partners: any[];
}

export default function Home({ lang, setView, volunteerCount, trialCount, t, news, events, partners }: HomeProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [eventPage, setEventPage] = useState(0);

  const displayedEvents = events.slice(eventPage * 4, (eventPage * 4) + 4);

  const Modal = ({ item, onClose }: { item: any, onClose: () => void }) => {
    const photos = JSON.parse(item.photos || '[]');
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl relative"
        >
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-all z-10">
            <X size={24} />
          </button>
          
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-4">
              {item.start_date ? <Calendar size={16} /> : <Newspaper size={16} />}
              {item.start_date ? 'Event' : 'News'}
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold text-slate-900 mb-6 ${lang === 'am' ? 'font-amharic' : ''}`}>
              {lang === 'en' ? item.title_en : item.title_am}
            </h2>
            
            {item.start_date && (
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-slate-600 font-bold text-sm">
                  <Clock size={16} />
                  {new Date(item.start_date).toLocaleDateString()} - {new Date(item.end_date).toLocaleDateString()}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {photos.map((p: string, i: number) => (
                <img key={i} src={p} className="w-full h-64 object-cover rounded-2xl shadow-md" />
              ))}
            </div>

            <div className={`text-slate-600 leading-relaxed space-y-4 ${lang === 'am' ? 'font-amharic' : ''}`}>
              <p className="text-lg font-bold text-slate-900">{lang === 'en' ? item.summary_en : item.summary_am}</p>
              <p className="whitespace-pre-wrap">{lang === 'en' ? item.description_en : item.description_am}</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <motion.section 
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative"
    >
      <AnimatePresence>
        {selectedItem && <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </AnimatePresence>

      {/* Hero */}
      <div className="relative min-h-[700px] flex items-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-900/60 z-10" />
         
            
            <div className="relative h-full hidden md:block">
              <img src="images/header.jpg" alt="Clinical Trial Concept" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 w-full relative z-20">
          <div className="max-w-3xl">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8">
              <Activity size={16} className="text-secondary" />
              <span className="text-sm font-bold uppercase tracking-widest">National Research Network</span>
            </motion.div>
            <motion.h2 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className={`text-5xl md:text-7xl font-bold mb-8 leading-[1.1] ${lang === 'am' ? 'font-amharic' : ''}`}>
              {lang === 'en' ? 'Advancing Clinical Research in Ethiopia' : 'በኢትዮጵያ የክሊኒካል ምርምርን ማሳደግ'}
            </motion.h2>
            <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className={`text-xl md:text-2xl text-white/90 mb-12 max-w-2xl leading-relaxed ${lang === 'am' ? 'font-amharic' : ''}`}>
              {t.hero.subtitle}
            </motion.p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button onClick={() => setView('volunteer')} className="w-full sm:w-auto bg-secondary hover:bg-accent text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl transition-all flex items-center justify-center gap-3 group">
                <Users size={24} />
                <span className={lang === 'am' ? 'font-amharic' : ''}>{t.hero.cta_volunteer}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setView('trials')} className="w-full sm:w-auto bg-white/10 backdrop-blur-xl border border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3">
                <Search size={24} />
                <span className={lang === 'am' ? 'font-amharic' : ''}>{t.hero.cta_trials}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Users size={32} /></div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{volunteerCount.toLocaleString()}+</p>
              <p className="text-slate-500 font-medium">{lang === 'en' ? 'Registered Volunteers' : 'የተመዘገቡ በጎ ፈቃደኞች'}</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-6">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600"><ClipboardList size={32} /></div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{trialCount}+</p>
              <p className="text-slate-500 font-medium">{lang === 'en' ? 'Active Trials' : 'ንቁ ሙከራዎች'}</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-6">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600"><ShieldCheck size={32} /></div>
            <div>
              <p className="text-3xl font-bold text-slate-900">100%</p>
              <p className="text-slate-500 font-medium">{lang === 'en' ? 'Secure & Regulated' : 'ደህንነቱ የተጠበቀ'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h3 className={`text-3xl md:text-4xl font-bold mb-4 ${lang === 'am' ? 'font-amharic' : ''}`}>
                {lang === 'en' ? 'Upcoming Events' : 'መጪ ክስተቶች'}
              </h3>
              <p className="text-white/50 font-medium">Join our workshops, seminars, and networking events.</p>
            </div>
            <div className="flex gap-2">
              <button 
                disabled={eventPage === 0}
                onClick={() => setEventPage(p => p - 1)}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                disabled={(eventPage + 1) * 4 >= events.length}
                onClick={() => setEventPage(p => p + 1)}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedEvents.map((event, i) => {
              const photos = JSON.parse(event.photos || '[]');
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] flex flex-col">
                  <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-widest mb-4">
                    <Clock size={14} />
                    {new Date(event.start_date).toLocaleDateString()}
                  </div>
                  <h4 className={`text-lg font-bold mb-4 line-clamp-2 ${lang === 'am' ? 'font-amharic' : ''}`}>
                    {lang === 'en' ? event.title_en : event.title_am}
                  </h4>
                  <p className={`text-white/60 text-sm mb-6 line-clamp-3 ${lang === 'am' ? 'font-amharic' : ''}`}>
                    {lang === 'en' ? event.summary_en : event.summary_am}
                  </p>
                  <div className="mt-auto">
                    {(lang === 'en' ? event.description_en : event.description_am) && (
                      <button onClick={() => setSelectedItem(event)} className="text-white font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                        {t.news.readMore} <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className={`text-3xl md:text-4xl font-bold text-slate-900 mb-4 ${lang === 'am' ? 'font-amharic' : ''}`}>
              {lang === 'en' ? 'Our Partners' : 'የእኛ አጋሮች'}
            </h3>
            <p className="text-slate-500 font-medium">Collaborating with leading institutions to advance research.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {partners.map((partner, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl shadow-lg border border-slate-100 p-6 flex items-center justify-center group">
                <img src={partner.image_url} alt={partner.name} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className={`text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight ${lang === 'am' ? 'font-amharic' : ''}`}>
              {lang === 'en' ? 'Strengthening Ethiopia\'s Research Ecosystem' : 'የኢትዮጵያን የምርምር ሥነ-ምህዳር ማጠናከር'}
            </h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">{t.about.description}</p>
            <div className="space-y-4 mb-8">
              {[
                lang === 'en' ? 'National Volunteer Registry' : 'ብሔራዊ የበጎ ፈቃደኞች መዝገብ',
                lang === 'en' ? 'Clinical Trial Database' : 'የክሊኒካል ሙከራ የውሂብ ጎታ',
                lang === 'en' ? 'Regulatory Compliance Support' : 'የቁጥጥር ተገዢነት ድጋፍ',
                lang === 'en' ? 'Capacity Building & Training' : 'የአቅም ግንባታ እና ስልጠና'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-secondary" size={20} />
                  <span className="font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setView('about')} className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
              {lang === 'en' ? 'Learn more about our mission' : 'ስለ ተልዕኳችን የበለጠ ይወቁ'}
              <ArrowRight size={20} />
            </button>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-2xl" />
            <img src="https://picsum.photos/seed/research/800/600" alt="Research" className="relative rounded-[2rem] shadow-2xl border border-white/20" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

