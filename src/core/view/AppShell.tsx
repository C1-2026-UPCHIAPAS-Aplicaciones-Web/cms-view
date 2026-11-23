import type { ReactNode } from 'react';
import { HoverTooltipOverlay } from '@shared/view/HoverTooltipOverlay';
import { ToastStack } from '@shared/view/ToastStack';
import type { ToastMessage } from '@core/model/app.model';

interface AppShellProps {
  toasts: ToastMessage[];
  children: ReactNode;
}

export function AppShell({ toasts, children }: AppShellProps) {
  return (
    <>
      {children}
      <HoverTooltipOverlay />
      <ToastStack toasts={toasts} />
    </>
  );
}
