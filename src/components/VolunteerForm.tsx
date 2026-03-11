import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface VolunteerFormProps {
  lang: Language;
  t: any;
  onSuccess: () => void;
}

export default function VolunteerForm({ lang, t, onSuccess }: VolunteerFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleVolunteerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      id: crypto.randomUUID(),
      full_name: formData.get('full_name'),
      date_of_birth: formData.get('date_of_birth'),
      sex: formData.get('sex'),
      phone_number: formData.get('phone_number'),
      email: formData.get('email'),
      national_id: formData.get('national_id'),
      address: formData.get('address'),
      chronic_illness: formData.get('chronic_illness') === 'on',
      health_data: {},
      consent_given: formData.get('consent_given') === 'on',
    };

    try {
      const res = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: lang === 'en' ? 'Registration successful!' : 'ምዝገባው ተሳክቷል!' });
        (e.target as HTMLFormElement).reset();
        onSuccess();
      } else {
        throw new Error();
      }
    } catch (err) {
      setMessage({ type: 'error', text: lang === 'en' ? 'Registration failed.' : 'ምዝገባው አልተሳካም።' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <motion.section 
      key="volunteer"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto px-4 py-16"
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
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Users size={24} />
          </div>
          <h2 className={`text-3xl font-bold text-slate-900 ${lang === 'am' ? 'font-amharic' : ''}`}>{t.volunteer.title}</h2>
        </div>

        {message && (
          <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleVolunteerSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t.volunteer.full_name}</label>
              <input name="full_name" required className="input-field" placeholder="e.g. Abebe Bikila" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t.volunteer.dob}</label>
              <input name="date_of_birth" type="date" required className="input-field" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t.volunteer.sex}</label>
              <select name="sex" required className="input-field">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t.volunteer.phone}</label>
              <input name="phone_number" required className="input-field" placeholder="+251..." />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t.volunteer.email}</label>
            <input name="email" type="email" className="input-field" placeholder="abebe@example.com" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t.volunteer.address}</label>
            <textarea name="address" className="input-field min-h-[100px]" placeholder="City, Sub-city, Woreda..." />
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
            <input type="checkbox" name="chronic_illness" id="chronic" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
            <label htmlFor="chronic" className="text-slate-700 font-medium">{t.volunteer.chronic}</label>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <input type="checkbox" name="consent_given" id="consent" required className="mt-1 w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
            <label htmlFor="consent" className="text-slate-700 text-sm leading-relaxed">{t.volunteer.consent}</label>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-secondary hover:bg-accent text-white py-4 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ArrowRight size={20} />
                <span className={lang === 'am' ? 'font-amharic' : ''}>{t.volunteer.submit}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </motion.section>
  );
}
