import { useMenuStore } from '../store/useMenuStore';
import MenuHeader from '../components/menu/common/MenuHeader';
import MenusTab from '../components/menu/menus/MenusTab';
import MenuBuilderTab from '../components/menu/builder/MenuBuilderTab';
import StoreLinkingTab from '../components/menu/linking/StoreLinkingTab';
import ModifiersTab from '../components/menu/modifiers/ModifiersTab';
import TaxesTab from '../components/menu/taxes/TaxesTab';
import ThirdPartyLinkingTab from '../components/menu/linking/ThirdPartyLinkingTab';


const TABS = [
  { id: 'menus',     label: 'Menus' },
  { id: 'builder',   label: 'Builder' },
  { id: 'links',     label: 'Store Links' },
  { id: 'modifiers', label: 'Modifiers' },
  { id: 'taxes',     label: 'Taxes' },
  { id: 'third-party', label: 'Third Party' },
];

export default function Menu() {
  const { activeTab, setActiveTab } = useMenuStore();

  return (
    <div className="flex-1 flex flex-col h-full bg-muted/30 overflow-hidden">

      {/* Compact global header */}
      <MenuHeader />

      {/* Tab navigation */}
      <div className="bg-card border-b border-border px-4 flex gap-5 overflow-x-auto shrink-0 scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-1 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'menus'     && <MenusTab />}
        {activeTab === 'builder'   && <MenuBuilderTab />}
        {activeTab === 'links'     && <StoreLinkingTab />}
        {activeTab === 'modifiers' && <ModifiersTab />}
        {activeTab === 'taxes'     && <div className="h-full overflow-y-auto"><TaxesTab /></div>}
        {activeTab === 'third-party' && <ThirdPartyLinkingTab />}
      </div>

    </div>
  );
}
