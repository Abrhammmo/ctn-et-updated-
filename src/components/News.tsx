import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Newspaper, Calendar, Clock, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Language } from '../types';

interface NewsProps {
  lang: Language;
  t: any;
  news: any[];
  events: any[];
}

export default function News({ lang, t, news: initialNews, events: initialEvents }: NewsProps) {
  const [news, setNews] = useState<any[]>(initialNews);
  const [events, setEvents] = useState<any[]>(initialEvents);
  const [loading, setLoading] = useState(initialNews.length === 0 && initialEvents.length === 0);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    setNews(initialNews);
    setEvents(initialEvents);
  }, [initialNews, initialEvents]);

  useEffect(() => {
    if (initialNews.length === 0 && initialEvents.length === 0) {
      fetchContent();
    }
  }, [initialNews, initialEvents]);

  const fetchContent = async () => {
    try {
      const [newsRes, eventsRes] = await Promise.all([
        fetch('/api/news'),
        fetch('/api/events'),
      ]);

      if (newsRes.ok) {
        setNews(await newsRes.json());
      }
      if (eventsRes.ok) {
        setEvents(await eventsRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const parsePhotos = (value: string | null | undefined) => {
    if (!value) return [] as string[];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return [];
    }
  };

  const Modal = ({ item, onClose }: { item: any; onClose: () => void }) => {
    const photos = parsePhotos(item.photos);
    const isEvent = Boolean(item.start_date);
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
              {isEvent ? <Calendar size={16} /> : <Newspaper size={16} />}
              {isEvent ? 'Event' : 'News'}
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold text-slate-900 mb-6 ${lang === 'am' ? 'font-amharic' : ''}`}>
              {lang === 'en' ? item.title_en : item.title_am}
            </h2>

            {isEvent && (
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
      key="news"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-4 py-16"
    >
      <AnimatePresence>
        {selectedItem && <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </AnimatePresence>

      <div className="mb-16">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
          <Newspaper size={32} />
        </div>
        <h2 className={`text-4xl md:text-5xl font-bold text-slate-900 mb-3 ${lang === 'am' ? 'font-amharic' : ''}`}>{t.news.title}</h2>
        <p className="text-xl text-slate-500 font-medium">Latest news and upcoming events from CTN-ET.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 animate-pulse">
              <div className="w-full h-48 bg-slate-100 rounded-2xl mb-6" />
              <div className="h-6 bg-slate-100 rounded w-3/4 mb-4" />
              <div className="h-4 bg-slate-100 rounded w-full mb-2" />
              <div className="h-4 bg-slate-100 rounded w-full mb-2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-20">
            <h3 className={`text-3xl font-bold text-slate-900 mb-8 ${lang === 'am' ? 'font-amharic' : ''}`}>
              {lang === 'en' ? 'Latest News' : 'የቅርብ ጊዜ ዜናዎች'}
            </h3>
            {news.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-[2rem] border border-dashed border-slate-300">
                <Newspaper size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">No news updates at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {news.map((item) => {
                  const photos = parsePhotos(item.photos);
                  return (
                    <motion.div key={item.id} whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
                      {photos[0] && <img src={photos[0]} className="w-full h-48 object-cover rounded-2xl mb-6" />}
                      <h4 className={`text-xl font-bold text-slate-900 mb-4 line-clamp-2 ${lang === 'am' ? 'font-amharic' : ''}`}>
                        {lang === 'en' ? item.title_en : item.title_am}
                      </h4>
                      <p className={`text-slate-500 text-sm mb-6 line-clamp-3 ${lang === 'am' ? 'font-amharic' : ''}`}>
                        {lang === 'en' ? item.summary_en : item.summary_am}
                      </p>
                      <div className="mt-auto">
                        <button type="button" onClick={() => setSelectedItem(item)} className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                          {t.news.readMore} <ChevronRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className={`text-3xl font-bold text-slate-900 mb-8 ${lang === 'am' ? 'font-amharic' : ''}`}>
              {lang === 'en' ? 'Events' : 'ክስተቶች'}
            </h3>
            {events.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-[2rem] border border-dashed border-slate-300">
                <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">No upcoming events at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {events.map((event) => (
                  <motion.div key={event.id} whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-widest mb-4">
                      <Clock size={14} />
                      {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                    </div>
                    <h4 className={`text-xl font-bold text-slate-900 mb-4 line-clamp-2 ${lang === 'am' ? 'font-amharic' : ''}`}>
                      {lang === 'en' ? event.title_en : event.title_am}
                    </h4>
                    <p className={`text-slate-500 text-sm mb-6 line-clamp-3 ${lang === 'am' ? 'font-amharic' : ''}`}>
                      {lang === 'en' ? event.summary_en : event.summary_am}
                    </p>
                    <div className="mt-auto">
                      <button type="button" onClick={() => setSelectedItem(event)} className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                        {t.news.readMore} <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </motion.section>
  );
}
