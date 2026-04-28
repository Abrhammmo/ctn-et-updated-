import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Language } from "../types";

interface ResourcesProps {
  lang: Language;
  t: any;
}

export default function Resources({ lang, t }: ResourcesProps) {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const headingClass = lang === "am" ? "font-amharic" : "";

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/resources");
      const data = await res.json().catch(() => []);
      setResources(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const groupedResources = useMemo(() => {
    const grouped: Record<string, any[]> = {
      guidelines_directives: [],
      online_courses: [],
      publications: [],
    };
    resources.forEach((resource) => {
      const key = String(resource.resource_type || "").toLowerCase();
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(resource);
    });
    return grouped;
  }, [resources]);

  const getEmbedSrc = (resource: any) => {
    if (resource.drive_iframe_html) {
      const match = String(resource.drive_iframe_html).match(/src="([^"]+)"/);
      if (match?.[1]) return match[1];
    }
    if (resource.drive_link) {
      const match = String(resource.drive_link).match(/\/d\/([^/]+)\//);
      if (match?.[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    return "";
  };

  const sections = [
    { key: "guidelines_directives", title: "Guidelines and Directives" },
    { key: "online_courses", title: "Online Courses" },
    { key: "publications", title: "Publications" },
  ];

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

      {loading ? (
        <p className="text-slate-500 text-center">Loading resources...</p>
      ) : resources.length === 0 ? (
        <p className="text-slate-500 text-center">
          No resources have been published yet.
        </p>
      ) : (
        <div className="space-y-10">
          {sections.map((section) => {
            const sectionResources = groupedResources[section.key] || [];
            if (sectionResources.length === 0) return null;

            return (
              <section key={section.key}>
                <h3 className="text-2xl font-bold text-slate-900 mb-5">
                  {section.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sectionResources.map((resource) => {
                    const embedSrc = getEmbedSrc(resource);
                    return (
                      <article
                        key={resource.id}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                      >
                        <h4 className="text-lg font-bold text-slate-900 mb-2">
                          {resource.title}
                        </h4>
                        <p className="text-slate-600 text-sm mb-4">
                          {resource.description}
                        </p>

                        {resource.resource_type === "publications" && (
                          <div className="text-sm text-slate-500 mb-4">
                            <p>
                              <span className="font-semibold text-slate-700">
                                Author:
                              </span>{" "}
                              {resource.author}
                            </p>
                            <p>
                              <span className="font-semibold text-slate-700">
                                Year:
                              </span>{" "}
                              {resource.publication_year}
                            </p>
                          </div>
                        )}

                        {embedSrc && (
                          <iframe
                            src={embedSrc}
                            width="300"
                            height="400"
                            className="border border-slate-200 rounded-lg max-w-full mb-4"
                            title={`${resource.title} preview`}
                            allow="autoplay"
                          />
                        )}

                        {resource.drive_link && (
                          <a
                            href={resource.drive_link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex text-sm font-semibold text-primary hover:text-primary-dark"
                          >
                            Open file
                          </a>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}
