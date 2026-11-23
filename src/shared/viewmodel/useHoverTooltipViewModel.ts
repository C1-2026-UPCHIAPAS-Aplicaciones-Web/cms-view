import { useEffect, useRef, useState } from 'react';
import type { TooltipState } from '@shared/model/shared.model';

export function useHoverTooltipViewModel() {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    text: '',
    left: 0,
    top: 0,
  });
  const timerRef = useRef<number | null>(null);
  const tooltipElRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const clearTimer = () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const handleMouseOver = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest('[data-tooltip]') as HTMLElement | null;
      if (!target) return;
      const text = target.getAttribute('data-tooltip');
      if (!text) return;

      clearTimer();
      timerRef.current = window.setTimeout(() => {
        const rect = target.getBoundingClientRect();
        const tipWidth = tooltipElRef.current?.offsetWidth || 220;
        const tipHeight = tooltipElRef.current?.offsetHeight || 36;
        let left = rect.left + (rect.width - tipWidth) / 2;
        left = Math.max(8, Math.min(window.innerWidth - tipWidth - 8, left));
        let top = rect.top - tipHeight - 8;
        if (top < 8) top = rect.bottom + 8;

        setTooltip({ visible: true, text, left, top });
      }, 90);
    };

    const hideTooltip = () => {
      clearTimer();
      setTooltip((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    };

    const handleMouseOut = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest('[data-tooltip]');
      if (target) hideTooltip();
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', hideTooltip);

    return () => {
      clearTimer();
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', hideTooltip);
    };
  }, []);

  return { tooltip, tooltipElRef };
}
