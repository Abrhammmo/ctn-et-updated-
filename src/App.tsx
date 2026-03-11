import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { translations } from './translations';
import { Language, ClinicalTrial } from './types';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Partners from './components/Partners';
import News from './components/News';
import Contact from './components/Contact';
import VolunteerForm from './components/VolunteerForm';
import TrialRegistry from './components/TrialRegistry';
import Auth from './components/Auth';
import Admin from './components/Admin';

type View = 'home' | 'about' | 'services' | 'partners' | 'news' | 'contact' | 'volunteer' | 'trials' | 'admin' | 'signin' | 'signup';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [view, setView] = useState<View>('home');
  const [trials, setTrials] = useState<ClinicalTrial[]>([]);
  const [volunteerCount, setVolunteerCount] = useState(0);
  const [news, setNews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const t = translations[lang];

  useEffect(() => {
    fetchTrials();
    fetchVolunteerCount();
    fetchNews();
    fetchEvents();
    fetchPartners();
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

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

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.role === 'ADMIN') setView('admin');
    else setView('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setView('home');
  };

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
            <Admin lang={lang} t={t} onLogout={handleLogout} />
          )}
        </AnimatePresence>
      </main>

      {view !== 'admin' && <Footer lang={lang} t={t} setView={setView} />}
    </div>
  );
}
