import React, { useState, useEffect } from 'react';
import { doctorService } from '../../api/services.js';
import Modal from '../../components/ui/Modal.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { CardSkeleton } from '../../components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [form, setForm] = useState({ name: '', title: '', qualification: '', experience: 5, certifications: '', expertise: '', initials: '', bio: '', email: '', phone: '', consultationFee: 0 });

  const fetchDoctors = async () => {
    try {
      const response = await doctorService.getDoctors();
      if (response?.success) setDoctors(response.data);
    } catch { toast.error('Failed to load doctors'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const resetForm = () => setForm({ name: '', title: '', qualification: '', experience: 5, certifications: '', expertise: '', initials: '', bio: '', email: '', phone: '', consultationFee: 0 });

  const openCreate = () => { resetForm(); setEditingDoc(null); setShowModal(true); };
  const openEdit = (doc) => {
    setEditingDoc(doc);
    setForm({
      name: doc.name, title: doc.title, qualification: doc.qualification,
      experience: doc.experience, certifications: Array.isArray(doc.certifications) ? doc.certifications.join(', ') : doc.certifications || '',
      expertise: Array.isArray(doc.expertise) ? doc.expertise.join(', ') : doc.expertise || '',
      initials: doc.initials, bio: doc.bio, email: doc.email || '', phone: doc.phone || '', consultationFee: doc.consultationFee || 0,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      const fileInput = document.getElementById('doctor-photo');
      if (fileInput?.files?.[0]) formData.append('photo', fileInput.files[0]);

      if (editingDoc) {
        await doctorService.updateDoctor(editingDoc._id, formData);
        toast.success('Doctor updated');
      } else {
        await doctorService.createDoctor(formData);
        toast.success('Doctor added');
      }
      setShowModal(false);
      fetchDoctors();
    } catch (error) { toast.error(error.message || 'Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor profile?')) return;
    try {
      await doctorService.deleteDoctor(id);
      toast.success('Doctor deleted');
      fetchDoctors();
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3].map(i => <CardSkeleton key={i} />)}</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Manage Doctors</h1>
          <p className="text-slate-400 text-sm mt-1">{doctors.length} specialist profiles</p>
        </div>
        <button onClick={openCreate} className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold py-2.5 px-5 rounded-lg transition">+ Add Doctor</button>
      </div>

      {doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc._id} className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700/50 transition-all">
              <div className="flex gap-3 items-center">
                {doc.photo ? (
                  <img src={doc.photo} alt={doc.name} className="w-12 h-12 rounded-full object-cover border-2 border-teal-500/20" />
                ) : (
                  <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 text-teal-400 font-black flex items-center justify-center rounded-full text-lg">{doc.initials}</div>
                )}
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">{doc.name}</h4>
                  <span className="text-xs text-slate-400 block">{doc.title}</span>
                  <span className="text-xs text-slate-500">{doc.qualification}</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 block uppercase font-bold">Expertise</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {doc.expertise?.map((exp) => (
                    <span key={exp} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">{exp}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-800/80 justify-end">
                <button onClick={() => openEdit(doc)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-700 transition">Edit</button>
                <button onClick={() => handleDelete(doc._id)} className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold py-1.5 px-3 rounded-lg transition">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="🩺" title="No doctors" description="Add your first doctor profile." />
      )}

      {/* Doctor Form Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingDoc ? `Edit: ${editingDoc.name}` : 'Add New Doctor'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Full Name', required: true },
              { key: 'title', label: 'Title', required: true, placeholder: 'e.g. Senior Consultant' },
              { key: 'qualification', label: 'Qualification', required: true },
              { key: 'initials', label: 'Initials', required: true, placeholder: 'e.g. AK' },
              { key: 'experience', label: 'Experience (Years)', type: 'number', required: true },
              { key: 'consultationFee', label: 'Consultation Fee (₹)', type: 'number' },
              { key: 'email', label: 'Email', type: 'email' },
              { key: 'phone', label: 'Phone' },
            ].map(({ key, label, type = 'text', required, placeholder }) => (
              <div key={key}>
                <label className="text-xs text-slate-400 block mb-1">{label} {required && '*'}</label>
                <input type={type} required={required} placeholder={placeholder}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                  value={form[key]} onChange={(e) => setForm({ ...form, [key]: type === 'number' ? Number(e.target.value) : e.target.value })} />
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Expertise (comma separated)</label>
            <input type="text" placeholder="Thyroid, Skin, Hair" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
              value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Certifications (comma separated)</label>
            <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
              value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Biography *</label>
            <textarea required rows="3" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
              value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Profile Photo</label>
            <input type="file" id="doctor-photo" accept="image/*" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-500/10 file:text-teal-400" />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-4 rounded-lg text-sm border border-slate-700 transition">Cancel</button>
            <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2 px-5 rounded-lg text-sm transition">{editingDoc ? 'Save Changes' : 'Add Doctor'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
