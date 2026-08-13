import React, { useState } from 'react';
import { 
  DollarSign, 
  Clock, 
  ShoppingBag, 
  ShieldCheck, 
  PlusCircle, 
  KeyRound, 
  Sparkles, 
  Mic, 
  Upload, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Package, 
  Trash2 
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart, Doughnut } from 'react-chartjs-2';
import { MarketItem } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface VendorDashboardViewProps {
  items: MarketItem[];
  onAddItem: (item: MarketItem) => void;
  onDeleteItem: (id: string) => void;
  onRedeemPin: (pin: string) => void;
}

export const VendorDashboardView: React.FC<VendorDashboardViewProps> = ({
  items,
  onAddItem,
  onDeleteItem,
  onRedeemPin
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinStatus, setPinStatus] = useState<string | null>(null);

  // Rapid Listing Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Fabrics');
  const [priceGhs, setPriceGhs] = useState('');
  const [stockCount, setStockCount] = useState('10');
  const [rawNotes, setRawNotes] = useState('');
  const [description, setDescription] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    onRedeemPin(pinInput);
    setPinStatus(`PIN ${pinInput} Verified & Funds Released to MoMo!`);
    setPinInput('');
  };

  const handleAiDescribe = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/describe-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawNotes, title, category })
      });
      const data = await res.json();
      if (data.description) {
        setDescription(data.description);
      }
    } catch {
      setDescription(rawNotes || 'Hand-crafted high quality Ghanaian artisan piece.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !priceGhs) return;

    const newItem: MarketItem = {
      id: `item-${Date.now()}`,
      title,
      category,
      priceGhs: Number(priceGhs),
      stallNumber: 'Stall B-12',
      shed: 'Kantomanto Shed 3',
      vendorName: 'Kofi Market Hub',
      vendorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvBs3POKhOHZ7pM5_n3Lkr4fL3DoM0D6hvSEEvSyk90RcY5R-vu5JL2X49rhFWQb_NI8yrbV3zqHuss3qjhthEwlIADFpY4gkPa-sepSo8ElAcQHfTE_xMwy5ZJO-cbrlsYiWwG9zwXNKKz6GrpfyIR9B7enAztXd-TFSz2eAgyUh55g3pTt59YiiVrbG2mBRBJ4_J1xC8a545m-EgJNlMyfuZXpTi2Z4_1Y8kdJye1f4giSC8Xfpo',
      rating: 5.0,
      salesCount: 1,
      isVerified: true,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZqcd4RV2FKCZz6cKd_jOgwcTV8G0BKf3dW-8LTJQGVCuYJUv5tJEOkdXukiHSUIDoKNGxPZ29-aj6vWCPVCtYYBTkt6KUb-6CbdavG5syK0UvInzKQ_gJeHtm9bkGbTfQjwgKcHRlmBW_X2p_CaZIrRvaOgxib5J5ManvAAmK0Y7TQbFhpmOrSdIC7t-YdYQAyyY6eCu8v9LsaxTIn2JGzTS90H5Z4RK7CGeYOGXydYQZWbFLjBbW',
      secondaryImages: [],
      description: description || rawNotes || 'Authentic West African marketplace item.',
      stockStatus: 'in_stock',
      stockCount: Number(stockCount) || 10
    };

    onAddItem(newItem);
    setTitle('');
    setPriceGhs('');
    setRawNotes('');
    setDescription('');
  };

  // Chart Data Configuration
  const salesChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        type: 'line' as const,
        label: 'Revenue (GHS)',
        borderColor: '#9f3c09',
        borderWidth: 3,
        fill: false,
        data: [450, 890, 620, 1100, 950, 1450, 1250],
        tension: 0.3
      },
      {
        type: 'bar' as const,
        label: 'Holds Completed',
        backgroundColor: '#ffdbce',
        borderColor: '#c05422',
        borderWidth: 1,
        data: [3, 5, 4, 8, 6, 12, 9]
      }
    ]
  };

  const donutData = {
    labels: ['Fulfilled', 'Active Holds', 'In Transit'],
    datasets: [
      {
        data: [18, 4, 3],
        backgroundColor: ['#2d6a4f', '#9f3c09', '#e07a00'],
        borderWidth: 0
      }
    ]
  };

  return (
    <div className="page-stack">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="page-title flex items-center gap-2">
            <span>Vendor Stall Executive Suite</span>
            <span className="bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              VERIFIED
            </span>
          </h2>
          <p className="text-xs text-muted">Manage active inventory, redeem hold PINs & track sales</p>
        </div>

        {/* Verification Status Alert */}
        <div className="bg-success-soft border border-success-border px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 text-success-text">
          <ShieldCheck className="w-4 h-4 text-success-icon" />
          <span>Ghana Card ID: <strong>Verified</strong> • Stall #B-12</span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="card space-y-1 !p-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Today's Revenue</span>
            <DollarSign className="w-4 h-4 text-brand" />
          </div>
          <div className="text-2xl font-bold text-brand">GHS 1,250.00</div>
          <p className="text-[11px] text-success font-semibold">+18.5% vs yesterday</p>
        </div>

        {/* Metric 2 */}
        <div className="card space-y-1 !p-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Active Holds Reserved</span>
            <Clock className="w-4 h-4 text-warn" />
          </div>
          <div className="text-2xl font-bold text-ink">4 Holds</div>
          <p className="text-[11px] text-muted">GHS 360 in Escrow</p>
        </div>

        {/* Metric 3 */}
        <div className="card space-y-1 !p-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Items Sold (This Week)</span>
            <ShoppingBag className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-bold text-ink">22 Units</div>
          <p className="text-[11px] text-success font-semibold">100% Picked Up</p>
        </div>

        {/* Metric 4 */}
        <div className="card space-y-1 !p-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Active Inventory</span>
            <Package className="w-4 h-4 text-brand" />
          </div>
          <div className="text-2xl font-bold text-ink">{items.length} Listings</div>
          <p className="text-[11px] text-warn font-semibold">2 Low Stock Alerts</p>
        </div>
      </div>

      {/* Redeem Hold PIN & Rapid Listing Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Redeem Release PIN Widget */}
        <div className="card-peach border-2 border-brand p-5 space-y-3">
          <div className="flex items-center gap-2 text-brand">
            <KeyRound className="w-5 h-5" />
            <h3 className="font-bold text-base">Enter Buyer Pickup Code</h3>
          </div>
          <p className="text-xs text-muted">
            When a buyer arrives at Stall B-12, enter their 4-digit pickup code to confirm handover and receive payment to Mobile Money.
          </p>

          <form onSubmit={handleRedeem} className="space-y-2">
            <input
              type="text"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="e.g. 4821"
              className="input-field text-center text-xl font-bold tracking-widest text-brand border-brand"
            />
            <button type="submit" className="btn-primary w-full">
              Confirm Pickup & Get Paid
            </button>
          </form>

          {pinStatus && (
            <div className="p-2.5 bg-white rounded-xl text-xs font-bold text-success text-center border border-success/30">
              {pinStatus}
            </div>
          )}
        </div>

        {/* Rapid New Item Listing Form */}
        <div className="lg:col-span-2 card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-ink flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-brand" />
              Rapid Listing Console
            </h3>
            <span className="text-xs text-muted bg-surface-sunken px-2.5 py-1 rounded-full">
              AI Powered Voice-to-Listing
            </span>
          </div>

          <form onSubmit={handleCreateListing} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-muted mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Vintage Leather Crossbody Bag"
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="Fabrics">Fabrics</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Bags">Bags</option>
                  <option value="Perfumes">Perfumes</option>
                  <option value="Artisan">Artisan</option>
                  <option value="Dresses">Dresses</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Price (GHS)</label>
                <input
                  type="number"
                  required
                  value={priceGhs}
                  onChange={(e) => setPriceGhs(e.target.value)}
                  placeholder="150"
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Stock Count</label>
                <input
                  type="number"
                  value={stockCount}
                  onChange={(e) => setStockCount(e.target.value)}
                  placeholder="10"
                  className="input-field text-xs"
                />
              </div>
            </div>

            {/* AI Voice-to-Text Description Generator */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-muted">Raw Voice Notes / Features</label>
                <button
                  type="button"
                  onClick={handleAiDescribe}
                  disabled={isGeneratingAi}
                  className="text-xs font-bold text-brand hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isGeneratingAi ? 'Improving text...' : 'Improve Description'}
                </button>
              </div>
              <textarea
                rows={2}
                value={description || rawNotes}
                onChange={(e) => {
                  setRawNotes(e.target.value);
                  setDescription(e.target.value);
                }}
                placeholder="Type or speak key details (e.g., '100% pure leather, brass buckle, sourced from Bolgatanga')..."
                className="input-field text-xs"
              />
            </div>

            <button type="submit" className="btn-primary w-full text-xs">
              Publish Product Listing
            </button>
          </form>
        </div>
      </div>

      {/* Analytics & Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Combo Chart */}
        <div className="lg:col-span-2 card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-ink flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand" />
              Weekly Sales & Reservation Trends
            </h3>
            <span className="text-xs text-muted">Past 7 Days</span>
          </div>

          <div className="h-64">
            <Chart type="bar" data={salesChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Fulfillment Donut */}
        <div className="card space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-ink flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-brand" />
              Fulfillment Breakdown
            </h3>
          </div>

          <div className="h-48 relative flex items-center justify-center">
            <Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>

          <div className="text-xs text-muted space-y-1">
            <p>• 18 Orders Picked Up & Completed</p>
            <p>• 4 Active Deposit Holds Awaiting Pickup</p>
          </div>
        </div>
      </div>

      {/* Managed Inventory Table */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-ink">Active Inventory ({items.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink">
            <thead className="bg-surface-sunken text-muted font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Item</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Stall No</th>
                <th className="p-3 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-surface-modal">
                  <td className="p-3 flex items-center gap-3">
                    <img src={item.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-bold line-clamp-1">{item.title}</span>
                  </td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3 font-bold text-brand">GHS {item.priceGhs}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold ${
                      item.stockCount < 5 ? 'bg-danger-soft text-danger' : 'bg-success-mint text-success'
                    }`}>
                      {item.stockCount} in stock
                    </span>
                  </td>
                  <td className="p-3 text-muted">{item.stallNumber}</td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-danger hover:bg-danger-soft rounded-lg transition-colors"
                      title="Remove Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
