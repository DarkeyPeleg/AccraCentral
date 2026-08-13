import React, { useState } from 'react';
import { Shield, Clock, KeyRound, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { MarketItem } from '../types';

interface HoldReserveModalProps {
  item: MarketItem;
  isOpen: boolean;
  onClose: () => void;
  onConfirmHold: (pin: string, depositAmount: number) => void;
}

export const HoldReserveModal: React.FC<HoldReserveModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmHold
}) => {
  const [depositPct, setDepositPct] = useState<number>(20);
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'momo' | 'card'>('paystack');
  const [phone, setPhone] = useState('0241234567');
  const [step, setStep] = useState<'confirm' | 'paying' | 'success'>('confirm');
  const [generatedPin, setGeneratedPin] = useState<string>('');

  if (!isOpen) return null;

  const depositAmount = Math.round((item.priceGhs * depositPct) / 100);
  const balanceDue = item.priceGhs - depositAmount;

  const handlePay = () => {
    setStep('paying');
    setTimeout(() => {
      // Generate a random 4 digit PIN
      const pin = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedPin(pin);
      setStep('success');
      onConfirmHold(pin, depositAmount);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-xs sm:items-center sm:p-4">
      <div className="modal-panel max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-2xl sm:rounded-2xl">
        {/* Header */}
        <div className="bg-brand text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-peach" />
            <h3 className="font-bold text-base">Pay Deposit to Hold Item</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'confirm' && (
          <div className="p-5 space-y-4">
            {/* Item Card */}
            <div className="flex gap-3 p-3 bg-surface-sunken rounded-xl border border-border">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-16 h-16 rounded-lg object-cover border"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-ink truncate">{item.title}</h4>
                <p className="text-xs text-muted">{item.stallNumber} • {item.vendorName}</p>
                <p className="text-sm font-bold text-brand mt-1">GHS {item.priceGhs}</p>
              </div>
            </div>

            {/* Deposit Ratio Selector */}
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                Select Hold Deposit Amount
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDepositPct(20)}
                  className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                    depositPct === 20
                      ? 'border-brand bg-peach text-brand font-bold shadow-xs'
                      : 'border-border bg-white text-muted'
                  }`}
                >
                  <p className="text-xs">20% Standard Deposit</p>
                  <p className="text-base font-extrabold">GHS {Math.round(item.priceGhs * 0.2)}</p>
                </button>
                <button
                  type="button"
                  onClick={() => setDepositPct(10)}
                  className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                    depositPct === 10
                      ? 'border-brand bg-peach text-brand font-bold shadow-xs'
                      : 'border-border bg-white text-muted'
                  }`}
                >
                  <p className="text-xs">10% Smaller Deposit</p>
                  <p className="text-base font-extrabold">GHS {Math.round(item.priceGhs * 0.1)}</p>
                </button>
              </div>
            </div>

            {/* Breakdown */}
            <div className="p-3 bg-danger-tint rounded-xl border border-danger-border text-xs space-y-1.5">
              <div className="flex justify-between text-muted">
                <span>Full Item Value:</span>
                <span className="font-bold">GHS {item.priceGhs}</span>
              </div>
              <div className="flex justify-between text-brand">
                <span>Deposit to hold now ({depositPct}%):</span>
                <span className="font-extrabold">GHS {depositAmount}</span>
              </div>
              <div className="flex justify-between text-muted pt-1 border-t border-danger-border">
                <span>Pay remaining at stall:</span>
                <span className="font-bold text-ink">GHS {balanceDue}</span>
              </div>
            </div>

            {/* Payment Method Option */}
            <div>
              <label className="block text-xs font-bold text-muted mb-1">
                Payment Channel
              </label>
              <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paystack')}
                  className={`p-2 rounded-lg border font-semibold text-center transition-colors ${
                    paymentMethod === 'paystack'
                      ? 'border-brand bg-peach text-brand'
                      : 'border-border bg-white'
                  }`}
                >
                  Paystack
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('momo')}
                  className={`p-2 rounded-lg border font-semibold text-center transition-colors ${
                    paymentMethod === 'momo'
                      ? 'border-brand bg-peach text-brand'
                      : 'border-border bg-white'
                  }`}
                >
                  Mobile Money
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2 rounded-lg border font-semibold text-center transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-brand bg-peach text-brand'
                      : 'border-border bg-white'
                  }`}
                >
                  Bank Card
                </button>
              </div>
            </div>

            {/* Phone input for MoMo/Paystack */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Mobile Money / Receipt Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-muted bg-surface-sunken p-2.5 rounded-lg">
              <Clock className="w-4 h-4 text-brand shrink-0" />
              <span>Stall holds item for <strong>48 hours</strong>. Full refund if item isn't as described.</span>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={handlePay}
              className="btn-primary w-full"
            >
              Pay GHS {depositAmount} Deposit & Get Pickup Code
            </button>
          </div>
        )}

        {step === 'paying' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-bold text-sm text-ink">Securing Funds in Escrow...</p>
            <p className="text-xs text-muted">Connecting to Paystack Ghana Gateway</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h4 className="font-extrabold text-lg text-ink">Hold Deposit Reserved!</h4>
            <p className="text-xs text-muted">
              GHS {depositAmount} is secured in escrow. Present this 4-digit PIN to <strong>{item.vendorName}</strong> at <strong>{item.stallNumber}</strong> to inspect & release payment.
            </p>

            {/* PIN Card */}
            <div className="p-4 bg-peach border-2 border-dashed border-brand rounded-2xl my-3">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-brand uppercase tracking-wider mb-1">
                <KeyRound className="w-4 h-4" />
                Release Hold PIN
              </div>
              <div className="text-3xl font-black tracking-widest text-brand">
                {generatedPin}
              </div>
              <p className="text-[10px] text-muted mt-1">
                Do not share this PIN until you inspect and accept the item at the stall.
              </p>
            </div>

            <div className="p-3 bg-surface-sunken rounded-xl text-left text-xs space-y-1">
              <p className="font-semibold text-ink">Stall Directions:</p>
              <p className="text-muted">{item.stallNumber} ({item.shed})</p>
              <p className="text-muted">Vendor: {item.vendorName} ({item.vendorPhone || '+233 24 123 4567'})</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="btn w-full bg-ink text-white px-4 py-3 hover:bg-black"
            >
              Back to Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
