
import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  error, 
  icon, 
  className = '', 
  id,
  ...props 
}) => {
  return (
    <div className="mb-4 text-left">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative rounded-xl shadow-sm transition-all focus-within:shadow-md">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`block w-full rounded-xl border-0 py-3.5 text-gray-900 dark:text-white dark:bg-slate-800 ring-1 ring-inset ring-gray-200 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all ${
            icon ? 'pl-11' : 'pl-4'
          } ${error ? 'ring-red-300 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 ml-1 text-xs text-red-600 dark:text-red-400 font-medium" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};
