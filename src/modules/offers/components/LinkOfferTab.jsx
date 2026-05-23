import { useState } from 'react';
import { MapPin, Store, Tag, Filter, Eye, Search } from 'lucide-react';

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

const MOCK_OFFERS = [
  { id: 1, code: 'VEGBOGO', type: 'BOGO', title: 'Buy 1 Get 1 Free', active: true },
  { id: 2, code: 'B@G1@PIZZA', type: 'Value Deal', title: 'Buy 2 Get 1 free', active: true },
  { id: 3, code: '2NDPIZZA50', type: 'Value Deal', title: 'Pizza@50%', active: true },
  { id: 4, code: 'B1G1ALLSIZE', type: 'BOGO with View', title: 'ALL SIZE BOGO', active: true },
  { id: 5, code: 'BOGO-LAMILANO', type: 'BOGO', title: 'Buy One Get One Free', active: false },
  { id: 6, code: 'FREE@chocolava', type: 'Get an Item', title: 'Free Choco lava', active: false },
  { id: 7, code: 'HUNGRY175', type: 'Flat Discount', title: 'Flat 175 Rs Off', active: true },
  { id: 8, code: 'HUNGRY125', type: 'Flat Discount', title: 'Flat 125 Rs Off', active: true },
  { id: 9, code: 'SAVERY75', type: 'Flat Discount', title: 'Flat 75 Rs Off', active: false },
  { id: 10, code: 'SAVERY50', type: 'Flat Discount', title: 'Flat 50 Rs Off', active: false },
];

// Mock linking data — which offers are linked to which outlets
const MOCK_LINKS = {
  1: { offerIds: [1, 2, 3, 7, 8] },       // Koramangala
  2: { offerIds: [1, 3, 4, 7] },           // Indiranagar
  3: { offerIds: [1, 2, 7, 8, 9] },        // Whitefield
  4: { offerIds: [2, 3, 5, 6, 7, 8] },     // HSR Layout
  5: { offerIds: [7, 8, 9, 10] },           // JP Nagar
  6: { offerIds: [1, 4, 6, 7] },            // Jayanagar
  7: { offerIds: [1, 2, 3, 4, 5, 7, 8] },  // MG Road
  8: { offerIds: [1, 7, 8, 10] },           // Electronic City
};

export default function LinkOfferTab() {
  const [filterMode, setFilterMode] = useState('outlet'); // 'outlet' or 'offer'
  const [selectedOutletId, setSelectedOutletId] = useState('');
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [liveOnly, setLiveOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get filtered results
  const getResults = () => {
    if (filterMode === 'outlet' && selectedOutletId) {
      const outletId = parseInt(selectedOutletId);
      const linkData = MOCK_LINKS[outletId];
      if (!linkData) return [];
      let offers = MOCK_OFFERS.filter(o => linkData.offerIds.includes(o.id));
      if (liveOnly) offers = offers.filter(o => o.active);
      if (searchQuery) offers = offers.filter(o =>
        o.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return offers;
    }
    if (filterMode === 'offer' && selectedOfferId) {
      const offerId = parseInt(selectedOfferId);
      let outlets = MOCK_OUTLETS.filter(outlet => {
        const linkData = MOCK_LINKS[outlet.id];
        return linkData && linkData.offerIds.includes(offerId);
      });
      if (searchQuery) outlets = outlets.filter(o =>
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.area.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return outlets;
    }
    return [];
  };

  const results = getResults();
  const selectedOffer = MOCK_OFFERS.find(o => o.id === parseInt(selectedOfferId));
  const selectedOutlet = MOCK_OUTLETS.find(o => o.id === parseInt(selectedOutletId));

  return (
    <div className="bg-card border border-border rounded-md shadow-sm">
      {/* Filter Controls */}
      <div className="p-5 border-b border-border space-y-4">
        {/* Mode Toggle */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground mr-2">Filter by:</span>
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => { setFilterMode('outlet'); setSelectedOfferId(''); setSearchQuery(''); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                filterMode === 'outlet'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Store className="w-4 h-4" />
              Outlet Wise
            </button>
            <button
              onClick={() => { setFilterMode('offer'); setSelectedOutletId(''); setSearchQuery(''); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                filterMode === 'offer'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Tag className="w-4 h-4" />
              Offer Wise
            </button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex items-center gap-3 flex-wrap">
          {filterMode === 'outlet' ? (
            <select
              value={selectedOutletId}
              onChange={e => setSelectedOutletId(e.target.value)}
              className="w-72 bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            >
              <option value="">Select an outlet</option>
              {MOCK_OUTLETS.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          ) : (
            <select
              value={selectedOfferId}
              onChange={e => setSelectedOfferId(e.target.value)}
              className="w-72 bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            >
              <option value="">Select an offer</option>
              {MOCK_OFFERS.map(o => (
                <option key={o.id} value={o.id}>{o.code} — {o.title}</option>
              ))}
            </select>
          )}

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={filterMode === 'outlet' ? 'Search linked offers...' : 'Search linked outlets...'}
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {/* Live Only Toggle (only for outlet-wise) */}
          {filterMode === 'outlet' && (
            <button
              onClick={() => setLiveOnly(!liveOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                liveOnly
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-background border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="w-4 h-4" />
              Live Only
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="p-5">
        {/* No selection state */}
        {((filterMode === 'outlet' && !selectedOutletId) || (filterMode === 'offer' && !selectedOfferId)) && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center mx-auto mb-4">
              {filterMode === 'outlet'
                ? <Store className="w-8 h-8 text-muted-foreground" />
                : <Tag className="w-8 h-8 text-muted-foreground" />
              }
            </div>
            <p className="text-muted-foreground font-medium">
              Select {filterMode === 'outlet' ? 'an outlet' : 'an offer'} to view linked {filterMode === 'outlet' ? 'offers' : 'outlets'}
            </p>
          </div>
        )}

        {/* Selected info header */}
        {((filterMode === 'outlet' && selectedOutlet) || (filterMode === 'offer' && selectedOffer)) && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                filterMode === 'outlet' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
              }`}>
                {filterMode === 'outlet' ? <Store className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
              </div>
              <div>
                <p className="font-bold text-foreground">
                  {filterMode === 'outlet' ? selectedOutlet?.name : selectedOffer?.code}
                </p>
                <p className="text-xs text-muted-foreground">
                  {filterMode === 'outlet'
                    ? selectedOutlet?.area
                    : `${selectedOffer?.type} — ${selectedOffer?.title}`
                  }
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {results.length} {filterMode === 'outlet' ? 'offer' : 'outlet'}{results.length !== 1 ? 's' : ''} linked
            </span>
          </div>
        )}

        {/* Results Grid */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filterMode === 'outlet'
              ? results.map(offer => (
                  <div key={offer.id} className="flex items-center gap-3 p-4 rounded-md border border-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground truncate">{offer.code}</p>
                        <span className={`shrink-0 w-2 h-2 rounded-full ${offer.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{offer.title}</p>
                      <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                        {offer.type}
                      </span>
                    </div>
                    <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
                      offer.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {offer.active ? '● Live' : '○ Off'}
                    </span>
                  </div>
                ))
              : results.map(outlet => (
                  <div key={outlet.id} className="flex items-center gap-3 p-4 rounded-md border border-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                    <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{outlet.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{outlet.area}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
                      outlet.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {outlet.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))
            }
          </div>
        )}

        {/* Empty results after selection */}
        {((filterMode === 'outlet' && selectedOutletId) || (filterMode === 'offer' && selectedOfferId)) && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-medium">No {filterMode === 'outlet' ? 'offers' : 'outlets'} linked{liveOnly ? ' (live)' : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
}
