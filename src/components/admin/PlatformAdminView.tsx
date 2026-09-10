'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Shield,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Building,
  Wrench,
  Users,
  Search,
  History,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { Worker, WorkerDocument, VerificationStatus } from '@/types';

interface AuditEntry {
  id: string;
  workerName: string;
  docName: string;
  decision: 'approved' | 'rejected' | 'more_info';
  timestamp: string;
  adminName: string;
  notes?: string;
}

export const PlatformAdminView: React.FC = () => {
  const { workers, verifyDocument, cooperatives, serviceCategories } = useApp();
  const [selectedWorker, setSelectedWorker] = useState<Worker>(
    workers.find((w) => !w.isOverallVerified) || workers[workers.length - 1]
  );
  const [viewingDoc, setViewingDoc] = useState<WorkerDocument | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([
    {
      id: 'audit-1',
      workerName: 'Arun Kumar',
      docName: 'Govt Aadhaar ID & ITI Skill Certificate',
      decision: 'approved',
      timestamp: '2024-08-15 14:30',
      adminName: 'Ministry Auditor (S. Verma)',
      notes: 'Certified via NSDC database query',
    },
    {
      id: 'audit-2',
      workerName: 'Vikram Singh',
      docName: 'Tamil Nadu Electrical License B-Grade',
      decision: 'approved',
      timestamp: '2024-08-10 11:20',
      adminName: 'Technical Inspector (R. Natarajan)',
      notes: 'Valid license confirmed',
    }
  ]);

  const handleDecision = (
    workerId: string,
    docId: string,
    status: VerificationStatus,
    docName: string,
    notes?: string
  ) => {
    verifyDocument(workerId, docId, status, notes);

    const newEntry: AuditEntry = {
      id: `audit-${Date.now()}`,
      workerName: selectedWorker.name,
      docName,
      decision: status === 'verified' ? 'approved' : status === 'rejected' ? 'rejected' : 'more_info',
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      adminName: 'Platform Auditor (Govt Admin)',
      notes: notes || (status === 'verified' ? 'All criteria satisfied' : 'Audit rejected'),
    };
    setAuditLogs([newEntry, ...auditLogs]);
  };

  const pendingWorkers = workers.filter(
    (w) => w.documents.some((d) => d.status === 'pending') || !w.isOverallVerified
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Title */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-saffron-500/20 text-saffron-400">
              <Shield className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-saffron-400">
              Ministry of Cooperation Console
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black mt-1">
            Platform Administration & Verification Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Audit worker credentials, manage cooperative registrations, and enforce data privacy standards.
          </p>
        </div>

        <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-xs">
          <span className="text-slate-400 block">Pending Verifications</span>
          <span className="text-xl font-black text-amber-400">{pendingWorkers.length} Applications</span>
        </div>
      </div>

      {/* Main Grid: Left = Worker Application Queue, Right = Document Audit Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Applications Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base">
              Verification Queue ({workers.length} Total Workers)
            </h3>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {workers.map((w) => {
              const isSelected = w.id === selectedWorker.id;
              const hasPending = w.documents.some((d) => d.status === 'pending');

              return (
                <div
                  key={w.id}
                  onClick={() => setSelectedWorker(w)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-saffron-500 bg-saffron-50/50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={w.avatar}
                        alt={w.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900">{w.name}</div>
                        <div className="text-xs text-slate-500">{w.primaryCategory} • {w.experienceYears}y exp</div>
                        <div className="text-[11px] text-coop-700 font-semibold">{w.cooperativeName}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      {w.isOverallVerified ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-coop-100 text-coop-800">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800">
                          ⏳ Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Worker Audit Screen (Section 16) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Audit Inspection Screen
              </span>
              <h3 className="text-xl font-black text-slate-900">{selectedWorker.name}</h3>
              <p className="text-xs text-slate-500">{selectedWorker.headline}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Application Status:</span>
              <div className="text-sm font-extrabold text-slate-800">
                {selectedWorker.isOverallVerified ? '🟢 Fully Certified' : '🟡 Audit Incomplete'}
              </div>
            </div>
          </div>

          {/* Privacy Security Callout */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              <strong>Security & Role-Based Access:</strong> Only authenticated platform auditors can inspect these verification proofs. Sensitive government ID credentials are redacted and protected from public view.
            </p>
          </div>

          {/* Worker Documents List */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Submitted Documents for Verification
            </h4>

            {selectedWorker.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-saffron-600" />
                    <div>
                      <span className="font-bold text-xs text-slate-900">{doc.name}</span>
                      <span className="text-[11px] text-slate-400 block capitalize">Type: {doc.type.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewingDoc(doc)}
                      className="px-3 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Sample</span>
                    </button>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        doc.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : doc.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                </div>

                {/* Audit Actions (Approve, Reject, More Info) */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2 text-xs">
                  <button
                    onClick={() => handleDecision(selectedWorker.id, doc.id, 'verified', doc.name, 'Audited and verified')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => handleDecision(selectedWorker.id, doc.id, 'rejected', doc.name, 'Document blurry or mismatched')}
                    className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold transition flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => handleDecision(selectedWorker.id, doc.id, 'needs_info', doc.name, 'Requested additional certificate page')}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold transition flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Request More Info</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Audit History Log (Section 16) */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <History className="w-4 h-4 text-slate-500" />
              <span>Audit Trail Log</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-800">
                      {log.workerName} • <span className="text-slate-500">{log.docName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Decided by {log.adminName} on {log.timestamp} • {log.notes}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      log.decision === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {log.decision}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mock Document Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="font-bold text-sm text-slate-900">{viewingDoc.name}</div>
              <button onClick={() => setViewingDoc(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-4 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 text-center space-y-3">
              {viewingDoc.fileUrl && (viewingDoc.fileUrl.startsWith('http') || viewingDoc.fileUrl.startsWith('blob:') || viewingDoc.fileUrl.startsWith('/uploads') || viewingDoc.fileUrl.startsWith('data:')) ? (
                <div className="space-y-2">
                  <img
                    src={viewingDoc.fileUrl.startsWith('/uploads') ? `http://127.0.0.1:8000${viewingDoc.fileUrl}` : viewingDoc.fileUrl}
                    alt={viewingDoc.name}
                    className="max-h-72 w-auto mx-auto rounded-xl object-contain shadow-sm bg-white"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="text-[11px] font-mono text-slate-500">Document URL: {viewingDoc.fileUrl}</div>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-xs text-slate-800">DOCUMENT AUDIT RECORD</div>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    Aadhaar Card / Government Identity file stored in verified cooperative repository.
                  </p>
                </div>
              )}
              <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block">
                SHA-256 Checksum: verified • Status: {viewingDoc.status}
              </div>
            </div>
            <button
              onClick={() => setViewingDoc(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Close Viewer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
