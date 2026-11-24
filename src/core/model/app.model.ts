export type AppModuleId = 'dashboard' | 'editor' | 'templates';

export type ThemeMode = 'light' | 'dark';

export interface ToastMessage {
  id: string;
  text: string;
}

export interface CoreAppState {
  activeModule: AppModuleId;
  theme: ThemeMode;
  toasts: ToastMessage[];
}
