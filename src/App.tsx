import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { translations } from './translations';
import { Language, ClinicalTrial, TeamMember } from './types';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Team from './components/Team';
import Services from './components/Services';
import Partners from './components/Partners';
import News from './components/News';
import Contact from './components/Contact';
import VolunteerForm from './components/VolunteerForm';
import TrialRegistry from './components/TrialRegistry';
import Auth from './components/Auth';
import Admin from './components/Admin';

type View = 'home' | 'about' | 'team' | 'services' | 'partners' | 'news' | 'contact' | 'volunteer' | 'trials' | 'admin' | 'signin' | 'signup';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [view, setView] = useState<View>('home');
  const [trials, setTrials] = useState<ClinicalTrial[]>([]);
  const [volunteerCount, setVolunteerCount] = useState(0);
  const [news, setNews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [user, setUser] = useState<any>(null);

  const t = translations[lang];

  useEffect(() => {
    fetchTrials();
    fetchVolunteerCount();
    fetchNews();
    fetchEvents();
    fetchPartners();
    fetchTeamMembers();
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    verifySession();
  }, []);

  const verifySession = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (!res.ok) {
        localStorage.removeItem('user');
        setUser(null);
        return;
      }
      const data = await res.json();
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTrials = async () => {
    try {
      const res = await fetch('/api/trials');
      const data = await res.json();
      setTrials(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVolunteerCount = async () => {
    try {
      const res = await fetch('/api/volunteers/count');
      const data = await res.json();
      setVolunteerCount(data.count);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news');
      setNews(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      setEvents(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/partners');
      setPartners(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch('/api/team-members');
      const data = await res.json();
      setTeamMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.role === 'ADMIN') setView('admin');
    else setView('home');
  };

  const handleLogout = async (reason?: 'inactive' | 'manual') => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    localStorage.removeItem('user');
    setView('home');
    // if (reason === 'inactive') {
    //   alert('You have been signed out due to 15 minutes of inactivity.');
    // }
  };

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;

    const timeoutMs = 15 * 60 * 1000;
    const pingIntervalMs = 60 * 1000;
    let timeoutId: number | undefined;
    let lastPing = 0;

    const resetTimer = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        handleLogout('inactive');
      }, timeoutMs);

      const now = Date.now();
      if (now - lastPing > pingIntervalMs) {
        lastPing = now;
        fetch('/api/auth/ping', { method: 'POST', credentials: 'include' }).catch(() => {});
      }
    };

    const events: Array<keyof WindowEventMap> = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [user?.role]);

  useEffect(() => {
    if (view === 'team') {
      fetchTeamMembers();
    }
  }, [view]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <Header 
        lang={lang} 
        setLang={setLang} 
        view={view} 
        setView={setView} 
        t={t} 
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <Home 
              lang={lang} 
              setView={setView} 
              volunteerCount={volunteerCount} 
              trialCount={trials.length} 
              t={t} 
              news={news}
              events={events}
              partners={partners}
            />
          )}
          {view === 'about' && <About lang={lang} t={t} />}
          {view === 'team' && <Team lang={lang} teamMembers={teamMembers} />}
          {view === 'services' && <Services lang={lang} t={t} setView={setView} />}
          {view === 'partners' && <Partners lang={lang} t={t} partners={partners} />}
          {view === 'news' && <News lang={lang} t={t} news={news} events={events} />}
          {view === 'contact' && <Contact lang={lang} t={t} />}
          {view === 'signin' && <Auth lang={lang} t={t} mode="signin" setView={setView} onLogin={handleLogin} />}
          {view === 'signup' && <Auth lang={lang} t={t} mode="signup" setView={setView} onLogin={handleLogin} />}
          {view === 'volunteer' && (
            <VolunteerForm 
              lang={lang} 
              t={t} 
              onSuccess={fetchVolunteerCount} 
            />
          )}
          {view === 'trials' && (
            <TrialRegistry 
              lang={lang} 
              t={t} 
              trials={trials} 
            />
          )}
          {view === 'admin' && user?.role === 'ADMIN' && (
            <Admin lang={lang} t={t} onLogout={handleLogout} onTeamMembersChanged={fetchTeamMembers} />
          )}
        </AnimatePresence>
      </main>

      {view !== 'admin' && <Footer lang={lang} t={t} setView={setView} />}
    </div>
  );
}
