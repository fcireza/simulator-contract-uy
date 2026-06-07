import type { TaxRegime, IraeExemption } from '../../utils/taxCalculator';

interface RegimeSelectorProps {
  regime: TaxRegime;
  onRegimeChange: (regime: TaxRegime) => void;
  isUniversityProfessional: boolean;
  onProfessionalChange: (value: boolean) => void;
  iraeExemption: IraeExemption;
  onIraeExemptionChange: (value: IraeExemption) => void;
  labelClass: string;
  inputClass: string;
  darkMode: boolean;
}

export default function RegimeSelector({
  regime,
  onRegimeChange,
  isUniversityProfessional,
  onProfessionalChange,
  iraeExemption,
  onIraeExemptionChange,
  labelClass,
  inputClass,
  darkMode,
}: RegimeSelectorProps) {
  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium ${labelClass} mb-2`}>Régimen Impositivo</label>
      <select
        value={regime === 'unipersonal' ? 'unipersonal' : 'sas'}
        onChange={(e) => {
          if (e.target.value === 'unipersonal') {
            onProfessionalChange(false);
            onRegimeChange('unipersonal');
          } else {
            onRegimeChange(isUniversityProfessional ? 'sas-con-caja' : 'sas-sin-caja');
          }
        }}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
      >
        <option value="unipersonal">Unipersonal (IRPF + BPS/FONASA)</option>
        <option value="sas">SAS (Sociedad Anónima Simplificada)</option>
      </select>

      {/* Caja Profesional Toggle - only for SAS */}
      {regime !== 'unipersonal' && (
        <div className="mt-3 flex items-center justify-between">
          <span className={`text-sm ${labelClass}`}>Aporta a Caja Profesional</span>
          <button
            type="button"
            onClick={() => onProfessionalChange(!isUniversityProfessional)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isUniversityProfessional ? 'bg-primary-600' : darkMode ? 'bg-gray-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isUniversityProfessional ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      )}

      {/* IRAE Exemption Toggle - only for SAS */}
      {regime !== 'unipersonal' && (
        <div className="mt-3">
          <label className={`block text-sm font-medium ${labelClass} mb-1.5`}>
            Exoneración IRAE (Software Exportación)
          </label>
          <div className={`flex rounded-lg overflow-hidden border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
            {(['none', 'partial', 'full'] as IraeExemption[]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onIraeExemptionChange(opt)}
                className={`flex-1 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 ${
                  iraeExemption === opt
                    ? opt === 'none'
                      ? 'bg-red-500 text-white'
                      : opt === 'partial'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-green-500 text-white'
                    : darkMode
                      ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {opt === 'none' ? 'Sin' : opt === 'partial' ? 'Parcial' : 'Total'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Show current SAS mode description */}
      {regime !== 'unipersonal' && (
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {regime === 'sas-con-caja'
            ? `→ SAS con Caja Profesional (IRAE 25%${iraeExemption !== 'none' ? ` - Exoneración ${iraeExemption === 'partial' ? '50%' : '100%'}` : ''} + Caja ~22.5%)`
            : `→ SAS sin Caja (IRAE 25%${iraeExemption !== 'none' ? ` - Exoneración ${iraeExemption === 'partial' ? '50%' : '100%'}` : ''} + BPS común ~12.5%)`}
        </p>
      )}
    </div>
  );
}
