import React, { useState, useEffect } from 'react';
import './NumberInput.css';

interface NumberInputProps {
  min: number;
  max: number;
  value?: number;
  onChange?: (value: number) => void;
  step?: number;
  customStyles?: {
    container?: string;
    input?: string;
  };
  renderTitle?: (value: number) => React.ReactNode;
}

const NumberInput: React.FC<NumberInputProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  customStyles,
  renderTitle
}) => {
  const [currentValue, setCurrentValue] = useState<number>(value ?? min);

  // 处理滑动条值变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setCurrentValue(newValue);
    onChange?.(newValue);
  };

  // 同步外部值
  useEffect(() => {
    if (value !== undefined && value !== currentValue) {
      setCurrentValue(value);
    }
  }, [value]);

  return (
    <div className={`number-wheel-container ${customStyles?.container || ''}`}>
      <div className="number-display">{renderTitle ? renderTitle(currentValue) : currentValue}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleChange}
        className={`range-input ${customStyles?.input || ''}`}
      />
    </div>
  );
};

export default NumberInput;