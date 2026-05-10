import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function ModalWrapper({ title, onClose, children, footer }) {
  const overlayRef = useRef();

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-sm mx-4 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-3">{children}</div>
        {footer && <div className="px-4 pb-4 flex gap-2">{footer}</div>}
      </div>
    </div>
  );
}
