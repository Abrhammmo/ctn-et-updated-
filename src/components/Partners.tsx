import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Handshake, Hospital, FlaskConical, ShieldCheck, Landmark } from 'lucide-react';
import { Language } from '../types';

interface PartnersProps {
  lang: Language;
  t: any;
  partners: any[];
}

export default function Partners({ lang, t, partners }: PartnersProps) {
  const categoryMeta: Record<string, { title: string; icon: any }> = {
    bank: { title: 'Bank', icon: Landmark },
    university: { title: 'University', icon: Hospital },
    hospital: { title: 'Hospitals', icon: Hospital },
    hospitals: { title: 'Hospitals', icon: Hospital },
    laboratory: { title: 'Laboratories', icon: FlaskConical },
    laboratories: { title: 'Laboratories', icon: FlaskConical },
    labratory: { title: 'Laboratories', icon: FlaskConical },
    labratories: { title: 'Laboratories', icon: FlaskConical },
    other: { title: 'Other', icon: ShieldCheck },
    others: { title: 'Others', icon: FlaskConical },
  };

  const groupedPartners = partners.reduce((acc: Record<string, any[]>, partner: any) => {
    const categoryKey = String(partner.category || 'other').toLowerCase();
    if (!acc[categoryKey]) {
      acc[categoryKey] = [];
    }
    acc[categoryKey].push(partner);
    return acc;
  }, {});
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    organization: '',
    category: 'bank',
    otherCategory: '',
    phoneNumber: '',
    email: '',
  });

  const submitPartnerApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/partner-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setStatus('success');
      setFormData({
        organization: '',
        category: 'bank',
        otherCategory: '',
        phoneNumber: '',
        email: '',
      });
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error?.message || 'Failed to submit application');
    }
  };

  const toWebsiteUrl = (website: string) => {
    if (/^https?:\/\//i.test(website)) return website;
    return `https://${website}`;
  };

  return (
    <motion.section 
      key="partners"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
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
      <div className="text-center mb-16">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
          <Handshake size={32} />
        </div>
        <h2 className={`text-4xl md:text-5xl font-bold text-slate-900 mb-6 ${lang === 'am' ? 'font-amharic' : ''}`}>{t.partners.title}</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {lang === 'en' ? 'CTN-ET collaborates with a wide range of institutions to strengthen Ethiopia\'s clinical trial ecosystem.' : 'CTN-ET የኢትዮጵያን የክሊኒካል ሙከራ ሥነ-ምህዳር ለማጠናከር ከብዙ ተቋማት ጋር ይተባበራል።'}
        </p>
      </div>

      <div className="space-y-10 mb-16">
        {Object.keys(groupedPartners).length === 0 ? (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
            <p className="text-slate-500 font-medium">No partners have been added yet.</p>
          </div>
        ) : (
          Object.entries(groupedPartners as Record<string, any[]>).map(([category, categoryPartners]) => {
            const meta = categoryMeta[category] || categoryMeta.other;
            const Icon = meta.icon;

            return (
              <div key={category} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Icon size={30} />
                  </div>
                  <h3 className={`text-2xl font-bold text-slate-900 ${lang === 'am' ? 'font-amharic' : ''}`}>
                    {meta.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(categoryPartners as any[]).map((partner: any) => (
                    <div key={partner.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5 flex flex-col">
                      <div className="h-28 mb-4 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden">
                        {partner.image_url ? (
                          <img src={partner.image_url} alt={partner.name} className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="text-xs text-slate-400">No image</span>
                        )}
                      </div>
                      <p className="font-bold text-slate-900 mb-2">{partner.name}</p>
                      {(() => {
                        const description = partner.description || 'No description provided.';
                        const isExpanded = Boolean(expandedDescriptions[partner.id]);
                        const canExpand = description.length > 140;
                        return (
                          <>
                            <p className={`text-sm text-slate-600 ${!isExpanded && canExpand ? 'line-clamp-3' : ''}`}>{description}</p>
                            {canExpand && (
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedDescriptions((prev) => ({
                                    ...prev,
                                    [partner.id]: !prev[partner.id],
                                  }))
                                }
                                className="mt-2 text-sm font-semibold text-primary text-left"
                              >
                                {isExpanded ? 'Show less' : 'Read more'}
                              </button>
                            )}
                          </>
                        );
                      })()}
                      {partner.official_website && (
                        <a
                          href={toWebsiteUrl(partner.official_website)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex text-sm font-semibold text-secondary hover:text-secondary/80"
                        >
                          Official website
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-primary text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] -mr-48 -mt-48" />
        <div className="relative z-10 text-center">
          <h3 className={`text-3xl font-bold mb-6 ${lang === 'am' ? 'font-amharic' : ''}`}>
            {lang === 'en' ? 'Become a Partner' : 'አጋር ይሁኑ'}
          </h3>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            {lang === 'en' ? 'Join our network of clinical trial sites, researchers, and regulatory bodies to shape the future of clinical research in Ethiopia.' : 'በኢትዮጵያ የክሊኒካል ምርምርን የወደፊት ሁኔታ ለመቅረጽ የክሊኒካል ሙከራ ቦታዎችን፣ ተመራማሪዎችን እና ተቆጣጣሪ አካላትን መረብ ይቀላቀሉ።'}
          </p>
          <button
            type="button"
            onClick={() => {
              setShowApplyForm(prev => !prev);
              setStatus('idle');
              setErrorMessage('');
            }}
            className="bg-white text-primary px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-slate-50 transition-all"
          >
            {lang === 'en' ? 'Become a Partner' : 'አጋር ይሁኑ'}
          </button>

          {showApplyForm && (
            <form onSubmit={submitPartnerApplication} className="mt-8 bg-white text-slate-900 rounded-2xl p-6 max-w-2xl mx-auto text-left space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Organization*</label>
                <input
                  required
                  value={formData.organization}
                  onChange={e => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Category*</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                >
                  <option value="bank">Bank</option>
                  <option value="university">University</option>
                  <option value="hospitals">Hospitals</option>
                  <option value="laboratories">Laboratories</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {formData.category === 'other' && (
                <div>
                  <label className="block text-sm font-bold mb-2">Specify Category*</label>
                  <input
                    required
                    value={formData.otherCategory}
                    onChange={e => setFormData({ ...formData, otherCategory: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold mb-2">Phone Number*</label>
                <input
                  required
                  value={formData.phoneNumber}
                  onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Email*</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold disabled:opacity-60"
              >
                {status === 'loading' ? 'Submitting...' : 'Submit Application'}
              </button>

              {status === 'success' && (
                <p className="text-green-700 font-bold">
                  you have successfully applied to be a partner our staffs will contact you shortly
                </p>
              )}
              {status === 'error' && <p className="text-red-600 font-bold">{errorMessage}</p>}
            </form>
          )}
        </div>
      </div>
    </motion.section>
  );
}
