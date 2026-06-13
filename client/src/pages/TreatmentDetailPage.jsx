import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { treatmentService } from '../api/services.js';
import Loader from '../components/ui/Loader.jsx';
import toast from 'react-hot-toast';
import SEO from '../components/SEO.jsx';

export default function TreatmentDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreatmentDetails = async () => {
      try {
        const response = await treatmentService.getTreatment(slug);
        if (response?.success) {
          setTreatment(response.data);
        } else {
          toast.error('Treatment details not found');
        }
      } catch (error) {
        toast.error('Failed to load treatment details');
      } finally {
        setLoading(false);
      }
    };

    fetchTreatmentDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center flex-col p-4">
        <span className="text-5xl">🔎</span>
        <h2 className="text-2xl font-bold mt-4">Treatment Profile Not Found</h2>
        <p className="text-slate-400 mt-2 max-w-md text-center">
          The treatment program you are looking for doesn't exist or has been deactivated.
        </p>
        <Link
          to="/treatments"
          className="mt-6 bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-2.5 rounded-lg font-semibold transition"
        >
          View All Treatments
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 relative overflow-hidden">
      <SEO title={treatment.name} description={treatment.shortDesc} />
      {/* Background radial highlight */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none opacity-20"
        style={{ backgroundColor: treatment.color }}
      />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none opacity-10" />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Navigation Breadcrumb */}
        <Link
          to="/treatments"
          className="text-slate-400 hover:text-teal-400 text-sm font-semibold flex items-center gap-1.5 transition-colors mb-8"
        >
          ← Back to Treatments
        </Link>

        {/* Treatment Header */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-10 backdrop-blur-md mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-5 items-start">
            <span className="text-5xl md:text-6xl bg-slate-950/80 border border-slate-800 w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center shadow-lg">
              {treatment.icon}
            </span>
            <div>
              <span
                className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: `${treatment.color}15`, color: treatment.color, border: `1px solid ${treatment.color}30` }}
              >
                {treatment.category} Category
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mt-3 text-slate-100">
                {treatment.name}
              </h1>
              <p className="text-slate-400 text-sm md:text-md mt-2 max-w-xl leading-relaxed">
                {treatment.shortDesc}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-slate-950/50 border border-slate-850 p-6 rounded-2xl text-center min-w-[150px] w-full md:w-auto">
            <span className="text-4xl font-black" style={{ color: treatment.color }}>
              {treatment.successRate}%
            </span>
            <span className="text-xs text-slate-400 uppercase font-bold mt-1 tracking-wider">Success Rate</span>
            <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${treatment.successRate}%`, backgroundColor: treatment.color }} />
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Symptoms Card */}
            <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-md font-bold text-slate-200 uppercase tracking-wider">Symptoms We Diagnose & Treat</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {treatment.symptoms?.map((symptom) => (
                  <span
                    key={symptom}
                    className="text-sm bg-slate-950 border border-slate-800 text-slate-300 py-1.5 px-4 rounded-xl hover:border-slate-700 transition"
                  >
                    🔍 {symptom}
                  </span>
                ))}
              </div>
            </div>

            {/* Timeline Healing Journey */}
            <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl space-y-6">
              <h3 className="text-md font-bold text-slate-200 uppercase tracking-wider">Clinical Healing Journey Timeline</h3>
              <ol className="relative border-l border-slate-800/80 ml-3 space-y-6">
                {treatment.timeline?.map((step, idx) => (
                  <li className="relative pl-6 group" key={step.stage}>
                    {/* Glowing bullet point */}
                    <span
                      className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md group-hover:scale-110 transition"
                      style={{ backgroundColor: treatment.color }}
                    >
                      <span className="w-1.5 h-1.5 bg-slate-950 rounded-full" />
                    </span>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {step.stage} • Avg. duration: {step.duration || 'N/A'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-200 mt-1">{step.stage} Remedy phase</h4>
                      <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">{step.details}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Sidebar Treatment Booking & Specs */}
          <div className="space-y-6">
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-5">
              <h3 className="text-md font-bold border-b border-slate-800 pb-3">Treatment Specs</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-500 block uppercase font-bold">Average Recovery Duration</span>
                  <span className="text-slate-200 font-semibold text-sm">{treatment.avgDuration}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block uppercase font-bold">Satisfied Recoveries</span>
                  <span className="text-slate-200 font-semibold text-sm">{treatment.patientCount} patients</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block uppercase font-bold">Therapeutic Approach</span>
                  <span className="text-slate-200 font-semibold text-sm">Constitutional Homeopathy</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4 text-center">
              <h3 className="text-md font-bold">Ready to Start Recovery?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Consult with our registered homeopathy panel to identify genetic triggers and customize your dilution dose.
              </p>
              <div className="space-y-3 pt-2">
                <a
                  href="/#appointment"
                  className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition hover:shadow-lg hover:shadow-teal-500/10 active:scale-[0.98]"
                >
                  📅 Book Consultation
                </a>
                <a
                  href="https://wa.me/919829593852"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition"
                >
                  💬 Ask on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
