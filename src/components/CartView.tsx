import React from 'react';
import { ShoppingBag, Trash2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { CartItem } from '../types';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onContinueShopping
}) => {
  const subtotal = cartItems.reduce((acc, curr) => acc + curr.item.priceGhs * curr.quantity, 0);
  const marketFee = Math.round(subtotal * 0.02); // 2% platform escrow fee
  const depositHoldTotal = Math.round(subtotal * 0.2);

  if (cartItems.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-border space-y-4 max-w-md mx-auto my-8">
        <div className="w-16 h-16 bg-peach text-brand rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="font-extrabold text-xl text-ink">Your Cart is Empty</h3>
        <p className="text-xs text-muted">
          Discover authentic fabrics, leathercraft, and artisan pieces across Accra Central Market stalls.
        </p>
        <button
          type="button"
          onClick={onContinueShopping}
          className="btn-primary"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="flex items-center justify-between">
        <button type="button" onClick={onContinueShopping} className="btn-back">
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </button>

        <h2 className="page-title">My Cart</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map(({ item, quantity }) => (
            <div
              key={item.id}
              className="card flex flex-col gap-3 !p-3 sm:flex-row sm:items-center sm:!p-4"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-16 w-16 shrink-0 rounded-xl border object-cover sm:h-20 sm:w-20"
                />

                <div className="min-w-0 flex-1 space-y-1">
                  <h4 className="truncate text-sm font-bold text-ink">{item.title}</h4>
                  <p className="truncate text-xs text-muted">
                    {item.stallNumber} · {item.vendorName}
                  </p>
                  <div className="text-xs font-black text-brand">
                    GHS {item.priceGhs}
                    <span className="ml-2 text-[10px] font-normal text-muted">
                      (GHS {Math.round(item.priceGhs * 0.2)} hold)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-sunken p-1.5">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-ink"
                  >
                    -
                  </button>
                  <span className="min-w-6 px-1 text-center text-xs font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-ink"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="rounded-xl p-2 text-danger transition-colors hover:bg-danger-soft"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Escrow Deposit Breakdown */}
        <div className="card space-y-4 h-fit">
          <h3 className="font-bold text-base text-ink border-b border-border-soft pb-3">
            Escrow Hold Summary
          </h3>

          <div className="space-y-2 text-xs text-muted">
            <div className="flex justify-between">
              <span>Full Merchandise Value:</span>
              <span className="font-bold text-ink">GHS {subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Escrow Protection Fee (2%):</span>
              <span className="font-bold text-ink">GHS {marketFee}</span>
            </div>

            <div className="pt-2 border-t border-border-soft flex justify-between text-sm font-extrabold text-brand">
              <span>20% Deposit Due Now:</span>
              <span>GHS {depositHoldTotal + marketFee}</span>
            </div>

            <div className="flex justify-between text-xs font-bold text-success">
              <span>Payable at Stall on Pickup:</span>
              <span>GHS {subtotal - depositHoldTotal}</span>
            </div>
          </div>

          <div className="card-success p-3 text-[11px] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-success-icon" />
            <span>Escrow holds funds securely until you inspect & release with PIN at stall.</span>
          </div>

          <button
            type="button"
            onClick={onCheckout}
            className="btn-primary w-full"
          >
            <span>Pay Deposit to Hold Items</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
