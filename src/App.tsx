import { useCoreViewModel } from '@core/viewmodel/useCoreViewModel';
import { AppShell } from '@core/view/AppShell';
import { DashboardView } from '@dashboard/view/DashboardView';
import { EditorView } from '@editor/view/EditorView';
import { TemplatesView } from '@templates/view/TemplatesView';

export function App() {
  const core = useCoreViewModel();

  return (
    <AppShell
      activeModule={core.activeModule}
      theme={core.theme}
      navCollapsed={core.navCollapsed}
      toasts={core.toasts}
      onNavigate={core.navigateTo}
      onToggleTheme={core.toggleTheme}
      onToggleNavCollapsed={core.toggleNavCollapsed}
    >
      {core.activeModule === 'dashboard' ? (
        <DashboardView
          onToggleTheme={core.toggleTheme}
          onNotify={core.notify}
        />
      ) : core.activeModule === 'templates' ? (
        <TemplatesView
          onOpenEditor={() => core.navigateTo('editor')}
          onToggleTheme={core.toggleTheme}
          onNotify={core.notify}
        />
      ) : (
        <EditorView
          onToggleTheme={core.toggleTheme}
          onNotify={core.notify}
        />
      )}
    </AppShell>
  );
}

export default App;
