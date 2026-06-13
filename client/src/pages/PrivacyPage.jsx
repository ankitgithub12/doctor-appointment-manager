import React from 'react';
import { Link } from 'react-router-dom';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold mb-6 border-b border-slate-800 pb-4">Privacy Policy</h1>
        <div className="space-y-6 text-slate-350 text-sm leading-relaxed">
          <p className="text-slate-400">Last updated: June 13, 2026</p>
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-200">1. Information We Collect</h2>
            <p>
              HomeHub Homeopathy collects patient information necessary to provide customized consultation booking. This includes name, phone number, email address, preferred date/time slots, and descriptions of symptoms or health concerns.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-200">2. Medical Privacy & Confidentiality</h2>
            <p>
              All clinical diagnostic details, health concern logs, and doctor consultation notes are strictly confidential. Patient data is encrypted and handled in compliance with medical data privacy guidelines. We do not sell or share patient health records with third-party marketing companies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-200">3. Contacting Us</h2>
            <p>
              If you have questions regarding this privacy policy or wish to delete your patient registration record, you can contact us at care@homehubhomeopathy.com.
            </p>
          </section>
        </div>
        <Link to="/" className="inline-block mt-10 text-teal-400 hover:underline">← Back to home</Link>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold mb-6 border-b border-slate-800 pb-4">Terms of Service</h1>
        <div className="space-y-6 text-slate-350 text-sm leading-relaxed">
          <p className="text-slate-400">Last updated: June 13, 2026</p>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-200">1. Medical Disclaimer</h2>
            <p>
              The information, symptoms matchers, and treatment timelines presented on this website are for educational and exploratory reference only. They do not constitute formal medical diagnosis, prescribing, or substitute professional consultation. Always consult a government-registered homeopath or medical practitioner.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-200">2. Appointment Scheduling</h2>
            <p>
              Submitting an appointment booking or free callback consultation request does not guarantee slot availability. Confirmations are sent via email, phone call, or text messages.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-200">3. Limitation of Liability</h2>
            <p>
              HomeHub Clinic is not liable for outcomes arising from self-medication based on website content. All prescription modifications should be performed strictly under clinical direction.
            </p>
          </section>
        </div>
        <Link to="/" className="inline-block mt-10 text-teal-400 hover:underline">← Back to home</Link>
      </div>
    </div>
  );
}
