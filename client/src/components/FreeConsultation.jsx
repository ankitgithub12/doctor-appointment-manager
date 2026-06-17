import React, { useState } from 'react';
import { consultationService } from '../api/services.js';
import toast from 'react-hot-toast';
import { FaCheck, FaWhatsapp, FaPhoneAlt, FaUser, FaPhone, FaClipboardList, FaClock } from 'react-icons/fa';

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
    <section className="py-20 bg-slate-50" id="free-consultation">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-100/50 backdrop-blur-md grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative overflow-hidden">
          {/* Glowing subtle light teal element */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-teal-500/3 blur-[100px] pointer-events-none" />

          {/* Copy section */}
          <div className="space-y-6">
            <span className="text-teal-700 text-xs font-bold uppercase tracking-wider bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100/80">
              Limited slots this week
            </span>
            <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-slate-800 leading-tight">
              Get a 100% Free Consultation Today
            </h2>
            <p className="text-slate-500 text-sm md:text-md leading-relaxed font-light">
              Not sure where to start? Talk to a certified senior homeopath — completely free.
              No obligation, no medical package pressure. Just honest clinical guidance about your condition.
            </p>

            <ul className="space-y-3.5 text-xs md:text-sm text-slate-650 font-medium">
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center text-[10px] shrink-0">
                  <FaCheck />
                </span>
                Speak directly with a senior doctor
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center text-[10px] shrink-0">
                  <FaCheck />
                </span>
                Personalised first-step diagnostic advice
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center text-[10px] shrink-0">
                  <FaCheck />
                </span>
                Available online (video/phone) &amp; in-clinic
              </li>
            </ul>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 text-xs transition-all shadow-md hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] cursor-pointer"
                href={`https://wa.me/${WHATSAPP}?text=Hi,%20I'd%20like%20a%20free%2520consultation`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="text-sm" /> Chat on WhatsApp
              </a>
              <a
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 text-xs transition-all border border-slate-200 active:scale-[0.98] cursor-pointer"
                href={`tel:${PHONE}`}
              >
                <FaPhoneAlt /> Call Now
              </a>
            </div>
          </div>

          {/* Form section */}
          <div>
            {status === 'sent' ? (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center space-y-5 animate-fadeIn shadow-inner">
                <div className="w-12 h-12 bg-teal-50 border border-teal-100 text-teal-600 text-xl font-bold rounded-full flex items-center justify-center mx-auto">
                  <FaCheck />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Request Received!</h3>
                  <p className="text-slate-500 text-xs mt-1.5 max-w-xs mx-auto">
                    Our medical care team will call you back shortly to schedule your free consultation slot.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl transition text-xs shadow cursor-pointer"
                >
                  Send Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 space-y-4 shadow-inner">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <FaClock className="text-teal-600" /> Request a Callback
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">Drop your details — we'll call within 30 minutes.</p>
                </div>

                <div>
                  <label htmlFor="fn" className="block text-xs font-bold text-slate-600 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FaUser className="text-[10px]" />
                    </div>
                    <input
                      id="fn"
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="fp" className="block text-xs font-bold text-slate-600 mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FaPhone className="text-[10px]" />
                    </div>
                    <input
                      id="fp"
                      type="tel"
                      required
                      pattern="[0-9+ ]{10,15}"
                      placeholder="+91 98765 43210"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="fc" className="block text-xs font-bold text-slate-600 mb-1">
                    Health Concern
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FaClipboardList className="text-[10px]" />
                    </div>
                    <input
                      id="fc"
                      type="text"
                      placeholder="e.g. Asthma, Diabetes, Skin..."
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition"
                      value={concern}
                      onChange={(e) => setConcern(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98] disabled:opacity-50 text-xs cursor-pointer"
                  >
                    {status === 'sending' ? (
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
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
