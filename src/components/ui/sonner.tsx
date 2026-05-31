"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-fundares-accent" />,
        info: <InfoIcon className="size-4 text-primary" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-600" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        loading: <Loader2Icon className="size-4 animate-spin text-primary" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast rounded-2xl border border-border bg-card text-foreground shadow-[var(--shadow-fundares-lg)]",
          title: "font-medium text-sm",
          description: "text-muted-foreground text-sm",
          actionButton: "bg-primary text-primary-foreground rounded-xl",
          cancelButton: "bg-muted text-muted-foreground rounded-xl",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
