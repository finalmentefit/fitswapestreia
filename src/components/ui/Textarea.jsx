import React from 'react';

export const Textarea = ({
  value,
  onChange,
  disabled = false,
  placeholder = "",
  rows = 4,
  className = "",
  ...props
}) => {
  const baseClasses =
    "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <textarea
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      rows={rows}
      className={${baseClasses} ${disabled ? "opacity-50 bg-gray-100 cursor-not-allowed" : ""} ${className}}
      {...props}
    ></textarea>
  );
};
