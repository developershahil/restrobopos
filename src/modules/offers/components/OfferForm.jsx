import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Plus, Minus, Save, Calendar } from 'lucide-react';
import SelectCategoriesModal from './SelectCategoriesModal';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Mock selected items (shown below "Modify Selection" button when categories/items are selected)
const MOCK_SELECTED_ITEMS = [
  { category: 'Veg Pizza', name: 'Veg Pizza-Koramangala Branch', qty: 1 },
  { category: 'Veg Pizza', name: 'Veg Pizza-Indiranagar Branch', qty: 1 },
  { category: 'Veg Pizza', name: 'Veg Pizza-Whitefield Branch', qty: 1 },
  { category: 'Veg Pizza', name: 'Veg Pizza-HSR Layout Branch', qty: 1 },
  { category: 'Non Veg Pizza', name: 'Non Veg Pizza-Koramangala Branch', qty: 1 },
  { category: 'Veg Pizza', name: 'Veg Pizza-JP Nagar Branch', qty: 1 },
  { category: 'Drinks & Shakes', name: 'Cold Coffee-Koramangala Branch', qty: 1 },
];

function Section({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-muted/30 transition-colors"
      >
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 pb-6 border-t border-border pt-4">{children}</div>}
    </div>
  );
}

function RadioGroup({ name, value, onChange, options }) {
  return (
    <div className="flex gap-4">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio" name={name} value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="w-4 h-4 accent-[hsl(var(--primary))]"
          />
          <span className="text-sm font-medium text-foreground">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

export default function OfferForm({ offerType, editData, onBack }) {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    // Basic Details
    code: editData?.code || '',
    title: editData?.title || '',
    description: editData?.description || '',
    // Value & Conditions
    minOrder: '',
    discountValue: '',
    discountType: 'flat',
    maxDiscount: '',
    applicability: 'all_categories',
    selectedCategories: [],
    selectedItems: [],
    // Clubbing
    clubWithOther: 'no',
    clubWithMembership: 'no',
    applyToMembershipItems: 'no',
    applyToExclusiveItems: 'no',
    autoApply: 'no',
    consolidateRewards: 'no',
    // Visibility and Linking
    visibleOnCouponPage: 'no',
    visibleOnOfferTab: 'no',
    userApplicability: 'all',
    // Offer Apply
    applyDelivery: false,
    applyTakeaway: false,
    applyQsr: false,
    // Validity and Applicability
    totalUsageLimit: 'no_limit',
    totalUsageLimitValue: '',
    individualUsageLimit: 'no_limit',
    individualUsageLimitValue: '',
    maxUsers: '',
    minOrderCount: '',
    maxOrderCount: '',
    isPerpetual: 'yes',
    validFrom: '',
    validTill: '',
    // Timing
    timingOption: 'all_days',
    // Terms
    termsAndConditions: '',
  });

  const [daySlots, setDaySlots] = useState(
    DAYS.reduce((acc, day) => ({ ...acc, [day]: [{ start: '12:01 am', end: '11:59 pm' }] }), {})
  );

  const [categoryModal, setCategoryModal] = useState({ open: false, mode: 'categories' });

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const addSlot = (day) => {
    setDaySlots(prev => ({
      ...prev,
      [day]: [...prev[day], { start: '12:00 am', end: '11:59 pm' }]
    }));
  };

  const removeSlot = (day, idx) => {
    setDaySlots(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-foreground">{isEdit ? 'Edit Offer' : 'Create Offer'}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Type: <span className="font-semibold text-primary">{offerType}</span></p>
          </div>
        </div>
      </div>

      {/* ──────────── Section 1: Basic Details ──────────── */}
      <Section title="Basic Details" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Offer Code *</label>
            <input
              value={form.code} onChange={e => update('code', e.target.value)}
              placeholder="e.g. VEGBOGO"
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Offer Title *</label>
            <input
              value={form.title} onChange={e => update('title', e.target.value)}
              placeholder="e.g. Buy 1 Get 1 Free"
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-foreground mb-1.5">Description</label>
            <textarea
              value={form.description} onChange={e => update('description', e.target.value)}
              placeholder="Enter offer description"
              rows={3}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            />
          </div>
        </div>
      </Section>

      {/* ──────────── Section 2: Value & Conditions ──────────── */}
      <Section title="Value & Conditions" defaultOpen={true}>
        <div className="space-y-6">
          {/* Discount fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Minimum Order Value (₹)</label>
              <input
                type="number" value={form.minOrder} onChange={e => update('minOrder', e.target.value)}
                placeholder="e.g. 499"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Discount Value</label>
              <div className="flex">
                <input
                  type="number" value={form.discountValue} onChange={e => update('discountValue', e.target.value)}
                  placeholder="e.g. 175"
                  className="flex-1 bg-background border border-border rounded-l-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
                <select
                  value={form.discountType} onChange={e => update('discountType', e.target.value)}
                  className="bg-muted border border-l-0 border-border rounded-r-lg px-3 py-2.5 text-sm font-semibold outline-none"
                >
                  <option value="flat">₹ Flat</option>
                  <option value="percent">% Off</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Max Discount (₹)</label>
              <input
                type="number" value={form.maxDiscount} onChange={e => update('maxDiscount', e.target.value)}
                placeholder="e.g. 200"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>

          {/* Category/Item Applicability */}
          <div className="border-t border-border pt-5">
            <p className="text-sm font-semibold text-foreground mb-3">Decide this offer is apply on which categories or items</p>
            <div className="space-y-2">
              {[
                { value: 'all_categories', label: 'This offer is applicable on all categories.' },
                { value: 'specific_categories', label: 'This offer is only applicable on specific categories.' },
                { value: 'specific_items', label: 'This offer is only applicable on specific items.' },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer py-1">
                  <input
                    type="radio" name="applicability" value={opt.value}
                    checked={form.applicability === opt.value}
                    onChange={() => update('applicability', opt.value)}
                    className="w-4 h-4 accent-[hsl(var(--primary))]"
                  />
                  <span className="text-sm font-medium text-foreground">{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Modify Selection button — matches PILOT video */}
            {(form.applicability === 'specific_categories' || form.applicability === 'specific_items') && (
              <div className="mt-4 space-y-4">
                <button
                  onClick={() => setCategoryModal({ open: true, mode: form.applicability === 'specific_categories' ? 'categories' : 'items' })}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Modify Selection ({(form.applicability === 'specific_categories' ? form.selectedCategories : form.selectedItems).length} selected)
                </button>

                {/* Selected items list with qty + remove */}
                {(form.applicability === 'specific_categories' ? form.selectedCategories : form.selectedItems).length > 0 && (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {MOCK_SELECTED_ITEMS.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-background border border-border rounded-lg px-3 py-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.category} | {item.name}</p>
                        </div>
                        <input
                          type="number" defaultValue={item.qty} min={1}
                          className="w-16 bg-card border border-border rounded-lg px-2 py-1.5 text-sm text-center outline-none focus:border-primary"
                        />
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors">
                          <Minus className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* ──────────── Section 3: Clubbing ──────────── */}
      <Section title="Clubbing">
        <div className="space-y-6">
          {[
            { key: 'clubWithOther', q: 'Do you want this offer to apply with any other offer?' },
            { key: 'clubWithMembership', q: 'Do you want this offer and the Club Membership Offer to be applied together?' },
            { key: 'applyToMembershipItems', q: 'Apply Offer to Membership Applied Items' },
            { key: 'applyToExclusiveItems', q: 'Apply Offer to Exclusive Items' },
            { key: 'autoApply', q: 'Do you want to auto-apply this offer?' },
            { key: 'consolidateRewards', q: 'Do you want to consolidate this offer with rewards?' },
          ].map(item => (
            <div key={item.key}>
              <p className="text-sm font-semibold text-foreground mb-2">{item.q}</p>
              <RadioGroup
                name={item.key}
                value={form[item.key]}
                onChange={(val) => update(item.key, val)}
                options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* ──────────── Section 4: Visibility and Linking ──────────── */}
      <Section title="Visibility and Linking">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Should this offer be visible on the Coupon Page in cart?</p>
            <RadioGroup
              name="visibleOnCouponPage"
              value={form.visibleOnCouponPage}
              onChange={(val) => update('visibleOnCouponPage', val)}
              options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Should this offer be visible on Offer Tab in app?</p>
            <RadioGroup
              name="visibleOnOfferTab"
              value={form.visibleOnOfferTab}
              onChange={(val) => update('visibleOnOfferTab', val)}
              options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Decide this offer is applied to all user or specific user</p>
            <RadioGroup
              name="userApplicability"
              value={form.userApplicability}
              onChange={(val) => update('userApplicability', val)}
              options={[{ value: 'all', label: 'Apply to all user' }, { value: 'specific', label: 'Apply for specific user' }]}
            />
          </div>
        </div>
      </Section>

      {/* ──────────── Section 5: Offer Apply ──────────── */}
      <Section title="Offer Apply">
        <div className="flex items-center gap-5 flex-wrap">
          {[
            { key: 'applyDelivery', label: 'Delivery' },
            { key: 'applyTakeaway', label: 'Takeaway' },
            { key: 'applyQsr', label: 'Qsr' },
          ].map(item => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form[item.key]}
                onChange={() => update(item.key, !form[item.key])}
                className="w-4.5 h-4.5 rounded border-border accent-[hsl(var(--primary))]"
              />
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* ──────────── Section 6: Validity and Applicability ──────────── */}
      <Section title="Validity and Applicability">
        <div className="space-y-6">
          {/* Total Usage Limit */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Decide the number of times the coupon can be used in total.</p>
            <RadioGroup
              name="totalUsageLimit"
              value={form.totalUsageLimit}
              onChange={(val) => update('totalUsageLimit', val)}
              options={[{ value: 'no_limit', label: 'Do not set a limit' }, { value: 'set_limit', label: 'Set a limit' }]}
            />
            {form.totalUsageLimit === 'set_limit' && (
              <div className="mt-3">
                <p className="text-sm font-medium text-muted-foreground mb-1.5">Specify the number of coupons to provide</p>
                <input
                  type="number" value={form.totalUsageLimitValue} onChange={e => update('totalUsageLimitValue', e.target.value)}
                  placeholder="Enter number of coupen available"
                  className="w-full max-w-sm bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            )}
          </div>

          {/* Individual Usage Limit */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Decide how many times an individual can use the coupon.</p>
            <RadioGroup
              name="individualUsageLimit"
              value={form.individualUsageLimit}
              onChange={(val) => update('individualUsageLimit', val)}
              options={[{ value: 'no_limit', label: 'No limit' }, { value: 'set_limit', label: 'Set a limit' }]}
            />
            {form.individualUsageLimit === 'set_limit' && (
              <div className="mt-3">
                <input
                  type="number" value={form.individualUsageLimitValue} onChange={e => update('individualUsageLimitValue', e.target.value)}
                  placeholder="Enter individual usage limit"
                  className="w-full max-w-sm bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            )}
          </div>

          {/* Number of users */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Number of users can use this offer</label>
              <input
                type="number" value={form.maxUsers} onChange={e => update('maxUsers', e.target.value)}
                placeholder="e.g. 500"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Minimum Required Order Counts</label>
              <input
                type="number" value={form.minOrderCount} onChange={e => update('minOrderCount', e.target.value)}
                placeholder="0"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Maximum Required Order Counts</label>
              <input
                type="number" value={form.maxOrderCount} onChange={e => update('maxOrderCount', e.target.value)}
                placeholder="0"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>

          {/* Perpetual */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Do you want to make this offer perpetual?</p>
            <RadioGroup
              name="isPerpetual"
              value={form.isPerpetual}
              onChange={(val) => update('isPerpetual', val)}
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
            />
          </div>

          {/* Date range (only if not perpetual) */}
          {form.isPerpetual === 'no' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-muted/30 rounded-lg border border-border">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  <Calendar className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                  Coupon valid from
                </label>
                <input
                  type="date" value={form.validFrom} onChange={e => update('validFrom', e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  <Calendar className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                  Coupon valid till
                </label>
                <input
                  type="date" value={form.validTill} onChange={e => update('validTill', e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* ──────────── Section 7: Offer Timing ──────────── */}
      <Section title="Offer Timing">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Please specify the timings when this offer will be available.</p>
          <p className="text-sm text-primary font-medium">Each day can have only 6 time slots</p>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Decide this item lifetime</p>
            {[
              { value: 'all_days', label: 'Offer is available at for all days of the week' },
              { value: 'same_time', label: 'Offer is available at same time for all days of the week' },
              { value: 'specific', label: 'Offer is available at specific time for specific days of the week' },
            ].map(opt => (
              <label key={opt.value} className="flex items-center gap-3 cursor-pointer py-1">
                <input
                  type="radio" name="timing" value={opt.value}
                  checked={form.timingOption === opt.value}
                  onChange={() => update('timingOption', opt.value)}
                  className="w-4 h-4 text-primary accent-[hsl(var(--primary))]"
                />
                <span className="text-sm font-medium text-foreground">{opt.label}</span>
              </label>
            ))}
          </div>

          {form.timingOption === 'specific' && (
            <div className="mt-4 space-y-4">
              {DAYS.map(day => (
                <div key={day} className="border border-border rounded-lg p-4">
                  <p className="font-semibold text-[13px] text-foreground mb-3">{day}</p>
                  {daySlots[day].map((slot, idx) => (
                    <div key={idx} className="flex items-center gap-4 mb-2">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-semibold text-muted-foreground mb-1 block">Start time</span>
                          <input type="text" defaultValue={slot.start} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-muted-foreground mb-1 block">End time</span>
                          <input type="text" defaultValue={slot.end} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
                        </div>
                      </div>
                      <button onClick={() => removeSlot(day, idx)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive mt-5">
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addSlot(day)} className="flex items-center gap-2 text-primary text-sm font-semibold mt-2 hover:underline">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* ──────────── Section 8: Terms & Conditions ──────────── */}
      <Section title="Terms & Conditions">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Terms and conditions</label>
          <textarea
            value={form.termsAndConditions} onChange={e => update('termsAndConditions', e.target.value)}
            placeholder="Please Enter terms and conditions: English"
            rows={5}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-y"
          />
        </div>
      </Section>

      {/* ──────────── Action Buttons ──────────── */}
      <div className="flex items-center justify-end gap-3 pt-2 pb-6">
        <button onClick={onBack} className="px-4 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
          Discard changes
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm">
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>

      {/* ──────────── Select Categories / Items Modal ──────────── */}
      <SelectCategoriesModal
        open={categoryModal.open}
        mode={categoryModal.mode}
        selectedCategories={categoryModal.mode === 'categories' ? form.selectedCategories : form.selectedItems}
        onClose={() => setCategoryModal({ open: false, mode: 'categories' })}
        onDone={(selected) => {
          if (categoryModal.mode === 'categories') {
            update('selectedCategories', selected);
          } else {
            update('selectedItems', selected);
          }
        }}
      />
    </div>
  );
}
