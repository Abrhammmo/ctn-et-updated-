import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, Globe, MapPin, ExternalLink, Send } from 'lucide-react';
import { Language } from '../types';

interface ContactProps {
  lang: Language;
  t: any;
}

export default function Contact({ lang, t }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <motion.section 
      key="contact"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-7xl mx-auto px-4 py-10 md:py-16"
    >
      <div className="flex justify-center mb-6 md:mb-8">
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
      <div className="text-center mb-10 md:mb-16">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
          <Phone size={28} className="md:w-8 md:h-8" />
        </div>
        <h2 className={`text-3xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6 ${lang === 'am' ? 'font-amharic' : ''}`}>{t.contact.title}</h2>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {lang === 'en' ? 'Get in touch with the CTN-ET team at the Armauer Hansen Research Institute.' : 'በአርማወር ሀንሰን የምርምር ኢንስቲትዩት ከ CTN-ET ቡድን ጋር ይገናኙ።'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
        <div className="space-y-6 md:space-y-8">
          <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-slate-100">
            <h3 className={`text-xl md:text-2xl font-bold text-slate-900 mb-6 md:mb-8 ${lang === 'am' ? 'font-amharic' : ''}`}>Contact Information</h3>
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start md:items-center gap-4 md:gap-6 p-4 md:p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <MapPin size={24} className="md:w-7 md:h-7" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Address</p>
                  <p className="font-bold text-slate-900 text-sm md:text-base">{t.contact.address}</p>
                </div>
              </div>
              <div className="flex items-start md:items-center gap-4 md:gap-6 p-4 md:p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Phone size={24} className="md:w-7 md:h-7" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                  <p className="font-bold text-slate-900 text-sm md:text-base">{t.contact.phone}</p>
                </div>
              </div>
              <div className="flex items-start md:items-center gap-4 md:gap-6 p-4 md:p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Mail size={24} className="md:w-7 md:h-7" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                  <p className="font-bold text-slate-900 text-sm md:text-base">{t.contact.email}</p>
                </div>
              </div>
              <div className="flex items-start md:items-center gap-4 md:gap-6 p-4 md:p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Globe size={24} className="md:w-7 md:h-7" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Website</p>
                  <a href={`https://${t.contact.website}`} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline flex items-center gap-2 text-sm md:text-base">
                    {t.contact.website}
                    <ExternalLink size={14} className="md:w-4 md:h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-slate-100">
            <h3 className={`text-xl md:text-2xl font-bold text-slate-900 mb-6 md:mb-8 ${lang === 'am' ? 'font-amharic' : ''}`}>Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] md:text-sm font-bold text-slate-700 uppercase tracking-wider">Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="input-field" 
                    placeholder="Full Name" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-sm font-bold text-slate-700 uppercase tracking-wider">Email</label>
                  <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="input-field" 
                    placeholder="Email Address" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] md:text-sm font-bold text-slate-700 uppercase tracking-wider">Subject</label>
                <input 
                  required
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  className="input-field" 
                  placeholder="Message Subject" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] md:text-sm font-bold text-slate-700 uppercase tracking-wider">Message</label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="input-field min-h-[120px] md:min-h-[150px]" 
                  placeholder="Your Message..." 
                />
              </div>
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-secondary hover:bg-accent text-white py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <Send size={18} className="md:w-5 md:h-5" />
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
              {status === 'success' && <p className="text-green-600 font-bold text-center text-sm">Message sent successfully!</p>}
              {status === 'error' && <p className="text-red-600 font-bold text-center text-sm">Failed to send message.</p>}
            </form>
          </div>
        </div>

        <div className="bg-white p-2 md:p-4 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden h-[400px] lg:h-full min-h-[400px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3756.09665730993!2d38.707765!3d8.9884548!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b875152e1f8b1%3A0x47f1dd5b9b8cf1b!2zQXJtYXVlciBIYW5zZW4gUmVzZWFyY2ggInstGl0dXRlIOGKoOGIreGIm-GLiOGIrSDhiJDhipXhiLDhipUg4Yuo4Yid4Yit4Yid4YitIOGJsOGJi-GInSAo4Yqg4YiF4YiqKQ!5e1!3m2!1sen!2set!4v1772294314451!5m2!1sen!2set" 
            width="100%" 
            height="100%" 
            style={{ border: 0, borderRadius: '1.5rem' }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </motion.section>
  );
}
