import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Zap, 
  DollarSign, 
  ShieldCheck 
} from 'lucide-react';
import { HaggleNegotiation, HaggleMessage } from '../types';

interface HaggleConsoleViewProps {
  negotiations: HaggleNegotiation[];
  activeId: string;
  setActiveId: (id: string) => void;
  onSendMessage: (negId: string, text: string, offerAmount?: number, type?: 'chat' | 'offer' | 'counter') => void;
  onAcceptOffer: (negId: string) => void;
  onDeclineOffer: (negId: string) => void;
  onBackToMarket?: () => void;
}

export const HaggleConsoleView: React.FC<HaggleConsoleViewProps> = ({
  negotiations,
  activeId,
  setActiveId,
  onSendMessage,
  onAcceptOffer,
  onDeclineOffer,
  onBackToMarket
}) => {
  const activeNeg = negotiations.find(n => n.id === activeId) || negotiations[0];
  const [inputText, setInputText] = useState('');
  const [offerValue, setOfferValue] = useState<number>(
    activeNeg ? Math.round(activeNeg.originalPrice * 0.85) : 100
  );
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);
  const [aiSuggestionText, setAiSuggestionText] = useState<string | null>(null);

  if (!activeNeg) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-border space-y-3">
        <MessageSquare className="w-12 h-12 text-brand mx-auto" />
        <h3 className="font-bold text-lg text-ink">No Price Negotiations Yet</h3>
        <p className="text-xs text-muted">Browse products and tap "Negotiate" to start talking with a seller.</p>
        <button type="button" onClick={onBackToMarket} className="btn-primary">
          Browse Products
        </button>
      </div>
    );
  }

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(activeNeg.id, inputText, undefined, 'chat');
    setInputText('');
  };

  const handleMakeCounter = () => {
    if (!offerValue) return;
    onSendMessage(activeNeg.id, `Counter-Offer: GHS ${offerValue}`, offerValue, 'counter');
  };

  const fetchAiCounterStrategy = async () => {
    setIsAiSuggesting(true);
    try {
      const res = await fetch('/api/ai/suggest-counter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalPrice: activeNeg.originalPrice,
          currentOffer: activeNeg.currentOffer,
          buyerHistory: activeNeg.buyerHistoryNote || 'Regular market buyer'
        })
      });
      const data = await res.json();
      if (data.suggestedCounter) {
        setOfferValue(data.suggestedCounter);
        setAiSuggestionText(`AI Suggestion: GHS ${data.suggestedCounter} (${data.reasoning})`);
      }
    } catch {
      const calc = Math.round(activeNeg.originalPrice - (activeNeg.originalPrice - activeNeg.currentOffer) * 0.4);
      setOfferValue(calc);
      setAiSuggestionText(`AI Suggestion: GHS ${calc} (Balanced counter-offer)`);
    } finally {
      setIsAiSuggesting(false);
    }
  };

  return (
    <div className="page-stack">
      {/* Console Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {onBackToMarket && (
            <button type="button" onClick={onBackToMarket} className="btn-back shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="min-w-0">
            <h2 className="page-title flex flex-wrap items-center gap-2">
              <span>Live Price Negotiation</span>
              <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                REAL-TIME
              </span>
            </h2>
            <p className="text-xs text-muted">Negotiate prices directly with vendors or buyers</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="card h-fit space-y-3 !p-3 sm:!p-5">
          <h3 className="text-xs font-bold tracking-wider text-muted uppercase">
            Open Negotiations ({negotiations.length})
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar lg:block lg:space-y-2 lg:overflow-visible">
            {negotiations.map((neg) => {
              const isSelected = neg.id === activeNeg.id;
              return (
                <button
                  key={neg.id}
                  type="button"
                  onClick={() => {
                    setActiveId(neg.id);
                    setOfferValue(Math.round(neg.originalPrice * 0.85));
                    setAiSuggestionText(null);
                  }}
                  className={`flex w-[min(280px,85vw)] shrink-0 items-center gap-3 rounded-xl border p-3 text-left transition-all lg:w-full ${
                    isSelected
                      ? 'border-brand bg-peach shadow-xs'
                      : 'border-border bg-surface-sunken hover:bg-surface-muted'
                  }`}
                >
                  <img
                    src={neg.itemImage}
                    alt={neg.itemTitle}
                    className="w-12 h-12 rounded-lg object-cover border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-ink truncate">{neg.itemTitle}</p>
                    <p className="text-[11px] text-muted truncate">With {neg.vendorName}</p>
                    <div className="flex items-center justify-between text-[11px] mt-1">
                      <span className="font-black text-brand">Offer: GHS {neg.currentOffer}</span>
                      <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                        neg.status === 'accepted' ? 'bg-success text-white' : 'bg-warn text-white'
                      }`}>
                        {neg.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Chat & Offer Console */}
        <div className="card-flush flex h-[min(620px,70dvh)] min-h-[480px] flex-col lg:col-span-2">
          {/* Item Banner Header */}
          <div className="flex flex-col gap-3 border-b border-border bg-surface-sunken p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={activeNeg.itemImage}
                alt={activeNeg.itemTitle}
                className="h-12 w-12 shrink-0 rounded-xl border border-border object-cover"
              />
              <div className="min-w-0">
                <h4 className="truncate text-sm font-bold text-ink">{activeNeg.itemTitle}</h4>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                  <span>
                    Asking: <strong className="text-ink">GHS {activeNeg.originalPrice}</strong>
                  </span>
                  <span className="hidden sm:inline">·</span>
                  <span>
                    Offer: <strong className="text-brand">GHS {activeNeg.currentOffer}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 self-start rounded-xl bg-peach px-3 py-1.5 text-xs font-extrabold text-brand sm:self-auto">
              <Clock className="w-4 h-4" />
              <span>Expires in 15m</span>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-surface-modal">
            {activeNeg.messages.map((msg) => {
              const isVendor = msg.sender === 'vendor';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="bg-surface-muted text-muted text-[11px] font-bold px-3 py-1 rounded-full inline-block">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isVendor ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-muted font-medium">
                    <span>{isVendor ? activeNeg.vendorName : activeNeg.buyerName}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1.5 shadow-xs ${
                      isVendor
                        ? 'bg-white border border-border text-ink rounded-tl-xs'
                        : 'bg-brand text-white rounded-tr-xs'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {msg.offerAmount && (
                      <div className={`p-2 rounded-xl text-xs font-black flex items-center justify-between gap-2 mt-1 ${
                        isVendor ? 'bg-peach text-brand' : 'bg-black/20 text-white'
                      }`}>
                        <span>Proposed Price:</span>
                        <span className="text-sm">GHS {msg.offerAmount}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Assistant Banner */}
          {aiSuggestionText && (
            <div className="px-4 py-2 bg-success-soft border-t border-success-border text-xs font-medium text-success-text flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-success-icon" />
                {aiSuggestionText}
              </span>
              <button
                onClick={() => setAiSuggestionText(null)}
                className="text-success-text hover:underline font-bold text-[10px]"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Interactive Offer Control Panel */}
          <div className="space-y-3 border-t border-border bg-surface-sunken p-3 sm:p-4">
            <div className="space-y-2 rounded-xl border border-border bg-white p-3">
              <div className="flex items-center justify-between text-xs font-bold text-ink">
                <span>Your new offer price:</span>
                <span className="text-base text-brand">GHS {offerValue}</span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="range"
                  min={Math.round(activeNeg.originalPrice * 0.5)}
                  max={activeNeg.originalPrice}
                  step={5}
                  value={offerValue}
                  onChange={(e) => setOfferValue(Number(e.target.value))}
                  className="w-full cursor-pointer accent-brand"
                />

                <button
                  type="button"
                  onClick={fetchAiCounterStrategy}
                  disabled={isAiSuggesting}
                  className="btn-secondary-sm w-full shrink-0 sm:w-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isAiSuggesting ? 'Suggesting...' : 'Suggest Price'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => onAcceptOffer(activeNeg.id)}
                className="btn-success py-2.5 text-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Accept GHS {activeNeg.currentOffer}
              </button>

              <button
                type="button"
                onClick={handleMakeCounter}
                className="btn-primary py-2.5 text-xs"
              >
                <Zap className="w-3.5 h-3.5" />
                Send Offer GHS {offerValue}
              </button>

              <button
                type="button"
                onClick={() => onDeclineOffer(activeNeg.id)}
                className="btn-danger-outline py-2.5 text-xs"
              >
                <XCircle className="w-3.5 h-3.5" />
                Decline Offer
              </button>
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message to vendor..."
                className="input-field flex-1 !py-2 text-xs"
              />
              <button
                type="submit"
                className="bg-ink text-white p-2 rounded-xl hover:bg-black transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
