'use client';

import React, { useState } from 'react';
import { Star, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { sanitizeInput } from '@/lib/security';

interface FeedbackWidgetProps {
  jobId: string;
  workerName: string;
  workerRole: string;
  onSubmit?: (rating: number, comment: string) => void;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  jobId,
  workerName,
  workerRole,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      if (onSubmit) onSubmit(rating, sanitizeInput(comment));
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 rounded-2xl p-6 text-center border border-emerald-100 shadow-sm">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
        <h4 className="text-emerald-900 font-bold text-lg mb-1">Thank You!</h4>
        <p className="text-emerald-700 text-sm">Your feedback helps maintain a trusted cooperative community.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-saffron-100 rounded-lg text-saffron-600">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Rate your experience</h3>
          <p className="text-xs text-slate-500">Job {jobId} with {workerName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center py-4 bg-slate-50 rounded-xl">
          <p className="text-sm font-semibold text-slate-700 mb-2">How was the service?</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    (hoverRating || rating) >= star
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-slate-200 text-slate-200'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Add a comment (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`How did ${workerName} do?`}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-saffron-500 outline-none resize-none h-24 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={rating === 0}
          className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            rating > 0
              ? 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
          Submit Feedback
        </button>
      </form>
    </div>
  );
};
