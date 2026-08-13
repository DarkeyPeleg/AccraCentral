import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  Navigation2, 
  Clock, 
  Share2, 
  Heart, 
  ShoppingBag, 
  CheckCircle2 
} from 'lucide-react';
import { MarketItem } from '../types';

interface ProductDetailViewProps {
  item: MarketItem;
  onBack: () => void;
  onOpenHaggle: (item: MarketItem) => void;
  onReserveItem: (item: MarketItem) => void;
  onAddToCart: (item: MarketItem) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  item,
  onBack,
  onOpenHaggle,
  onReserveItem,
  onAddToCart
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showDirectionsMap, setShowDirectionsMap] = useState<boolean>(false);

  const images = [item.imageUrl, ...(item.secondaryImages || [])];

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div className="page-stack">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="btn-back">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2.5 rounded-full border transition-colors ${
              isLiked ? 'bg-danger-soft border-danger text-danger' : 'bg-white border-border text-muted'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button className="p-2.5 rounded-full bg-white border border-border text-muted hover:bg-surface-sunken">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Image Gallery & Voice Player */}
        <div className="space-y-4">
          {/* Main Display Image */}
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-surface-sunken border border-border shadow-md">
            <img
              src={images[activeImageIndex]}
              alt={item.title}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {item.isVerified && (
              <div className="absolute top-4 left-4 bg-ink/90 backdrop-blur-md text-verified text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-verified" />
                VERIFIED STALL LEASE
              </div>
            )}

            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-xl font-bold">
              {item.stallNumber} ({item.shed})
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx ? 'border-brand scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Voice Audio Description Card */}
          {item.voiceAudioUrl && (
            <div className="card-peach p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleAudio}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all ${
                    isPlayingAudio ? 'bg-danger animate-pulse' : 'bg-brand hover:bg-brand-hover'
                  }`}
                >
                  {isPlayingAudio ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <div>
                  <h5 className="font-bold text-sm text-ink">Listen to Vendor Voice Note</h5>
                  <p className="text-xs text-muted">
                    {isPlayingAudio ? 'Playing vendor audio...' : `Hear ${item.vendorName} describe this piece (${item.audioDuration || '0:45'})`}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-brand bg-white px-2.5 py-1 rounded-full border border-brand/20">
                Twi / English
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Details, Price, Vendor Card & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand mb-1">
              <span>{item.category}</span>
              <span>•</span>
              <div className="flex items-center gap-1 text-warn">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-ink">{item.rating} Rating</span>
                <span className="text-muted">({item.salesCount} sold)</span>
              </div>
            </div>

            <h1 className="page-title md:text-3xl leading-tight">
              {item.title}
            </h1>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-black text-brand">GHS {item.priceGhs}</span>
              {item.originalPriceGhs && (
                <span className="text-base text-muted-soft line-through">GHS {item.originalPriceGhs}</span>
              )}
              <span className="bg-success/10 text-success text-xs font-bold px-2.5 py-1 rounded-full ml-auto">
                20% Deposit: GHS {Math.round(item.priceGhs * 0.2)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="card space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-muted">Item Story & Provenance</h4>
            <p className="text-sm text-ink leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Vendor Card & Stall Location */}
          <div className="card-inset p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={item.vendorAvatar}
                  alt={item.vendorName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-brand"
                />
                <div>
                  <h4 className="font-bold text-sm text-ink flex items-center gap-1.5">
                    {item.vendorName}
                    {item.isVerified && <CheckCircle2 className="w-4 h-4 text-success" />}
                  </h4>
                  <p className="text-xs text-muted">{item.stallNumber} • {item.shed}</p>
                </div>
              </div>

              <a
                href={`tel:${item.vendorPhone || '+233241234567'}`}
                className="p-2.5 bg-white border border-border rounded-xl text-brand hover:bg-peach transition-colors"
                title="Call Vendor"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-brand" />
                <span>{item.locationDetails || 'Opposite Kantomanto Main Gate'}</span>
              </div>
              <button
                onClick={() => setShowDirectionsMap(!showDirectionsMap)}
                className="font-bold text-brand underline hover:text-brand-hover"
              >
                {showDirectionsMap ? 'Hide Map' : 'Walking Map'}
              </button>
            </div>

            {/* Walking Directions Canvas Map Widget */}
            {showDirectionsMap && (
              <div className="p-3 bg-white rounded-xl border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-ink">
                  <span className="flex items-center gap-1">
                    <Navigation2 className="w-4 h-4 text-brand" />
                    Stall Walking Path
                  </span>
                  <span className="text-success">4 mins walk (280m)</span>
                </div>
                
                {/* Visual Map Canvas Simulation */}
                <div className="h-32 bg-surface-muted rounded-lg relative overflow-hidden flex items-center justify-center border border-muted-soft">
                  <div className="absolute inset-0 bg-[radial-gradient(var(--color-muted-soft)_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                  
                  {/* Path SVG */}
                  <svg className="absolute inset-0 w-full h-full text-brand">
                    <path d="M 20 100 Q 80 40 180 60 T 300 30" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="6,6" />
                  </svg>

                  {/* Start & End Pin */}
                  <div className="absolute bottom-3 left-4 bg-ink text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-md">
                    You (Market Entrance)
                  </div>
                  <div className="absolute top-4 right-6 bg-brand text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-md animate-bounce">
                    📍 {item.stallNumber}
                  </div>
                </div>

                <p className="text-[11px] text-muted">
                  Enter via Kantomanto Gate 2, walk straight past row C fabric sellers, stall is on your left.
                </p>
              </div>
            )}
          </div>

          {/* Primary Action Panel */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => onOpenHaggle(item)}
                className="btn-secondary w-full"
              >
                <MessageSquare className="w-4 h-4" />
                Negotiate
              </button>

              <button
                type="button"
                onClick={() => onAddToCart(item)}
                className="btn-outline w-full"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
            </div>

            <button
              type="button"
              onClick={() => onReserveItem(item)}
              className="btn-primary w-full text-base"
            >
              Hold · GHS {Math.round(item.priceGhs * 0.2)}
            </button>

            <p className="text-[11px] text-center text-muted flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand" />
              Item held exclusively for 48 hours. Escrow refund guaranteed if not as described.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
