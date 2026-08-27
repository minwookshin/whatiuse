const analyticsTooltipWidth = 228;
const analyticsTooltipInset = 8;

export function positionAnalyticsTooltip(host: HTMLElement | null, clientX: number, clientY: number) {
  const tooltip = host?.querySelector<HTMLElement>(".whatiuse-analytics-tooltip");
  if (!host || !tooltip) return;
  const rect = host.getBoundingClientRect();
  const localX = clientX - rect.left;
  const localY = clientY - rect.top;
  const width = Math.min(analyticsTooltipWidth, Math.max(0, rect.width - analyticsTooltipInset * 2));
  const placeRight = localX + 12 + width <= rect.width - analyticsTooltipInset;
  const x = placeRight
    ? Math.max(analyticsTooltipInset, localX + 12)
    : Math.max(analyticsTooltipInset, localX - width - 12);
  const placeAbove = localY >= 88;
  const y = placeAbove ? localY - 10 : localY + 12;
  tooltip.dataset.pointerPositioned = "true";
  tooltip.dataset.placement = placeAbove ? "top" : "bottom";
  tooltip.style.transform = placeAbove
    ? `translate3d(${x}px, ${y}px, 0) translateY(-100%)`
    : `translate3d(${x}px, ${y}px, 0)`;
}

export function clearAnalyticsTooltipPosition(host: HTMLElement | null) {
  const tooltip = host?.querySelector<HTMLElement>(".whatiuse-analytics-tooltip");
  if (!tooltip) return;
  delete tooltip.dataset.pointerPositioned;
  delete tooltip.dataset.placement;
  tooltip.style.removeProperty("transform");
}
