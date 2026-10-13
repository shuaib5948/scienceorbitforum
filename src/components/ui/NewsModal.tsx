import React, { useEffect } from 'react';
import { X, Calendar, User, Tag as TagIcon } from 'lucide-react';
import type { Update } from '../../types';

interface NewsModalProps {
  article: Update | null;
  onClose: () => void;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export const NewsModal: React.FC<NewsModalProps> = ({ article, onClose }) => {
  useEffect(() => {
    if (!article) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [article, onClose]);

  if (!article) return null;

  return (
    <div
      className="news-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="news-modal-title"
    >
      <div
        className="news-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="news-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {article.cover && (
          <div className="news-modal-media">
            <img src={article.cover} alt={article.title} />
            <span className="news-modal-badge">{article.tag}</span>
          </div>
        )}

        <div className="news-modal-body">
          {!article.cover && (
            <span className="news-modal-badge" style={{ position: 'static', marginBottom: '0.75rem', display: 'inline-block' }}>
              {article.tag}
            </span>
          )}

          <h2 id="news-modal-title" className="news-modal-title">
            {article.title}
          </h2>

          <div className="news-modal-meta">
            <span className="news-modal-meta-item">
              <Calendar size={14} />
              <span>{formatDate(article.date)}</span>
            </span>
            {article.author && (
              <>
                <span className="news-modal-meta-dot" />
                <span className="news-modal-meta-item">
                  <User size={14} />
                  <span>{article.author}</span>
                </span>
              </>
            )}
          </div>

          <div className="news-modal-content">
            <p>{article.content || article.excerpt}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
