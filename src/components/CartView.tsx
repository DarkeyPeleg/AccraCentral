import React from 'react';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
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
  onContinueShopping,
}) => {
  const subtotal = cartItems.reduce((acc, curr) => acc + curr.item.priceGhs * curr.quantity, 0);
  const itemCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto my-8 max-w-md space-y-4 rounded-3xl border border-border bg-white p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-peach text-brand">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-extrabold text-ink">Your Cart is Empty</h3>
        <p className="text-xs text-muted">
          Discover authentic fabrics, leathercraft, and artisan pieces across Accra Central Market
          stalls.
        </p>
        <button type="button" onClick={onContinueShopping} className="btn-primary">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={onContinueShopping} className="btn-back">
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </button>
        <h2 className="page-title">My Cart</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
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
                  <div className="text-xs font-bold text-brand">GHS {item.priceGhs}</div>
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
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card h-fit space-y-4">
          <h3 className="border-b border-border-soft pb-3 text-base font-bold text-ink">
            Order Summary
          </h3>

          <div className="space-y-2 text-xs text-muted">
            <div className="flex justify-between">
              <span>Items ({itemCount}):</span>
              <span className="font-bold text-ink">GHS {subtotal}</span>
            </div>
            <div className="flex justify-between border-t border-border-soft pt-2 text-sm font-extrabold text-brand">
              <span>Total:</span>
              <span>GHS {subtotal}</span>
            </div>
          </div>

          <p className="text-[11px] text-muted">
            Arrange pickup with the seller at their stall. Pay on collection.
          </p>

          <button type="button" onClick={onCheckout} className="btn-primary w-full">
            <span>Place Order</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
