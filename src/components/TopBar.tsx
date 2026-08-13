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
  const showSearch = currentView !== 'product-detail';

  return (
    <header className="sticky top-0 z-50 chrome-bar border-b shadow-sm supports-[backdrop-filter]:bg-surface-raised/95">
      <div className="flex w-full items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 md:px-8 lg:px-10 xl:px-12">
        <button
          type="button"
          onClick={() => setCurrentView('marketplace')}
          className="group flex min-w-0 shrink items-center gap-2 text-left focus:outline-none"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-sm transition-transform group-hover:scale-105 sm:h-10 sm:w-10">
            <Store className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold leading-tight tracking-tight text-brand sm:text-lg">
              Accra Central
            </h1>
            <p className="hidden truncate text-xs text-muted lg:block">
              Digital Thrift & Artisan Market
            </p>
          </div>
        </button>

        {showSearch && (
          <div className="relative mx-2 hidden min-w-0 max-w-xl flex-1 items-center md:flex lg:max-w-2xl">
            <Search className="absolute left-3 h-4 w-4 text-muted-soft" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search thrift items..."
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

        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
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

          <button
            type="button"
            className="btn-icon relative hidden text-muted sm:inline-flex"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger" />
          </button>

          <div className="ml-0.5 flex items-center gap-0.5 rounded-xl bg-surface-chip p-0.5 text-xs font-semibold sm:ml-1 sm:gap-1 sm:p-1">
            <button
              type="button"
              onClick={() => {
                setRole('buyer');
                setCurrentView('marketplace');
              }}
              className={`flex items-center gap-1 rounded-lg px-2 py-1.5 transition-all sm:px-2.5 ${
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
              className={`flex items-center gap-1 rounded-lg px-2 py-1.5 transition-all sm:px-2.5 ${
                role === 'vendor'
                  ? 'bg-brand font-bold text-white shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Seller</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setCurrentView('admin-moderation');
              }}
              className={`flex items-center gap-1 rounded-lg px-2 py-1.5 transition-all sm:px-2.5 ${
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

      {showSearch && (
        <div className="border-t border-border px-3 pb-2.5 md:hidden">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-soft" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, stalls, vendors..."
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
        </div>
      )}
    </header>
  );
};
