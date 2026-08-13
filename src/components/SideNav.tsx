import React from 'react';
import {
  LayoutDashboard,
  Store,
  Package,
  Receipt,
  MessageSquare,
  BarChart3,
  Map,
  Bookmark,
  Calendar,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';
import { AppRole, AppView } from '../types';

interface SideNavProps {
  role: AppRole;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onListNewItemClick?: () => void;
  activeHaggleCount?: number;
}

function dashboardViewForRole(role: AppRole): AppView {
  if (role === 'vendor') return 'vendor-dashboard';
  if (role === 'admin') return 'admin-moderation';
  return 'dashboard';
}

export const SideNav: React.FC<SideNavProps> = ({
  role,
  currentView,
  setCurrentView,
  onListNewItemClick,
  activeHaggleCount = 3,
}) => {
  const isVendor = role === 'vendor';
  const isAdmin = role === 'admin';
  const roleDashboard = dashboardViewForRole(role);
  const isDashboard =
    currentView === roleDashboard ||
    (role === 'buyer' && currentView === 'dashboard') ||
    (role === 'vendor' && currentView === 'vendor-dashboard') ||
    (role === 'admin' && currentView === 'admin-moderation');

  return (
    <aside className="fixed top-16 left-0 z-40 hidden h-[calc(100vh-4rem)] w-64 flex-col overflow-y-auto border-r border-border bg-surface-sunken px-4 py-6 shadow-sm md:flex">
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-surface-muted p-3">
        <img
          src={
            isAdmin
              ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAij67Pq538BK8gwi1mrKFZWOCLm8mAXn3Bn5pm5JNPHiK3_M7swQpvnUllIlRS9hOd20PMGhfe7Khns1DZbY3YNdTllno0Yf4NDm7Dbnu-mR9-43c3VjPLbvW1zGJTKXFskbZfu_s-CleqnZ5SO7QgQDA1J4zLsq5O8X5N0ncY3Ii7w9y_cGsuigEyUrFXPP2SUYIuy20s7cKnlcoLQ4KutnfqiTMVUJEtwdUc3-qnZ-O_yCRrp_4'
              : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvBs3POKhOHZ7pM5_n3Lkr4fL3DoM0D6hvSEEvSyk90RcY5R-vu5JL2X49rhFWQb_NI8yrbV3zqHuss3qjhthEwlIADFpY4gkPa-sepSo8ElAcQHfTE_xMwy5ZJO-cbrlsYiWwG9zwXNKKz6GrpfyIR9B7enAztXd-TFSz2eAgyUh55g3pTt59YiiVrbG2mBRBJ4_J1xC8a545m-EgJNlMyfuZXpTi2Z4_1Y8kdJye1f4giSC8Xfpo'
          }
          alt="User Profile"
          className="h-11 w-11 rounded-full border-2 border-brand object-cover"
        />
        <div className="overflow-hidden">
          <p className="truncate text-sm font-bold text-ink">
            {isAdmin ? 'Admin Kwame' : isVendor ? 'Kofi Market Hub' : 'Welcome to Accra'}
          </p>
          <p className="truncate text-xs text-muted">
            {isAdmin ? 'System Moderator' : isVendor ? 'Verified Merchant' : 'Buyer Account'}
          </p>
          <span className="inline-block text-[10px] font-medium text-brand">Accra Central</span>
        </div>
      </div>

      {isVendor && (
        <button type="button" onClick={onListNewItemClick} className="btn-primary mb-6 w-full">
          <PlusCircle className="h-4 w-4" />
          Add Product
        </button>
      )}

      <nav className="flex-1 space-y-1">
        <button
          type="button"
          onClick={() => setCurrentView(roleDashboard)}
          className={`nav-item justify-between ${isDashboard ? 'nav-item-active' : ''}`}
        >
          <span className="flex items-center gap-3">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('marketplace')}
          className={`nav-item ${currentView === 'marketplace' || currentView === 'product-detail' ? 'nav-item-active' : ''}`}
        >
          <Store className="h-4 w-4" />
          Shop Products
        </button>

        {isVendor && (
          <button
            type="button"
            onClick={() => setCurrentView('vendor-dashboard')}
            className={`nav-item ${currentView === 'vendor-dashboard' && !isDashboard ? 'nav-item-active' : ''}`}
          >
            <Package className="h-4 w-4" />
            My Products
          </button>
        )}

        <button
          type="button"
          onClick={() => setCurrentView('cart')}
          className={`nav-item justify-between ${currentView === 'cart' ? 'nav-item-active' : ''}`}
        >
          <span className="flex items-center gap-3">
            <Receipt className="h-4 w-4" />
            {isVendor ? 'Orders & Sales' : 'My Cart'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('haggle-console')}
          className={`nav-item justify-between ${
            currentView === 'haggle-console' ? 'nav-item-active' : ''
          }`}
        >
          <span className="flex items-center gap-3">
            <MessageSquare className="h-4 w-4" />
            Price Negotiations
          </span>
          {activeHaggleCount > 0 && <span className="badge-count">{activeHaggleCount}</span>}
        </button>

        {isVendor && (
          <button
            type="button"
            onClick={() => setCurrentView('vendor-dashboard')}
            className="nav-item"
          >
            <BarChart3 className="h-4 w-4" />
            Sales Insights
          </button>
        )}

        <button type="button" onClick={() => setCurrentView('marketplace')} className="nav-item">
          <Map className="h-4 w-4" />
          Find Stall Locations
        </button>

        <button type="button" onClick={() => setCurrentView('marketplace')} className="nav-item">
          <Bookmark className="h-4 w-4" />
          Saved Products
        </button>

        <button type="button" onClick={() => setCurrentView('cart')} className="nav-item">
          <Calendar className="h-4 w-4" />
          My Held Items
        </button>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setCurrentView('admin-moderation')}
            className={`nav-item justify-between ${
              currentView === 'admin-moderation'
                ? 'bg-chrome font-bold text-white hover:bg-chrome hover:text-white'
                : 'text-danger hover:bg-danger-soft hover:text-danger'
            }`}
          >
            <span className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4" />
              Review Queue
            </span>
            <span className="badge-danger px-1.5">URGENT</span>
          </button>
        )}
      </nav>

      <div className="mt-auto space-y-1 border-t border-border pt-4 text-xs text-muted">
        <p className="font-bold text-ink">Accra Central Suite v2.5</p>
        <p>Kantomanto & Makola Hub</p>
      </div>
    </aside>
  );
};
