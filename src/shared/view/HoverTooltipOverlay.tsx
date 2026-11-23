import { useHoverTooltipViewModel } from '@shared/viewmodel/useHoverTooltipViewModel';

export function HoverTooltipOverlay() {
  const { tooltip, tooltipElRef } = useHoverTooltipViewModel();

  return (
    <div
      ref={tooltipElRef}
      className={`hover-tooltip ${tooltip.visible ? 'visible' : ''}`}
      style={{ left: `${tooltip.left}px`, top: `${tooltip.top}px` }}
      role="tooltip"
    >
      {tooltip.text}
    </div>
  );
}
