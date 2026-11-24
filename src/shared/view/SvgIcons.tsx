import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function BaseSvg({ size = 15, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0, ...rest.style }}
      {...rest}
    >
      {children}
    </svg>
  );
}

export function IconChartBar(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </BaseSvg>
  );
}

export function IconFileEdit(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
    </BaseSvg>
  );
}

export function IconLayers(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 12 12 17 22 12" />
      <polyline points="2 17 12 22 22 17" />
    </BaseSvg>
  );
}

export function IconThemeContrast(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 0 0 18Z" fill="currentColor" stroke="none" />
    </BaseSvg>
  );
}

export function IconSidebarPanel(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
    </BaseSvg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </BaseSvg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <polyline points="20 6 9 17 4 12" />
    </BaseSvg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </BaseSvg>
  );
}

export function IconArchive(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <rect x="2" y="4" width="20" height="5" rx="1" />
      <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
      <path d="M10 13h4" />
    </BaseSvg>
  );
}

export function IconArchiveRestore(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <rect x="2" y="4" width="20" height="5" rx="1" />
      <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
      <path d="m9 14 3-3 3 3" />
      <path d="M12 11v6" />
    </BaseSvg>
  );
}

export function IconTrash(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </BaseSvg>
  );
}

export function IconCopy(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </BaseSvg>
  );
}

export function IconRotateCcw(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </BaseSvg>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </BaseSvg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </BaseSvg>
  );
}

export function IconArrowUp(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </BaseSvg>
  );
}

export function IconArrowDown(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </BaseSvg>
  );
}

export function IconGripVertical(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <circle cx="9" cy="5" r="1" fill="currentColor" />
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="9" cy="19" r="1" fill="currentColor" />
      <circle cx="15" cy="5" r="1" fill="currentColor" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
      <circle cx="15" cy="19" r="1" fill="currentColor" />
    </BaseSvg>
  );
}

export function IconEye(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </BaseSvg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </BaseSvg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </BaseSvg>
  );
}

export function IconLink(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </BaseSvg>
  );
}

export function IconImage(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </BaseSvg>
  );
}

export function IconCode(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </BaseSvg>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </BaseSvg>
  );
}

export function IconCheckCircle(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 12 2 2 4-4" />
    </BaseSvg>
  );
}

export function IconAlertTriangle(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </BaseSvg>
  );
}

export function IconAlertOctagon(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </BaseSvg>
  );
}

export function IconLightbulb(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </BaseSvg>
  );
}

export function IconQuote(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </BaseSvg>
  );
}

export function IconList(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </BaseSvg>
  );
}

export function IconTypeParagraph(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M13 4v16" />
      <path d="M17 4v16" />
      <path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13" />
    </BaseSvg>
  );
}

export function IconMinus(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M5 12h14" />
    </BaseSvg>
  );
}

export function IconWrench(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </BaseSvg>
  );
}

export function IconMicroscope(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" />
      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </BaseSvg>
  );
}

export function IconRocket(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </BaseSvg>
  );
}

export function IconZap(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </BaseSvg>
  );
}

export function IconSliders(props: IconProps) {
  return (
    <BaseSvg {...props}>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </BaseSvg>
  );
}
