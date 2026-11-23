import { useCoreViewModel } from '@core/viewmodel/useCoreViewModel';
import { AppShell } from '@core/view/AppShell';
import { DashboardView } from '@dashboard/view/DashboardView';
import { EditorView } from '@editor/view/EditorView';

export function App() {
  const core = useCoreViewModel();

  return (
    <AppShell toasts={core.toasts}>
      {core.activeModule === 'dashboard' ? (
        <DashboardView
          onOpenEditor={() => core.navigateTo('editor')}
          onToggleTheme={core.toggleTheme}
          onNotify={core.notify}
        />
      ) : (
        <EditorView
          onOpenDashboard={() => core.navigateTo('dashboard')}
          onToggleTheme={core.toggleTheme}
          onNotify={core.notify}
        />
      )}
    </AppShell>
  );
}

export default App;
