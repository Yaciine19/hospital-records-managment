import React, { useState } from 'react';

const CheckboxGroup = ({ options, onChange }) => {
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

  const handleOtherInputChange = (e) => {
    const value = e.target.value;
    setOtherValue(value);
    onChange(selectedOptions, value);
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
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="other"
            checked={otherSelected}
            onChange={() => handleCheckboxChange('other')}
            className="h-4 w-4 accent-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="other" className="text-sm text-gray-700">
            Other
          </label>
        </div>
        
        {otherSelected && (
          <div className=" mt-2 rounded-lg transition-all duration-200 ease-in-out">
            <input
              type="text"
              value={otherValue}
              onChange={handleOtherInputChange}
              placeholder="Please specify"
              className="form-input"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckboxGroup;