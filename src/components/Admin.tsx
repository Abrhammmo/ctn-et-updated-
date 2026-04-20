import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Users,
  UserPlus,
  LogOut,
  Plus,
  Trash2,
  Image as ImageIcon,
  Bell,
  CheckCircle,
  Clock,
  Mail,
  ShieldAlert,
  Handshake,
} from 'lucide-react';
import { Language, TeamMember } from '../types';

interface AdminProps {
  lang: Language;
  t: any;
  onLogout: () => void;
  onTeamMembersChanged: () => void;
}

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

export default function Admin({ onLogout, onTeamMembersChanged }: AdminProps) {
  const [activeTab, setActiveTab] = useState<'news' | 'events' | 'partners' | 'team' | 'people' | 'admins'>('news');
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const [news, setNews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [partnerApplications, setPartnerApplications] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);

  const [newsForm, setNewsForm] = useState({
    title_en: '', title_am: '', summary_en: '', summary_am: '', description_en: '', description_am: '', photos: [] as string[]
  });
  const [eventForm, setEventForm] = useState({
    title_en: '', title_am: '', summary_en: '', summary_am: '', description_en: '', description_am: '', photos: [] as string[], start_date: '', end_date: ''
  });
  const [partnerForm, setPartnerForm] = useState({
    category: 'university', name: '', description: '', image_url: ''
  });
  const [teamForm, setTeamForm] = useState({
    name: '',
    member_title: '',
    position_role: '',
    description: '',
    photo_url: '',
    facebook_url: '',
    x_url: '',
    youtube_url: '',
  });
  const [adminForm, setAdminForm] = useState({ email: '' });
  const [generatedPassword, setGeneratedPassword] = useState('');

  const handleUnauthorized = () => {
    alert('Your session has expired. Please sign in again.');
    onLogout();
  };

  const fetchWithAuth = async (input: RequestInfo, init?: RequestInit) => {
    const res = await fetch(input, {
      ...init,
      credentials: 'include',
      headers: { ...(init?.headers || {}) },
    });
    if (res.status === 401) {
      handleUnauthorized();
      throw new Error('Session expired');
    }
    return res;
  };

  const fetchNotifications = async () => {
    const res = await fetchWithAuth('/api/admin/notifications');
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Failed to fetch notifications');
    setContacts(data.contacts || []);
    setPartnerApplications(data.partnerApplications || []);
    setNotificationCount(Number(data.unreadCount || 0));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'news') {
        const res = await fetch('/api/news');
        setNews(await res.json());
      }
      if (activeTab === 'events') {
        const res = await fetch('/api/events');
        setEvents(await res.json());
      }
      if (activeTab === 'partners') {
        const res = await fetch('/api/partners');
        setPartners(await res.json());
      }
      if (activeTab === 'team') {
        const res = await fetch('/api/team-members');
        const data = await res.json().catch(() => ([]));
        setTeamMembers(Array.isArray(data) ? data : []);
      }
      if (activeTab === 'admins') {
        const res = await fetchWithAuth('/api/admin/admins');
        const data = await res.json().catch(() => ([]));
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch admins');
        }
        setAdmins(Array.isArray(data) ? data : []);
      }
      await fetchNotifications();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'news' | 'event') => {
    const files = Array.from(e.target.files || []).slice(0, 4);
    if (!files.length) return;
    const images = await Promise.all(files.map(toDataUrl));
    if (type === 'news') {
      setNewsForm(prev => ({ ...prev, photos: [...prev.photos, ...images].slice(0, 4) }));
    } else {
      setEventForm(prev => ({ ...prev, photos: [...prev.photos, ...images].slice(0, 4) }));
    }
  };

  const handlePartnerImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const image = await toDataUrl(file);
    setPartnerForm(prev => ({ ...prev, image_url: image }));
  };

  const handleTeamPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const image = await toDataUrl(file);
    setTeamForm(prev => ({ ...prev, photo_url: image }));
  };

  const submitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.photos.length) return alert('Please upload at least one photo for news.');
    try {
      const res = await fetchWithAuth('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to publish news');
      alert('News added successfully');
      setNewsForm({ title_en: '', title_am: '', summary_en: '', summary_am: '', description_en: '', description_am: '', photos: [] });
      await fetchData();
    } catch (error: any) {
      alert(error?.message || 'Failed to publish news');
    }
  };

  const submitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.photos.length) return alert('Please upload at least one photo for event.');
    try {
      const res = await fetchWithAuth('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to publish event');
      alert('Event added successfully');
      setEventForm({ title_en: '', title_am: '', summary_en: '', summary_am: '', description_en: '', description_am: '', photos: [], start_date: '', end_date: '' });
      await fetchData();
    } catch (error: any) {
      alert(error?.message || 'Failed to publish event');
    }
  };

  const submitPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.image_url) return alert('Please upload a logo/image for the partner.');
    try {
      const res = await fetchWithAuth('/api/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partnerForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to add partner');
      alert('Partner added successfully');
      setPartnerForm({ category: 'university', name: '', description: '', image_url: '' });
      await fetchData();
    } catch (error: any) {
      alert(error?.message || 'Failed to add partner');
    }
  };

  const submitTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.photo_url) return alert('Please upload one portrait photo for this team member.');
    try {
      const res = await fetchWithAuth('/api/admin/team-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to add CTNET member');
      alert('CTNET member added successfully');
      setTeamForm({
        name: '',
        member_title: '',
        position_role: '',
        description: '',
        photo_url: '',
        facebook_url: '',
        x_url: '',
        youtube_url: '',
      });
      await fetchData();
      onTeamMembersChanged();
    } catch (error: any) {
      alert(error?.message || 'Failed to add CTNET member');
    }
  };

  const deletePartner = async (id: string) => {
    if (!confirm('Delete this partner?')) return;
    try {
      const res = await fetchWithAuth(`/api/admin/partners/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to delete partner');
      await fetchData();
    } catch (error: any) {
      alert(error?.message || 'Failed to delete partner');
    }
  };

  const deleteTeamMember = async (id: string) => {
    if (!confirm('Delete this CTNET member?')) return;
    try {
      const res = await fetchWithAuth(`/api/admin/team-members/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to delete CTNET member');
      await fetchData();
      onTeamMembersChanged();
    } catch (error: any) {
      alert(error?.message || 'Failed to delete CTNET member');
    }
  };

  const addAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetchWithAuth('/api/admin/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to generate admin account');
      setGeneratedPassword(data.generatedPassword || '');
      setAdminForm({ email: '' });
      await fetchData();
    } catch (error: any) {
      alert(error?.message || 'Failed to generate admin account');
    }
  };

  const deleteNews = async (id: string) => {
    if (!confirm('Delete this news item?')) return;
    try {
      const res = await fetchWithAuth(`/api/admin/news/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to delete news');
      await fetchData();
    } catch (error: any) {
      alert(error?.message || 'Failed to delete news');
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    try {
      const res = await fetchWithAuth(`/api/admin/events/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to delete event');
      await fetchData();
    } catch (error: any) {
      alert(error?.message || 'Failed to delete event');
    }
  };

  const tabHeadingLabels: Record<typeof activeTab, string> = {
    news: 'News',
    events: 'Events',
    partners: 'Partners',
    team: 'CTNET Team',
    people: 'People',
    admins: 'Admins',
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="w-64 min-w-[16rem] max-w-[16rem] shrink-0 h-screen sticky top-0 bg-primary text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <LayoutDashboard size={24} />
            Admin Panel
          </h1>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <button type="button" onClick={() => setActiveTab('news')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'news' ? 'bg-white/20' : 'hover:bg-white/10'}`}><Newspaper size={20} />News</button>
          <button type="button" onClick={() => setActiveTab('events')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'events' ? 'bg-white/20' : 'hover:bg-white/10'}`}><Calendar size={20} />Events</button>
          <button type="button" onClick={() => setActiveTab('partners')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'partners' ? 'bg-white/20' : 'hover:bg-white/10'}`}><Handshake size={20} />Partners</button>
          <button type="button" onClick={() => setActiveTab('team')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'team' ? 'bg-white/20' : 'hover:bg-white/10'}`}><Users size={20} />Add CTNET Member</button>
          <button type="button" onClick={() => setActiveTab('people')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl relative ${activeTab === 'people' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
            <Mail size={20} />
            People
            {notificationCount > 0 && <span className="absolute right-4 top-3 min-w-5 h-5 px-1 bg-secondary text-white text-[10px] flex items-center justify-center rounded-full">{notificationCount}</span>}
          </button>
          <button type="button" onClick={() => setActiveTab('admins')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'admins' ? 'bg-white/20' : 'hover:bg-white/10'}`}><UserPlus size={20} />Manage Admins</button>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button type="button" onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-400"><LogOut size={20} />Logout</button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-8">
        <header className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-slate-900">{tabHeadingLabels[activeTab]} Management</h2>
          <div className="relative">
            <Bell size={24} className="text-slate-400" />
            {notificationCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-white" />}
          </div>
        </header>
        {loading && <p className="text-slate-500 mb-4">Loading...</p>}

        {activeTab === 'news' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus size={20} className="text-primary" />Add New News</h3>
              <form onSubmit={submitNews} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required value={newsForm.title_en} onChange={e => setNewsForm({ ...newsForm, title_en: e.target.value })} placeholder="Title (English)" className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                <input required value={newsForm.title_am} onChange={e => setNewsForm({ ...newsForm, title_am: e.target.value })} placeholder="Title (Amharic)" className="w-full px-4 py-3 rounded-xl border border-slate-200 font-amharic" />
                <textarea required value={newsForm.summary_en} onChange={e => setNewsForm({ ...newsForm, summary_en: e.target.value })} placeholder="Summary (English)" className="w-full px-4 py-3 rounded-xl border border-slate-200 h-24" />
                <textarea required value={newsForm.summary_am} onChange={e => setNewsForm({ ...newsForm, summary_am: e.target.value })} placeholder="Summary (Amharic)" className="w-full px-4 py-3 rounded-xl border border-slate-200 h-24 font-amharic" />
                <textarea value={newsForm.description_en} onChange={e => setNewsForm({ ...newsForm, description_en: e.target.value })} placeholder="Description (English)" className="md:col-span-2 w-full px-4 py-3 rounded-xl border border-slate-200 h-24" />
                <textarea value={newsForm.description_am} onChange={e => setNewsForm({ ...newsForm, description_am: e.target.value })} placeholder="Description (Amharic)" className="md:col-span-2 w-full px-4 py-3 rounded-xl border border-slate-200 h-24 font-amharic" />
                <div className="md:col-span-2 flex gap-4 flex-wrap">
                  {newsForm.photos.map((p, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border">
                      <img src={p} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setNewsForm(prev => ({ ...prev, photos: prev.photos.filter((_, idx) => idx !== i) }))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><Trash2 size={12} /></button>
                    </div>
                  ))}
                  {newsForm.photos.length < 4 && (
                    <label className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 cursor-pointer">
                      <ImageIcon size={24} />
                      <span className="text-[10px] font-bold mt-1">Upload</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={e => handlePhotoUpload(e, 'news')} />
                    </label>
                  )}
                </div>
                <button type="submit" className="md:col-span-2 bg-primary text-white py-4 rounded-2xl font-bold">Publish News</button>
              </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{item.title_en}</p>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.summary_en}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteNews(item.id)}
                      className="shrink-0 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Calendar size={20} className="text-secondary" />Add New Event</h3>
              <form onSubmit={submitEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required value={eventForm.title_en} onChange={e => setEventForm({ ...eventForm, title_en: e.target.value })} placeholder="Title (English)" className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                <input required value={eventForm.title_am} onChange={e => setEventForm({ ...eventForm, title_am: e.target.value })} placeholder="Title (Amharic)" className="w-full px-4 py-3 rounded-xl border border-slate-200 font-amharic" />
                <textarea required value={eventForm.summary_en} onChange={e => setEventForm({ ...eventForm, summary_en: e.target.value })} placeholder="Summary (English)" className="w-full px-4 py-3 rounded-xl border border-slate-200 h-24" />
                <textarea required value={eventForm.summary_am} onChange={e => setEventForm({ ...eventForm, summary_am: e.target.value })} placeholder="Summary (Amharic)" className="w-full px-4 py-3 rounded-xl border border-slate-200 h-24 font-amharic" />
                <input type="date" required value={eventForm.start_date} onChange={e => setEventForm({ ...eventForm, start_date: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                <input type="date" required value={eventForm.end_date} onChange={e => setEventForm({ ...eventForm, end_date: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                <textarea value={eventForm.description_en} onChange={e => setEventForm({ ...eventForm, description_en: e.target.value })} placeholder="Description (English)" className="md:col-span-2 w-full px-4 py-3 rounded-xl border border-slate-200 h-24" />
                <textarea value={eventForm.description_am} onChange={e => setEventForm({ ...eventForm, description_am: e.target.value })} placeholder="Description (Amharic)" className="md:col-span-2 w-full px-4 py-3 rounded-xl border border-slate-200 h-24 font-amharic" />
                <div className="md:col-span-2 flex gap-4 flex-wrap">
                  {eventForm.photos.map((p, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border">
                      <img src={p} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setEventForm(prev => ({ ...prev, photos: prev.photos.filter((_, idx) => idx !== i) }))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><Trash2 size={12} /></button>
                    </div>
                  ))}
                  {eventForm.photos.length < 4 && (
                    <label className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 cursor-pointer">
                      <ImageIcon size={24} />
                      <span className="text-[10px] font-bold mt-1">Upload</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={e => handlePhotoUpload(e, 'event')} />
                    </label>
                  )}
                </div>
                <button type="submit" className="md:col-span-2 bg-secondary text-white py-4 rounded-2xl font-bold">Publish Event</button>
              </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{item.title_en}</p>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.summary_en}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteEvent(item.id)}
                      className="shrink-0 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'partners' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold mb-6">Add New Partner</h3>
              <form onSubmit={submitPartner} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select value={partnerForm.category} onChange={e => setPartnerForm({ ...partnerForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200">
                  <option value="university">University</option>
                  <option value="bank">Bank</option>
                  <option value="hospitals">Hospitals</option>
                  <option value="laboratories">Laboratories</option>
                  <option value="others">Others</option>
                </select>
                <input required value={partnerForm.name} onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })} placeholder="Partner Name" className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                <textarea value={partnerForm.description} onChange={e => setPartnerForm({ ...partnerForm, description: e.target.value })} placeholder="Description" className="md:col-span-2 w-full px-4 py-3 rounded-xl border border-slate-200 h-24" />
                <div className="md:col-span-2 flex items-center gap-4">
                  {partnerForm.image_url && <img src={partnerForm.image_url} className="w-16 h-16 object-contain border rounded-lg" />}
                  <label className="flex-grow px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 cursor-pointer">
                    <ImageIcon size={20} className="mr-2" />
                    <span className="text-sm font-bold">Upload Logo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePartnerImage} />
                  </label>
                </div>
                <button type="submit" className="md:col-span-2 bg-primary text-white py-4 rounded-2xl font-bold">Add Partner</button>
              </form>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-2xl border">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={p.image_url} className="w-12 h-12 object-contain shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold truncate">{p.name}</p>
                        <p className="text-xs text-slate-400 uppercase">{p.category}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deletePartner(p.id)}
                      className="shrink-0 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                  {p.description && <p className="text-sm text-slate-600 mt-3">{p.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus size={20} className="text-primary" />
                Add CTNET Member
              </h3>
              <form onSubmit={submitTeamMember} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  required
                  value={teamForm.name}
                  onChange={e => setTeamForm({ ...teamForm, name: e.target.value })}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200"
                />
                <input
                  required
                  value={teamForm.member_title}
                  onChange={e => setTeamForm({ ...teamForm, member_title: e.target.value })}
                  placeholder="Member Title (Doctor, Professor...)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200"
                />
                <input
                  required
                  value={teamForm.position_role}
                  onChange={e => setTeamForm({ ...teamForm, position_role: e.target.value })}
                  placeholder="Position / Role (Director General...)"
                  className="md:col-span-2 w-full px-4 py-3 rounded-xl border border-slate-200"
                />
                <textarea
                  required
                  value={teamForm.description}
                  onChange={e => setTeamForm({ ...teamForm, description: e.target.value })}
                  placeholder="Description about the individual"
                  className="md:col-span-2 w-full px-4 py-3 rounded-xl border border-slate-200 h-32"
                />
                <input
                  value={teamForm.facebook_url}
                  onChange={e => setTeamForm({ ...teamForm, facebook_url: e.target.value })}
                  placeholder="Facebook URL (optional)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200"
                />
                <input
                  value={teamForm.x_url}
                  onChange={e => setTeamForm({ ...teamForm, x_url: e.target.value })}
                  placeholder="X URL (optional)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200"
                />
                <input
                  value={teamForm.youtube_url}
                  onChange={e => setTeamForm({ ...teamForm, youtube_url: e.target.value })}
                  placeholder="YouTube URL (optional)"
                  className="md:col-span-2 w-full px-4 py-3 rounded-xl border border-slate-200"
                />

                <div className="md:col-span-2 flex items-center gap-4">
                  {teamForm.photo_url && (
                    <img src={teamForm.photo_url} className="w-16 h-16 object-cover rounded-lg border" />
                  )}
                  <label className="flex-grow px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 cursor-pointer">
                    <ImageIcon size={20} className="mr-2" />
                    <span className="text-sm font-bold">Upload Portrait Photo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleTeamPhoto} />
                  </label>
                </div>
                <button type="submit" className="md:col-span-2 bg-primary text-white py-4 rounded-2xl font-bold">Save CTNET Member</button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map(member => (
                <div key={member.id} className="bg-white p-4 rounded-2xl border">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={member.photo_url} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold truncate">{member.name}</p>
                        <p className="text-xs text-slate-500 truncate">{member.member_title}</p>
                        <p className="text-xs text-slate-400 truncate">{member.position_role}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteTeamMember(member.id)}
                      className="shrink-0 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 mt-3 line-clamp-3">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'people' && (
          <div className="space-y-10">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Contact Notifications</h3>
              {contacts.length === 0 ? <p className="text-slate-500">No contact notifications yet.</p> : (
                <div className="space-y-4">
                  {contacts.map(c => (
                    <div key={c.id} className={`bg-white p-6 rounded-2xl border ${c.is_read ? 'border-slate-100' : 'border-primary/30 bg-primary/5'}`}>
                      <div className="flex justify-between mb-2">
                        <div><p className="font-bold">{c.name}</p><p className="text-sm text-slate-500">{c.email}</p></div>
                        <p className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} />{new Date(c.created_at).toLocaleDateString()}</p>
                      </div>
                      <p className="font-bold text-slate-800 mb-1">{c.subject}</p>
                      <p className="text-sm text-slate-600">{c.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Partner Applications</h3>
              {partnerApplications.length === 0 ? <p className="text-slate-500">No partner applications yet.</p> : (
                <div className="space-y-4">
                  {partnerApplications.map(p => (
                    <div key={p.id} className={`bg-white p-6 rounded-2xl border ${p.is_read ? 'border-slate-100' : 'border-secondary/30 bg-secondary/5'}`}>
                      <div className="flex justify-between mb-2">
                        <div><p className="font-bold">{p.organization}</p><p className="text-sm text-slate-500">{p.email}</p></div>
                        <p className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} />{new Date(p.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p><span className="font-bold">Category:</span> {p.category}</p>
                        <p><span className="font-bold">Phone:</span> {p.phone_number}</p>
                        <p className="md:col-span-2"><span className="font-bold">Other Category:</span> {p.other_category || '-'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'admins' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><UserPlus size={20} className="text-primary" />Add New Administrator</h3>
              <form onSubmit={addAdmin} className="space-y-6">
                <input type="email" required value={adminForm.email} onChange={e => setAdminForm({ email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200" placeholder="email@ctn-et.org" />
                <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-bold">Generate Admin Account</button>
              </form>

              {generatedPassword && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-green-50 border border-green-100 rounded-2xl">
                  <div className="flex items-center gap-2 text-green-700 font-bold mb-2"><CheckCircle size={20} />Admin Account Created</div>
                  <p className="text-sm text-green-600 mb-4">A temporary password has been generated. Please share this securely with the new admin.</p>
                  <div className="bg-white p-4 rounded-xl border border-green-200 font-mono text-center text-lg font-bold text-slate-900">{generatedPassword}</div>
                </motion.div>
              )}
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
              <h3 className="text-xl font-bold mb-6">Current Administrators</h3>
              {admins.length === 0 ? (
                <p className="text-slate-500">No admins found.</p>
              ) : (
                <div className="space-y-3">
                  {admins.map(admin => (
                    <div key={admin.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                      <div>
                        <p className="font-semibold text-slate-900">{admin.email}</p>
                        <p className="text-xs text-slate-500">Role: {admin.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">{new Date(admin.created_at).toLocaleDateString()}</p>
                        {admin.must_change_password && <p className="text-[11px] text-amber-600 font-semibold">Password reset pending</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex items-start gap-4">
              <ShieldAlert className="text-amber-600 shrink-0" />
              <p className="text-amber-700 text-xs mt-1">New administrators will be required to change their password immediately on first successful login.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
