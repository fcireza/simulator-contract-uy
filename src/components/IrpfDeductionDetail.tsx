import { formatUyu } from '../utils/format';
import type { TaxBreakdownData } from './TaxBreakdown';

interface IrpfDeductionDetailProps {
  data: TaxBreakdownData;
  darkMode: boolean;
}

export default function IrpfDeductionDetail({ data, darkMode }: IrpfDeductionDetailProps) {
  if (
    !data.appliedIrpfBracket &&
    (data.familyDetail?.childDeduction ?? 0) <= 0 &&
    (data.familyDetail?.disabledChildDeduction ?? 0) <= 0
  ) {
    return null;
  }

  return (
    <div className="ml-5 py-2 space-y-1 border-l-2 border-gray-300 dark:border-gray-600 pl-3">
      {data.appliedIrpfBracket && (
        <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>• Tramo aplicado: {data.appliedIrpfBracket.label}</span>
          <span className="text-red-400">-{formatUyu(data.irpf ?? 0)}</span>
        </div>
      )}
      {(data.familyDetail?.childDeduction ?? 0) > 0 && (
        <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>• Deducción hijos IRPF</span>
          <span className="text-green-400">-{formatUyu(data.familyDetail?.childDeduction ?? 0)}</span>
        </div>
      )}
      {(data.familyDetail?.disabledChildDeduction ?? 0) > 0 && (
        <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>• Deducción hijos disc. IRPF</span>
          <span className="text-green-400">-{formatUyu(data.familyDetail?.disabledChildDeduction ?? 0)}</span>
        </div>
      )}
    </div>
  );
}
