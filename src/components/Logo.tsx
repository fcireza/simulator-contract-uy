import { useDarkModeContext } from '../hooks/DarkModeContext';

interface LogoProps {
  onClick: () => void;
  size?: 'sm' | 'lg';
}

const sizes = {
  sm: { img: 'h-9 w-auto', text: 'text-xl', gap: 'gap-2' },
  lg: { img: 'h-14 w-auto', text: 'text-3xl', gap: 'gap-3' },
} as const;

export default function Logo({ onClick, size = 'sm' }: LogoProps) {
  const { darkMode } = useDarkModeContext();
  const s = sizes[size];

  return (
    <button
      onClick={onClick}
      className={`flex items-center ${s.gap} hover:opacity-80 transition-opacity ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}
    >
      <img src="/logo.svg" alt="ContractSimulator" className={s.img} />
      <span className={`${s.text} font-bold tracking-tight`}>
        Contract <span className="text-blue-600">Simulator</span>
      </span>
    </button>
  );
}
