import { formatUyu } from '../utils/format';
import type { FamilyDetail } from './TaxBreakdown';

interface FamilySurchargeDetailProps {
  familyDetail: FamilyDetail;
  darkMode: boolean;
}

export default function FamilySurchargeDetail({ familyDetail, darkMode }: FamilySurchargeDetailProps) {
  const {
    hasSpouse,
    childrenCount,
    disabledChildrenCount,
    spouseSurcharge,
    childrenSurcharge,
    disabledChildDeduction,
  } = familyDetail;

  if (!hasSpouse && (childrenCount ?? 0) <= 0 && (disabledChildrenCount ?? 0) <= 0) {
    return null;
  }

  return (
    <>
      {hasSpouse && (
        <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>• Cónyuge</span>
          <span className="text-red-400">+{formatUyu(spouseSurcharge ?? 0)}</span>
        </div>
      )}
      {(childrenCount ?? 0) > 0 && (
        <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>• Hijos ({childrenCount})</span>
          <span className="text-red-400">+{formatUyu(childrenSurcharge ?? 0)}</span>
        </div>
      )}
      {(disabledChildrenCount ?? 0) > 0 && (
        <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>• Hijos con discapacidad ({disabledChildrenCount})</span>
          <span className="text-red-400">+{formatUyu(disabledChildDeduction ?? 0)}</span>
        </div>
      )}
    </>
  );
}
