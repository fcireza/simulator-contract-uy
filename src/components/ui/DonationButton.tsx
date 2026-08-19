import { useEffect, useState } from 'react';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="donation-heart" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="55%" stopColor="#FF8E53" />
          <stop offset="100%" stopColor="#FFC24B" />
        </linearGradient>
      </defs>
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  );
}

/**
 * Floating donation button (bottom-left) linking to a MercadoPago donation URL.
 * Renders nothing when VITE_DONATION_URL is missing or empty.
 * Desktop: heart icon + "Dona" label always visible.
 * Mobile: label shows for 3 seconds on mount, then fades out (icon stays).
 */
export function DonationButton() {
  const isMobile = useDeviceDetect();
  const [labelHidden, setLabelHidden] = useState(false);

  const donationUrl = import.meta.env.VITE_DONATION_URL?.trim();

  useEffect(() => {
    if (!isMobile) return;
    const timer = setTimeout(() => setLabelHidden(true), 3000);
    return () => clearTimeout(timer);
  }, [isMobile]);

  if (!donationUrl) return null;

  const labelVisible = !isMobile || !labelHidden;

  return (
    <a
      href={donationUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Dona"
      className="group fixed bottom-5 left-5 z-50 inline-flex items-center rounded-full border border-rose-200 bg-white/90 px-4 py-2.5 shadow-lg shadow-rose-500/20 backdrop-blur transition-all duration-300 hover:scale-105 hover:border-transparent hover:bg-gradient-to-br hover:from-rose-500 hover:via-orange-500 hover:to-amber-500 hover:shadow-xl hover:shadow-rose-500/30 dark:border-rose-500/30 dark:bg-primary-900/90 dark:shadow-rose-500/10"
    >
      <HeartIcon className="h-5 w-5 fill-[url(#donation-heart)] transition-colors group-hover:fill-white" />
      <span
        data-testid="donation-label"
        className={`overflow-hidden transition-all duration-500 ${
          labelVisible ? 'max-w-20 opacity-100' : 'max-w-0 opacity-0'
        }`}
      >
        <span className="ml-2 whitespace-nowrap text-sm font-semibold text-rose-600 transition-colors group-hover:text-white dark:text-rose-400">Dona</span>
      </span>
    </a>
  );
}
