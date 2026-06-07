import { useState, useEffect } from 'react';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Navbar from './components/Layout/Navbar';
import Guide from './views/Guide';
import About from './views/About';
import Simulators from './views/simulators';
import Footer from './components/Layout/Footer';
import { DarkModeProvider, useDarkModeContext } from './hooks/DarkModeContext';

type ActiveTab = 'simulator' | 'guide' | 'about';

function AppContent() {
  const { darkMode, toggleDarkMode } = useDarkModeContext();

  // Navigation state
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');

  // Listen for navigation requests from modals
  useEffect(() => {
    const handleNavigate = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab: 'guide' }>;
      if (customEvent.detail?.tab === 'guide') {
        setActiveTab('guide');
      }
    };
    window.addEventListener('navigate-to', handleNavigate);
    return () => window.removeEventListener('navigate-to', handleNavigate);
  }, []);

  return (
    <div
      className={`min-h-screen ${darkMode ? 'bg-primary-900 text-white' : 'bg-gradient-to-br from-primary-50 to-primary-100 text-primary-800'} py-0 px-0`}
    >
      <Navbar toggleDarkMode={toggleDarkMode} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="max-w-4xl mx-auto py-20 px-5">
        {activeTab === 'simulator' && <Simulators />}

        {activeTab === 'guide' && <Guide />}

        {activeTab === 'about' && <About />}
      </div>
      <Footer onNavigate={setActiveTab} />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <DarkModeProvider>
        <AppContent />
      </DarkModeProvider>
    </ErrorBoundary>
  );
}

export default App;
