import React from 'react';

export default function AdminBlogs() {
  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900">Blog Management</h1>
        <p className="text-sm text-slate-500 mt-1">Publish homeopathic advice, articles, and clinic announcements.</p>
      </div>
      <div className="bg-white border border-slate-200/60 rounded-xl p-8 text-center shadow-sm">
        <span className="text-4xl mb-4 block">📝</span>
        <h3 className="text-lg font-bold text-slate-800">Blog System Ready</h3>
        <p className="text-slate-655 text-sm mt-2 max-w-md mx-auto leading-relaxed">
          The blog API is fully functional. Create, edit, and publish health articles for your patients.
          Blog posts will appear on the public /blog page.
        </p>
        <p className="text-slate-400 text-xs mt-4 font-bold uppercase tracking-wider">Coming soon: Rich text editor integration</p>
      </div>
    </div>
  );
}
