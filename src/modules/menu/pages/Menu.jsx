import { useEffect } from 'react';
import { useMenuStore } from '@modules/menu/store/useMenuStore';
import MenuHeader from '@modules/menu/components/common/MenuHeader';
import MenusTab from '@modules/menu/components/menus/MenusTab';
import MenuBuilderTab from '@modules/menu/components/builder/MenuBuilderTab';
import StoreLinkingTab from '@modules/menu/components/linking/StoreLinkingTab';
import ModifiersTab from '@modules/menu/components/modifiers/ModifiersTab';
import TaxesTab from '@modules/menu/components/taxes/TaxesTab';
import ThirdPartyLinkingTab from '@modules/menu/components/linking/ThirdPartyLinkingTab';
import MenuPushTab from '@modules/menu/components/push/MenuPushTab';


const TABS = [
  { id: 'menus',     label: 'Menus' },
  { id: 'builder',   label: 'Builder' },
  { id: 'push',      label: 'Push Menu' },
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
        {activeTab === 'push'      && <MenuPushTab />}
        {activeTab === 'links'     && <StoreLinkingTab />}
        {activeTab === 'modifiers' && <ModifiersTab />}
        {activeTab === 'taxes'     && <div className="h-full overflow-y-auto"><TaxesTab /></div>}
        {activeTab === 'third-party' && <ThirdPartyLinkingTab />}
      </div>

    </div>
  );
}
