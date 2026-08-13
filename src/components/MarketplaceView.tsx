import React, { useState } from 'react';
import { 
  Filter, 
  MapPin, 
  Sparkles, 
  Star, 
  ShieldCheck, 
  MessageSquare, 
  Clock, 
  ArrowRight, 
  Volume2, 
  SlidersHorizontal 
} from 'lucide-react';
import { MarketItem } from '../types';

interface MarketplaceViewProps {
  items: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
  onOpenHaggle: (item: MarketItem) => void;
  onReserveItem: (item: MarketItem) => void;
  searchQuery: string;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  items,
  onSelectItem,
  onOpenHaggle,
  onReserveItem,
  searchQuery
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('All Zones');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  const categories = ['All', 'Fabrics', 'Shoes', 'Bags', 'Perfumes', 'Artisan', 'Dresses', 'Gadgets'];
  const zones = ['All Zones', 'Kantomanto Shed 3', 'Makola Market', 'Okaishie Lane', 'Shed A & B'];

  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.stallNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    const matchesZone = selectedZone === 'All Zones' || 
      (selectedZone === 'Kantomanto Shed 3' && item.shed.includes('Kantomanto')) ||
      (selectedZone === 'Makola Market' && (item.shed.includes('Makola') || item.stallNumber.includes('Makola'))) ||
      (selectedZone === 'Okaishie Lane' && item.shed.includes('Okaishie')) ||
      (selectedZone === 'Shed A & B' && (item.shed.includes('Shed A') || item.shed.includes('Shed B')));

    return matchesSearch && matchesCategory && matchesZone;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.priceGhs - b.priceGhs;
    if (sortBy === 'price-high') return b.priceGhs - a.priceGhs;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="page-stack">
      <div>
        <h2 className="page-title">Marketplace</h2>
        <p className="mt-1 text-sm text-muted">
          Browse verified stalls across Accra Central Market
        </p>
      </div>

      {/* Hero Banner with West African Warm Palette */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand via-danger to-brand-deep p-8 text-white shadow-md md:p-10">
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-peach" />
            Live Market Haggle & Reserve Platform
          </div>
          <h2 className="text-3xl leading-tight font-bold tracking-tight md:text-4xl">
            Discover Verified Thrift & Handcrafted Treasures in Accra
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-peach md:text-base">
            Directly from Kantomanto Sheds, Makola Rows, and Bolga artisans. Negotiate live prices, place 20% deposit holds, and pick up safely at the stall.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-verified" />
              <span>Escrow Protected Holds</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
              <Clock className="w-4 h-4 text-peach" />
              <span>48-Hour Stall Reservations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Zone Selector Bar */}
      <div className="bg-surface-sunken p-4 rounded-2xl border border-border space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Zone Selector */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand" />
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Market Zone:</span>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-white border border-border text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand"
            >
              {zones.map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-muted" />
            <span className="text-xs font-medium text-muted">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-white border border-border text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated Vendors</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`chip whitespace-nowrap ${
                selectedCategory === cat ? 'chip-active' : 'chip-idle border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="section-title flex items-center gap-2">
          <span>Stall Market Listings</span>
          <span className="text-xs font-normal text-muted bg-surface-muted px-2 py-0.5 rounded-full">
            {filteredItems.length} items
          </span>
        </h3>
      </div>

      {/* Item Grid — wider cards that fill the main column */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="card-flush group flex flex-col transition-all duration-200 hover:shadow-lg"
          >
            <div
              onClick={() => onSelectItem(item)}
              className="relative aspect-[5/4] cursor-pointer overflow-hidden bg-surface-sunken"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {item.isVerified && (
                  <span className="flex items-center gap-1 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-extrabold text-verified backdrop-blur-md">
                    <ShieldCheck className="h-3.5 w-3.5 text-verified" />
                    VERIFIED STALL
                  </span>
                )}
                {item.voiceAudioUrl && (
                  <span className="flex items-center gap-1 rounded-full bg-brand/90 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                    <Volume2 className="h-3.5 w-3.5" />
                    AUDIO {item.audioDuration}
                  </span>
                )}
              </div>

              <div className="absolute right-3 bottom-3 rounded-lg bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                {item.stallNumber}
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm text-muted">
                  <span className="font-semibold text-brand">{item.category}</span>
                  <div className="flex items-center gap-1 text-warn">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold text-ink">{item.rating}</span>
                    <span className="text-xs text-muted">({item.salesCount})</span>
                  </div>
                </div>

                <h4
                  onClick={() => onSelectItem(item)}
                  className="line-clamp-2 cursor-pointer text-base font-bold text-ink transition-colors hover:text-brand"
                >
                  {item.title}
                </h4>

                <p className="mt-1.5 truncate text-sm text-muted">
                  By {item.vendorName} · {item.shed}
                </p>
              </div>

              <div className="flex items-baseline justify-between border-t border-border-soft pt-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-brand">GHS {item.priceGhs}</span>
                    {item.originalPriceGhs && (
                      <span className="text-sm text-muted-soft line-through">
                        GHS {item.originalPriceGhs}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-success">
                  Reserve with GHS {Math.round(item.priceGhs * 0.2)} deposit
                </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenHaggle(item)}
                  className="btn-secondary-sm !py-2.5 !text-sm"
                >
                  <MessageSquare className="h-4 w-4" />
                  Negotiate
                </button>

                <button
                  type="button"
                  onClick={() => onReserveItem(item)}
                  className="btn-primary-sm !py-2.5 !text-sm"
                >
                  Hold
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
