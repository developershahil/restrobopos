import { useState } from 'react';
import { Plus, Edit2, Trash2, Info } from 'lucide-react';
import { useMenuStore } from '../../../store/useMenuStore';
import { TaxModal } from '../builder/modals/FormModals';
import { getAffectedItems, totalRate } from '../../../utils/taxUtils';

export default function TaxesTab() {
  const { taxes, categories, items, addTax, updateTax, deleteTax } = useMenuStore();
  const [modal, setModal] = useState(null);

  const getCategoryNames = (ids) => {
    if (!ids || ids.length === 0) return 'All Categories';
    return ids.map(id => categories.find(c => c.id === id)?.name).filter(Boolean).join(', ');
  };

  const total = (t) => totalRate(t);

  return (
    <div className="p-5 max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-bold text-foreground">Tax Rules</p>
          <p className="text-xs text-muted-foreground mt-0.5">Assign CGST &amp; SGST rates to categories or all items. Tax is <strong>automatically applied to all items</strong> in the selected categories.</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Tax
        </button>
      </div>

      {/* Info box */}
      <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800">
        <div className="flex items-start gap-2">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold">How tax applies:</span> When a tax is assigned to a category, it automatically applies to <span className="font-bold">all items in that category</span>. A tax with no category selected is a <span className="font-bold">global tax</span> and applies to all items. Category-specific tax takes priority over global.
          </div>
        </div>
      </div>

      {taxes.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl py-12 text-center text-sm text-muted-foreground">
          No tax rules yet. Click "Add Tax" to create one.
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Tax Name</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground">CGST</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground">SGST</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Applies To</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Items</th>
                <th className="px-3 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {taxes.map((tax, idx) => (
                <tr key={tax.id} className={`border-t border-border/50 ${idx % 2 ? 'bg-muted/20' : ''}`}>
                  <td className="px-4 py-3 font-semibold text-foreground">{tax.name}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full text-xs">{tax.cgst}%</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full text-xs">{tax.sgst}%</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-green-50 text-green-700 font-bold px-2.5 py-0.5 rounded-full text-xs">{total(tax)}%</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{getCategoryNames(tax.categoryIds)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      {getAffectedItems(tax, items).length} items
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => setModal({ mode: 'edit', tax })} className="p-1.5 rounded hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteTax(tax.id)} className="p-1.5 rounded hover:bg-red-50 hover:text-red-500 text-muted-foreground transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Footer total row */}
            <tfoot>
              <tr className="border-t border-border bg-muted/30">
                <td colSpan={5} className="px-4 py-2.5 text-xs text-muted-foreground">
                  {taxes.length} tax rule{taxes.length !== 1 ? 's' : ''} · All rates are in %
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {modal?.mode === 'add' && (
        <TaxModal categories={categories} onSave={(d) => addTax(d)} onClose={() => setModal(null)} />
      )}
      {modal?.mode === 'edit' && (
        <TaxModal initial={modal.tax} categories={categories} onSave={(d) => updateTax(modal.tax.id, d)} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
