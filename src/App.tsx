import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { ProposalTool } from './tools/proposal';
import { FollowupTool } from './tools/followup';
import { ScopeTool } from './tools/scope';
import { InvoiceTool } from './tools/invoice';
import { OnboardingTool } from './tools/onboarding';
import { CalculatorTool } from './tools/calculator';

function PageContent() {
  const { activePage } = useApp();

  switch (activePage) {
    case 'dashboard':  return <Dashboard />;
    case 'proposal':   return <ProposalTool />;
    case 'followup':   return <FollowupTool />;
    case 'scope':      return <ScopeTool />;
    case 'invoice':    return <InvoiceTool />;
    case 'onboarding': return <OnboardingTool />;
    case 'calculator': return <CalculatorTool />;
    case 'settings':   return <Settings />;
    default:           return <Dashboard />;
  }
}

export function App() {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <PageContent />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
