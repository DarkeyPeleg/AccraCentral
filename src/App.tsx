import React, { useState } from 'react';
import { AppRole, AppView, MarketItem, HaggleNegotiation, CartItem, VendorApproval, DisputeCase } from './types';
import { INITIAL_ITEMS, INITIAL_NEGOTIATIONS, INITIAL_VENDOR_APPROVALS, INITIAL_DISPUTES } from './data/mockData';
import { TopBar } from './components/TopBar';
import { SideNav } from './components/SideNav';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { MarketplaceView } from './components/MarketplaceView';
import { ProductDetailView } from './components/ProductDetailView';
import { HaggleConsoleView } from './components/HaggleConsoleView';
import { VendorDashboardView } from './components/VendorDashboardView';
import { CartView } from './components/CartView';
import { AdminModerationView } from './components/AdminModerationView';
import { HoldReserveModal } from './components/HoldReserveModal';

export default function App() {
  const [role, setRole] = useState<AppRole>('buyer');
  const [currentView, setCurrentView] = useState<AppView>('marketplace');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);

  // Core Data Collections
  const [items, setItems] = useState<MarketItem[]>(INITIAL_ITEMS);
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(INITIAL_ITEMS[0]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [negotiations, setNegotiations] = useState<HaggleNegotiation[]>(INITIAL_NEGOTIATIONS);
  const [activeHaggleId, setActiveHaggleId] = useState<string>('neg-1');
  const [approvals, setApprovals] = useState<VendorApproval[]>(INITIAL_VENDOR_APPROVALS);
  const [disputes, setDisputes] = useState<DisputeCase[]>(INITIAL_DISPUTES);

  // Hold Reserve Modal State
  const [isHoldModalOpen, setIsHoldModalOpen] = useState<boolean>(false);
  const [reserveModalItem, setReserveModalItem] = useState<MarketItem | null>(null);

  // Toast Notification Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Voice Search Handler
  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setIsListeningVoice(!isListeningVoice);
      if (!isListeningVoice) {
        showToast('Listening... Speak product name (e.g., "Kente Cloth")');
        setTimeout(() => {
          setSearchQuery('Kente');
          setIsListeningVoice(false);
          setCurrentView('marketplace');
          showToast('Voice matched: "Kente"');
        }, 2000);
      }
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.onstart = () => setIsListeningVoice(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListeningVoice(false);
        setCurrentView('marketplace');
        showToast(`Voice Search: "${transcript}"`);
      };
      recognition.onerror = () => setIsListeningVoice(false);
      recognition.start();
    } catch {
      setIsListeningVoice(false);
    }
  };

  // Select Item for Detail View
  const handleSelectItem = (item: MarketItem) => {
    setSelectedItem(item);
    setCurrentView('product-detail');
  };

  // Open Haggle Console for a given item
  const handleOpenHaggle = (item: MarketItem) => {
    // Check if negotiation exists or create new one
    const existing = negotiations.find(n => n.itemId === item.id);
    if (existing) {
      setActiveHaggleId(existing.id);
    } else {
      const newNegId = `neg-${Date.now()}`;
      const newNeg: HaggleNegotiation = {
        id: newNegId,
        itemId: item.id,
        itemTitle: item.title,
        itemImage: item.imageUrl,
        originalPrice: item.priceGhs,
        buyerName: 'Kwame O.',
        vendorName: item.vendorName,
        vendorAvatar: item.vendorAvatar,
        status: 'active',
        currentOffer: Math.round(item.priceGhs * 0.8),
        messages: [
          {
            id: `m-${Date.now()}`,
            sender: 'buyer',
            text: `Hi ${item.vendorName}, I'd like to negotiate for ${item.title}. Can you consider GHS ${Math.round(item.priceGhs * 0.8)}?`,
            offerAmount: Math.round(item.priceGhs * 0.8),
            timestamp: 'Just now',
            type: 'offer'
          }
        ]
      };
      setNegotiations([newNeg, ...negotiations]);
      setActiveHaggleId(newNegId);
    }
    setCurrentView('haggle-console');
  };

  // Open Hold Reserve Modal
  const handleOpenReserveModal = (item: MarketItem) => {
    setReserveModalItem(item);
    setIsHoldModalOpen(true);
  };

  // Confirm Hold Reservation
  const handleConfirmHold = (pin: string, depositAmount: number) => {
    showToast(`Hold Reserved! Release PIN: ${pin}`);
  };

  // Cart Operations
  const handleAddToCart = (item: MarketItem) => {
    setCartItems(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { item, quantity: 1 }];
    });
    showToast(`Added "${item.title}" to reservation cart`);
  };

  const handleUpdateCartQuantity = (itemId: string, delta: number) => {
    setCartItems(prev => prev.map(c => {
      if (c.item.id === itemId) {
        const newQty = c.quantity + delta;
        return newQty > 0 ? { ...c, quantity: newQty } : c;
      }
      return c;
    }));
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems(prev => prev.filter(c => c.item.id !== itemId));
  };

  // Haggle Messages & Actions
  const handleSendHaggleMessage = (
    negId: string, 
    text: string, 
    offerAmount?: number, 
    type: 'chat' | 'offer' | 'counter' = 'chat'
  ) => {
    setNegotiations(prev => prev.map(n => {
      if (n.id === negId) {
        const newMsg = {
          id: `m-${Date.now()}`,
          sender: 'buyer' as const,
          text,
          offerAmount,
          timestamp: 'Just now',
          type
        };
        return {
          ...n,
          currentOffer: offerAmount || n.currentOffer,
          status: type === 'counter' ? 'countered' : 'active',
          messages: [...n.messages, newMsg]
        };
      }
      return n;
    }));
  };

  const handleAcceptHaggleOffer = (negId: string) => {
    setNegotiations(prev => prev.map(n => n.id === negId ? { ...n, status: 'accepted' } : n));
    showToast('Haggle Offer Accepted! Proceeding to Reserve Deposit.');
  };

  const handleDeclineHaggleOffer = (negId: string) => {
    setNegotiations(prev => prev.map(n => n.id === negId ? { ...n, status: 'rejected' } : n));
    showToast('Offer Declined.');
  };

  // Vendor Operations
  const handleAddVendorItem = (newItem: MarketItem) => {
    setItems([newItem, ...items]);
    showToast(`Published listing: "${newItem.title}"`);
  };

  const handleDeleteVendorItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    showToast('Item listing removed');
  };

  const handleRedeemVendorPin = (pin: string) => {
    showToast(`PIN ${pin} verified! GHS 180.00 released to MoMo`);
  };

  // Admin Operations
  const handleApproveVendor = (id: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
    showToast('Merchant verification approved & badge granted.');
  };

  const handleRejectVendor = (id: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
    showToast('Merchant application rejected.');
  };

  const handleResolveDispute = (id: string, decision: 'refund' | 'reject') => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: decision === 'refund' ? 'refunded' : 'rejected' } : d));
    showToast(decision === 'refund' ? 'Refund issued to buyer in full.' : 'Claim rejected. Escrow released to vendor.');
  };

  return (
    <div className="min-h-screen bg-surface text-ink flex flex-col font-sans">
      {/* Toast Notification Popup */}
      {toastMessage && <div className="toast animate-bounce">{toastMessage}</div>}

      {/* Global Top App Bar */}
      <TopBar
        role={role}
        setRole={setRole}
        currentView={currentView}
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        setSearchQuery={(query) => {
          setSearchQuery(query);
          if (query.trim()) setCurrentView('marketplace');
        }}
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        onVoiceClick={handleVoiceToggle}
        isListening={isListeningVoice}
      />

      <div className="flex w-full flex-1">
        {/* Desktop Left Drawer Navigation */}
        <SideNav
          role={role}
          currentView={currentView}
          setCurrentView={setCurrentView}
          onListNewItemClick={() => {
            setRole('vendor');
            setCurrentView('vendor-dashboard');
          }}
          activeHaggleCount={negotiations.filter(n => n.status === 'active' || n.status === 'countered').length}
        />

        {/* Main Content View Container */}
        <main className="w-full flex-1 px-4 py-6 md:ml-64 md:px-8 lg:px-10 xl:px-12">
          {currentView === 'dashboard' && (
            <DashboardView
              items={items}
              negotiations={negotiations}
              cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
              onOpenMarketplace={() => setCurrentView('marketplace')}
              onOpenHaggle={() => setCurrentView('haggle-console')}
              onOpenCart={() => setCurrentView('cart')}
              onSelectItem={handleSelectItem}
              onOpenNegotiation={(id) => {
                setActiveHaggleId(id);
                setCurrentView('haggle-console');
              }}
            />
          )}

          {currentView === 'marketplace' && (
            <MarketplaceView
              items={items}
              onSelectItem={handleSelectItem}
              onOpenHaggle={handleOpenHaggle}
              onReserveItem={handleOpenReserveModal}
              searchQuery={searchQuery}
            />
          )}

          {currentView === 'product-detail' && selectedItem && (
            <ProductDetailView
              item={selectedItem}
              onBack={() => setCurrentView('marketplace')}
              onOpenHaggle={handleOpenHaggle}
              onReserveItem={handleOpenReserveModal}
              onAddToCart={handleAddToCart}
            />
          )}

          {currentView === 'haggle-console' && (
            <HaggleConsoleView
              negotiations={negotiations}
              activeId={activeHaggleId}
              setActiveId={setActiveHaggleId}
              onSendMessage={handleSendHaggleMessage}
              onAcceptOffer={handleAcceptHaggleOffer}
              onDeclineOffer={handleDeclineHaggleOffer}
              onBackToMarket={() => setCurrentView('marketplace')}
            />
          )}

          {currentView === 'vendor-dashboard' && (
            <VendorDashboardView
              items={items}
              onAddItem={handleAddVendorItem}
              onDeleteItem={handleDeleteVendorItem}
              onRedeemPin={handleRedeemVendorPin}
            />
          )}

          {currentView === 'cart' && (
            <CartView
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateCartQuantity}
              onRemoveItem={handleRemoveCartItem}
              onCheckout={() => {
                if (cartItems.length > 0) {
                  handleOpenReserveModal(cartItems[0].item);
                }
              }}
              onContinueShopping={() => setCurrentView('marketplace')}
            />
          )}

          {currentView === 'admin-moderation' && (
            <AdminModerationView
              approvals={approvals}
              disputes={disputes}
              onApproveVendor={handleApproveVendor}
              onRejectVendor={handleRejectVendor}
              onResolveDispute={handleResolveDispute}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentView={currentView}
        setCurrentView={setCurrentView}
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        activeHaggleCount={negotiations.filter(n => n.status === 'active' || n.status === 'countered').length}
      />

      {/* Hold Reserve Escrow Deposit Modal */}
      {reserveModalItem && (
        <HoldReserveModal
          item={reserveModalItem}
          isOpen={isHoldModalOpen}
          onClose={() => setIsHoldModalOpen(false)}
          onConfirmHold={handleConfirmHold}
        />
      )}
    </div>
  );
}
