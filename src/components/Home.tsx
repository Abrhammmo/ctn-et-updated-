import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  ClipboardList, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Newspaper, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  X,
  Clock,
  Leaf,
  Handshake,
  Microscope,
  Heart,
  Scale
} from 'lucide-react';
import { Language } from '../types';
import headerImage from '../images/header.jpg';
import faviconLogo from '../images/favicon-logo.png';

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
  const strategicRationaleItems = [
    'Coordinating Stakeholders: Facilitating seamless collaboration between research sites, institutions, and sponsors.',
    'Building Capacity: Strengthening clinical trial research infrastructure and expertise nationwide.',
    'Driving Evidence-Based Decisions: Advocating for high-quality local evidence generation to inform national health policies.',
  ];
  const whyEthiopiaItems = [
    'Research Potential: Home to over 20 universities with significant research capabilities.',
    'Diverse Study Profiles: A wide-ranging disease profile provides critical opportunities for diverse medical studies.',
    'Regulatory Growth: An evolving regulatory environment that supports clinical trial expansion.',
  ];
  const coreValues = [
    {
      title: 'Sustainability',
      description: 'Ensuring long-term growth and viability for clinical research in Ethiopia.',
      icon: Leaf,
    },
    {
      title: 'Collaboration',
      description: 'Working together across institutions and sectors to achieve common goals.',
      icon: Handshake,
    },
    {
      title: 'Scientific Rigor',
      description: 'Maintaining the highest standards of accuracy and excellence in all research activities.',
      icon: Microscope,
    },
    {
      title: 'Respect',
      description: 'Upholding the dignity and rights of all stakeholders and participants.',
      icon: Heart,
    },
    {
      title: 'Equity',
      description: 'Promoting fairness and inclusion throughout the clinical trial ecosystem.',
      icon: Scale,
    },
  ];

  const parsePhotos = (value: string | null | undefined) => {
    if (!value) return [] as string[];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return [];
    }
  };

  const marqueePartners = useMemo(() => {
    if (!partners.length) return [];
    return [...partners, ...partners];
  }, [partners]);

  const Modal = ({ item, onClose }: { item: any, onClose: () => void }) => {
    const photos = parsePhotos(item.photos);
    const [photoIndex, setPhotoIndex] = useState(0);
    const hasMultiplePhotos = photos.length > 1;
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

            {photos.length > 0 && (
              <div className="relative mb-8">
                <img
                  src={photos[photoIndex]}
                  className="w-full h-[26rem] object-cover rounded-2xl shadow-md"
                  alt={`${item.title_en || 'Event'} photo ${photoIndex + 1}`}
                />
                {hasMultiplePhotos && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/45 text-white flex items-center justify-center hover:bg-black/60 transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/45 text-white flex items-center justify-center hover:bg-black/60 transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
                {hasMultiplePhotos && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {photos.map((_: string, index: number) => (
                      <button
                        key={`dot-${index}`}
                        type="button"
                        onClick={() => setPhotoIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${index === photoIndex ? 'bg-white w-6' : 'bg-white/60'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

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
              <img src={headerImage} alt="Clinical Trial Concept" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 w-full relative z-20">
          <div className="max-w-3xl">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8">
              <img src={faviconLogo} alt="Logo" className="w-8 h-8" />
              <span className="text-sm font-bold uppercase tracking-widest">Clinical Trial Network Ethiopia</span>
            </motion.div>
            <motion.h2 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className={`text-5xl md:text-7xl font-bold mb-8 leading-[1.1] ${lang === 'am' ? 'font-amharic' : ''}`}>
              {lang === 'en' ? 'Advancing Clinical Trials in Ethiopia' : 'በኢትዮጵያ የክሊኒካል ሙከራዎችን ማሳደግ'}
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

      {/* Strategic Brief */} 
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="pb-10 border-b border-slate-200">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-5">
              Advancing Clinical Research for a Healthier Ethiopia
            </h3>
            <p className="text-slate-600 text-lg leading-8">
              The Clinical Trial Network Ethiopia (CTN-ET) is a collaborative platform unifying research institutions, investigators, and regulators to foster high-quality local evidence. By establishing a coordinated network, we aim to advance the national health sector and create an enabling environment for ethical, evidence-based research that addresses patient needs and enhances care across health facilities.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <section>
              <h4 className="text-2xl font-bold text-slate-900 mb-4">Strategic Rationale</h4>
              <p className="text-slate-600 mb-5">
                Why a unified network is essential for the Ethiopian health sector:
              </p>
              <p className="text-slate-600 mb-5">
                Despite Ethiopia&apos;s significant population size and diverse disease profile, the number of clinical trials remains limited. Progress has historically been hindered by fragmented infrastructure. The CTN-ET addresses this by:
              </p>
              <ul className="space-y-3">
                {strategicRationaleItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 size={18} className="text-primary mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h4 className="text-2xl font-bold text-slate-900 mb-4">Why Ethiopia?</h4>
              <p className="text-slate-600 mb-5">
                Ethiopia offers a unique and evolving landscape for clinical advancement:
              </p>
              <ul className="space-y-3">
                {whyEthiopiaItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 size={18} className="text-secondary mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="mt-8 bg-slate-100 border border-slate-200 rounded-3xl p-8 md:p-10">
            <h4 className="text-3xl font-bold text-slate-900 text-center mb-8">Core Values</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {coreValues.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="rounded-2xl bg-white border border-slate-200 p-6 text-center shadow-sm">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-primary mb-4">
                      <Icon size={26} />
                    </div>
                    <h5 className="text-lg font-bold text-slate-900 mb-3">{value.title}</h5>
                    <p className="text-sm text-slate-600 leading-7">{value.description}</p>
                  </div>
                );
              })}
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
                    <button onClick={() => setSelectedItem(event)} className="text-white font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                      {t.news.readMore} <ChevronRight size={16} />
                    </button>
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
          
          <div className="overflow-hidden">
            <div className="partners-banner-track">
              {marqueePartners.map((partner, i) => (
                <div key={`${partner.id || partner.name}-${i}`} className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl shadow-lg border border-slate-100 p-6 flex items-center justify-center shrink-0 mx-4">
                  <img src={partner.image_url} alt={partner.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

