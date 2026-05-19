import type { TaxRegime } from '../utils/taxCalculator';
import type { ComparisonTableRow } from '../data/guideData';

interface StructureComparisonTableProps {
  rows: ComparisonTableRow[];
  columns: { key: TaxRegime; label: string }[];
  darkMode: boolean;
  title?: string;
}

const columnBg = (darkMode: boolean, colIndex: number): string => {
  if (colIndex === 0) return '';
  return darkMode ? 'bg-gray-700/50' : 'bg-gray-50';
};

const theadBg = (darkMode: boolean) => (darkMode ? 'bg-gray-700' : 'bg-gray-100');

export default function StructureComparisonTable({ rows, columns, darkMode, title }: StructureComparisonTableProps) {
  const headerClass = darkMode ? 'text-gray-200' : 'text-gray-800';
  const cellClass = darkMode ? 'text-gray-300' : 'text-gray-600';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="overflow-x-auto">
      {title && <h4 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h4>}
      <table className={`w-full text-sm border-collapse ${borderClass}`}>
        <thead>
          <tr className={`${theadBg(darkMode)}`}>
            <th className={`text-left px-4 py-3 font-semibold border-b ${borderClass} ${headerClass}`}>Dimensión</th>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-center px-4 py-3 font-semibold border-b ${borderClass} ${headerClass}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={row.id}
              className={`transition-colors ${
                rowIndex % 2 === 1 ? (darkMode ? 'bg-gray-800/40' : 'bg-gray-50/50') : ''
              }`}
            >
              <td className={`px-4 py-3 border-b ${borderClass} font-medium ${headerClass}`}>{row.label}</td>
              {row.values.map((val, colIndex) => (
                <td
                  key={`${row.id}-${colIndex}`}
                  className={`px-4 py-3 border-b ${borderClass} text-center ${cellClass} ${columnBg(darkMode, colIndex)}`}
                >
                  <span
                    className={
                      val === 'Sí' || val === 'Alta' || val === 'Muy alta'
                        ? 'text-green-600 dark:text-green-400 font-medium'
                        : val === 'No' || val === 'Baja'
                          ? 'text-red-500 dark:text-red-400'
                          : ''
                    }
                  >
                    {val}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
