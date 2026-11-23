import type { ToastMessage } from '@core/model/app.model';

interface ToastStackProps {
  toasts: ToastMessage[];
}

export function ToastStack({ toasts }: ToastStackProps) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          {toast.text}
        </div>
      ))}
    </div>
  );
}
