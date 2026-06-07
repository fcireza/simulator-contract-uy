import { formatUyu } from '../../utils/format';

interface TaxLineItemProps {
  label: string;
  value: number;
  darkMode: boolean;
  indent?: boolean;
  color?: 'red' | 'green' | 'default';
  subtitle?: string;
}

export default function TaxLineItem({
  label,
  value,
  darkMode,
  indent = false,
  color = 'default',
  subtitle,
}: TaxLineItemProps) {
  const valueColorClass = color === 'red' ? 'text-red-400' : color === 'green' ? 'text-green-400' : '';
  const prefix = color !== 'default' ? '-' : '';

  return (
    <div
      className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${indent ? 'ml-2' : ''}`}
    >
      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} ${indent ? 'text-sm' : ''}`}>
        {label}
        {subtitle && <span className={`ml-1 text-xs ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>{subtitle}</span>}
      </span>
      <span className={`font-medium ${valueColorClass}`}>
        {prefix}
        {formatUyu(value)}
      </span>
    </div>
  );
}
