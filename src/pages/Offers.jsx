import { useState } from 'react';
import OfferList from '../components/offers/OfferList';
import OfferForm from '../components/offers/OfferForm';

export default function Offers() {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [selectedType, setSelectedType] = useState('');
  const [editData, setEditData] = useState(null);

  const handleAddOffer = (type) => {
    setSelectedType(type);
    setEditData(null);
    setView('form');
  };

  const handleEditOffer = (offer) => {
    setSelectedType(offer.type);
    setEditData(offer);
    setView('form');
  };

  const handleBack = () => {
    setView('list');
    setEditData(null);
    setSelectedType('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Offers</h1>
      
      {view === 'list' ? (
        <OfferList onAddOffer={handleAddOffer} onEditOffer={handleEditOffer} />
      ) : (
        <OfferForm offerType={selectedType} editData={editData} onBack={handleBack} />
      )}
    </div>
  );
}
