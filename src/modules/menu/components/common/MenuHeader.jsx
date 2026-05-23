import { Search } from 'lucide-react';
import { useMenuStore } from '@modules/menu/store/useMenuStore';

const TAB_LABELS = {
  menus: 'Menus',
  builder: 'Builder',
  links: 'Store Links',
  modifiers: 'Modifiers',
};

export default function MenuHeader() {
  const { activeTab } = useMenuStore();

  return (
    <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between gap-4 shrink-0">
      <p className="text-sm font-bold text-foreground">{TAB_LABELS[activeTab] || 'Menu'}</p>

      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          className="w-48 pl-8 pr-3 py-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary text-xs font-medium transition-colors"
        />
      </div>
    </div>
  );
}
