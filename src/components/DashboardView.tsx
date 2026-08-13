import React from 'react';
import {
  MessageSquare,
  ShoppingBag,
  ShieldCheck,
  Store,
  ArrowRight,
  TrendingUp,
  Package,
  MapPin,
} from 'lucide-react';
import { HaggleNegotiation, MarketItem } from '../types';

interface DashboardViewProps {
  items: MarketItem[];
  negotiations: HaggleNegotiation[];
  cartCount: number;
  onOpenMarketplace: () => void;
  onOpenHaggle: () => void;
  onOpenCart: () => void;
  onSelectItem: (item: MarketItem) => void;
  onOpenNegotiation: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  items,
  negotiations,
  cartCount,
  onOpenMarketplace,
  onOpenHaggle,
  onOpenCart,
  onSelectItem,
  onOpenNegotiation,
}) => {
  const activeHaggles = negotiations.filter(
    (n) => n.status === 'active' || n.status === 'countered'
  );
  const featured = items.filter((i) => i.isFeatured).slice(0, 3);
  const verifiedCount = items.filter((i) => i.isVerified).length;

  return (
    <div className="page-stack">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="page-title">Buyer Dashboard</h2>
          <p className="mt-1 text-sm text-muted">
            Track negotiations, cart, and market activity. Browse products in Marketplace.
          </p>
        </div>
        <button type="button" onClick={onOpenMarketplace} className="btn-primary shrink-0">
          <Store className="h-4 w-4" />
          Browse Products
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-muted uppercase">
              Open Negotiations
            </span>
            <MessageSquare className="h-4 w-4 text-brand" />
          </div>
          <div className="text-3xl font-bold text-ink">{activeHaggles.length}</div>
          <button
            type="button"
            onClick={onOpenHaggle}
            className="mt-2 text-xs font-semibold text-brand hover:underline"
          >
            View price negotiations
          </button>
        </div>

        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-muted uppercase">
              Cart Items
            </span>
            <ShoppingBag className="h-4 w-4 text-brand" />
          </div>
          <div className="text-3xl font-bold text-ink">{cartCount}</div>
          <button
            type="button"
            onClick={onOpenCart}
            className="mt-2 text-xs font-semibold text-brand hover:underline"
          >
            View my cart
          </button>
        </div>

        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-muted uppercase">
              Accepted Offers
            </span>
            <ShieldCheck className="h-4 w-4 text-success" />
          </div>
          <div className="text-3xl font-bold text-ink">
            {negotiations.filter((n) => n.status === 'accepted').length}
          </div>
          <p className="mt-2 text-xs text-muted">Ready to add to cart</p>
        </div>

        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-muted uppercase">
              Market Listings
            </span>
            <Package className="h-4 w-4 text-success" />
          </div>
          <div className="text-3xl font-bold text-ink">{items.length}</div>
          <p className="mt-2 text-xs text-muted">{verifiedCount} verified stalls</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="card lg:col-span-3 !p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border-soft px-5 py-4">
            <h3 className="section-title">Recent Negotiations</h3>
            <button
              type="button"
              onClick={onOpenHaggle}
              className="text-xs font-bold text-brand hover:underline"
            >
              View all
            </button>
          </div>
          <div className="divide-y divide-border-soft">
            {negotiations.slice(0, 4).map((neg) => (
              <button
                type="button"
                key={neg.id}
                onClick={() => onOpenNegotiation(neg.id)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-sunken"
              >
                <img
                  src={neg.itemImage}
                  alt={neg.itemTitle}
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">{neg.itemTitle}</p>
                  <p className="truncate text-xs text-muted">
                    with {neg.vendorName} · Offer GHS {neg.currentOffer}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                    neg.status === 'accepted'
                      ? 'bg-success-soft text-success-text'
                      : neg.status === 'rejected'
                        ? 'bg-danger-soft text-danger'
                        : 'bg-peach text-brand'
                  }`}
                >
                  {neg.status}
                </span>
              </button>
            ))}
            {negotiations.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-muted">
                No haggles yet. Start one from Marketplace.
              </p>
            )}
          </div>
        </section>

        <section className="card lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand" />
            <h3 className="section-title">Quick Actions</h3>
          </div>
          <button type="button" onClick={onOpenMarketplace} className="btn-secondary w-full">
            <Store className="h-4 w-4" />
            Browse Products
          </button>
          <button type="button" onClick={onOpenHaggle} className="btn-outline w-full">
            <MessageSquare className="h-4 w-4" />
            Continue Negotiation
          </button>
          <button type="button" onClick={onOpenCart} className="btn-outline w-full">
            <ShoppingBag className="h-4 w-4" />
            Open My Cart
          </button>
          <div className="card-success !rounded-xl p-4 text-xs">
            <div className="mb-1 flex items-center gap-1.5 font-bold">
              <ShieldCheck className="h-3.5 w-3.5" />
              Pay at the stall
            </div>
            Order online, then pay the seller when you pick up. Negotiate prices before you buy.
          </div>
        </section>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="section-title">Featured from Marketplace</h3>
          <button
            type="button"
            onClick={onOpenMarketplace}
            className="flex items-center gap-1 text-xs font-bold text-brand hover:underline"
          >
            See all products
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {featured.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="card-flush group text-left transition-shadow hover:shadow-lg"
            >
              <div className="aspect-[16/10] overflow-hidden bg-surface-sunken">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="space-y-1 p-4">
                <p className="line-clamp-1 text-sm font-bold text-ink">{item.title}</p>
                <p className="flex items-center gap-1 text-xs text-muted">
                  <MapPin className="h-3 w-3" />
                  {item.stallNumber}
                </p>
                <p className="text-base font-bold text-brand">GHS {item.priceGhs}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
