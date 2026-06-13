import React, { useState } from 'react';
import { consultationService } from '../api/services.js';
import toast from 'react-hot-toast';

const PHONE = '+919829593852';
const WHATSAPP = '919829593852';

export default function FreeConsultation() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [concern, setConcern] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    try {
      const response = await consultationService.createConsultation({
        name,
        phone,
        healthConcern: concern || 'General Homeopathy consult',
      });

      if (response?.success) {
        toast.success(response.message || 'Consultation callback requested!');
        setStatus('sent');
      }
    } catch (error) {
      toast.error(error.message || 'Callback request failed. Please try again.');
      setStatus('idle');
    }
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setConcern('');
    setStatus('idle');
  };

  return (
    <section className="py-20 bg-slate-900/10" id="free-consultation">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-10 backdrop-blur-md grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-teal-500/5 blur-[80px] pointer-events-none" />

          {/* Copy section */}
          <div className="space-y-6">
            <span className="text-teal-400 text-xs font-semibold uppercase tracking-wider bg-teal-500/5 px-2.5 py-1 rounded-full border border-teal-500/10">
              Limited slots this week
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
              Get a 100% Free Consultation Today
            </h2>
            <p className="text-slate-400 text-sm md:text-md leading-relaxed">
              Not sure where to start? Talk to a certified senior homeopath — completely free.
              No obligation, no medical package pressure. Just honest clinical guidance about your condition.
            </p>

            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Speak directly with a senior doctor
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Personalised first-step diagnostic advice
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Available online (video/phone) &amp; in-clinic
              </li>
            </ul>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 text-sm transition-all"
                href={`https://wa.me/${WHATSAPP}?text=Hi,%20I'd%20like%20a%20free%20consultation`}
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 Chat on WhatsApp
              </a>
              <a
                className="bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 font-semibold py-2.5 px-5 rounded-xl flex items-center gap-2 text-sm transition-all"
                href={`tel:${PHONE}`}
              >
                📞 Call Now
              </a>
            </div>
          </div>

          {/* Form section */}
          <div>
            {status === 'sent' ? (
              <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-center space-y-5 animate-fadeIn">
                <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-2xl font-bold rounded-full flex items-center justify-center mx-auto">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Request Received!</h3>
                  <p className="text-slate-400 text-xs mt-1.5 max-w-xs mx-auto">
                    Our medical care team will call you back shortly to schedule your free consultation slot.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold py-2 rounded-xl transition text-xs"
                >
                  Send Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div>
                  <h3 className="text-md font-bold text-slate-100">Request a Callback</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Drop your details — we'll call within 30 minutes.</p>
                </div>

                <div>
                  <label htmlFor="fn" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="fn"
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500 transition"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="fp" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    id="fp"
                    type="tel"
                    required
                    pattern="[0-9+ ]{10,15}"
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500 transition"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="fc" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Health Concern
                  </label>
                  <input
                    id="fc"
                    type="text"
                    placeholder="e.g. Asthma, Diabetes, Skin..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500 transition"
                    value={concern}
                    onChange={(e) => setConcern(e.target.value)}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center transition hover:shadow-lg hover:shadow-teal-500/10 active:scale-[0.98] disabled:opacity-50 text-xs"
                  >
                    {status === 'sending' ? (
                      <span className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                    ) : (
                      'Request Free Callback'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
