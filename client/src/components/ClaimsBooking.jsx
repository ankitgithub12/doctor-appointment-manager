import React, { useState, useEffect } from 'react';
import { doctorService, appointmentService } from '../api/services.js';
import toast from 'react-hot-toast';
import {
  FaLeaf,
  FaShieldAlt,
  FaBullseye,
  FaUserMd,
  FaClipboardList,
  FaLaptopMedical
} from 'react-icons/fa';

const claims = [
  {
    icon: FaLeaf,
    title: '100% Natural Treatment',
    desc: 'Plant & mineral based medicines with zero chemicals or steroids.',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    borderColor: 'hover:border-emerald-500/35',
    shadowColor: 'hover:shadow-emerald-500/5'
  },
  {
    icon: FaShieldAlt,
    title: 'No Side Effects',
    desc: 'Gentle and safe for infants, pregnant women and the elderly alike.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    borderColor: 'hover:border-cyan-500/35',
    shadowColor: 'hover:shadow-cyan-500/5'
  },
  {
    icon: FaBullseye,
    title: 'Root-Cause Cure',
    desc: 'We treat the underlying cause for lasting relief, not temporary suppression.',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10 border-rose-500/20',
    borderColor: 'hover:border-rose-500/35',
    shadowColor: 'hover:shadow-rose-500/5'
  },
  {
    icon: FaUserMd,
    title: 'Expert Doctors',
    desc: 'BHMS & MD certified specialists with 12+ years of clinical experience.',
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10 border-teal-500/20',
    borderColor: 'hover:border-teal-500/35',
    shadowColor: 'hover:shadow-teal-500/5'
  },
  {
    icon: FaClipboardList,
    title: 'Personalised Plans',
    desc: 'Every protocol is tailored to your unique body, history and lifestyle.',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
    borderColor: 'hover:border-amber-500/35',
    shadowColor: 'hover:shadow-amber-500/5'
  },
  {
    icon: FaLaptopMedical,
    title: 'Online Consultation',
    desc: 'Consult from home — medicines delivered to your doorstep across India.',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10 border-violet-500/20',
    borderColor: 'hover:border-violet-500/35',
    shadowColor: 'hover:shadow-violet-500/5'
  },
];

export default function ClaimsBooking() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [doctors, setDoctors] = useState([]);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [healthConcern, setHealthConcern] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorService.getDoctors();
        if (response?.success) {
          setDoctors(response.data);
          if (response.data.length > 0) {
            setSelectedDoctor(response.data[0]._id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    if (!selectedDoctor) {
      toast.error('Please select a doctor');
      return;
    }

    setStatus('sending');
    try {
      const response = await appointmentService.createAppointment({
        patientName: name,
        email,
        phone,
        preferredDate,
        preferredTime,
        healthConcern,
        doctor: selectedDoctor,
      });

      if (response?.success) {
        toast.success(response.message || 'Appointment requested!');
        setStatus('sent');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit appointment request');
      setStatus('idle');
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPreferredDate('');
    setPreferredTime('');
    setHealthConcern('');
    if (doctors.length > 0) {
      setSelectedDoctor(doctors[0]._id);
    }
    setStatus('idle');
  };

  return (
    <section className="py-20 bg-slate-950" id="appointment">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-teal-400 text-sm font-semibold uppercase tracking-wider">Why Patients Trust Us</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-slate-100">Proven Benefits, Backed by Results</h2>
          <p className="text-slate-400 text-sm md:text-md mt-4">
            A safer, smarter path to recovery — select your specialist and schedule your consultation in under a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Claims List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {claims.map((c) => {
              const IconComponent = c.icon;
              return (
                <div
                  className={`group relative bg-slate-900/15 border border-slate-800/60 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:bg-slate-900/40 hover:shadow-xl ${c.borderColor} ${c.shadowColor}`}
                  key={c.title}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border transition-colors duration-300 ${c.bgColor}`} aria-hidden="true">
                    <IconComponent className={`text-xl transition-transform duration-300 group-hover:scale-110 ${c.color}`} />
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm tracking-wide transition-colors duration-300 group-hover:text-white">
                    {c.title}
                  </h4>
                  <p className="text-slate-400 text-xs mt-2.5 leading-relaxed font-light">
                    {c.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Booking Card */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-teal-500/5 blur-[80px] pointer-events-none" />

            {status === 'sent' ? (
              <div className="text-center py-10 space-y-6 relative z-10 animate-fadeIn">
                <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-3xl font-bold rounded-full flex items-center justify-center mx-auto">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Appointment Requested!</h3>
                  <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
                    Thank you — our care team will contact you within 24 hours to confirm your scheduled slot.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold py-2.5 rounded-xl transition text-sm active:scale-[0.98]"
                >
                  Book Another Appointment
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Book Your Appointment</h3>
                  <p className="text-slate-400 text-xs mt-1">Fill out the clinical form to allocate slot consultations.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="patient-name" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="patient-name"
                      type="text"
                      required
                      placeholder="e.g. Riya Sharma"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/10 transition"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="patient-phone" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Mobile Number *
                    </label>
                    <input
                      id="patient-phone"
                      type="tel"
                      required
                      pattern="[0-9+ ]{10,15}"
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/10 transition"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="patient-email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id="patient-email"
                    type="email"
                    required
                    placeholder="riya@example.com"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/10 transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pref-date" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Preferred Date *
                    </label>
                    <input
                      id="pref-date"
                      type="date"
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/10 transition"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="pref-time" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Preferred Time Slot *
                    </label>
                    <select
                      id="pref-time"
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-300 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/10 transition"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                    >
                      <option value="">Select time</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="health-concern" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Health Concern *
                    </label>
                    <select
                      id="health-concern"
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-300 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/10 transition"
                      value={healthConcern}
                      onChange={(e) => setHealthConcern(e.target.value)}
                    >
                      <option value="">Select a concern</option>
                      <option value="Diabetes">Diabetes</option>
                      <option value="Respiratory issues">Respiratory Care</option>
                      <option value="Allergic Rhinitis">Allergic Rhinitis</option>
                      <option value="Bronchial Asthma">Bronchial Asthma</option>
                      <option value="Skin / Psoriasis">Skin / Psoriasis</option>
                      <option value="Weight Management">Weight Management</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="assigned-doctor" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Assign Doctor *
                    </label>
                    <select
                      id="assigned-doctor"
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-300 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/10 transition"
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                    >
                      {doctors.map((d) => (
                        <option value={d._id} key={d._id}>
                          {d.name} ({d.title})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2 text-xs text-slate-400">
                  <input id="aterms" type="checkbox" required className="mt-0.5" />
                  <label htmlFor="aterms">
                    I agree to the Terms of Service and authorize HomeHub to contact me regarding my booking.
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition hover:shadow-lg hover:shadow-teal-500/10 active:scale-[0.98] disabled:opacity-50"
                  >
                    {status === 'sending' ? (
                      <span className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                    ) : (
                      'Confirm My Appointment'
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
