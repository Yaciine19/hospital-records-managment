import React, { useState } from 'react';

const CheckboxGroupNoOther = ({ options, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [otherSelected, setOtherSelected] = useState(false);
  const [otherValue, setOtherValue] = useState('');

  const handleCheckboxChange = (id) => {
    setSelectedOptions((prev) => {
      if (id === 'other') {
        setOtherSelected(!otherSelected);
        return prev.includes(id)
          ? prev.filter((option) => option !== id)
          : [...prev, id];
      }

      const newSelected = prev.includes(id)
        ? prev.filter((option) => option !== id)
        : [...prev, id];
      
      onChange(newSelected, otherValue);
      return newSelected;
    });
  };

  return (
    <div className="mt-2">
      <div className="grid grid-cols-2 grid-rows-2 gap-3">
        {options.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={option.id}
              checked={selectedOptions.includes(option.id)}
              onChange={() => handleCheckboxChange(option.id)}
              className="h-4 w-4 accent-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={option.id} className="text-sm text-gray-700">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroupNoOther;