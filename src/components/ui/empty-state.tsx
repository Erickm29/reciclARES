import { Inbox } from "lucide-react";

interface EmptyStateProps {
  message: string;
  description?: string;
}

export function EmptyState({ message, description }: EmptyStateProps) {
  return (
    <div className="fundares-empty">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
        <Inbox className="size-6 text-muted-foreground" />
      </div>
      <div>
        <p className="font-heading text-sm text-foreground">{message}</p>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
