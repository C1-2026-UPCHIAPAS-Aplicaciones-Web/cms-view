import type { ReactNode } from 'react';
import '@core/view/app-shell.css';
import { HoverTooltipOverlay } from '@shared/view/HoverTooltipOverlay';
import { ToastStack } from '@shared/view/ToastStack';
import {
  IconChartBar,
  IconFileEdit,
  IconLayers,
  IconSidebarPanel,
  IconThemeContrast,
} from '@shared/view/SvgIcons';
import type { AppModuleId, ThemeMode, ToastMessage } from '@core/model/app.model';

interface AppShellProps {
  activeModule: AppModuleId;
  theme: ThemeMode;
  navCollapsed: boolean;
  toasts: ToastMessage[];
  onNavigate: (moduleId: AppModuleId) => void;
  onToggleTheme: () => void;
  onToggleNavCollapsed: () => void;
  children: ReactNode;
}

const NAV_ITEMS: {
  id: AppModuleId;
  label: string;
  description: string;
  icon: typeof IconChartBar;
}[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Analítica de sitios, visitas y retención',
    icon: IconChartBar,
  },
  {
    id: 'editor',
    label: 'Editor CMS',
    description: 'Redacción modular con bloques y vista previa',
    icon: IconFileEdit,
  },
  {
    id: 'templates',
    label: 'Plantillas',
    description: 'Estéticas jerárquicas por blog, artículo y block',
    icon: IconLayers,
  },
];

export function AppShell({
  activeModule,
  theme,
  navCollapsed,
  toasts,
  onNavigate,
  onToggleTheme,
  onToggleNavCollapsed,
  children,
}: AppShellProps) {
  return (
    <div className={`app-shell-layout ${navCollapsed ? 'nav-collapsed' : ''}`}>
      <aside className="app-nav-sidebar" aria-label="Navegación de módulos">
        <div className="app-nav-top">
          <div className="app-nav-brand">
            <div className="brand-icon">&lt;/&gt;</div>
            {!navCollapsed && (
              <div className="app-nav-brand-text">
                <strong>InkStack</strong>
                <span>CMS Studio</span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="btn btn-icon btn-sm"
            data-tooltip={navCollapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'}
            onClick={onToggleNavCollapsed}
          >
            <IconSidebarPanel size={15} />
          </button>
        </div>

        <nav className="app-nav-links">
          {!navCollapsed && <span className="app-nav-section-label">Módulos</span>}
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`app-nav-item ${isActive ? 'active' : ''}`}
                data-tooltip={navCollapsed ? `${item.label}: ${item.description}` : item.description}
                onClick={() => onNavigate(item.id)}
              >
                <Icon size={17} />
                {!navCollapsed && <span className="app-nav-item-label">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="app-nav-footer">
          <button
            type="button"
            className="app-nav-item"
            data-tooltip="Alternar entre tema claro y oscuro"
            onClick={onToggleTheme}
          >
            <IconThemeContrast size={17} />
            {!navCollapsed && (
              <span className="app-nav-item-label">
                {theme === 'dark' ? 'Tema Oscuro' : 'Tema Claro'}
              </span>
            )}
          </button>
        </div>
      </aside>

      <div className="app-shell-main">{children}</div>

      <HoverTooltipOverlay />
      <ToastStack toasts={toasts} />
    </div>
  );
}
