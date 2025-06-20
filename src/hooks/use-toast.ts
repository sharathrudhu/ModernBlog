'use client'

import { toast as sonnerToast } from 'sonner'

type ToastOptions = {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  duration?: number
};

export function useToast() {
  const toast = (options: ToastOptions) => {
    const {
      title = '',
      description,
      action,
      duration = 4000,
    } = options;

    const id = sonnerToast(title, {
      description,
      duration,
      action,
    });

    return {
      id,
      dismiss: () => sonnerToast.dismiss(id),
      update: (next: Partial<ToastOptions>) => {
        sonnerToast.dismiss(id);
        return sonnerToast(next.title ?? title, { ...next });
      },
    };
  };

  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}
