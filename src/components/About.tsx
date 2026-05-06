import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Compass,
  Flag,
  Handshake,
  Microscope,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { Language } from "../types";
import heroImage from "../images/header.jpg";
import aboutPageImage from "../images/aboutpageimage.png";

interface AboutProps {
  lang: Language;
  t: any;
}

const aboutPage = {
  title: "About CTN-ET",
  summary:
    "The Clinical Trials Network in Ethiopia (CTN-ET) is a national collaborative platform strengthening Ethiopia's clinical research ecosystem through coordination, capacity building, and high-quality clinical trials.",
  overview: [
    "The Clinical Trials Network in Ethiopia (CTN-ET) is a national collaborative platform that brings together clinical trial sites, research institutions, regulatory authorities, laboratories, universities, and other key stakeholders to strengthen Ethiopia's clinical research ecosystem.",
    "CTN-ET aims to create a coordinated environment that supports the design, implementation, and oversight of high-quality clinical trials. By fostering collaboration among national and international partners, the network works to enhance research capacity, improve trial quality and efficiency, and facilitate the generation of reliable scientific evidence that informs public health policy and medical innovation.",
    "Through its activities, CTN-ET contributes to advancing health research that addresses both national health priorities and global health challenges, while ensuring that clinical trials conducted in Ethiopia meet the highest standards of ethics, safety, and scientific rigor.",
  ],
  stakeholders: [
    "Clinical trial sites",
    "Research institutions and universities",
    "Regulatory authorities and ethics bodies",
    "Laboratories and diagnostic partners",
    "Healthcare facilities and development partners",
  ],
  vision:
    "To position Ethiopia as a regional center of excellence for high-quality, ethical, and innovative clinical trials that contribute to improved health outcomes and global scientific advancement.",
  mission:
    "To strengthen collaboration, coordination, and capacity among key stakeholders in Ethiopia's clinical research landscape in order to improve the quality, efficiency, and impact of clinical trials conducted in the country.",
  history: [
    {
      label: "May 2025",
      title: "Official launch during International Clinical Trials Day",
      text: "CTN-ET was officially launched by the Armauer Hansen Research Institute (AHRI), bringing national attention to the need for a coordinated clinical trials platform in Ethiopia.",
    },
    {
      label: "Launch milestone",
      title: "More than 300 stakeholders convened",
      text: "The launch event brought together participants from research institutions, government agencies, universities, healthcare facilities, and development partners.",
    },
    {
      label: "Why it matters",
      title: "A coordinated national platform was established",
      text: "The creation of CTN-ET marked an important milestone in Ethiopia's efforts to strengthen collaboration, knowledge sharing, and national clinical trial capacity.",
    },
  ],
  objectives: [
    "Strengthen collaboration among clinical trial stakeholders across Ethiopia.",
    "Improve the quality, transparency, and efficiency of clinical trials.",
    "Support regulatory and ethical compliance in clinical research.",
    "Build national capacity through training and knowledge sharing.",
    "Facilitate partnerships with regional and international research institutions.",
    "Promote evidence-based health innovation and policy development.",
  ],
  why: {
    intro:
      "Ethiopia has made significant progress in expanding its clinical research capacity through universities, research institutes, and specialized health facilities. Historically, however, coordination among clinical trial sites, regulatory bodies, laboratories, and research institutions has been limited.",
    items: [
      "Connects clinical trial stakeholders across the country.",
      "Strengthens collaboration among institutions.",
      "Improves the quality and efficiency of clinical trials.",
      "Supports regulatory compliance and ethical research practices.",
      "Facilitates access to national clinical trial infrastructure.",
    ],
    closing:
      "Through this coordinated approach, CTN-ET contributes to building a stronger and more sustainable clinical research environment in Ethiopia.",
  },
  governance: {
    intro:
      "The governance structure of CTN-ET is designed to provide strategic leadership, technical guidance, and effective coordination across the network.",
    steering:
      "Provides strategic leadership and oversight of the network, guiding its priorities, policies, and long-term vision.",
    secretariat:
      "Responsible for the day-to-day coordination and management of network activities. The Secretariat is hosted by Armauer Hansen Research Institute and supports communication, partnerships, and implementation of CTN-ET initiatives.",
    workingGroupsText:
      "Specialized groups composed of experts from partner institutions focus on the technical priorities of the network.",
    workingGroups: [
      "Capacity building and training",
      "Regulatory support and compliance",
      "Research ethics and governance",
      "Clinical trial site coordination",
      "Data and registry management",
    ],
    closing:
      "These working groups play a critical role in moving the network from strategy into practical implementation.",
  },
  join: {
    intro:
      "CTN-ET welcomes collaboration with research institutions, universities, healthcare facilities, regulatory bodies, laboratories, and development partners committed to strengthening clinical research in Ethiopia.",
    benefits: [
      "Participate in national clinical trial initiatives.",
      "Collaborate with leading research institutions.",
      "Access training and capacity-building programs.",
      "Contribute to strengthening Ethiopia's clinical research ecosystem.",
    ],
    closing:
      "Together, we can advance high-quality clinical research that improves health outcomes in Ethiopia and beyond.",
  },
  links: [
    { href: "#overview", label: "Overview" },
    { href: "#direction", label: "Vision & Mission" },
    { href: "#history", label: "History" },
    { href: "#objectives", label: "Objectives" },
    { href: "#why-ctn-et", label: "Why CTN-ET" },
    { href: "#governance", label: "Governance" },
    { href: "#join-network", label: "Join the Network" },
  ],
};

export default function About({ lang, t }: AboutProps) {
  const title =
    lang === "am" ? (t.about?.title ?? aboutPage.title) : aboutPage.title;
  const titleClass = lang === "am" ? "font-amharic" : "";
  const contactEmail = t.contact?.email ?? "contact@ctnet.org";

  function ObjectiveCard({ title, detail }: { title: string; detail: string }) {
    const [flipped, setFlipped] = useState(false);
    return (
      <div
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        className="w-full h-44 perspective"
      >
        <div
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 450ms",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
          className="relative w-full h-full"
        >
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="absolute inset-0 bg-white rounded-2xl p-6 shadow-sm flex items-center justify-center"
          >
            <h4 className="text-lg font-bold text-slate-900 text-center">
              {title}
            </h4>
          </div>

          <div
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
            className="absolute inset-0 bg-slate-50 rounded-2xl p-6 shadow-sm flex items-center"
          >
            <p className="text-slate-700 leading-6">{detail}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      key="about"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-4 pt-0 pb-16 md:pb-20"
    >
      <div className="flex justify-center mb-8">
        <img
          src="/logo.png"
          alt="CTN-ET Logo"
          className="h-20 w-auto object-contain"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="-mx-4">
        <header className="relative mb-10 overflow-hidden shadow-2xl">
          <img
            src={aboutPageImage}
            alt="CTN-ET Hero"
            className="w-full h-80 md:h-130 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center">
            <div className="text-left text-white px-8 max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/90 mb-4">
                National Clinical Research Collaboration
              </p>
              <h2
                className={`text-4xl md:text-5xl font-bold mb-6 ${titleClass}`}
              >
                {title}
              </h2>
              <p className="text-lg md:text-xl leading-relaxed">
                {aboutPage.summary}
              </p>
            </div>
          </div>
        </header>
      </div>

      <div className="mb-16 overflow-x-auto pb-2">
        <div className="flex min-w-max justify-start md:justify-center gap-3">
          {aboutPage.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:border-primary hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-20">
        <section
          id="overview"
          className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-[1.35fr,0.9fr] gap-12 items-start"
        >
          <div>
            <div className="flex items-center gap-3 mb-5 text-slate-900">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Microscope size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Overview
                </p>
                <h3 className="text-2xl md:text-3xl font-bold">
                  What CTN-ET is building
                </h3>
              </div>
            </div>

            <div className="space-y-5 text-slate-600 leading-8 text-lg">
              {aboutPage.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                <Users size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Who is involved
                </p>
                <h4 className="text-xl font-bold text-slate-900">
                  Network stakeholders
                </h4>
              </div>
            </div>

            <ul className="space-y-4">
              {aboutPage.stakeholders.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-slate-700"
                >
                  <CheckCircle2
                    size={18}
                    className="shrink-0 mt-1 text-primary"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section
          id="direction"
          className="scroll-mt-28 border-y border-slate-200 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14"
        >
          <div className="md:pr-10 md:border-r md:border-slate-200">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Target size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Vision</h3>
            </div>
            <p className="text-lg text-slate-600 leading-8">
              {aboutPage.vision}
            </p>
          </div>

          <div className="md:pl-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                <Compass size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Mission</h3>
            </div>
            <p className="text-lg text-slate-600 leading-8">
              {aboutPage.mission}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[0.95fr,1.05fr] gap-16 items-start">
          <div id="history" className="scroll-mt-28">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  History
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
                  A milestone launched in 2025
                </h3>
              </div>
            </div>

            <div className="border-l border-slate-200 pl-6 space-y-8">
              {aboutPage.history.map((item) => (
                <div key={item.title} className="relative">
                  <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-primary" />
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary mb-2">
                    {item.label}
                  </p>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-slate-600 leading-7">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="objectives" className="scroll-mt-28">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                <Flag size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Objectives
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
                  What the network is set up to do
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                const cards = [
                  {
                    title: "Strengthening collaboration",
                    detail: aboutPage.objectives[0],
                  },
                  {
                    title: "Improve trial quality",
                    detail: aboutPage.objectives[1],
                  },
                  {
                    title: "Regulatory support",
                    detail: aboutPage.objectives[2],
                  },
                  {
                    title: "Capacity building",
                    detail: aboutPage.objectives[3],
                  },
                  {
                    title: "Facilitate partnerships",
                    detail: aboutPage.objectives[4],
                  },
                  {
                    title: "Promote evidence",
                    detail: aboutPage.objectives[5],
                  },
                ];

                return cards.map((c, i) => (
                  <ObjectiveCard
                    key={c.title + i}
                    title={c.title}
                    detail={c.detail}
                  />
                ));
              })()}
            </div>
          </div>
        </section>

        <section
          id="why-ctn-et"
          className="scroll-mt-28 rounded-[2.5rem] bg-slate-900 text-white px-6 py-10 md:px-10 md:py-12"
        >
          <div className="max-w-3xl mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
                  Why CTN-ET
                </p>
                <h3 className="text-2xl md:text-3xl font-bold">
                  Why a national platform matters now
                </h3>
              </div>
            </div>
            <p className="text-white/80 text-lg leading-8">
              {aboutPage.why.intro}
            </p>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aboutPage.why.items.map((item, index) => (
              <li key={item} className="border-t border-white/15 pt-5">
                <p className="text-secondary text-sm font-semibold uppercase tracking-[0.22em] mb-2">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="text-white/90 leading-7">{item}</p>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-white/75 text-lg leading-8 max-w-3xl">
            {aboutPage.why.closing}
          </p>
        </section>

        <section
          id="governance"
          className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-[0.9fr,1.1fr] gap-12 items-start"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Building2 size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Governance
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
                  How the network is organized
                </h3>
              </div>
            </div>
            <p className="text-lg text-slate-600 leading-8">
              {aboutPage.governance.intro}
            </p>
          </div>

          <div className="space-y-8">
            <div className="border-l-4 border-primary pl-6">
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Steering Committee
              </h4>
              <p className="text-slate-600 leading-7">
                {aboutPage.governance.steering}
              </p>
            </div>

            <div className="border-l-4 border-secondary pl-6">
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Secretariat
              </h4>
              <p className="text-slate-600 leading-7">
                {aboutPage.governance.secretariat}
              </p>
            </div>

            <div className="border-l-4 border-slate-300 pl-6">
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Technical Working Groups
              </h4>
              <p className="text-slate-600 leading-7 mb-5">
                {aboutPage.governance.workingGroupsText}
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aboutPage.governance.workingGroups.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-slate-700"
                  >
                    <CheckCircle2
                      size={18}
                      className="shrink-0 mt-1 text-primary"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="text-slate-600 leading-7 mt-5">
                {aboutPage.governance.closing}
              </p>
            </div>
          </div>
        </section>

        <section
          id="join-network"
          className="scroll-mt-28 rounded-[2.5rem] bg-gradient-to-br from-primary via-primary to-slate-900 text-white px-6 py-10 md:px-10 md:py-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr,1.05fr] gap-10 items-start">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                  <Handshake size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
                    Join the Network
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    Collaborate with CTN-ET
                  </h3>
                </div>
              </div>

              <p className="text-white/85 text-lg leading-8 mb-6">
                {aboutPage.join.intro}
              </p>
              <p className="text-white/70 leading-7 mb-8">
                {aboutPage.join.closing}
              </p>

              {/* <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 font-semibold text-white hover:text-white/80 transition-all"
              >
                Contact the Secretariat
                <ArrowRight size={18} />
              </a> */}
              {/* <p className="mt-3 text-white/70">{contactEmail}</p> */}
            </div>

            <div className="rounded-[2rem] bg-white/10 backdrop-blur-sm border border-white/10 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                  <Users size={22} />
                </div>
                <h4 className="text-xl font-bold">
                  Members gain opportunities to:
                </h4>
              </div>

              <ul className="space-y-4">
                {aboutPage.join.benefits.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="shrink-0 mt-1 text-secondary"
                    />
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </motion.section>
  );
}
