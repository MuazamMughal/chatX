interface InputFormProps {
  id: string;
  name: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label: string;
  error?: string;
  className?: string;
}

export default function InputForm({
  id,
  name,
  type,
  autoComplete,
  required = false,
  value,
  onChange,
  placeholder,
  label,
  error,
  className = "",
}: InputFormProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
