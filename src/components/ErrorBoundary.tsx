import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Algo salió mal
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ocurrió un error inesperado. Recargá la página o intentá de nuevo.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Recargar página
            </button>
            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-6 text-left text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg overflow-auto">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
