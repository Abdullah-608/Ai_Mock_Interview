"use client"

import * as React from "react"
import { toast as sonnerToast, Toaster as Sonner } from "sonner"

import { cn } from "@/lib/utils"

type ToastProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToastProps) => {
  return (
    <Sonner
      className={cn("toaster group", props.className)}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, sonnerToast as toast }