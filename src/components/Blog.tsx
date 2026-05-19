import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, ChevronRight, ChevronLeft, X } from "lucide-react";
import { Language } from "../types";

interface BlogProps {
  lang: Language;
  t: any;
  blogs: any[];
}

const parsePhotos = (value: string | null | undefined) => {
  if (!value) return [] as string[];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

export default function Blog({ lang, t, blogs: initialBlogs }: BlogProps) {
  const [blogs, setBlogs] = useState<any[]>(initialBlogs);
  const [loading, setLoading] = useState(initialBlogs.length === 0);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  useEffect(() => {
    setBlogs(initialBlogs);
  }, [initialBlogs]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const Modal = ({ item, onClose }: { item: any; onClose: () => void }) => {
    const photos = parsePhotos(item.photos);
    const [photoIndex, setPhotoIndex] = useState(0);
    const hasMultiplePhotos = photos.length > 1;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl relative"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 bg-slate-100 rounded-full hover:bg-slate-200 z-10"
          >
            <X size={22} />
          </button>

          <div className="p-8 md:p-10">
            <p className="text-xs uppercase tracking-widest font-bold text-primary mb-4">
              {t.nav.blogs ?? "Blogs"}
            </p>

            {photos.length > 0 && (
              <div className="relative mb-8">
                <img
                  src={photos[photoIndex]}
                  alt={item.title_en || "Blog image"}
                  className="w-full h-[22rem] object-cover rounded-2xl"
                />
                {hasMultiplePhotos && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setPhotoIndex((prev) =>
                          prev === 0 ? photos.length - 1 : prev - 1,
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 text-white flex items-center justify-center"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPhotoIndex((prev) =>
                          prev === photos.length - 1 ? 0 : prev + 1,
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 text-white flex items-center justify-center"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {item.title_en}
                </h3>
                <p className="text-slate-600 font-medium mb-3">
                  {item.summary_en}
                </p>
                <p className="text-slate-600 whitespace-pre-wrap">
                  {item.description_en}
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 font-amharic">
                  {item.title_am}
                </h3>
                <p className="text-slate-600 font-medium mb-3 font-amharic">
                  {item.summary_am}
                </p>
                <p className="text-slate-600 whitespace-pre-wrap font-amharic">
                  {item.description_am}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <motion.section
      key="blogs"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="max-w-7xl mx-auto px-4 py-16"
    >
      <AnimatePresence>
        {selectedBlog && (
          <Modal item={selectedBlog} onClose={() => setSelectedBlog(null)} />
        )}
      </AnimatePresence>

      <div className="mb-12">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5">
          <BookOpen size={30} />
        </div>
        <h2
          className={`text-4xl md:text-5xl font-bold text-slate-900 mb-3 ${lang === "am" ? "font-amharic" : ""}`}
        >
          {t.nav.blogs ?? "Blogs"}
        </h2>
        <p className="text-slate-500 text-lg">
          {lang === "en"
            ? "Important notices, updates, and announcements."
            : "Important notices, updates, and announcements."}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white p-6 rounded-[1.5rem] border border-slate-100 animate-pulse"
            >
              <div className="w-full h-44 bg-slate-100 rounded-xl mb-4" />
              <div className="h-5 bg-slate-100 rounded w-3/4 mb-3" />
              <div className="h-4 bg-slate-100 rounded w-full mb-2" />
              <div className="h-4 bg-slate-100 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-300">
          <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">
            {lang === "en"
              ? "No blog posts yet."
              : "No blog posts yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((item) => {
            const photos = parsePhotos(item.photos);
            return (
              <article
                key={item.id}
                className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col"
              >
                {photos[0] && (
                  <img
                    src={photos[0]}
                    alt={item.title_en || "Blog image"}
                    className="w-full h-44 object-cover rounded-xl mb-5"
                  />
                )}
                <h3
                  className={`text-xl font-bold text-slate-900 mb-2 line-clamp-2 ${lang === "am" ? "font-amharic" : ""}`}
                >
                  {lang === "en" ? item.title_en : item.title_am}
                </h3>
                <p
                  className={`text-slate-500 text-sm mb-2 line-clamp-3 ${lang === "am" ? "font-amharic" : ""}`}
                >
                  {lang === "en" ? item.summary_en : item.summary_am}
                </p>
                <p
                  className={`text-xs text-slate-400 mb-6 line-clamp-2 ${lang === "am" ? "" : "font-amharic"}`}
                >
                  {lang === "en" ? item.summary_am : item.summary_en}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedBlog(item)}
                  className="mt-auto text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                  {t.news.readMore} <ChevronRight size={16} />
                </button>
              </article>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}

