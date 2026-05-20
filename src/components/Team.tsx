import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Facebook, Linkedin, Twitter, X } from "lucide-react";
import { Language, TeamMember as TeamMemberType } from "../types";

interface TeamProps {
  lang: Language;
  teamMembers: TeamMemberType[];
}

interface TeamMemberRowProps {
  member: TeamMemberType;
}

const TeamMemberRow = ({ member }: TeamMemberRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const maxDescriptionLength = 180;
  const isLongDescription = member.description.length > maxDescriptionLength;
  const previewDescription = isLongDescription
    ? `${member.description.slice(0, maxDescriptionLength).trim()}...`
    : member.description;

  const socialLinks = [
    { key: "facebook", href: member.facebook_url, Icon: Facebook, label: "Facebook" },
    { key: "x", href: member.x_url, Icon: Twitter, label: "X" },
    { key: "linkedin", href: member.linkedin_url, Icon: Linkedin, label: "LinkedIn" },
  ];

  useEffect(() => {
    if (!isPhotoModalOpen) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPhotoModalOpen(false);
      }
    };

    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [isPhotoModalOpen]);

  return (
    <>
      <article className="py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(true)}
              className="rounded-2xl overflow-hidden shrink-0 focus:outline-none focus:ring-4 focus:ring-primary/25"
              aria-label={`View full photo of ${member.name}`}
            >
              <img
                src={member.photo_url}
                alt={member.name}
                className="h-[7.5rem] w-[7.5rem] rounded-2xl object-cover cursor-zoom-in"
                loading="lazy"
              />
            </button>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
              <p className="text-sm font-semibold text-primary mt-1">
                {member.member_title}
              </p>
              <p className="text-sm text-slate-600 mt-1">
                {member.position_role}
              </p>
              <p className="text-sm text-slate-500 leading-7 mt-3">
                {isExpanded ? member.description : previewDescription}
              </p>
              {isLongDescription && (
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="text-sm font-semibold text-primary mt-2"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 md:justify-end">
            {socialLinks.map(({ key, href, Icon, label }) =>
              href ? (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-9 w-9 rounded-full border border-slate-300 text-slate-600 hover:text-primary hover:border-primary flex items-center justify-center transition-all"
                >
                  <Icon size={16} />
                </a>
              ) : null,
            )}
          </div>
        </div>
      </article>

      {isPhotoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${member.name} full photo`}
          className="fixed inset-0 z-[100] bg-slate-900/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsPhotoModalOpen(false)}
            className="absolute top-6 right-6 rounded-full bg-white/10 text-white p-2 hover:bg-white/20 transition-all"
            aria-label="Close photo preview"
          >
            <X size={22} />
          </button>
          <img
            src={member.photo_url}
            alt={member.name}
            className="max-w-[95vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default function Team({ teamMembers }: TeamProps) {
  const groupedMembers = useMemo(() => {
    const chair = teamMembers.filter((member) => member.hierarchy === "chair");
    const viceChair = teamMembers.filter(
      (member) => member.hierarchy === "vice_chair",
    );
    const scMembers = teamMembers.filter(
      (member) => member.hierarchy !== "chair" && member.hierarchy !== "vice_chair",
    );

    return { chair, viceChair, scMembers };
  }, [teamMembers]);

  const sections = [
    {
      id: "chair",
      title: "Chair",
      members: groupedMembers.chair,
    },
    {
      id: "vice-chair",
      title: "Vice Chair",
      members: groupedMembers.viceChair,
    },
    {
      id: "sc-members",
      title: "SC Members",
      members: groupedMembers.scMembers,
    },
  ];

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
              CTN-ET
            </span>
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              Steering Committee Members
            </h2>
          </div>
        </div>

        {teamMembers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-8 py-16 text-center text-slate-500">
            No team members yet. Please add members from the admin panel using
            "Add CTNET Member."
          </div>
        ) : (
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.id} className="border-b border-slate-200 pb-6 last:border-b-0">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {section.title}
                </h3>
                {section.members.length === 0 ? (
                  <p className="text-slate-500 text-sm">
                    No members assigned to this hierarchy yet.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {section.members.map((member) => (
                      <TeamMemberRow key={member.id} member={member} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
