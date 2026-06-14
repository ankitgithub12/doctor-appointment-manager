import React from 'react';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, totalItems, hasNextPage, hasPrevPage } = pagination;

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
      <span className="text-xs text-slate-500">
        Showing page {currentPage} of {totalPages} ({totalItems} items)
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition disabled:opacity-30 disabled:pointer-events-none"
        >
          ← Prev
        </button>
        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`w-8 h-8 text-xs font-bold rounded-lg transition ${
              num === currentPage
                ? 'bg-teal-500 text-slate-950'
                : 'border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition disabled:opacity-30 disabled:pointer-events-none"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
