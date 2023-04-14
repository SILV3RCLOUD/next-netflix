import React from 'react';

interface AuthInputProps {
  id: string;
  type?: string;
  label: string;
  value: string;
  onChange: any;
  error?: string;
}

const AuthInput: React.FC<AuthInputProps> = ({
  id,
  type,
  label,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="flex flex-col px-2 pt-2 pb-6">
      <label
        id={id}
        className="text-md text-gray-400 font-semibold pb-2 uppercase"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className="w-full border-none bg-gray-800 text-gray-200 p-2 mb-2"
        onChange={onChange}
        value={value}
      />
      {error && <p className="text-sm text-red-500 -mb-5">{error}</p>}
    </div>
  );
};

export default AuthInput;
