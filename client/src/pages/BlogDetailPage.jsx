import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogService } from '../api/services.js';
import Loader from '../components/ui/Loader.jsx';
import toast from 'react-hot-toast';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await blogService.getBlog(slug);
        if (response?.success) {
          setBlog(response.data);
        }
      } catch (error) {
        toast.error('Failed to load article details');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderContent = (content) => {
    if (!content) return null;
    
    // Check if the content contains HTML tags (simple heuristic)
    const hasHtml = /<[a-z][\s\S]*>/i.test(content);
    if (hasHtml) {
      return (
        <div 
          className="prose prose-teal max-w-none text-slate-600 text-sm md:text-base leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      );
    }

    // Otherwise split by double newlines into paragraph blocks
    return (
      <div className="space-y-5 text-slate-600 text-sm md:text-base leading-relaxed">
        {content.split('\n\n').map((para, i) => (
          <p key={i}>
            {para.split('\n').map((line, j) => (
              <React.Fragment key={j}>
                {line}
                {j < para.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-55 text-slate-800 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center space-y-4">
        <span className="text-4xl">🔎</span>
        <h2 className="text-xl font-bold">Article Not Found</h2>
        <Link to="/blogs" className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow">
          Back to Journal Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-28 pb-16 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-8 animate-fadeIn">
        {/* Navigation Breadcrumb */}
        <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
          <Link to="/" className="hover:text-slate-600">Home</Link>
          <span>/</span>
          <Link to="/blogs" className="hover:text-slate-600">Journal</Link>
          <span>/</span>
          <span className="text-slate-500 truncate max-w-[200px] md:max-w-none">{blog.title}</span>
        </div>

        {/* Back Button */}
        <div>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 transition"
          >
            ← Back to Journal Articles
          </Link>
        </div>

        {/* Article Layout */}
        <article className="space-y-6 bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm">
          {/* Header Metadata */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-2xs font-semibold">
              <span className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-md border border-teal-200 uppercase tracking-wider">
                {blog.category || 'homeopathy'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">📅 {formatDate(blog.createdAt)}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">👁️ {blog.views} Reads</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight text-slate-800">
              {blog.title}
            </h1>

            {/* Author Profile */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 pb-2">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center text-xs">
                {blog.author?.avatar ? (
                  <img src={blog.author.avatar} alt={blog.author.name} className="w-full h-full object-cover" />
                ) : (
                  '👤'
                )}
              </div>
              <div>
                <strong className="text-slate-700 font-bold text-sm block leading-snug">
                  By {blog.author?.name || 'Homeopathy Specialist'}
                </strong>
                <span className="text-[10px] text-slate-400 block font-medium mt-0.5">
                  Consulting Practitioner & Health Educator
                </span>
              </div>
            </div>
          </div>

          {/* Large cover image */}
          {blog.coverImage && (
            <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Summary Quote */}
          {blog.summary && (
            <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded-r-xl">
              <p className="text-slate-700 text-xs md:text-sm italic font-medium">
                "{blog.summary}"
              </p>
            </div>
          )}

          {/* Main Body Content */}
          <div className="pt-2 border-t border-slate-100 pb-6">
            {renderContent(blog.content)}
          </div>

          {/* Tags list */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
              <span className="text-2xs text-slate-400 font-bold uppercase tracking-wider flex items-center mr-1">
                🏷️ Tags:
              </span>
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-slate-50 border border-slate-200 text-slate-600 text-3xs font-semibold px-2.5 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
