import React from 'react';
import {
  Store,
  Mic,
  Bell,
  Search,
  ShoppingCart,
  ShieldAlert,
  UserCheck,
  Building2,
} from 'lucide-react';
import { AppRole, AppView } from '../types';

interface TopBarProps {
  role: AppRole;
  setRole: (role: AppRole) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  onVoiceClick?: () => void;
  isListening?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  role,
  setRole,
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  cartCount,
  onVoiceClick,
  isListening,
}) => {
  return (
    <header className="sticky top-0 z-50 chrome-bar border-b shadow-sm">
      <div className="flex w-full items-center justify-between gap-3 px-4 py-3 md:px-8 lg:px-10 xl:px-12">
        <button
          type="button"
          onClick={() => setCurrentView('marketplace')}
          className="group flex items-center gap-2 text-left focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-sm transition-transform group-hover:scale-105">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h1 className="flex items-center gap-2 text-lg font-bold leading-tight tracking-tight text-brand">
              Accra Central
            </h1>
            <p className="hidden text-xs text-muted sm:block">Digital Thrift & Artisan Market</p>
          </div>
        </button>

        {currentView !== 'product-detail' && (
          <div className="relative mx-4 hidden max-w-xl flex-1 items-center lg:max-w-2xl md:flex">
            <Search className="absolute left-3 h-4 w-4 text-muted-soft" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search thrift items in Kantomanto, Makola..."
              className="input-search"
            />
            <button
              type="button"
              onClick={onVoiceClick}
              title="Voice Search"
              className={`absolute right-2 rounded-full p-1.5 transition-all ${
                isListening ? 'animate-pulse bg-danger text-white' : 'text-brand hover:bg-peach'
              }`}
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onVoiceClick}
            className={`btn-icon md:hidden ${
              isListening ? 'animate-pulse bg-danger text-white hover:bg-danger' : ''
            }`}
            title="Voice Search"
          >
            <Mic className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('cart')}
            className="btn-icon relative"
            title="Shopping Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="badge-danger absolute top-1 right-1">{cartCount}</span>
            )}
          </button>

          <button type="button" className="btn-icon relative text-muted" title="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger" />
          </button>

          <div className="ml-1 flex items-center gap-1 rounded-xl bg-surface-chip p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setRole('buyer');
                setCurrentView('marketplace');
              }}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition-all ${
                role === 'buyer'
                  ? 'bg-surface-raised font-bold text-brand shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Buyer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('vendor');
                setCurrentView('vendor-dashboard');
              }}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition-all ${
                role === 'vendor'
                  ? 'bg-brand font-bold text-white shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Seller Shop</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setCurrentView('admin-moderation');
              }}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition-all ${
                role === 'admin'
                  ? 'bg-chrome font-bold text-white shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
