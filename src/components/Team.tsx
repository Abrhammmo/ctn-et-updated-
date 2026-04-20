import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Facebook, Twitter, Youtube } from 'lucide-react';
import { Language, TeamMember as TeamMemberType } from '../types';

interface TeamProps {
  lang: Language;
  teamMembers: TeamMemberType[];
}

interface TeamMemberProps {
  member: TeamMemberType;
}

const TeamMemberCard = ({ member }: TeamMemberProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxDescriptionLength = 140;
  const isLongDescription = member.description.length > maxDescriptionLength;
  const previewDescription = isLongDescription
    ? `${member.description.slice(0, maxDescriptionLength).trim()}...`
    : member.description;

  const socialLinks = [
    { key: 'facebook', href: member.facebook_url, Icon: Facebook, label: 'Facebook' },
    { key: 'x', href: member.x_url, Icon: Twitter, label: 'X' },
    { key: 'youtube', href: member.youtube_url, Icon: Youtube, label: 'YouTube' },
  ];

  return (
    <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col">
      <div className="mx-auto mb-6 w-full max-w-[220px]">
        <div className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-slate-100">
          <img
            src={member.photo_url}
            alt={member.name}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        </div>
      </div>

      <h3 className="text-center text-xl font-bold text-slate-900">{member.name}</h3>
      <p className="mt-1 text-center text-sm font-semibold text-primary">{member.member_title}</p>
      <p className="mt-1 text-center text-sm text-slate-600">{member.position_role}</p>
      <p className="mt-4 text-sm leading-7 text-slate-500">{isExpanded ? member.description : previewDescription}</p>

      {isLongDescription && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-3 self-start text-sm font-semibold text-primary hover:text-primary-dark transition"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}

      <div className="mt-6 flex items-center justify-center gap-4 border-t border-slate-100 pt-4">
        {socialLinks.map(({ key, href, Icon, label }) => {
          if (!href) {
            return (
              <span key={key} className="text-gray-300" aria-label={label}>
                <Icon size={18} />
              </span>
            );
          }

          return (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-gray-600 transition hover:text-black"
            >
              <Icon size={18} />
            </a>
          );
        })}
      </div>
    </article>
  );
};

export default function Team({ lang, teamMembers }: TeamProps) {
  return (
    <motion.section
      key="team"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white"
    >
      <div className="mx-auto max-w-7xl px-8 py-16 md:py-20">
        <div className="relative mb-14 overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
          <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(148,163,184,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.15)_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white" />
          <div className="relative px-6 py-16 text-center md:px-12">
            <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-700">
              Team
            </span>
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              CTNET Staff
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-500 md:text-lg">
              Meet the multidisciplinary CTNET research group working together to deliver rigorous, ethical, and high-impact clinical research.
            </p>
          </div>
        </div>

        {teamMembers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-8 py-16 text-center text-slate-500">
            No team members yet. Please add members from the admin panel using "Add CTNET Member."
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <div key={member.id}>
                <TeamMemberCard member={member} />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
