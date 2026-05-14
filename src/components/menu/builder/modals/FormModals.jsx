import { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { useMenuStore } from '../../../../store/useMenuStore';
import TimingSelector from '../TimingSelector';

// ─── Shared primitives ────────────────────────────────────────────────────────
export function ModalWrapper({ title, onClose, children, footer, maxWidth = 'max-w-sm' }) {
  const overlayRef = useRef();
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className={`bg-card border border-border rounded-xl shadow-xl w-full mx-4 flex flex-col ${maxWidth}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && <div className="px-4 pb-4 flex gap-2">{footer}</div>}
      </div>
    </div>
  );
}

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">{label}</label>
    {children}
  </div>
);

const Input = (props) => (
  <input {...props} className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors" />
);

const SaveCancelFooter = ({ onClose }) => (
  <>
    <button onClick={onClose} className="flex-1 py-1.5 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors">Cancel</button>
    <button type="submit" className="flex-1 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Save</button>
  </>
);

// ─── COLORS ───────────────────────────────────────────────────────────────────
const PALETTE = ['#6366f1','#f59e0b','#10b981','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#64748b'];

// ─── TAGS ─────────────────────────────────────────────────────────────────────
const ALL_TAGS = ['Bestseller','Spicy','New','Popular',"Chef's Special","Must Try","Healthy"];

// ─── Category Modal ───────────────────────────────────────────────────────────
export function CategoryModal({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || '');
  const [active, setActive] = useState(initial?.active ?? true);
  const [color, setColor] = useState(initial?.color || '#6366f1');

  const { categoryTiming, setCategoryTiming } = useMenuStore();
  const initialTiming = initial ? categoryTiming[initial.id] : undefined;
  const [timing, setTiming] = useState(initialTiming || { alwaysAvailable: true, days: [], startTime: '', endTime: '' });

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Save category
    const catData = { name: name.trim(), active, color };
    onSave(catData, timing); // Pass timing to onSave
    onClose();
  };

  return (
    <ModalWrapper title={initial ? 'Edit Category' : 'Add Category'} onClose={onClose}
      footer={<form onSubmit={handleSave} className="contents"><SaveCancelFooter onClose={onClose} /></form>}>
      <Field label="Name *">
        <Input placeholder="e.g. Starters" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      </Field>
      <Field label="Color">
        <div className="flex gap-2 flex-wrap">
          {PALETTE.map(c => (
            <button key={c} type="button" onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-foreground scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>
      </Field>
      <div className="flex items-center justify-between border-t border-border/50 pt-3">
        <span className="text-sm font-semibold text-foreground">Active</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={active} onChange={(e) => setActive(e.target.checked)} />
          <div className="w-8 h-4 bg-muted-foreground/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary" />
        </label>
      </div>

      <div className="border-t border-border/50 pt-3 mt-1">
        <TimingSelector value={timing} onChange={setTiming} />
      </div>
    </ModalWrapper>
  );
}

// ─── Item Modal ───────────────────────────────────────────────────────────────
const ALL_ALLERGENS = ['Gluten','Dairy','Eggs','Nuts','Soy','Seafood','Sesame'];
const ALL_CHANNELS  = ['Swiggy', 'Zomato', 'POS', 'Mobile App'];

export function ItemModal({ initial, categoryId, onSave, onClose }) {
  const [name, setName]                   = useState(initial?.name || '');
  const [price, setPrice]                 = useState(initial?.price || '');
  const [type, setType]                   = useState(initial?.type || 'Veg');
  const [status, setStatus]               = useState(initial?.status || 'Active');
  const [description, setDescription]     = useState(initial?.description || '');
  const [prepTime, setPrepTime]           = useState(initial?.prepTime || '');
  const [calories, setCalories]           = useState(initial?.calories || '');
  const [packagingCharge, setPackaging]   = useState(initial?.packagingCharge || '0');
  const [tags, setTags]                   = useState(initial?.tags || []);
  const [itemCode, setItemCode]           = useState(initial?.itemCode || '');
  const [discount, setDiscount]           = useState(initial?.discount || '0');
  const [minOrderQty, setMinOrderQty]     = useState(initial?.minOrderQty || '1');
  const [maxOrderQty, setMaxOrderQty]     = useState(initial?.maxOrderQty || '');
  const [allergens, setAllergens]         = useState(initial?.allergens || []);
  const [channels, setChannels]           = useState(initial?.channels || ['Swiggy', 'Zomato', 'POS', 'Mobile App']);

  const toggleTag      = (t) => setTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  const toggleAllergen = (a) => setAllergens(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a]);
  const toggleChannel  = (c) => setChannels(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !price) return;
    onSave({ name: name.trim(), price, type, status, description, prepTime, calories, packagingCharge, tags, itemCode, discount, minOrderQty, maxOrderQty, allergens, channels, categoryId: initial?.categoryId || categoryId });
    onClose();
  };

  const SectionLabel = ({ children }) => (
    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pt-1 border-t border-border/50 mb-2">{children}</p>
  );

  return (
    <ModalWrapper title={initial ? 'Edit Item' : 'Add Item'} onClose={onClose} maxWidth="max-w-md"
      footer={<form onSubmit={handleSave} className="contents"><SaveCancelFooter onClose={onClose} /></form>}>

      {/* Basic */}
      <Field label="Name *">
        <Input placeholder="e.g. Paneer Tikka" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Price *">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₹</span>
            <input type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-6 pr-3 py-1.5 text-sm outline-none focus:border-primary transition-colors" />
          </div>
        </Field>
        <Field label="Type">
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors">
            <option>Veg</option><option>Non-Veg</option><option>Egg</option><option>Vegan</option>
          </select>
        </Field>
      </div>

      <Field label="Description">
        <textarea rows={2} placeholder="Short description of this item..." value={description} onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors resize-none" />
      </Field>

      {/* Inventory */}
      <SectionLabel>Inventory & Pricing</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Discount %">
          <input type="number" placeholder="0" min={0} max={100} value={discount} onChange={(e) => setDiscount(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors" />
        </Field>
        <Field label="Pkg. ₹">
          <input type="number" placeholder="0" value={packagingCharge} onChange={(e) => setPackaging(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors" />
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Field label="Item Code">
          <Input placeholder="SKU-001" value={itemCode} onChange={(e) => setItemCode(e.target.value)} />
        </Field>
        <Field label="Min Qty">
          <input type="number" placeholder="1" min={1} value={minOrderQty} onChange={(e) => setMinOrderQty(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors" />
        </Field>
        <Field label="Max Qty">
          <input type="number" placeholder="∞" min={1} value={maxOrderQty} onChange={(e) => setMaxOrderQty(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors" />
        </Field>
      </div>

      {/* Nutrition */}
      <SectionLabel>Nutrition</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Prep (min)">
          <input type="number" placeholder="15" value={prepTime} onChange={(e) => setPrepTime(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors" />
        </Field>
        <Field label="Calories">
          <input type="number" placeholder="350" value={calories} onChange={(e) => setCalories(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors" />
        </Field>
      </div>

      {/* Allergens */}
      <SectionLabel>Allergens</SectionLabel>
      <div className="flex flex-wrap gap-1.5">
        {ALL_ALLERGENS.map(a => (
          <button key={a} type="button" onClick={() => toggleAllergen(a)}
            className={`px-2 py-0.5 rounded-full text-xs font-semibold border transition-colors ${
              allergens.includes(a) ? 'bg-red-100 text-red-700 border-red-300' : 'bg-background border-border text-muted-foreground hover:border-red-300'
            }`}>{a}</button>
        ))}
      </div>

      {/* Channels */}
      <SectionLabel>Available On</SectionLabel>
      <div className="flex gap-2">
        {ALL_CHANNELS.map(c => (
          <button key={c} type="button" onClick={() => toggleChannel(c)}
            className={`flex-1 py-1 rounded-lg text-xs font-semibold border transition-colors ${
              channels.includes(c) ? 'bg-primary/10 text-primary border-primary/40' : 'bg-background border-border text-muted-foreground hover:border-primary/30'
            }`}>{c}</button>
        ))}
      </div>

      {/* Tags */}
      <SectionLabel>Tags</SectionLabel>
      <div className="flex flex-wrap gap-1.5">
        {ALL_TAGS.map(tag => (
          <button key={tag} type="button" onClick={() => toggleTag(tag)}
            className={`px-2 py-0.5 rounded-full text-xs font-semibold border transition-colors ${
              tags.includes(tag) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground hover:border-primary/50'
            }`}>{tag}</button>
        ))}
      </div>

      {/* Status */}
      <SectionLabel>Status</SectionLabel>
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors">
        <option>Active</option><option>Inactive</option><option>Out of Stock</option>
      </select>
    </ModalWrapper>
  );
}


// ─── Variant Modal ────────────────────────────────────────────────────────────
export function VariantModal({ initial, itemId, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || '');
  const [price, setPrice] = useState(initial?.price || '');
  const [itemCode, setItemCode] = useState(initial?.itemCode || '');
  const [calories, setCalories] = useState(initial?.calories || '');
  const [inStock, setInStock] = useState(initial?.inStock ?? true);

  const handleSave = (e) => { 
    e.preventDefault(); 
    if (!name.trim() || !price) return; 
    onSave({ 
      name: name.trim(), 
      price, 
      itemId: initial?.itemId || itemId,
      itemCode,
      calories,
      inStock
    }); 
    onClose(); 
  };

  return (
    <ModalWrapper title={initial ? 'Edit Variant' : 'Add Variant'} onClose={onClose}
      footer={<form onSubmit={handleSave} className="contents"><SaveCancelFooter onClose={onClose} /></form>}>
      
      <Field label="Name *"><Input placeholder="e.g. Small / Medium / Large" value={name} onChange={(e) => setName(e.target.value)} autoFocus /></Field>
      
      <div className="grid grid-cols-2 gap-3">
        <Field label="Price *">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₹</span>
            <input type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-6 pr-3 py-1.5 text-sm outline-none focus:border-primary transition-colors" />
          </div>
        </Field>
        <Field label="Item Code / SKU">
          <Input placeholder="e.g. PIZ-SML" value={itemCode} onChange={(e) => setItemCode(e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3 items-end">
        <Field label="Calories (kcal)">
          <Input type="number" placeholder="e.g. 250" value={calories} onChange={(e) => setCalories(e.target.value)} />
        </Field>
        
        <label className="flex items-center gap-2 p-2 border border-border rounded-lg bg-background cursor-pointer hover:bg-muted/50 transition-colors h-[34px] mb-2.5">
          <input 
            type="checkbox" 
            checked={inStock} 
            onChange={(e) => setInStock(e.target.checked)}
            className="w-4 h-4 text-primary rounded border-border" 
          />
          <span className="text-sm font-medium text-foreground">In Stock</span>
        </label>
      </div>
    </ModalWrapper>
  );
}

// ─── Addon Group Modal ────────────────────────────────────────────────────────
export function AddonGroupModal({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || '');
  const [min, setMin] = useState(initial?.min ?? 0);
  const [max, setMax] = useState(initial?.max ?? 1);
  const handleSave = (e) => { e.preventDefault(); if (!name.trim()) return; onSave({ name: name.trim(), min: Number(min), max: Number(max) }); onClose(); };
  return (
    <ModalWrapper title={initial ? 'Edit Addon Group' : 'Add Addon Group'} onClose={onClose}
      footer={<form onSubmit={handleSave} className="contents"><SaveCancelFooter onClose={onClose} /></form>}>
      <Field label="Group Name *"><Input placeholder="e.g. Dips & Sauces" value={name} onChange={(e) => setName(e.target.value)} autoFocus /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Min Selection">
          <input type="number" min={0} value={min} onChange={(e) => setMin(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors" />
        </Field>
        <Field label="Max Selection">
          <input type="number" min={1} value={max} onChange={(e) => setMax(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors" />
        </Field>
      </div>
    </ModalWrapper>
  );
}

// ─── Variant Group Modal ──────────────────────────────────────────────────────
export function VariantGroupModal({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || '');
  const handleSave = (e) => { e.preventDefault(); if (!name.trim()) return; onSave({ name: name.trim() }); onClose(); };
  return (
    <ModalWrapper title={initial ? 'Edit Variant Group' : 'Add Variant Group'} onClose={onClose}
      footer={<form onSubmit={handleSave} className="contents"><SaveCancelFooter onClose={onClose} /></form>}>
      <Field label="Group Name *"><Input placeholder="e.g. Size / Preparation" value={name} onChange={(e) => setName(e.target.value)} autoFocus /></Field>
      <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground mt-2 border border-border">
        Global variant groups allow you to define standard options (e.g. Small, Medium, Large) that can be applied to many items at once.
      </div>
    </ModalWrapper>
  );
}

// ─── Global Variant Modal ─────────────────────────────────────────────────────
export function GlobalVariantModal({ initial, groupId, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || '');
  const [priceDiff, setPriceDiff] = useState(initial?.priceDiff || '0');
  const [itemCode, setItemCode] = useState(initial?.itemCode || '');
  const [calories, setCalories] = useState(initial?.calories || '');
  const [inStock, setInStock] = useState(initial?.inStock ?? true);
  
  const handleSave = (e) => { 
    e.preventDefault(); 
    if (!name.trim()) return; 
    onSave({ 
      name: name.trim(), 
      priceDiff: priceDiff || '0', 
      groupId: initial?.groupId || groupId,
      itemCode,
      calories,
      inStock
    }); 
    onClose(); 
  };
  
  return (
    <ModalWrapper title={initial ? 'Edit Variant Option' : 'Add Variant Option'} onClose={onClose}
      footer={<form onSubmit={handleSave} className="contents"><SaveCancelFooter onClose={onClose} /></form>}>
      <Field label="Variant Name *"><Input placeholder="e.g. Medium / Giant" value={name} onChange={(e) => setName(e.target.value)} autoFocus /></Field>
      
      <div className="grid grid-cols-2 gap-3">
        <Field label="Price Adjustment (+/- ₹)">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₹</span>
            <input type="number" placeholder="0.00" value={priceDiff} onChange={(e) => setPriceDiff(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-6 pr-3 py-1.5 text-sm outline-none focus:border-primary transition-colors" />
          </div>
        </Field>
        <Field label="Item Code / SKU">
          <Input placeholder="e.g. V-MED" value={itemCode} onChange={(e) => setItemCode(e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3 items-end">
        <Field label="Calories Adjust (+/- kcal)">
          <Input type="number" placeholder="e.g. 150" value={calories} onChange={(e) => setCalories(e.target.value)} />
        </Field>
        
        <label className="flex items-center gap-2 p-2 border border-border rounded-lg bg-background cursor-pointer hover:bg-muted/50 transition-colors h-[34px] mb-2.5">
          <input 
            type="checkbox" 
            checked={inStock} 
            onChange={(e) => setInStock(e.target.checked)}
            className="w-4 h-4 text-primary rounded border-border" 
          />
          <span className="text-sm font-medium text-foreground">In Stock</span>
        </label>
      </div>

      <div className="bg-muted/50 p-2.5 rounded-lg text-xs text-muted-foreground border border-border mt-1">
        Example: If base item is ₹100, entering <strong>20</strong> makes this variant ₹120. Entering <strong>-10</strong> makes it ₹90.
      </div>
    </ModalWrapper>
  );
}

// ─── Addon Item Modal ─────────────────────────────────────────────────────────
export function AddonItemModal({ initial, groupId, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || '');
  const [price, setPrice] = useState(initial?.price || '0');
  const [itemCode, setItemCode] = useState(initial?.itemCode || '');
  const [calories, setCalories] = useState(initial?.calories || '');
  const [inStock, setInStock] = useState(initial?.inStock ?? true);

  const handleSave = (e) => { 
    e.preventDefault(); 
    if (!name.trim()) return; 
    onSave({ 
      name: name.trim(), 
      price: price || '0', 
      groupId: initial?.groupId || groupId,
      itemCode,
      calories,
      inStock
    }); 
    onClose(); 
  };

  return (
    <ModalWrapper title={initial ? 'Edit Addon Item' : 'Add Addon Item'} onClose={onClose}
      footer={<form onSubmit={handleSave} className="contents"><SaveCancelFooter onClose={onClose} /></form>}>
      <Field label="Item Name *"><Input placeholder="e.g. Extra Cheese" value={name} onChange={(e) => setName(e.target.value)} autoFocus /></Field>
      
      <div className="grid grid-cols-2 gap-3">
        <Field label="Additional Price (₹)">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₹</span>
            <input type="number" min={0} placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-6 pr-3 py-1.5 text-sm outline-none focus:border-primary transition-colors" />
          </div>
        </Field>
        <Field label="Item Code / SKU">
          <Input placeholder="e.g. ADD-CHS" value={itemCode} onChange={(e) => setItemCode(e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3 items-end">
        <Field label="Calories (kcal)">
          <Input type="number" placeholder="e.g. 120" value={calories} onChange={(e) => setCalories(e.target.value)} />
        </Field>
        
        <label className="flex items-center gap-2 p-2 border border-border rounded-lg bg-background cursor-pointer hover:bg-muted/50 transition-colors h-[34px] mb-2.5">
          <input 
            type="checkbox" 
            checked={inStock} 
            onChange={(e) => setInStock(e.target.checked)}
            className="w-4 h-4 text-primary rounded border-border" 
          />
          <span className="text-sm font-medium text-foreground">In Stock</span>
        </label>
      </div>
    </ModalWrapper>
  );
}

// ─── Bulk Link Modal ──────────────────────────────────────────────────────────
export function BulkLinkModal({ group, type, onSave, onClose }) {
  const { categories, items } = useMenuStore();
  const [mode, setMode] = useState('category'); // 'all', 'category', 'item'
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleId = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(mode, selectedIds);
    onClose();
  };

  return (
    <ModalWrapper title={`Link ${type === 'addon' ? 'Add-on' : 'Variant'} Group: ${group.name}`} onClose={onClose}
      footer={<form onSubmit={handleSave} className="contents"><SaveCancelFooter onClose={onClose} /></form>}>
      
      <div className="flex bg-muted/50 p-1 rounded-lg border border-border mb-4">
        {['all', 'category', 'item'].map(m => (
          <button
            key={m} type="button"
            onClick={() => { setMode(m); setSelectedIds([]); }}
            className={`flex-1 text-xs font-bold py-1.5 rounded-md capitalize transition-colors ${mode === m ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {m === 'all' ? 'All Items' : `By ${m}`}
          </button>
        ))}
      </div>

      {mode === 'all' && (
        <div className="text-center py-8 bg-muted/20 border border-dashed border-border rounded-lg text-sm text-muted-foreground">
          This will apply <strong className="text-foreground">{group.name}</strong> to every item in your menu.
        </div>
      )}

      {mode === 'category' && (
        <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-2">
          {categories.map(c => (
            <label key={c.id} className="flex items-center gap-3 p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => toggleId(c.id)} className="w-4 h-4 text-primary rounded border-border" />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="text-sm font-medium text-foreground">{c.name}</span>
            </label>
          ))}
        </div>
      )}

      {mode === 'item' && (
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search items to link..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-2">
            {items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(i => (
              <label key={i.id} className="flex items-center justify-between p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={selectedIds.includes(i.id)} onChange={() => toggleId(i.id)} className="w-4 h-4 text-primary rounded border-border" />
                  <span className="text-sm font-medium text-foreground">{i.name}</span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{categories.find(c => c.id === i.categoryId)?.name || 'Uncategorized'}</span>
              </label>
            ))}
            {items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
              <div className="text-center py-4 text-xs text-muted-foreground">No items found matching "{searchTerm}"</div>
            )}
          </div>
        </div>
      )}
    </ModalWrapper>
  );
}

// ─── Tax Modal ────────────────────────────────────────────────────────────────
export function TaxModal({ initial, categories, onSave, onClose }) {
  const [name, setName]             = useState(initial?.name || '');
  const [cgst, setCgst]             = useState(initial?.cgst || '');
  const [sgst, setSgst]             = useState(initial?.sgst || '');
  const [categoryIds, setCategoryIds] = useState(initial?.categoryIds || []);

  const total = (parseFloat(cgst || 0) + parseFloat(sgst || 0)).toFixed(2).replace(/\.?0+$/, '');

  // Auto-split helper: enter total GST → split equally into CGST & SGST
  const autoSplit = (totalRate) => {
    const half = (parseFloat(totalRate) / 2).toString();
    setCgst(half); setSgst(half);
  };

  const toggleCat = (id) => setCategoryIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !cgst || !sgst) return;
    onSave({ name: name.trim(), cgst, sgst, categoryIds });
    onClose();
  };

  return (
    <ModalWrapper title={initial ? 'Edit Tax' : 'Add Tax'} onClose={onClose}
      footer={<form onSubmit={handleSave} className="contents"><SaveCancelFooter onClose={onClose} /></form>}>
      <Field label="Tax Name *">
        <Input placeholder="e.g. GST 18%" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      </Field>

      {/* Auto-split quick buttons */}
      <div>
        <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1.5">Quick Split</label>
        <div className="flex gap-1.5 flex-wrap">
          {['5','12','18','28'].map(r => (
            <button key={r} type="button" onClick={() => { autoSplit(r); setName(`GST ${r}%`); }}
              className="px-2.5 py-1 rounded-lg border border-border text-xs font-semibold hover:bg-primary/10 hover:border-primary hover:text-primary transition-colors">
              {r}% GST
            </button>
          ))}
        </div>
      </div>

      {/* CGST + SGST inputs */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="CGST (%)">
          <div className="relative">
            <input type="number" placeholder="e.g. 9" step="0.5" value={cgst} onChange={(e) => setCgst(e.target.value)}
              className="w-full bg-background border border-blue-300 rounded-lg px-3 pr-8 py-1.5 text-sm outline-none focus:border-blue-500 transition-colors" />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-blue-500 font-bold">%</span>
          </div>
        </Field>
        <Field label="SGST (%)">
          <div className="relative">
            <input type="number" placeholder="e.g. 9" step="0.5" value={sgst} onChange={(e) => setSgst(e.target.value)}
              className="w-full bg-background border border-indigo-300 rounded-lg px-3 pr-8 py-1.5 text-sm outline-none focus:border-indigo-500 transition-colors" />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-indigo-500 font-bold">%</span>
          </div>
        </Field>
      </div>

      {/* Live total preview */}
      {(cgst || sgst) && (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <div className="flex gap-4 text-xs font-semibold">
            <span className="text-blue-700">CGST {cgst || 0}%</span>
            <span className="text-muted-foreground">+</span>
            <span className="text-indigo-700">SGST {sgst || 0}%</span>
          </div>
          <span className="text-sm font-bold text-green-700">= {total}% Total</span>
        </div>
      )}

      <Field label="Apply to Categories (empty = all)">
        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          {categories.map(c => (
            <label key={c.id} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={categoryIds.includes(c.id)} onChange={() => toggleCat(c.id)} className="accent-primary w-3.5 h-3.5" />
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color || '#6366f1' }} />
              <span className="text-sm text-foreground">{c.name}</span>
            </label>
          ))}
        </div>
      </Field>
    </ModalWrapper>
  );
}


// ─── Offer Modal ──────────────────────────────────────────────────────────────
export function OfferModal({ initial, items, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || '');
  const [type, setType] = useState(initial?.type || 'Percentage');
  const [value, setValue] = useState(initial?.value || '');
  const [itemIds, setItemIds] = useState(initial?.itemIds || []);
  const toggleItem = (id) => setItemIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const handleSave = (e) => { e.preventDefault(); if (!name.trim() || !value) return; onSave({ name: name.trim(), type, value, itemIds }); onClose(); };
  return (
    <ModalWrapper title={initial ? 'Edit Offer' : 'Add Offer'} onClose={onClose}
      footer={<form onSubmit={handleSave} className="contents"><SaveCancelFooter onClose={onClose} /></form>}>
      <Field label="Offer Name *"><Input placeholder="e.g. Happy Hour 20% Off" value={name} onChange={(e) => setName(e.target.value)} autoFocus /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Type">
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors">
            <option>Percentage</option><option>Flat</option>
          </select>
        </Field>
        <Field label={type === 'Percentage' ? 'Discount %' : 'Flat ₹ Off'}>
          <input type="number" placeholder="20" value={value} onChange={(e) => setValue(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors" />
        </Field>
      </div>
      <Field label="Apply to Items (empty = all)">
        <div className="max-h-32 overflow-y-auto space-y-1 border border-border rounded-lg p-2">
          {items.map(i => (
            <label key={i.id} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={itemIds.includes(i.id)} onChange={() => toggleItem(i.id)} className="accent-primary w-3.5 h-3.5" />
              <span className="text-xs text-foreground">{i.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">₹{i.price}</span>
            </label>
          ))}
        </div>
      </Field>
    </ModalWrapper>
  );
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
export function ConfirmModal({ title, message, confirmText = 'Delete', onConfirm, onClose }) {
  const overlayRef = useRef();
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-sm mx-4 flex flex-col animate-in fade-in zoom-in-95">
        <div className="p-5">
          <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors">
            Cancel
          </button>
          <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
