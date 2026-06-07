interface ClientTypeFieldProps {
  value: 'local' | 'exterior';
  onChange: (value: 'local' | 'exterior') => void;
  labelClass: string;
  radioLabelClass: string;
  name: string;
}

export default function ClientTypeField({ value, onChange, labelClass, radioLabelClass, name }: ClientTypeFieldProps) {
  return (
    <div>
      <label className={`block text-sm font-medium ${labelClass} mb-2`}>Tipo de Cliente</label>
      <div className="flex gap-4">
        <label className={`flex items-center ${radioLabelClass}`}>
          <input
            type="radio"
            name={name}
            checked={value === 'exterior'}
            onChange={() => onChange('exterior')}
            className="mr-2"
          />
          Exterior (IVA 0%)
        </label>
        <label className={`flex items-center ${radioLabelClass}`}>
          <input
            type="radio"
            name={name}
            checked={value === 'local'}
            onChange={() => onChange('local')}
            className="mr-2"
          />
          Local (IVA 22%)
        </label>
      </div>
    </div>
  );
}
