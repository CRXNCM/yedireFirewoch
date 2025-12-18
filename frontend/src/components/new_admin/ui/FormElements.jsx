import React, { forwardRef } from 'react';

// Input Component
export const Input = forwardRef(({
  label,
  error,
  description,
  className = '',
  labelClassName = '',
  errorClassName = '',
  descriptionClassName = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={`block w-full px-3 py-2 border ${
          error ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
        {...props}
      />
      {error && (
        <p className={`mt-1 text-sm text-red-600 ${errorClassName}`}>
          {error}
        </p>
      )}
      {description && !error && (
        <p className={`mt-1 text-sm text-gray-500 ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  );
});

// Textarea Component
export const Textarea = forwardRef(({
  label,
  error,
  description,
  className = '',
  rows = 3,
  ...props
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`block w-full px-3 py-2 border ${
          error ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {description && !error && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
});

// Select Component
export const Select = forwardRef(({
  label,
  options = [],
  error,
  description,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`block w-full px-3 py-2 border ${
          error ? 'border-red-300 text-red-900' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {description && !error && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
});

// Checkbox Component
export const Checkbox = forwardRef(({
  label,
  error,
  description,
  className = '',
  ...props
}, ref) => {
  const id = `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={className}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={id}
            type="checkbox"
            ref={ref}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            {...props}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor={id} className="font-medium text-gray-700">
            {label}
          </label>
          {description && (
            <p className="text-gray-500">{description}</p>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

// Radio Component
export const Radio = forwardRef(({
  label,
  options = [],
  error,
  description,
  className = '',
  name,
  ...props
}, ref) => {
  const groupName = name || `radio-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${groupName}-${option.value}`}
              name={groupName}
              type="radio"
              ref={ref}
              value={option.value}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              {...props}
            />
            <label
              htmlFor={`${groupName}-${option.value}`}
              className="ml-2 block text-sm text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {description && !error && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
});

// Toggle Switch Component
export const Toggle = forwardRef(({
  label,
  description,
  className = '',
  ...props
}, ref) => {
  const id = `toggle-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={className}>
      <div className="flex items-center">
        <button
          type="button"
          className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
            props.checked ? 'bg-primary-600' : 'bg-gray-200'
          }`}
          role="switch"
          aria-checked={props.checked}
          onClick={() => props.onChange && props.onChange(!props.checked)}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
              props.checked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <div className="ml-3">
          <label htmlFor={id} className="text-sm font-medium text-gray-700">
            {label}
          </label>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
});

// Form Group Component
export const FormGroup = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Form Actions Component
export const FormActions = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex justify-end space-x-3 mt-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default {
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Toggle,
  FormGroup,
  FormActions,
};
