import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ options, value, onChange, defaultValue = "", placeholder = "Select an option", className = "" }) => {
  return (
    <select
      value={value || defaultValue}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-transparent text-white-100 text-[15px] py-3 px-5 border-2 border-solid border-gray-600 rounded-2xl ${className}`}>
      {placeholder && !value && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option
          className="text-white-100"
          key={option.value}
          value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
