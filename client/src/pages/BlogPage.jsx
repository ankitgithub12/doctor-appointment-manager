import React, { useState, useEffect } from 'react';
import { blogService } from '../api/services.js';
import SearchInput from '../components/ui/SearchInput.jsx';
import Loader from '../components/ui/Loader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const categories = [
  { value: '', label: 'All Articles' },
  { value: 'homeopathy', label: 'Homeopathy Basics' },
  { value: 'treatments', label: 'Clinical Treatments' },
  { value: 'wellness', label: 'General Wellness' },
  { value: 'research', label: 'Research & Cases' },
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 6,
        category: category || undefined,
        search: search || undefined,
      };

      const response = await blogService.getBlogs(params);
      if (response?.success) {
        setBlogs(response.data || []);
        setPagination(response.pagination || null);
      }
    } catch (error) {
      toast.error('Failed to load blog articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [category, search, page]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [category, search]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10 space-y-8 animate-fadeIn">
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-teal-400 text-sm font-semibold uppercase tracking-wider">Health Journal</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100">Homeopathy Wellness & Insights</h1>
          <p className="text-slate-400 text-sm md:text-base">
            Discover articles on chronic treatment methodologies, natural remedies, and lifestyle coaching.
          </p>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900/20 border border-slate-800/80 rounded-2xl p-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap ${
                  category === cat.value
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'bg-slate-950 border border-slate-850 text-slate-450 hover:text-slate-205'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="w-full md:w-80">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search articles..."
            />
          </div>
        </div>

        {/* Blog grid */}
        {loading ? (
          <div className="py-20 flex justify-center"><Loader size="lg" /></div>
        ) : blogs.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((post) => (
                <article
                  key={post._id}
                  className="bg-slate-900/35 border border-slate-850 hover:border-slate-750 rounded-2xl overflow-hidden flex flex-col justify-between transition duration-200 group"
                >
                  <Link to={`/blogs/${post.slug}`}>
                    <div className="aspect-[16/10] w-full bg-slate-950 overflow-hidden relative border-b border-slate-900">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-900 text-slate-700">
                          📝
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-teal-500/10 backdrop-blur-md text-teal-400 text-3xs font-extrabold uppercase px-2.5 py-1 rounded-md border border-teal-500/20">
                        {post.category || 'homeopathy'}
                      </span>
                    </div>
                  </Link>

                  <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-500 font-semibold">
                        📅 {formatDate(post.createdAt)}
                      </span>
                      <Link to={`/blogs/${post.slug}`} className="block">
                        <h2 className="font-extrabold text-slate-200 text-base md:text-lg group-hover:text-teal-400 transition leading-snug line-clamp-2">
                          {post.title}
                        </h2>
                      </Link>
                      <p className="text-slate-400 text-xs md:text-sm line-clamp-3 leading-relaxed">
                        {post.summary || 'Read details of our clinical homeopathy review and results...'}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-900 mt-2">
                      <div className="flex gap-2 items-center">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px]">
                          {post.author?.avatar ? (
                            <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                          ) : (
                            '👤'
                          )}
                        </div>
                        <span className="text-2xs font-semibold text-slate-400">
                          {post.author?.name || 'Clinic Specialist'}
                        </span>
                      </div>

                      <Link
                        to={`/blogs/${post.slug}`}
                        className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
                      >
                        Read Post ➔
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <Pagination pagination={pagination} onPageChange={setPage} />
          </div>
        ) : (
          <EmptyState
            icon="📝"
            title="No articles found"
            description={
              search
                ? `No articles matched search term "${search}".`
                : "No blog articles found in this category category list."
            }
          />
        )}
      </div>
    </div>
  );
}
