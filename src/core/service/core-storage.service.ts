import type { AppModuleId, ThemeMode } from '@core/model/app.model';

const THEME_STORAGE_KEY = 'inkstack_theme_mode_v1';

export const coreStorageService = {
  getItem<T>(key: string): T | null {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  setItem<T>(key: string, value: T): boolean {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  loadTheme(): ThemeMode {
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  },

  saveTheme(theme: ThemeMode): void {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage quota errors
    }
  },

  applyTheme(theme: ThemeMode): void {
    document.documentElement.dataset.theme = theme;
  },

  resolveInitialModule(): AppModuleId {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash === 'editor' || hash === 'dashboard' || hash === 'templates') {
      return hash;
    }
    return 'dashboard';
  },

  syncHash(moduleId: AppModuleId): void {
    if (window.location.hash !== `#${moduleId}`) {
      window.history.replaceState(null, '', `#${moduleId}`);
    }
  },
};
