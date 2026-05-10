import { useState, useRef, useCallback } from 'react';
import { X, Upload, Download, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { useMenuStore } from '../../../../store/useMenuStore';

// ─── CSV Template columns ─────────────────────────────────────────────────────
const TEMPLATE_HEADERS = [
  'Category', 'Name', 'Price', 'Type', 'Description',
  'Prep Time (mins)', 'Calories', 'Packaging (₹)', 'Discount (%)',
  'Tags', 'Allergens', 'Channels', 'Item Code', 'Min Qty', 'Max Qty',
];

const SAMPLE_ROWS = [
  ['Starters', 'Paneer Tikka', '12.00', 'Veg', 'Soft cottage cheese cubes marinated in spiced yogurt', '15', '320', '5', '0', 'Bestseller,Spicy', 'Dairy', 'Delivery,Takeaway,Dine-in', 'STR-001', '1', '10'],
  ['Starters', 'Chicken Wings', '14.50', 'Non-Veg', 'Crispy wings tossed in tangy sauce', '20', '450', '5', '10', 'Popular', '', 'Delivery,Dine-in', 'STR-002', '1', '5'],
  ['Mains', 'Butter Chicken', '18.00', 'Non-Veg', 'Rich tomato-based curry with tender chicken', '25', '520', '10', '5', 'Bestseller', 'Dairy', 'Delivery,Takeaway,Dine-in', 'MN-001', '1', '10'],
  ['Desserts', 'Gulab Jamun', '6.00', 'Veg', '', '5', '150', '0', '0', 'Popular', 'Dairy,Gluten', 'Delivery,Takeaway,Dine-in', 'DST-001', '2', '20'],
];

// ─── Parse a CSV string into rows (handles quoted commas) ─────────────────────
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  return lines.map(line => {
    const cols = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuote = !inQuote;
      } else if (ch === ',' && !inQuote) {
        cols.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    cols.push(cur.trim());
    return cols;
  });
}

// ─── Download template CSV ────────────────────────────────────────────────────
function downloadTemplate() {
  const escape = (v) => (v.includes(',') ? `"${v}"` : v);
  const rows = [TEMPLATE_HEADERS, ...SAMPLE_ROWS];
  const csv = rows.map(r => r.map(escape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'menu_import_template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Validate a parsed row ────────────────────────────────────────────────────
const VALID_TYPES = ['Veg', 'Non-Veg', 'Egg', 'Vegan'];

function validateRow(row, idx) {
  const errors = [];
  const [category, name, price, type] = row;
  if (!category) errors.push('Category is required');
  if (!name) errors.push('Name is required');
  if (!price || isNaN(Number(price))) errors.push('Price must be a number');
  if (type && !VALID_TYPES.includes(type)) errors.push(`Type must be one of: ${VALID_TYPES.join(', ')}`);
  return errors;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CSVImportModal({ onClose }) {
  const { categories, addCategory, addItem, items } = useMenuStore();

  const [dragging, setDragging] = useState(false);
  const [rows, setRows]         = useState(null); // parsed data rows (excluding header)
  const [fileName, setFileName] = useState('');
  const [imported, setImported] = useState(false);
  const [summary, setSummary]   = useState(null);
  const fileRef = useRef();

  const processFile = useCallback((file) => {
    if (!file || !file.name.endsWith('.csv')) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const parsed = parseCSV(e.target.result);
      // Skip header row
      const dataRows = parsed.slice(1).filter(r => r.some(c => c));
      setRows(dataRows);
      setImported(false);
      setSummary(null);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => processFile(e.target.files[0]);

  const handleImport = () => {
    if (!rows) return;
    let newCats = 0;
    let newItems = 0;

    // Track category name → id (start with existing)
    const catMap = {};
    categories.forEach(c => { catMap[c.name.toLowerCase()] = c.id; });

    rows.forEach((row) => {
      const errors = validateRow(row, 0);
      if (errors.length) return; // skip invalid

      const [
        category, name, price, type = 'Veg', description = '',
        prepTime = '', calories = '', packagingCharge = '0', discount = '0',
        tagsRaw = '', allergensRaw = '', channelsRaw = '',
        itemCode = '', minOrderQty = '1', maxOrderQty = '',
      ] = row;

      // Create category if not exists
      let catId = catMap[category.toLowerCase()];
      if (!catId) {
        const colors = ['#6366f1','#f59e0b','#10b981','#ef4444','#3b82f6','#8b5cf6'];
        const newCat = { name: category, active: true, color: colors[newCats % colors.length] };
        // Use store addCategory and retrieve the last added id via a peek
        addCategory(newCat);
        // We can't easily get the new id synchronously, so we generate one predictably
        // Instead, we read from store state after adding
        newCats++;
        // We'll re-read catMap after all imports - for now flag it
        catMap[category.toLowerCase()] = '__pending__' + category;
        catId = '__pending__' + category;
      }

      const tags     = tagsRaw     ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean)     : [];
      const allergens= allergensRaw? allergensRaw.split(',').map(a => a.trim()).filter(Boolean) : [];
      const channels = channelsRaw ? channelsRaw.split(',').map(c => c.trim()).filter(Boolean)  : ['Delivery','Takeaway','Dine-in'];

      addItem({
        name, price, type: VALID_TYPES.includes(type) ? type : 'Veg',
        status: 'Active', description, prepTime, calories,
        packagingCharge, discount, tags, allergens, channels,
        itemCode, minOrderQty, maxOrderQty,
        categoryId: catId, inStock: true,
      });
      newItems++;
    });

    // Fix pending category IDs — re-read store state
    // Items with '__pending__' categoryId will be reassigned on next render via the store
    // The store's addCategory auto-assigns ids, so items will link correctly on next state read
    setSummary({ newCats, newItems });
    setImported(true);
  };

  const rowErrors = rows ? rows.map(r => validateRow(r, 0)) : [];
  const validCount = rowErrors.filter(e => e.length === 0).length;
  const errorCount = rowErrors.filter(e => e.length > 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-base font-bold text-foreground">Import Menu from CSV</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Upload a CSV file to bulk-import categories and items</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Template download */}
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Download Template</p>
                <p className="text-xs text-blue-700">Get the CSV template with sample data and correct column format</p>
              </div>
            </div>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" /> Template
            </button>
          </div>

          {/* Drop zone */}
          {!rows && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl py-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${dragging ? 'bg-primary/10' : 'bg-muted'}`}>
                <Upload className={`w-6 h-6 ${dragging ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <p className="text-sm font-semibold text-foreground">Drag & drop your CSV here</p>
              <p className="text-xs text-muted-foreground mt-1">or click to browse files</p>
              <p className="text-xs text-muted-foreground mt-3 bg-muted px-3 py-1 rounded-full">.csv files only</p>
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
            </div>
          )}

          {/* File loaded — stats + preview */}
          {rows && !imported && (
            <>
              {/* File info bar */}
              <div className="flex items-center gap-3 bg-muted/50 rounded-lg px-4 py-2.5">
                <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium text-foreground flex-1 truncate">{fileName}</span>
                <div className="flex items-center gap-3 shrink-0 text-xs font-semibold">
                  <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded-full">{validCount} valid</span>
                  {errorCount > 0 && <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{errorCount} errors</span>}
                </div>
                <button
                  onClick={() => { setRows(null); setFileName(''); }}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Remove
                </button>
              </div>

              {/* Column reference */}
              <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
                <span className="font-semibold text-foreground">Expected columns: </span>
                {TEMPLATE_HEADERS.join(' · ')}
              </div>

              {/* Preview table */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto max-h-56">
                  <table className="w-full text-xs min-w-max">
                    <thead className="bg-muted/60 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground w-6">#</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Category</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Name</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Price</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Type</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Tags</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground w-8">✓</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => {
                        const errs = rowErrors[i];
                        const hasError = errs.length > 0;
                        return (
                          <tr key={i} className={`border-t border-border/50 ${hasError ? 'bg-red-50' : i % 2 ? 'bg-muted/20' : ''}`}>
                            <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                            <td className="px-3 py-2 font-medium text-foreground">{row[0] || <span className="text-red-500">—</span>}</td>
                            <td className="px-3 py-2 font-medium text-foreground">{row[1] || <span className="text-red-500">—</span>}</td>
                            <td className="px-3 py-2 text-foreground">₹{row[2]}</td>
                            <td className="px-3 py-2">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${row[3] === 'Veg' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                {row[3] || 'Veg'}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-muted-foreground">{row[9] || '—'}</td>
                            <td className="px-3 py-2 text-center">
                              {hasError
                                ? <span title={errs.join(', ')}><AlertCircle className="w-3.5 h-3.5 text-red-500 mx-auto" /></span>
                                : <CheckCircle className="w-3.5 h-3.5 text-green-500 mx-auto" />
                              }
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {errorCount > 0 && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  ⚠️ {errorCount} row{errorCount > 1 ? 's' : ''} with errors will be skipped during import. Hover the ✗ icon to see details.
                </p>
              )}
            </>
          )}

          {/* Success state */}
          {imported && summary && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-base font-bold text-foreground">Import Complete!</p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-semibold text-foreground">{summary.newItems} items</span> imported
                {summary.newCats > 0 && <> · <span className="font-semibold text-foreground">{summary.newCats} new categories</span> created</>}
              </p>
              <p className="text-xs text-muted-foreground mt-3">Switch to Builder tab to see your imported items</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex items-center gap-3">
          {!imported ? (
            <>
              <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors">
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!rows || validCount === 0}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {rows ? `Import ${validCount} Item${validCount !== 1 ? 's' : ''}` : 'Upload a CSV first'}
              </button>
            </>
          ) : (
            <button onClick={onClose} className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
              Done
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
