import { useState } from 'react';
import { Image as ImageIcon, Upload, Sparkles } from 'lucide-react';
import { useMenuStore } from '../../../store/useMenuStore';
import VariantManager from './VariantManager';
import AddonManager from './AddonManager';
import TimingSelector from './TimingSelector';
import { getItemTax, totalRate } from '../../../utils/taxUtils';

const TABS = ['Details', 'Variants', 'Addons', 'Timing'];

const TAG_COLORS = {
  Bestseller: 'bg-amber-50 text-amber-700',
  Spicy: 'bg-red-50 text-red-600',
  New: 'bg-blue-50 text-blue-700',
  Popular: 'bg-purple-50 text-purple-700',
  "Chef's Special": 'bg-green-50 text-green-700',
  "Must Try": 'bg-orange-50 text-orange-700',
  Healthy: 'bg-teal-50 text-teal-700',
};

const VegDot = ({ type }) => {
  const color = type === 'Veg' ? 'bg-green-500' : type === 'Non-Veg' ? 'bg-red-500' : 'bg-yellow-400';
  return <span className={`w-2 h-2 rounded-full shrink-0 ${color}`} />;
};

function DetailsTab({ item }) {
  const { updateItem, taxes } = useMenuStore();
  const appliedTax = getItemTax(item, taxes);
  const [desc, setDesc]         = useState(item.description || '');
  const [prep, setPrep]         = useState(item.prepTime || '');
  const [cal, setCal]           = useState(item.calories || '');
  const [pkg, setPkg]           = useState(item.packagingCharge || '0');
  const [discount, setDiscount] = useState(item.discount || '0');
  const [itemCode, setItemCode] = useState(item.itemCode || '');
  const [minQty, setMinQty]     = useState(item.minOrderQty || '1');
  const [maxQty, setMaxQty]     = useState(item.maxOrderQty || '');
  const [imageUrl, setImageUrl] = useState(item.imageUrl || '');
  const [swiggyMarkup, setSwiggyMarkup] = useState(item.swiggyMarkup || '0');
  const [zomatoMarkup, setZomatoMarkup] = useState(item.zomatoMarkup || '0');

  const isDirty = [
    desc !== (item.description||''), prep !== (item.prepTime||''), cal !== (item.calories||''),
    pkg !== (item.packagingCharge||'0'), discount !== (item.discount||'0'), itemCode !== (item.itemCode||''),
    minQty !== (item.minOrderQty||'1'), maxQty !== (item.maxOrderQty||''),
    imageUrl !== (item.imageUrl||''), swiggyMarkup !== (item.swiggyMarkup||'0'), zomatoMarkup !== (item.zomatoMarkup||'0')
  ].some(Boolean);

  const save = () => updateItem(item.id, { 
    description: desc, prepTime: prep, calories: cal, packagingCharge: pkg, discount, itemCode, minOrderQty: minQty, maxOrderQty: maxQty,
    imageUrl, swiggyMarkup, zomatoMarkup
  });

  const SL = ({ children }) => <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 mt-4 first:mt-0">{children}</p>;


  return (
    <div className="space-y-1">
      {/* Image Upload */}
      <div className="mb-4">
        {imageUrl ? (
          <div className="relative h-32 rounded-xl overflow-hidden group border border-border">
            <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => setImageUrl('')} className="bg-background text-foreground px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-muted">Change Image</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setImageUrl('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80')} className="w-full h-24 rounded-xl border-2 border-dashed border-border bg-muted/20 hover:bg-muted/50 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-1.5 text-muted-foreground group">
            <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center group-hover:text-primary group-hover:border-primary/30 transition-colors">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Upload Item Photo</span>
          </button>
        )}
      </div>

      {/* Tags */}
      {item.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {item.tags.map(tag => (
            <span key={tag} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${TAG_COLORS[tag] || 'bg-muted text-muted-foreground'}`}>{tag}</span>
          ))}
        </div>
      )}

      {/* Channel badges */}
      {item.channels?.length > 0 && (
        <div className="flex gap-1 mb-2">
          {item.channels.map(c => (
            <span key={c} className="text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded">{c}</span>
          ))}
        </div>
      )}

      {/* Allergens */}
      {item.allergens?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {item.allergens.map(a => (
            <span key={a} className="text-[10px] font-semibold bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full">{a}</span>
          ))}
        </div>
      )}

      {/* Applied Tax */}
      {appliedTax ? (
        <div className={`rounded-lg border px-3 py-2 ${appliedTax.source === 'category' ? 'bg-blue-50 border-blue-200' : 'bg-muted/40 border-border'}`}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-foreground">{appliedTax.name}</p>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${appliedTax.source === 'category' ? 'bg-blue-100 text-blue-700' : 'bg-muted text-muted-foreground'}`}>
              {appliedTax.source === 'category' ? 'Category Tax' : 'Global Tax'}
            </span>
          </div>
          <div className="flex gap-3 text-xs font-semibold">
            <span className="text-blue-700">CGST {appliedTax.cgst}%</span>
            <span className="text-muted-foreground">+</span>
            <span className="text-indigo-700">SGST {appliedTax.sgst}%</span>
            <span className="text-muted-foreground ml-auto">= <span className="text-green-700 font-bold">{totalRate(appliedTax)}%</span></span>
          </div>
        </div>
      ) : (
        <div className="bg-muted/30 border border-dashed border-border rounded-lg px-3 py-2 text-xs text-muted-foreground text-center">
          No tax applied — add a rule in the <span className="font-semibold">Taxes</span> tab
        </div>
      )}

      <SL>Aggregator Pricing & Inventory</SL>
      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
        <div className="bg-orange-50 border border-orange-100 rounded-lg px-2 py-1.5 text-center">
          <p className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">Swiggy Markup</p>
          <div className="flex items-center justify-center mt-0.5">
            <input type="number" value={swiggyMarkup} onChange={(e) => setSwiggyMarkup(e.target.value)} placeholder="0"
              className="w-12 text-sm font-black text-center bg-transparent outline-none text-orange-900" />
            <span className="text-xs font-bold text-orange-700">%</span>
          </div>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-lg px-2 py-1.5 text-center">
          <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Zomato Markup</p>
          <div className="flex items-center justify-center mt-0.5">
            <input type="number" value={zomatoMarkup} onChange={(e) => setZomatoMarkup(e.target.value)} placeholder="0"
              className="w-12 text-sm font-black text-center bg-transparent outline-none text-red-900" />
            <span className="text-xs font-bold text-red-700">%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <div className="bg-muted/40 rounded-lg px-2 py-1.5 text-center">
          <p className="text-xs text-muted-foreground">Discount</p>
          <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0"
            className="w-full text-xs font-bold text-center bg-transparent outline-none text-foreground" />
          <p className="text-[10px] text-muted-foreground">%</p>
        </div>
        <div className="bg-muted/40 rounded-lg px-2 py-1.5 text-center">
          <p className="text-xs text-muted-foreground">Pkg.</p>
          <input type="number" value={pkg} onChange={(e) => setPkg(e.target.value)} placeholder="0"
            className="w-full text-xs font-bold text-center bg-transparent outline-none text-foreground" />
          <p className="text-[10px] text-muted-foreground">₹</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        <div className="bg-muted/40 rounded-lg px-2 py-1.5 text-center col-span-1">
          <p className="text-xs text-muted-foreground">Code</p>
          <input value={itemCode} onChange={(e) => setItemCode(e.target.value)} placeholder="SKU"
            className="w-full text-xs font-bold text-center bg-transparent outline-none text-foreground" />
        </div>
        <div className="bg-muted/40 rounded-lg px-2 py-1.5 text-center">
          <p className="text-xs text-muted-foreground">Min Qty</p>
          <input type="number" value={minQty} onChange={(e) => setMinQty(e.target.value)} placeholder="1"
            className="w-full text-xs font-bold text-center bg-transparent outline-none text-foreground" />
        </div>
        <div className="bg-muted/40 rounded-lg px-2 py-1.5 text-center">
          <p className="text-xs text-muted-foreground">Max Qty</p>
          <input type="number" value={maxQty} onChange={(e) => setMaxQty(e.target.value)} placeholder="∞"
            className="w-full text-xs font-bold text-center bg-transparent outline-none text-foreground" />
        </div>
      </div>

      <SL>Nutrition</SL>
      <div className="grid grid-cols-2 gap-1.5">
        <div className="bg-muted/40 rounded-lg px-2 py-1.5 text-center">
          <p className="text-xs text-muted-foreground">Prep</p>
          <input type="number" value={prep} onChange={(e) => setPrep(e.target.value)} placeholder="—"
            className="w-full text-xs font-bold text-center bg-transparent outline-none text-foreground" />
          <p className="text-[10px] text-muted-foreground">mins</p>
        </div>
        <div className="bg-muted/40 rounded-lg px-2 py-1.5 text-center">
          <p className="text-xs text-muted-foreground">Calories</p>
          <input type="number" value={cal} onChange={(e) => setCal(e.target.value)} placeholder="—"
            className="w-full text-xs font-bold text-center bg-transparent outline-none text-foreground" />
          <p className="text-[10px] text-muted-foreground">kcal</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2 mt-4 first:mt-0">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</p>
        <button 
          onClick={() => {
            setDesc('Generating...');
            setTimeout(() => {
              const base = `A delicious and mouth-watering serving of ${item.name}.`;
              const spice = item.tags?.includes('Spicy') ? ' Perfectly spiced to give a fiery kick.' : '';
              const best = item.tags?.includes('Bestseller') ? ' One of our most loved and highly recommended dishes!' : '';
              setDesc(base + spice + best);
            }, 800);
          }}
          className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-[10px] font-bold transition-colors"
        >
          <Sparkles className="w-3 h-3" /> AI Auto-Write
        </button>
      </div>
      <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Short description..."
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs outline-none focus:border-primary transition-colors resize-none" />

      <div className="sticky bottom-0 pb-2 pt-4 bg-gradient-to-t from-card via-card to-transparent mt-4 -mx-1 px-1">
        <button 
          onClick={save} 
          disabled={!isDirty}
          className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-md ${isDirty ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5' : 'bg-muted text-muted-foreground opacity-60 cursor-not-allowed shadow-none'}`}
        >
          {isDirty ? 'Save Details' : 'All Changes Saved'}
        </button>
      </div>
    </div>
  );
}


export default function ItemConfigPanel() {
  const { items, selectedItemId } = useMenuStore();
  const [tab, setTab] = useState('Details');

  const item = items.find(i => i.id === selectedItemId);

  if (!item) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-muted/20">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
          <span className="text-base">☰</span>
        </div>
        <p className="text-xs font-semibold text-muted-foreground">Select an item</p>
        <p className="text-[10px] text-muted-foreground mt-1">Click any item to configure variants, addons & timing</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background w-full">
      {/* Item Header */}
      <div className="px-4 py-3 border-b border-border bg-card flex items-center gap-2.5">
        <VegDot type={item.type} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate">{item.name}</p>
          <p className="text-xs text-muted-foreground">₹{item.price} · {item.type}{item.prepTime ? ` · ${item.prepTime}min` : ''}{item.calories ? ` · ${item.calories}kcal` : ''}</p>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          item.status === 'Active' ? 'bg-green-50 text-green-700' :
          item.status === 'Out of Stock' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
        }`}>{item.status}</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card px-4 gap-4">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'Details' && <DetailsTab item={item} />}
        {tab === 'Variants' && <VariantManager itemId={item.id} />}
        {tab === 'Addons' && <AddonManager itemId={item.id} />}
        {tab === 'Timing' && <TimingSelector itemId={item.id} />}
      </div>
    </div>
  );
}
