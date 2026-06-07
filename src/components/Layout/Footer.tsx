import { useDarkModeContext } from '../../hooks/DarkModeContext';

interface FooterProps {
  onNavigate?: (tab: 'simulator' | 'guide' | 'about') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { darkMode } = useDarkModeContext();
  const textClass = darkMode ? 'text-gray-300' : 'text-gray-700';
  const linkClass = darkMode ? 'hover:text-white transition-colors' : 'hover:text-blue-600 transition-colors';
  const currentYear = new Date().getFullYear();

  const handleNavigate = (tab: 'simulator' | 'guide' | 'about') => {
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  return (
    <footer
      className={`bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-900/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'} shadow-sm transition-colors duration-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex container for 4 columns */}
        <div className="flex flex-col items-center py-4 sm:flex-row sm:justify-between sm:items-start gap-4">
          {/* Column 1: Logo */}
          <div className="text-center sm:text-left order-1">
            <button
              onClick={() => handleNavigate('simulator')}
              className={`text-4xl font-bold tracking-tight hover:opacity-80 transition-opacity ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Simulador<span className="text-blue-600">IT</span>
            </button>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center sm:text-left order-2">
            <div className="flex flex-col items-center sm:items-start gap-1">
              <p className="font-bold">Enlaces Rápidos</p>
              <button onClick={() => handleNavigate('simulator')} className={`${linkClass} text-sm text-left`}>
                Simulador
              </button>
              <button onClick={() => handleNavigate('guide')} className={`${linkClass} text-sm text-left`}>
                Guia Contractor
              </button>
              <button onClick={() => handleNavigate('about')} className={`${linkClass} text-sm text-left`}>
                About
              </button>
            </div>
          </div>

          {/* Column 3: Empty */}
          <div className="order-3 w-32" />

          {/* Column 4: Social Links */}
          <div className="flex flex-col items-center sm:items-end order-4">
            <p className={`text-sm font-medium ${textClass} mb-2`}>Sígueme en:</p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/fcireza/simulador-contract-uy"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://fcireza.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                aria-label="Website"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 py-5 text-center text-gray-500 dark:text-gray-400 text-[0.85rem]">
          <p>
            &copy; {currentYear} Construido con{' '}
            <svg className="w-4 h-4 inline mx-1 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>{' '}
            por
            <a
              href="https://linkedin.com/in/federico-cireza/"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
              aria-label="LinkedIn"
            >
              fcireza |
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
                className="inline-block align-text-bottom ml-2 mr-1"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
              </svg>
            </a>
            .
          </p>
          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
            Versión Beta • Actualizado Mayo 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
