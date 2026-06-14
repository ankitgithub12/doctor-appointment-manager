import React, { useState } from 'react';
import { contactService } from '../api/services.js';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaUser, FaPhone, FaClipboardList, FaLeaf } from 'react-icons/fa';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await contactService.createContact({ name, email, phone, subject, message });
      if (response?.success) {
        toast.success(response.message || 'Message sent successfully!');
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-28 pb-16 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-teal-650 text-xs font-bold uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Get in Touch
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3 text-slate-900">
            Contact <span className="text-teal-605">HomeHub Clinic</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-md mt-4">
            Have queries about homeopathy treatments, packaging, or doctor sessions? Reach out and we'll respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details & Info */}
          <div className="space-y-8">
            <div className="bg-white border border-slate-100/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-md">
              <h2 className="text-lg font-bold border-b border-slate-100 pb-3 text-slate-850">Clinic Information</h2>
              <div className="space-y-5 text-slate-600 font-medium">
                
                <div className="flex gap-4">
                  <span className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center text-sm flex-shrink-0">
                    <FaMapMarkerAlt />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Address</h3>
                    <p className="text-xs text-slate-500 mt-1">102, Apex Mall, Lalkothi, Jaipur, Rajasthan 302015</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center text-sm flex-shrink-0">
                    <FaPhoneAlt />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Phone</h3>
                    <p className="text-xs text-slate-500 mt-1">+91 98295 93852</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center text-sm flex-shrink-0">
                    <FaEnvelope />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Email</h3>
                    <p className="text-xs text-slate-500 mt-1">care@homehubhomeopathy.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center text-sm flex-shrink-0">
                    <FaClock />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Working Hours</h3>
                    <p className="text-xs text-slate-500 mt-1">Mon - Sat: 9:00 AM - 8:00 PM</p>
                    <p className="text-xs text-slate-550">Sunday: 10:00 AM - 2:00 PM</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Embedded Map */}
            <div className="bg-white border border-slate-100/80 rounded-3xl p-4 h-80 shadow-md overflow-hidden">
              <iframe
                title="HomeHub Homeopathy Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.4239851608973!2d75.8038527!3d26.8900000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db41fcfffffb3%3A0xe54fb72ffb8a7db3!2sApex%20Mall!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 rounded-2xl bg-slate-50"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl">
            <h2 className="text-lg font-bold border-b border-slate-100 pb-3 mb-6 text-slate-850">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold text-slate-600 mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FaUser className="text-[10px]" />
                    </div>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="John Doe"
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 pl-8 pr-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition text-xs"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-bold text-slate-600 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FaPhone className="text-[10px]" />
                    </div>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 pl-8 pr-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition text-xs"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-bold text-slate-600 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaEnvelope className="text-[10px]" />
                  </div>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 pl-8 pr-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition text-xs"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subj" className="block text-xs font-bold text-slate-600 mb-1">
                  Subject *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaClipboardList className="text-[10px]" />
                  </div>
                  <input
                    id="contact-subj"
                    type="text"
                    required
                    placeholder="How can we help?"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 pl-8 pr-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition text-xs"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-msg" className="block text-xs font-bold text-slate-600 mb-1">
                  Message *
                </label>
                <textarea
                  id="contact-msg"
                  required
                  rows="4"
                  placeholder="Describe your health query, packaging questions, or appointment preferences here..."
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition text-xs"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-teal-500/20 disabled:opacity-50 active:scale-[0.98] cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
