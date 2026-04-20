import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, CheckCircle2, ClipboardList, GraduationCap, ShieldCheck, FileText, Mail } from 'lucide-react';
import { Language } from '../types';

interface ServicesProps {
  lang: Language;
  t: any;
  setView: (v: any) => void;
}

const clinicalTrialSupportItems = [
  'Clinical trial site identification and feasibility assessments',
  'Study start-up support and coordination',
  'Study management and operational guidance',
  'Stakeholder engagement and partnership facilitation',
  'Support for multi-center trial coordination',
  'Monitoring and quality assurance support',
];

const registryItems = [
  'Improve transparency and accountability in clinical research',
  'Provide a centralized database of clinical trials in Ethiopia',
  'Facilitate collaboration between investigators and institutions',
  'Support coordination among research stakeholders',
  'Increase public awareness and access to research information',
];

const trainingAreas = [
  {
    title: 'Good Clinical Practice (GCP)',
    description:
      'International ethical and scientific quality standards for designing, conducting, recording, and reporting clinical trials involving human participants, ensuring participant safety, rights, and data integrity.',
  },
  {
    title: 'Good Clinical Laboratory Practice (GCLP)',
    description:
      'Standards that ensure laboratory processes supporting clinical trials are conducted with high levels of accuracy, reliability, and quality, ensuring valid and reproducible laboratory data.',
  },
  {
    title: 'Good Laboratory Practice (GLP)',
    description:
      'Principles that govern laboratory organization, study conduct, documentation, and reporting to ensure consistency, quality assurance, and regulatory compliance in laboratory research.',
  },
  {
    title: 'Clinical Trial Management',
    description:
      'Practical training on planning, coordinating, and overseeing clinical trials, including study start-up, participant recruitment, site management, monitoring, and reporting.',
  },
  {
    title: 'Clinical Data Management',
    description:
      'Methods and tools for collecting, validating, managing, and analyzing clinical trial data to ensure accuracy, confidentiality, and compliance with international research standards.',
  },
  {
    title: 'Research Ethics and Participant Protection',
    description:
      'Ethical principles and regulatory requirements that safeguard the rights, safety, dignity, and well-being of participants involved in clinical research.',
  },
  {
    title: 'Regulatory Requirements and Compliance',
    description:
      'Guidance on national and international regulatory frameworks governing clinical trials, including protocol approvals, reporting obligations, and compliance with regulatory authorities such as the Ethiopian Food and Drug Authority.',
  },
];

const consultationItems = [
  'Clinical trial design and protocol development',
  'Regulatory submission and compliance guidance',
  'Ethical review preparation and approval processes',
  'Data management systems and research governance',
  'Partnership development and collaborative research initiatives',
];

export default function Services({ lang, t, setView }: ServicesProps) {
  const headingClass = lang === 'am' ? 'font-amharic' : '';

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

      <div className="text-center mb-14">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
          <Briefcase size={32} />
        </div>
        <h2 className={`text-4xl md:text-5xl font-bold text-slate-900 mb-5 ${headingClass}`}>Services</h2>
        <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
          Clinical Trials Network in Ethiopia (CTN-ET) provides a range of services designed to strengthen Ethiopia&apos;s
          clinical research ecosystem and support the successful implementation of high-quality clinical trials.
          Through collaboration with national and international partners, CTN-ET facilitates efficient trial planning,
          implementation, and coordination while ensuring adherence to global scientific and ethical standards.
        </p>
      </div>

      <div className="space-y-8">
        <article className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <ClipboardList size={24} />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Clinical Trial Support</h3>
          </div>
          <p className="text-slate-600 leading-8 mb-6">
            CTN-ET offers comprehensive support across the entire lifecycle of clinical trials from initial planning to
            implementation and reporting. The network connects investigators, institutions, and partners to ensure
            trials are conducted efficiently and in accordance with international best practices.
          </p>
          <p className="font-semibold text-slate-800 mb-4">Key support services include:</p>
          <ul className="space-y-3">
            {clinicalTrialSupportItems.map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 size={18} className="text-primary shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
              <FileText size={24} />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Clinical Trial Registry</h3>
          </div>
          <p className="text-slate-600 leading-8 mb-6">
            CTN-ET hosts a national platform that registers ongoing and completed clinical trials conducted in Ethiopia,
            promoting transparency and accessibility of clinical research information.
          </p>
          <p className="font-semibold text-slate-800 mb-4">The registry helps to:</p>
          <ul className="space-y-3">
            {registryItems.map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 size={18} className="text-secondary shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Training & Capacity Building</h3>
          </div>
          <p className="text-slate-600 leading-8 mb-6">
            Strengthening human resource capacity is central to CTN-ET&apos;s mission. The network organizes workshops,
            short courses, and professional training programs to enhance knowledge and skills in clinical research.
          </p>
          <p className="font-semibold text-slate-800 mb-4">Training areas include:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainingAreas.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-600 leading-7">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-600 leading-8 mt-6">
            These programs support investigators, clinicians, laboratory professionals, and research coordinators in
            conducting high-quality clinical research.
          </p>
        </article>

        <article className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Expert Consultation</h3>
          </div>
          <p className="text-slate-600 leading-8 mb-6">
            CTN-ET provides expert technical guidance to researchers, institutions, and partners involved in clinical
            research.
          </p>
          <p className="font-semibold text-slate-800 mb-4">Consultation services include:</p>
          <ul className="space-y-3">
            {consultationItems.map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 size={18} className="text-blue-700 shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <button
          onClick={() => setView('volunteer')}
          className="group relative overflow-hidden bg-primary p-10 rounded-[2.5rem] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 text-left"
        >
          <div className="relative z-10">
            <h4 className={`text-3xl font-bold text-white mb-4 ${headingClass}`}>{t.nav.volunteer}</h4>
            <p className="text-white/75 text-lg mb-7 max-w-[320px]">
              Join our national volunteer database and support ethical evidence generation in Ethiopia.
            </p>
            <div className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-bold shadow-lg transition-all">
              <span>Register Now</span>
              <CheckCircle2 size={18} />
            </div>
          </div>
        </button>

        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
          <h4 className="text-2xl font-bold text-slate-900 mb-4">Request Advisory</h4>
          <p className="text-slate-600 mb-6 leading-7">
            Contact our team to discuss clinical trial planning, partnerships, compliance, or training support.
          </p>
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200">
            <Mail size={24} className="text-primary" />
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest">Email Us</p>
              <p className="font-bold text-slate-900">{t.contact.email}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
