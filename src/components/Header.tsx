import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  Globe,
  Menu,
  X,
  ChevronDown,
  Users,
  ClipboardList,
  ShieldCheck,
  Info,
  Briefcase,
  Handshake,
  Newspaper,
  Phone,
} from "lucide-react";
import { Language } from "../types";
import headerLogo from "../images/Header-Logo-SVG.svg";

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  view: string;
  setView: (v: any) => void;
  t: any;
  user: any;
  onLogout: () => void;
}

export default function Header({
  lang,
  setLang,
  view,
  setView,
  t,
  user,
  onLogout,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsAdminOpen(false);
    setIsAboutOpen(false);
    setIsMobileAboutOpen(false);
  };

  const handleViewChange = (nextView: string) => {
    setView(nextView);
    closeMenus();
  };

  const NavItem = ({
    id,
    label,
    icon: Icon,
    active,
  }: {
    id: string;
    label: string;
    icon: any;
    active: boolean;
  }) => (
    <button
      onClick={() => handleViewChange(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm ${active ? "bg-primary text-white shadow-md" : "hover:bg-slate-100 text-slate-600"}`}
    >
      <Icon size={16} />
      <span className={lang === "am" ? "font-amharic" : ""}>{label}</span>
    </button>
  );

  const isAboutActive = view === "about" || view === "team";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-start">
        <div
          className="flex items-start gap-3 cursor-pointer pt-4"
          onClick={() => handleViewChange("home")}
        >
          <div className="flex items-center gap-2">
            <img
              src={headerLogo}
              alt="CTN-ET Logo"
              className="h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
              referrerPolicy="no-referrer"
            />
            <div className="hidden w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg"></div>
          </div>
          <div className="hidden sm:block">
            {/* <h1 className="text-lg font-bold text-primary tracking-tight">CTN-ET</h1> */}
            {/* <p className="text-[8px] uppercase tracking-widest text-slate-500 font-semibold">Clinical Trial Network Ethiopia</p> */}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4 pt-4">
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavItem
              id="home"
              label={t.nav.home}
              icon={Globe}
              active={view === "home"}
            />
            <div
              className="relative"
              onMouseEnter={() => setIsAboutOpen(true)}
              onMouseLeave={() => setIsAboutOpen(false)}
            >
              <button
                onClick={() => {
                  setIsAboutOpen(!isAboutOpen);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm ${isAboutActive || isAboutOpen ? "bg-primary text-white shadow-md" : "hover:bg-slate-100 text-slate-600"}`}
              >
                <Info size={16} />
                <span className={lang === "am" ? "font-amharic" : ""}>
                  {t.nav.about}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isAboutOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isAboutOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 overflow-hidden z-50"
                  >
                    <button
                      onClick={() => handleViewChange("about")}
                      className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${view === "about" ? "bg-primary/10 text-primary" : "hover:bg-slate-50 text-slate-600"}`}
                    >
                      <Info size={18} />
                      <span
                        className={
                          lang === "am"
                            ? "font-amharic text-sm"
                            : "text-sm font-medium"
                        }
                      >
                        {t.nav.about_ctnet}
                      </span>
                    </button>
                    <button
                      onClick={() => handleViewChange("team")}
                      className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${view === "team" ? "bg-primary/10 text-primary" : "hover:bg-slate-50 text-slate-600"}`}
                    >
                      <Users size={18} />
                      <span
                        className={
                          lang === "am"
                            ? "font-amharic text-sm"
                            : "text-sm font-medium"
                        }
                      >
                        {t.nav.team}
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <NavItem
              id="services"
              label={t.nav.services}
              icon={Briefcase}
              active={view === "services"}
            />
            <NavItem
              id="partners"
              label={t.nav.partners}
              icon={Handshake}
              active={view === "partners"}
            />
            <NavItem
              id="news"
              label={t.nav.news}
              icon={Newspaper}
              active={view === "news"}
            />
            <NavItem
              id="resources"
              label={t.nav.resources ?? "Resources"}
              icon={Activity}
              active={view === "resources"}
            />
            <NavItem
              id="contact"
              label={t.nav.contact}
              icon={Phone}
              active={view === "contact"}
            />

            {user?.role === "ADMIN" && (
              <div
                className="relative"
                onMouseEnter={() => setIsAdminOpen(true)}
                onMouseLeave={() => setIsAdminOpen(false)}
              >
                <button
                  onClick={() => {
                    handleViewChange("admin");
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm ${view === "admin" || isAdminOpen ? "bg-primary text-white shadow-md" : "hover:bg-slate-100 text-slate-600"}`}
                >
                  <ShieldCheck size={16} />
                  <span>Admin</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${isAdminOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isAdminOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 overflow-hidden z-50"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 mb-2">
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                          Admin Account
                        </p>
                        <p className="text-sm font-semibold text-slate-700 break-all">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          onLogout();
                          closeMenus();
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-all"
                      >
                        <X size={18} />
                        <span
                          className={
                            lang === "am"
                              ? "font-amharic text-sm"
                              : "text-sm font-medium"
                          }
                        >
                          Logout
                        </span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Registration moved to footer quick links; header no longer shows signin/signup */}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(lang === "en" ? "am" : "en")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-bold transition-all"
            >
              <Globe size={16} />
              {lang === "en" ? "አማርኛ" : "EN"}
            </button>

            <button
              className="lg:hidden p-2 text-slate-600"
              onClick={() => {
                if (isMenuOpen) setIsMobileAboutOpen(false);
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-200 overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-1">
              <NavItem
                id="home"
                label={t.nav.home}
                icon={Globe}
                active={view === "home"}
              />
              <button
                onClick={() => setIsMobileAboutOpen(!isMobileAboutOpen)}
                className={`flex items-center justify-between gap-2 px-4 py-2 rounded-lg transition-all text-sm ${isAboutActive || isMobileAboutOpen ? "bg-primary text-white shadow-md" : "hover:bg-slate-100 text-slate-600"}`}
              >
                <span className="flex items-center gap-2">
                  <Info size={16} />
                  <span className={lang === "am" ? "font-amharic" : ""}>
                    {t.nav.about}
                  </span>
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isMobileAboutOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {isMobileAboutOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 overflow-hidden border-l border-slate-200 pl-3"
                  >
                    <button
                      onClick={() => handleViewChange("about")}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${view === "about" ? "text-primary font-semibold" : "text-slate-600"}`}
                    >
                      <Info size={14} />
                      <span>{t.nav.about_ctnet}</span>
                    </button>
                    <button
                      onClick={() => handleViewChange("team")}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${view === "team" ? "text-primary font-semibold" : "text-slate-600"}`}
                    >
                      <Users size={14} />
                      <span>{t.nav.team}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <NavItem
                id="services"
                label={t.nav.services}
                icon={Briefcase}
                active={view === "services"}
              />
              <NavItem
                id="partners"
                label={t.nav.partners}
                icon={Handshake}
                active={view === "partners"}
              />
              <NavItem
                id="news"
                label={t.nav.news}
                icon={Newspaper}
                active={view === "news"}
              />
              <NavItem
                id="resources"
                label={t.nav.resources ?? "Resources"}
                icon={Activity}
                active={view === "resources"}
              />
              <NavItem
                id="contact"
                label={t.nav.contact}
                icon={Phone}
                active={view === "contact"}
              />
              <div className="h-px bg-slate-100 my-2" />
              {/* signin/signup moved to footer quick links */}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
