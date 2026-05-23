import { useState, useEffect } from 'react';
import { Search, X, Building, CheckCircle2, Store, PlusCircle } from 'lucide-react';

export default function SwitchRestaurantModal({ isOpen, onClose, brands, activeBrand, onSelectBrand }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Overlay Click to Close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="bg-card w-full max-w-2xl rounded-lg shadow-2xl border border-border flex flex-col relative z-10 overflow-hidden max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Switch Brand Context</h2>
              <p className="text-sm text-muted-foreground mt-1">Select a restaurant brand to manage its data and outlets.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-background border border-border rounded-full hover:bg-muted transition-colors shadow-sm"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search brands..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md outline-none focus:border-primary font-medium shadow-sm"
            />
          </div>
        </div>

        {/* Brand List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-4 bg-background">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredBrands.map(brand => {
              const isCurrent = activeBrand.id === brand.id;
              return (
              <div 
                key={brand.id}
                onClick={() => {
                  if (!isCurrent) {
                    onSelectBrand(brand);
                    onClose();
                  }
                }}
                className={`relative p-5 rounded-md border transition-all ${
                  isCurrent 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                    : 'border-border bg-card hover:border-primary/50 hover:shadow-md cursor-pointer group'
                }`}
              >
                {isCurrent && (
                  <div className="absolute top-3 right-3 text-primary flex items-center gap-1 text-xs font-bold bg-primary/10 px-2 py-1 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Current
                  </div>
                )}
                
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg ${brand.color} flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0 transition-colors`}>
                    {brand.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground leading-tight">{brand.name}</h3>
                    <p className="text-[11px] font-medium text-muted-foreground">{brand.role}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                    <Store className="w-4 h-4" /> {brand.outlets} Outlets
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                    brand.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {brand.status}
                  </span>
                </div>
              </div>
            )})}
            
            {filteredBrands.length === 0 && (
              <div className="col-span-1 sm:col-span-2 text-center py-10 text-muted-foreground">
                <Building className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-bold">No brands found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-4 border-t border-border bg-muted/30 shrink-0">
          <button className="w-full py-3 bg-background border border-border border-dashed rounded-md font-bold text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
            <PlusCircle className="w-4 h-4" /> Register New Restaurant Brand
          </button>
        </div>

      </div>
    </div>
  );
}
