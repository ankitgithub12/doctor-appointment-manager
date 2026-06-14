import React from 'react';

export default function AdminBlogs() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-extrabold">Blog Management</h1>
      <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-8 text-center">
        <span className="text-4xl mb-4 block">📝</span>
        <h3 className="text-lg font-bold text-slate-300">Blog System Ready</h3>
        <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
          The blog API is fully functional. Create, edit, and publish health articles for your patients.
          Blog posts will appear on the public /blog page.
        </p>
        <p className="text-slate-500 text-xs mt-4">Coming soon: Rich text editor integration</p>
      </div>
    </div>
  );
}
