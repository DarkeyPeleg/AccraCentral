import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  UserCheck, 
  AlertTriangle, 
  Sparkles, 
  Eye, 
  Scale, 
  Search 
} from 'lucide-react';
import { VendorApproval, DisputeCase } from '../types';

interface AdminModerationViewProps {
  approvals: VendorApproval[];
  disputes: DisputeCase[];
  onApproveVendor: (id: string) => void;
  onRejectVendor: (id: string) => void;
  onResolveDispute: (id: string, decision: 'refund' | 'reject') => void;
}

export const AdminModerationView: React.FC<AdminModerationViewProps> = ({
  approvals,
  disputes,
  onApproveVendor,
  onRejectVendor,
  onResolveDispute
}) => {
  const [selectedApproval, setSelectedApproval] = useState<VendorApproval | null>(null);
  const [activeTab, setActiveTab] = useState<'verifications' | 'disputes'>('verifications');

  return (
    <div className="page-stack">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="page-title flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-danger" />
            <span>Admin Moderation & Compliance Suite</span>
          </h2>
          <p className="text-xs text-muted">
            Review vendor stall licenses, Ghana Card IDs, and resolve order disputes
          </p>
        </div>

        <div className="flex items-center gap-1 bg-surface-chip p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('verifications')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'verifications' ? 'bg-chrome text-white' : 'text-muted'
            }`}
          >
            Vendor Verifications ({approvals.filter(a => a.status === 'pending').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('disputes')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'disputes' ? 'bg-danger text-white' : 'text-muted'
            }`}
          >
            Disputes ({disputes.filter(d => d.status === 'active').length})
          </button>
        </div>
      </div>

      {/* Top Admin Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card space-y-1 !p-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Pending Verifications</span>
            <UserCheck className="w-4 h-4 text-brand" />
          </div>
          <div className="text-2xl font-bold text-ink">42 Pending</div>
          <p className="text-[11px] text-success font-semibold">High AI OCR Confidence</p>
        </div>

        <div className="card space-y-1 !p-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Active Disputes</span>
            <AlertTriangle className="w-4 h-4 text-danger" />
          </div>
          <div className="text-2xl font-bold text-danger">15 Cases</div>
          <p className="text-[11px] text-danger font-bold">1 Case Requires Immediate Decision</p>
        </div>

        <div className="card space-y-1 !p-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Flagged Transactions</span>
            <ShieldAlert className="w-4 h-4 text-warn" />
          </div>
          <div className="text-2xl font-bold text-ink">8 Orders</div>
          <p className="text-[11px] text-muted">0.02% Suspicious Rate</p>
        </div>
      </div>

      {/* TAB 1: Pending Vendor Approvals */}
      {activeTab === 'verifications' && (
        <div className="card space-y-4">
          <h3 className="font-bold text-base text-ink">Pending Merchant Applications</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink">
              <thead className="bg-surface-sunken text-muted font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Vendor & Market</th>
                  <th className="p-3">Stall Location</th>
                  <th className="p-3">Ghana Card ID</th>
                  <th className="p-3">AI Match Confidence</th>
                  <th className="p-3 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {approvals.map((app) => (
                  <tr key={app.id} className="hover:bg-surface-modal">
                    <td className="p-3 flex items-center gap-3">
                      <img src={app.avatar} alt="" className="w-10 h-10 rounded-full object-cover border" />
                      <div>
                        <p className="font-bold">{app.vendorName}</p>
                        <p className="text-muted">{app.ownerName} • {app.marketName}</p>
                      </div>
                    </td>
                    <td className="p-3 text-muted">{app.stallBlock}</td>
                    <td className="p-3 font-mono font-bold text-brand">{app.ghanaCardNumber}</td>
                    <td className="p-3">
                      <span className="bg-success-soft text-success-text font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                        {app.confidence} Match
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedApproval(app)}
                        className="btn-ghost text-xs"
                      >
                        Review Documents
                      </button>
                      <button
                        type="button"
                        onClick={() => onApproveVendor(app.id)}
                        className="btn-success text-xs py-1.5 px-3"
                      >
                        Approve Seller
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Active Dispute Settlement Panel */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          {disputes.map((caseItem) => (
            <div
              key={caseItem.id}
              className="bg-white rounded-2xl border-2 border-danger p-5 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-border-soft pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-danger text-white text-xs font-black px-2.5 py-1 rounded-lg">
                    {caseItem.caseNumber}
                  </span>
                  <h3 className="font-bold text-base text-ink">{caseItem.title}</h3>
                </div>
                <div className="text-right">
                  <span className="font-black text-lg text-brand">GHS {caseItem.amountGhs.toFixed(2)}</span>
                  <p className="text-[10px] text-muted">Disputed Amount</p>
                </div>
              </div>

              {/* Claims Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Buyer Claim */}
                <div className="p-4 bg-danger-tint rounded-xl border border-danger-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-danger">Buyer Claim</span>
                    <span className="text-[10px] text-muted">{caseItem.buyerClaimDate}</span>
                  </div>
                  <p className="font-bold text-xs text-ink">{caseItem.buyerName}</p>
                  <p className="text-xs text-muted italic">{caseItem.buyerClaimText}</p>

                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-muted uppercase mb-1">Uploaded Buyer Evidence:</p>
                    <img
                      src={caseItem.buyerEvidenceImage}
                      alt="Buyer Evidence"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                </div>

                {/* Vendor Response */}
                <div className="p-4 bg-surface-sunken rounded-xl border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-brand">Vendor Defense</span>
                    <span className="text-[10px] text-muted">{caseItem.vendorResponseDate}</span>
                  </div>
                  <p className="font-bold text-xs text-ink">{caseItem.vendorName}</p>
                  <p className="text-xs text-muted italic">{caseItem.vendorResponseText}</p>
                </div>
              </div>

              {/* Action Decision Buttons */}
              <div className="p-3 bg-surface-muted rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-brand" />
                  Admin Final Decision Required
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onResolveDispute(caseItem.id, 'refund')}
                    className="btn-success text-xs py-2"
                  >
                    Refund Buyer (GHS {caseItem.amountGhs})
                  </button>
                  <button
                    type="button"
                    onClick={() => onResolveDispute(caseItem.id, 'reject')}
                    className="btn-danger text-xs py-2"
                  >
                    Keep Payment with Seller
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Review Side-By-Side Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="modal-panel w-full max-w-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-ink">
                Reviewing Documents for {selectedApproval.vendorName}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedApproval(null)}
                className="btn-ghost text-sm"
              >
                Close ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted">Ghana Card ID Document</p>
                <img
                  src={selectedApproval.ghanaCardImage}
                  alt="Ghana Card"
                  className="w-full h-48 object-cover rounded-xl border"
                />
                <p className="text-xs font-mono font-bold text-brand">{selectedApproval.ghanaCardNumber}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-muted">Stall Lease Agreement</p>
                <img
                  src={selectedApproval.leaseImage}
                  alt="Lease Document"
                  className="w-full h-48 object-cover rounded-xl border"
                />
                <p className="text-xs text-muted">{selectedApproval.marketName} • {selectedApproval.stallBlock}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onRejectVendor(selectedApproval.id);
                  setSelectedApproval(null);
                }}
                className="btn-danger text-xs py-2"
              >
                Reject Application
              </button>
              <button
                type="button"
                onClick={() => {
                  onApproveVendor(selectedApproval.id);
                  setSelectedApproval(null);
                }}
                className="btn-success text-xs py-2"
              >
                Approve Seller Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
