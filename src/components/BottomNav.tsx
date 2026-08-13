import React from 'react';
import { LayoutDashboard, Store, MessageSquare, ShoppingBag } from 'lucide-react';
import { AppView } from '../types';

interface BottomNavProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  cartCount: number;
  activeHaggleCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  setCurrentView,
  cartCount,
  activeHaggleCount = 3,
}) => {
  const itemClass = (active: boolean) =>
    `flex flex-col items-center gap-1 rounded-xl p-1.5 transition-all ${
      active ? 'font-bold text-brand' : 'text-muted'
    }`;

  return (
    <nav className="chrome-bar fixed right-0 bottom-0 left-0 z-50 flex items-center justify-around border-t px-2 py-1.5 shadow-lg md:hidden">
      <button
        type="button"
        onClick={() => setCurrentView('dashboard')}
        className={itemClass(currentView === 'dashboard')}
      >
        <LayoutDashboard className="h-5 w-5" />
        <span className="text-[10px]">Dashboard</span>
      </button>

      <button
        type="button"
        onClick={() => setCurrentView('marketplace')}
        className={itemClass(
          currentView === 'marketplace' || currentView === 'product-detail'
        )}
      >
        <Store className="h-5 w-5" />
        <span className="text-[10px]">Shop</span>
      </button>

      <button
        type="button"
        onClick={() => setCurrentView('haggle-console')}
        className={`relative ${itemClass(currentView === 'haggle-console')}`}
      >
        <MessageSquare className="h-5 w-5" />
        <span className="text-[10px]">Negotiate</span>
        {activeHaggleCount > 0 && (
          <span className="badge-count absolute top-1 right-2">{activeHaggleCount}</span>
        )}
      </button>

      <button
        type="button"
        onClick={() => setCurrentView('cart')}
        className={`relative ${itemClass(currentView === 'cart')}`}
      >
        <ShoppingBag className="h-5 w-5" />
        <span className="text-[10px]">Cart</span>
        {cartCount > 0 && <span className="badge-danger absolute top-1 right-2">{cartCount}</span>}
      </button>
    </nav>
  );
};
