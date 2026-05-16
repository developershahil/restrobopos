import { useState } from 'react';
import { Plus, Pencil, Trash2, Link, ChevronLeft, ChevronRight, X, MapPin, Search, Check, Settings2, ChevronDown, Store } from 'lucide-react';
import LinkOfferTab from './LinkOfferTab';

const MOCK_OUTLETS = [
  { id: 1, name: 'Koramangala Branch', area: 'Koramangala, Bangalore', status: 'active' },
  { id: 2, name: 'Indiranagar Branch', area: 'Indiranagar, Bangalore', status: 'active' },
  { id: 3, name: 'Whitefield Branch', area: 'Whitefield, Bangalore', status: 'active' },
  { id: 4, name: 'HSR Layout Branch', area: 'HSR Layout, Bangalore', status: 'active' },
  { id: 5, name: 'JP Nagar Branch', area: 'JP Nagar, Bangalore', status: 'inactive' },
  { id: 6, name: 'Jayanagar Branch', area: 'Jayanagar, Bangalore', status: 'active' },
  { id: 7, name: 'MG Road Branch', area: 'MG Road, Bangalore', status: 'active' },
  { id: 8, name: 'Electronic City Branch', area: 'Electronic City, Bangalore', status: 'active' },
];

const OFFER_TYPES = [
  'Get an Item', 'Buy X Get Y Free', 'Menu Discount', 'BOGO',
  'Coupled Offer', 'Value Deal', 'BOGO with View', 'Price Override',
  'Flat Discount', 'Free Delivery', 'Percentage Discount'
];

const TABS = ['Offer List', 'Link Offer', 'Membership List', 'Membership Offer List'];

const MOCK_OFFERS = [
  { id: 1, code: 'VEGBOGO', type: 'BOGO', title: 'Buy 1 Get 1 Free', description: 'Buy One Get One Free', active: true },
  { id: 2, code: 'B@G1@PIZZA', type: 'Value Deal', title: 'Buy 2 Get 1 free', description: 'Buy two pizza and get one pizza free.', active: true },
  { id: 3, code: '2NDPIZZA50', type: 'Value Deal', title: 'Pizza@50%', description: 'Get 50% on second pizza.', active: true },
  { id: 4, code: 'B1G1ALLSIZE', type: 'BOGO with View', title: 'ALL SIZE BOGO', description: 'All size Pizza free.', active: true },
  { id: 5, code: 'BOGO-LAMILANO', type: 'BOGO', title: 'Buy One Get One Free', description: 'Buy One Get One Free', active: false },
  { id: 6, code: 'FREE@chocolava', type: 'Get an Item', title: 'Free Choco lava', description: 'Get free choco lava', active: false },
  { id: 7, code: 'HUNGRY175', type: 'Flat Discount', title: 'Flat 175 Rs Off', description: '175 Rs off on orders worth 599 Rs and more', active: true },
  { id: 8, code: 'HUNGRY125', type: 'Flat Discount', title: 'Flat 125 Rs Off', description: '125 Rs off on orders worth 399 Rs and more', active: true },
  { id: 9, code: 'SAVERY75', type: 'Flat Discount', title: 'Flat 75 Rs Off', description: '75 Rs off on orders worth 249 Rs and more', active: false },
  { id: 10, code: 'SAVERY50', type: 'Flat Discount', title: 'Flat 50 Rs Off', description: '50 Rs off on orders worth 199 Rs and more', active: false },
];

export default function OfferList({ onAddOffer, onEditOffer }) {
  const [activeTab, setActiveTab] = useState('Offer List');
  const [offers, setOffers] = useState(MOCK_OFFERS);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [linkModal, setLinkModal] = useState({ open: false, offer: null });
  const [linkedOutlets, setLinkedOutlets] = useState({});
  const [outletSearch, setOutletSearch] = useState('');

  const openLinkModal = (offer) => {
    setLinkModal({ open: true, offer });
    setOutletSearch('');
    // Initialize linked state for this offer if not set
    if (!linkedOutlets[offer.id]) {
      setLinkedOutlets(prev => ({ ...prev, [offer.id]: [1, 2, 3] })); // default some linked
    }
  };

  const toggleOutletLink = (offerId, outletId) => {
    setLinkedOutlets(prev => {
      const current = prev[offerId] || [];
      const updated = current.includes(outletId)
        ? current.filter(id => id !== outletId)
        : [...current, outletId];
      return { ...prev, [offerId]: updated };
    });
  };

  const selectAllOutlets = (offerId) => {
    setLinkedOutlets(prev => ({ ...prev, [offerId]: MOCK_OUTLETS.map(o => o.id) }));
  };

  const deselectAllOutlets = (offerId) => {
    setLinkedOutlets(prev => ({ ...prev, [offerId]: [] }));
  };

  const toggleOffer = (id) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o));
  };

  const deleteOffer = (id) => {
    setOffers(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Tabs + Add Offer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex gap-1 overflow-x-auto w-full sm:w-auto scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
                activeTab === tab
                  ? 'text-primary border-primary bg-primary/5'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Offer
          </button>

          {showTypeDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowTypeDropdown(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2">
                <p className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Offer Type</p>
                {OFFER_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => { setShowTypeDropdown(false); onAddOffer(type); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Link Offer Tab Content */}
      {activeTab === 'Link Offer' && <LinkOfferTab />}

      {/* Offer List Tab Content */}
      {activeTab === 'Offer List' && (
      <div className="bg-card border border-border rounded-xl shadow-sm">
        {/* Outlet Filter */}
        <div className="p-4 border-b border-border">
          <div className="relative inline-block w-full sm:w-72">
            <div className="flex items-center gap-2 bg-background border border-border px-4 py-2.5 rounded-lg hover:border-primary/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <Store className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={selectedOutlet}
                onChange={e => setSelectedOutlet(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-foreground outline-none appearance-none cursor-pointer pr-4"
              >
                <option value="">Select outlets</option>
                <option value="all">All Outlets</option>
                <option value="koramangala">Koramangala Branch</option>
                <option value="indiranagar">Indiranagar Branch</option>
              </select>
              <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Code</th>
                <th className="text-center px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                <th className="text-center px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</th>
                <th className="text-center px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</th>
                <th className="text-center px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Link Offer</th>
                <th className="text-center px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map(offer => (
                <tr key={offer.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4 text-sm font-mono font-semibold text-foreground">{offer.code}</td>
                  <td className="px-5 py-4 text-sm text-center text-muted-foreground font-medium">{offer.type}</td>
                  <td className="px-5 py-4 text-sm text-center font-medium text-foreground">{offer.title}</td>
                  <td className="px-5 py-4 text-sm text-center text-muted-foreground max-w-xs truncate">{offer.description}</td>
                  <td className="px-5 py-4 text-center">
                    <button onClick={() => openLinkModal(offer)} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1 mx-auto">
                      <Link className="w-3.5 h-3.5" />
                      Link
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-3">
                      {/* Toggle */}
                      <button
                        onClick={() => toggleOffer(offer.id)}
                        className={`w-14 h-7 rounded-full relative transition-all ${offer.active ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-all ${offer.active ? 'left-8' : 'left-1'}`} />
                      </button>
                      <button
                        onClick={() => onEditOffer(offer)}
                        className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        title="Configure"
                      >
                        <Settings2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => onEditOffer(offer)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteOffer(offer.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 py-4 border-t border-border">
          <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm font-bold">1</button>
          <button className="w-8 h-8 rounded-lg hover:bg-muted text-muted-foreground text-sm font-medium transition-colors">2</button>
          <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      )}

      {/* Link Outlets Modal */}
      {linkModal.open && linkModal.offer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setLinkModal({ open: false, offer: null })} />
          
          {/* Modal */}
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <div>
                <h3 className="text-lg font-bold text-foreground">Link Outlets</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  <span className="font-semibold text-primary">{linkModal.offer.code}</span> — {linkModal.offer.title}
                </p>
              </div>
              <button
                onClick={() => setLinkModal({ open: false, offer: null })}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search + Select All */}
            <div className="px-6 py-3 border-b border-border space-y-3 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={outletSearch}
                  onChange={e => setOutletSearch(e.target.value)}
                  placeholder="Search outlets..."
                  className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  {(linkedOutlets[linkModal.offer.id] || []).length} of {MOCK_OUTLETS.length} outlets linked
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => selectAllOutlets(linkModal.offer.id)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-border">|</span>
                  <button
                    onClick={() => deselectAllOutlets(linkModal.offer.id)}
                    className="text-xs font-bold text-destructive hover:underline"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
            </div>

            {/* Outlet List */}
            <div className="flex-1 overflow-y-auto px-3 py-2">
              {MOCK_OUTLETS
                .filter(o => o.name.toLowerCase().includes(outletSearch.toLowerCase()) || o.area.toLowerCase().includes(outletSearch.toLowerCase()))
                .map(outlet => {
                  const isLinked = (linkedOutlets[linkModal.offer.id] || []).includes(outlet.id);
                  return (
                    <button
                      key={outlet.id}
                      onClick={() => toggleOutletLink(linkModal.offer.id, outlet.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
                        isLinked
                          ? 'bg-primary/5 border border-primary/20'
                          : 'hover:bg-muted/50 border border-transparent'
                      }`}
                    >
                      {/* Checkbox */}
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isLinked ? 'bg-primary border-primary' : 'border-border'
                      }`}>
                        {isLinked && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                      </div>

                      {/* Outlet Info */}
                      <div className="flex-1 text-left">
                        <p className={`text-sm font-semibold ${isLinked ? 'text-foreground' : 'text-muted-foreground'}`}>{outlet.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {outlet.area}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        outlet.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {outlet.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                  );
                })
              }
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
              <button
                onClick={() => setLinkModal({ open: false, offer: null })}
                className="px-5 py-2.5 text-sm font-bold text-muted-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setLinkModal({ open: false, offer: null })}
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
              >
                Save Links
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
