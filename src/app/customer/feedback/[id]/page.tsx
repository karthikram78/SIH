import React from 'react';
import { FeedbackWidget } from '@/components/customer/FeedbackWidget';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function FeedbackPage({ params }: { params: { id: string } }) {
  // Mock data for the demonstration. In reality, fetch job/worker details from DB using params.id
  const jobId = params.id;
  const workerName = "Ravi K.";
  const workerRole = "Electrician";

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 md:pb-8 px-4">
      <div className="max-w-md mx-auto">
        <Link 
          href="/customer/dashboard" 
          className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900">Job Complete!</h1>
          <p className="text-slate-600 mt-1">Please rate your experience with {workerName}.</p>
        </div>

        <FeedbackWidget 
          jobId={jobId} 
          workerName={workerName} 
          workerRole={workerRole} 
        />
      </div>
    </div>
  );
}
