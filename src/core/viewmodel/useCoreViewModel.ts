import { useCallback, useEffect, useState } from 'react';
import type { AppModuleId, ThemeMode, ToastMessage } from '@core/model/app.model';
import { coreStorageService } from '@core/service/core-storage.service';

export function useCoreViewModel() {
  const [activeModule, setActiveModule] = useState<AppModuleId>(() =>
    coreStorageService.resolveInitialModule(),
  );
  const [theme, setTheme] = useState<ThemeMode>(() => coreStorageService.loadTheme());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    coreStorageService.applyTheme(theme);
    coreStorageService.saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    coreStorageService.syncHash(activeModule);
  }, [activeModule]);

  useEffect(() => {
    const onHashChange = () => {
      setActiveModule(coreStorageService.resolveInitialModule());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const navigateTo = useCallback((moduleId: AppModuleId) => {
    setActiveModule(moduleId);
  }, []);

  const notify = useCallback((text: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, text }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 2400);
  }, []);

  return {
    activeModule,
    theme,
    toasts,
    toggleTheme,
    navigateTo,
    notify,
  };
}
