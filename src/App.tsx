import { useState, useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import Guide from './views/Guide';
import About from './views/About';
import Simulators from './views/simulators';
import Footer from './components/Layout/Footer';
import { useDarkMode } from './hooks/useDarkMode';

type ActiveTab = 'simulator' | 'guide' | 'about';

function App() {
  const { darkMode, toggleDarkMode } = useDarkMode();

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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'} py-0 px-0`}>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="max-w-4xl mx-auto py-20 px-5">
        {activeTab === 'simulator' && <Simulators darkMode={darkMode} />}

        {activeTab === 'guide' && <Guide darkMode={darkMode} />}

        {activeTab === 'about' && <About darkMode={darkMode} />}
      </div>
      <Footer darkMode={darkMode} onNavigate={setActiveTab} />
    </div>
  );
}

export default App;