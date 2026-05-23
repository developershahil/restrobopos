import { useState, useEffect, useRef } from 'react';
import { Search, X, Command, FileText, Settings, Users, Store, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const mockResults = [
    { type: 'Setting', title: 'Auto Assignment', path: '/settings', icon: Settings },
    { type: 'Setting', title: 'Home Delivery', path: '/settings', icon: Settings },
    { type: 'Customer', title: 'John Doe', path: '/customers', icon: Users },
    { type: 'Order', title: '#ORD-10492', path: '/orders', icon: FileText },
    { type: 'Store', title: 'Koramangala Branch', path: '/stores', icon: Store },
  ];

  const filteredResults = query 
    ? mockResults.filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.type.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden animate-in slide-in-from-top-4 duration-300">
        
        {/* Search Header */}
        <div className="flex items-center px-4 border-b border-border bg-card relative">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search settings, orders, customers..."
            className="flex-1 bg-transparent border-none outline-none px-4 py-5 text-base font-medium text-foreground placeholder:text-muted-foreground"
          />
          <button 
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query && (
            <div className="p-8 text-center text-muted-foreground">
              <Command className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">Type to start searching</p>
              <p className="text-xs mt-1 opacity-60">Find settings, recent orders, or customer profiles</p>
            </div>
          )}

          {query && filteredResults.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">No results found for "{query}"</p>
            </div>
          )}

          {query && filteredResults.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-black uppercase tracking-wider text-muted-foreground opacity-60">
                Search Results
              </div>
              {filteredResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    navigate(result.path);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                      <result.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {result.title}
                      </h4>
                      <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                        {result.type} • {result.path}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
