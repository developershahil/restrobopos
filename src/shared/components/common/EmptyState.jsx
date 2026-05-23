import { Search } from 'lucide-react';

export default function EmptyState({ icon: Icon = Search, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center h-full animate-in fade-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-border">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
          <Icon className="w-6 h-6 text-muted-foreground/60" />
        </div>
      </div>
      <h3 className="text-xl font-black text-foreground tracking-tight mb-2">{title}</h3>
      <p className="text-sm font-medium text-muted-foreground max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
