import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useMenuStore } from '../../../store/useMenuStore';
import { VariantModal } from './modals/FormModals';

export default function VariantManager({ itemId }) {
  const { variants, addVariant, updateVariant, deleteVariant } = useMenuStore();
  const [modal, setModal] = useState(null);

  const itemVariants = variants.filter(v => v.itemId === itemId);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Variants</span>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>

      {itemVariants.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl py-8 flex flex-col items-center justify-center text-center px-4 bg-muted/10">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
            <Plus className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-foreground mb-1">No variants configured</p>
          <p className="text-xs text-muted-foreground max-w-[200px]">Add variants like "Small" or "Large" to offer multiple price points.</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-3 py-1.5 font-semibold text-muted-foreground">Name</th>
                <th className="text-left px-3 py-1.5 font-semibold text-muted-foreground">Price</th>
                <th className="px-2 py-1.5 w-14" />
              </tr>
            </thead>
            <tbody>
              {itemVariants.map((v, idx) => (
                <tr key={v.id} className={`border-t border-border/50 ${idx % 2 === 0 ? '' : 'bg-muted/20'}`}>
                  <td className="px-3 py-1.5 font-medium text-foreground">{v.name}</td>
                  <td className="px-3 py-1.5 font-bold text-foreground">₹{v.price}</td>
                  <td className="px-2 py-1.5">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => setModal({ mode: 'edit', variant: v })}
                        className="p-1 rounded hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteVariant(v.id)}
                        className="p-1 rounded hover:bg-red-50 hover:text-red-500 text-muted-foreground transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal?.mode === 'add' && (
        <VariantModal
          itemId={itemId}
          onSave={(data) => addVariant(data)}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.mode === 'edit' && (
        <VariantModal
          initial={modal.variant}
          itemId={itemId}
          onSave={(data) => updateVariant(modal.variant.id, data)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
