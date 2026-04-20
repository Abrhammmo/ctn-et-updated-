import React from "react";
import { Activity } from "lucide-react";
import { Language } from "../types";

interface FooterProps {
  lang: Language;
  t: any;
  setView: (v: any) => void;
}

export default function Footer({ lang, t, setView }: FooterProps) {
  return (
    <footer className="bg-white border-t border-slate-200 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div
              className="flex items-center gap-3 mb-6 cursor-pointer"
              onClick={() => setView("home")}
            >
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="CTN-ET Logo"
                  className="h-10 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.classList.remove(
                      "hidden",
                    );
                  }}
                  referrerPolicy="no-referrer"
                />
                <div className="hidden w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                  <Activity size={24} />
                </div>
              </div>
              <h1 className="text-xl font-bold text-primary tracking-tight">
                CTN-ET
              </h1>
            </div>
            <p className="text-slate-500 max-w-md leading-relaxed mb-6">
              {lang === "en"
                ? "The Clinical Trial Network Ethiopia (CTN-ET) is a national initiative to streamline clinical research, ensure participant safety, and promote medical innovation in Ethiopia."
                : "የኢትዮጵያ የክሊኒካል ሙከራ መረብ (CTN-ET) የክሊኒካል ምርምርን ለማሳለጥ፣ የተሳታፊዎችን ደህንነት ለማረጋገጥ እና በኢትዮጵያ የህክምና ፈጠራን ለማስተዋወቅ የተጀመረ አገራዊ ተነሳሽነት ነው።"}
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all cursor-pointer">
                <span className="font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all cursor-pointer">
                <span className="font-bold">in</span>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all cursor-pointer">
                <span className="font-bold">𝕏</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">
              Quick Links
            </h4>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li>
                <button
                  onClick={() => setView("about")}
                  className="hover:text-primary transition-all"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView("team")}
                  className="hover:text-primary transition-all"
                >
                  {t.nav.team}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView("services")}
                  className="hover:text-primary transition-all"
                >
                  {t.nav.services}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView("partners")}
                  className="hover:text-primary transition-all"
                >
                  {t.nav.partners}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView("news")}
                  className="hover:text-primary transition-all"
                >
                  {t.nav.news}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView("resources")}
                  className="hover:text-primary transition-all"
                >
                  {t.nav.resources ?? "Resources"}
                </button>
              </li>
              <li className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setView("signin")}
                  className="hover:text-primary transition-all"
                >
                  {t.nav.signin}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView("signup")}
                  className="hover:text-primary transition-all"
                >
                  {t.nav.signup}
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">
              Contact
            </h4>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li>{t.contact.address}</li>
              <li>{t.contact.email}</li>
              <li>{t.contact.phone}</li>
              <li>
                <a
                  href={`https://${t.contact.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {t.contact.website}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400 font-medium">
          <p>© 2026 Clinical Trial Network Ethiopia. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-all">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-all">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
