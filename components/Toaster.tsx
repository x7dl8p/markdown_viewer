"use client"

import React from "react"
import { useToast } from "@/hooks/use-toast"
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from "@/components/ui/toast"

const Toaster: React.FC = () => {
  const { toasts = [], dismiss } = useToast()

  return (
    <ToastProvider>
      <div>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            open={t.open}
            onOpenChange={(open) => {
              if (!open) dismiss(t.id)
            }}
            className={t.className}
            variant={t.variant as any}
          >
            {t.title ? <ToastTitle>{t.title}</ToastTitle> : null}
            {t.description ? (
              <ToastDescription>{t.description}</ToastDescription>
            ) : null}
            {t.action ? t.action : null}
            <ToastClose />
          </Toast>
        ))}
      </div>
      <ToastViewport />
    </ToastProvider>
  )
}

export default Toaster
