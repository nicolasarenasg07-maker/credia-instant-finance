import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'approved' | 'pending' | 'rejected' | 'processing';
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
        status === 'approved' && "bg-success/20 text-success border border-success/30",
        status === 'pending' && "bg-warning/20 text-warning border border-warning/30",
        status === 'rejected' && "bg-destructive/20 text-destructive border border-destructive/30",
        status === 'processing' && "bg-primary/20 text-primary border border-primary/30",
        className
      )}
    >
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        status === 'approved' && "bg-success",
        status === 'pending' && "bg-warning animate-pulse",
        status === 'rejected' && "bg-destructive",
        status === 'processing' && "bg-primary animate-pulse"
      )} />
      {children}
    </span>
  );
}
