export type AppRole = 'buyer' | 'vendor' | 'admin';

export type AppView =
  | 'dashboard'
  | 'marketplace'
  | 'product-detail'
  | 'haggle-console'
  | 'vendor-dashboard'
  | 'cart'
  | 'admin-moderation';

export interface MarketItem {
  id: string;
  title: string;
  category: string;
  priceGhs: number;
  originalPriceGhs?: number;
  stallNumber: string;
  shed: string;
  vendorName: string;
  vendorAvatar: string;
  vendorPhone?: string;
  vendorWhatsapp?: string;
  rating: number;
  salesCount: number;
  isVerified: boolean;
  isFeatured?: boolean;
  imageUrl: string;
  secondaryImages: string[];
  description: string;
  voiceAudioUrl?: string;
  audioDuration?: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockCount: number;
  sku?: string;
  locationDetails?: string;
}

export interface HaggleMessage {
  id: string;
  sender: 'buyer' | 'vendor' | 'system';
  text: string;
  offerAmount?: number;
  timestamp: string;
  type?: 'chat' | 'offer' | 'counter' | 'system';
}

export interface HaggleNegotiation {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  originalPrice: number;
  buyerName: string;
  buyerAvatar?: string;
  buyerHistoryNote?: string;
  vendorName: string;
  vendorAvatar?: string;
  status: 'active' | 'accepted' | 'rejected' | 'countered';
  currentOffer: number;
  counterOffer?: number;
  expiresInMinutes?: number;
  messages: HaggleMessage[];
}

export interface CartItem {
  item: MarketItem;
  quantity: number;
}

export interface VendorApproval {
  id: string;
  vendorName: string;
  ownerName: string;
  avatar: string;
  marketName: string;
  stallBlock: string;
  hasIdDoc: boolean;
  hasLeaseDoc: boolean;
  ghanaCardNumber: string;
  ghanaCardImage: string;
  leaseImage: string;
  confidence: 'High' | 'Medium' | 'Low';
  expiryDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface DisputeCase {
  id: string;
  caseNumber: string;
  title: string;
  amountGhs: number;
  buyerName: string;
  buyerClaimDate: string;
  buyerClaimText: string;
  buyerEvidenceImage: string;
  vendorName: string;
  vendorResponseDate: string;
  vendorResponseText: string;
  isUrgent: boolean;
  status: 'active' | 'refunded' | 'rejected';
}
