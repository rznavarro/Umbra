import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ConsultationForm } from './components/ConsultationForm';
import { Results } from './components/Results';
import { History } from './components/History';

type ActiveSection = 'dashboard' | 'consultation' | 'results' | 'history';

function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [consultationData, setConsultationData] = useState<any>(null);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onStartConsultation={() => setActiveSection('consultation')} />;
      case 'consultation':
        return (
          <ConsultationForm 
            onSubmit={(data) => {
              setConsultationData(data);
              setActiveSection('results');
            }} 
          />
        );
      case 'results':
        return <Results data={consultationData} />;
      case 'history':
        return <History />;
      default:
        return <Dashboard onStartConsultation={() => setActiveSection('consultation')} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex font-mono">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;