import { useState, useCallback } from 'react';
import { useDarkModeContext } from '../../hooks/DarkModeContext';

interface NavbarProps {
  toggleDarkMode: () => void;
  activeTab: string;
  setActiveTab: (tab: 'simulator' | 'guide' | 'about') => void;
}

const navTabs = ['simulator', 'guide', 'about'] as const;
const navLabels: Record<string, string> = {
  simulator: 'Simulador',
  guide: 'Guía Contractor',
  about: 'Acerca',
};

export default function Navbar({ toggleDarkMode, activeTab, setActiveTab }: NavbarProps) {
  const { darkMode } = useDarkModeContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleTabClick = useCallback((tab: 'simulator' | 'guide' | 'about') => {
    setActiveTab(tab);
    setMenuOpen(false);
  }, [setActiveTab]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? 'bg-gray-900/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'} shadow-sm transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Name */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`text-xl font-bold tracking-tight hover:opacity-80 transition-opacity ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Simulador<span className="text-blue-600">IT</span>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-2 text-sm font-medium transition-colors rounded-md
                  ${activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                {navLabels[tab]}
              </button>
            ))}

            {/* Empty third column placeholder */}
            <div className="w-20" />

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all ${
                darkMode
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.343l-.707-.707M6.343 17.657l-.707-.707m12.728 0l-.707.707M6.343 6.343l-.707.707M12 12a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={handleToggleMenu}
              className={`p-2 rounded-md transition-colors ${
                darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className={`md:hidden py-4 space-y-1 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {navTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`block w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-800'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {navLabels[tab]}
              </button>
            ))}
            <button
              onClick={() => { toggleDarkMode(); handleCloseMenu(); }}
              className={`flex items-center w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                darkMode
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {darkMode ? (
                <><svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.343l-.707-.707M6.343 17.657l-.707-.707m12.728 0l-.707.707M6.343 6.343l-.707.707M12 12a3 3 0 100-6 3 3 0 000 6z" /></svg> Modo Claro</>
              ) : (
                <><svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z" /></svg> Modo Noche</>
              )}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
