import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  KeyboardEvent,
  ChangeEvent,
  FormEvent
} from 'react';
import './SelectInput.css';

interface SelectInputProps {
  options: string[];
  value?: string;
  onChange?: (value: string, isCustomValue?: boolean) => void;
  placeholder?: string;
  animateDuration?: number;
  error?: boolean;

  mode?: 'select-only' | 'input-only' | 'both';
  size?: 'small' | 'medium' | 'large';
  customStyles?: {
    container?: string;
    input?: string;
    optionList?: string;
    optionItem?: string;
    clearButton?: string;
  };
  renderOption?: (option: string) => React.ReactNode;
}

const SelectInput: React.FC<SelectInputProps> = ({
  options,
  value,
  onChange,
  placeholder = '请选择',
  animateDuration = 300,
  mode = 'both',
  size = 'medium',
  customStyles,
  renderOption,
  error = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 处理点击外部区域关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 初始化输入值
  useEffect(() => {
    if (value) {
      const selectedOption = options.find(opt => opt === value);
      if (selectedOption) {
        setInputValue(selectedOption);
      }
    } else {
      setInputValue('');
    }
  }, [value, options]);

  // 过滤选项
  useEffect(() => {
    if (mode !== 'select-only' && inputValue) {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [inputValue, options]);

  // 处理输入变化
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    onChange?.(newValue);

    // 重置高亮索引
    if (newValue) {
      setHighlightedIndex(0);
    } else {
      setHighlightedIndex(-1);
    }
  }, []);

  // 清空输入内容
  const handleClearInput = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue('');
    onChange?.('');
    setIsOpen(false);
    inputRef.current?.focus();
  }, [onChange]);

  // 提交表单，处理自定义值
  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();

    if (mode !== 'select-only' && inputValue) {
      // 如果允许自定义值且有输入内容
      if (filteredOptions.length === 0) {
        // 没有匹配选项，使用输入值作为自定义值
        onChange?.(inputValue, true);
        setIsOpen(false);
      } else if (filteredOptions.length === 1) {
        // 只有一个匹配选项，自动选择
        onChange?.(filteredOptions[0]);
        setInputValue(filteredOptions[0]);
        setIsOpen(false);
      } else if (highlightedIndex >= 0) {
        // 有高亮选项，选择高亮项
        const selectedOption = filteredOptions[highlightedIndex];
        onChange?.(selectedOption);
        setInputValue(selectedOption);
        setIsOpen(false);
      } else {
        // 有多个选项但没有高亮项，使用输入值作为自定义值
        onChange?.(inputValue, true);
        setIsOpen(false);
      }
    } else if (filteredOptions.length === 1) {
      // 不允许自定义值但只有一个选项时，自动选择
      onChange?.(filteredOptions[0]);
      setInputValue(filteredOptions[0]);
      setIsOpen(false);
    } else if (filteredOptions.length > 0 && highlightedIndex >= 0) {
      // 有多个选项且有高亮选项
      const selectedOption = filteredOptions[highlightedIndex];
      onChange?.(selectedOption);
      setInputValue(selectedOption);
      setIsOpen(false);
    }
  }, [inputValue, filteredOptions, onChange, highlightedIndex]);

  // 键盘导航处理
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => {
          if (prev === -1 && filteredOptions.length > 0) {
            return filteredOptions.length - 1;
          }
          return Math.max(0, prev - 1);
        });
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => {
          if (prev === filteredOptions.length - 1) {
            return -1;
          }
          return Math.min(filteredOptions.length - 1, prev + 1);
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (mode != 'select-only' && inputValue) {
          if (filteredOptions.length === 0) {
            // 没有匹配选项，使用输入值作为自定义值
            onChange?.(inputValue, true);
            setIsOpen(false);
          } else if (highlightedIndex >= 0) {
            // 有高亮选项，选择高亮项
            const selectedOption = filteredOptions[highlightedIndex];
            onChange?.(selectedOption);
            setInputValue(selectedOption);
            setIsOpen(false);
          } else if (filteredOptions.length === 1) {
            // 只有一个匹配选项，自动选择
            onChange?.(filteredOptions[0]);
            setInputValue(filteredOptions[0]);
            setIsOpen(false);
          } else {
            // 有多个选项但没有高亮项，使用输入值作为自定义值
            onChange?.(inputValue, true);
            setIsOpen(false);
          }
        } else if (highlightedIndex >= 0) {
          // 不允许自定义值且有高亮选项
          const selectedOption = filteredOptions[highlightedIndex];
          onChange?.(selectedOption);
          setInputValue(selectedOption);
          setIsOpen(false);
        } else if (filteredOptions.length === 1) {
          // 不允许自定义值但只有一个选项
          onChange?.(filteredOptions[0]);
          setInputValue(filteredOptions[0]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        // 恢复为选中的值
        if (value) {
          const selectedOption = options.find(opt => opt === value);
          if (selectedOption) {
            setInputValue(selectedOption);
          }
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  }, [isOpen, highlightedIndex, filteredOptions, options, onChange, value, inputValue]);

  // 滚动可视区域
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const item = listRef.current.children[highlightedIndex];
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  // 触控处理
  const handleTouchInteraction = useCallback((e: React.TouchEvent) => {
    e.preventDefault(); // 防止触发其他事件
    if (!isOpen) {
      setHighlightedIndex(options.findIndex(opt => opt === value));
    }
    setIsOpen(prev => !prev);
  }, [isOpen, options, value]);


  const renderOptionList = () => {
    const displayOptions = [...filteredOptions];
    if (mode === 'both' && inputValue && filteredOptions.length === 0) {
      displayOptions.push(inputValue);
    }
    return displayOptions.map((option, index) => (
      <li
        key={option}
        className={`option-item ${index === highlightedIndex ? 'highlighted' : ''} ${customStyles?.optionItem || ''}`}
        onClick={(e) => {
          e.preventDefault();
          onChange?.(option, option === inputValue);
          setInputValue(option);
          setIsOpen(false);
        }}
        // onTouchEnd={(e) => {
        //   e.preventDefault();
        //   onChange?.(option, option === inputValue);
        //   setInputValue(option);
        //   setIsOpen(false);
        // }}
      >
        {renderOption ? renderOption(option) : option}
      </li>
    ));
  }

  return (
    <div
      ref={containerRef}
      className={`select-input-container ${customStyles?.container || ''}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {mode === 'input-only' ? (
        <form onSubmit={handleSubmit}>
          <div
            className={`input-container ${size} ${isOpen ? 'is-open' : ''} ${error ? 'error' : ''} ${customStyles?.input || ''}`}
          >
            <input
              ref={inputRef}
              className="input-element"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={placeholder}
              autoComplete="off"
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClearInput}
                className={`clear-button ${customStyles?.clearButton || ''}`}
                aria-label="清除输入"
              >
                ×
              </button>
            )}
          </div>
        </form>
      ) : mode === 'select-only' ? (
        <div
          className={`input-container ${size} ${isOpen ? 'is-open' : ''} ${error ? 'error' : ''} ${customStyles?.input || ''}`}
          onClick={() => setIsOpen(!isOpen)}
          onTouchEnd={handleTouchInteraction}
        >
          <span style={{
            display: "inline-block",
            width: '100%',
            textAlign: 'left',
            paddingLeft: '4px',
            fontSize:'var(--select-font-size)'
          }}>
            {value ? options.find(opt => opt === value) : <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{placeholder}</span>}
          </span>
          <div
            className="dropdown-indicator"
            onClick={() => setIsOpen(!isOpen)}
            onTouchEnd={(e) => {
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
          />
        </div>
      ) : (
        // mode === 'both'
        <form onSubmit={handleSubmit}>
          <div
            className={`input-container ${size} ${isOpen ? 'is-open' : ''} ${error ? 'error' : ''} ${customStyles?.input || ''}`}
            onClick={() => {
              if (!isOpen) {
                setIsOpen(true);
                inputRef.current?.focus();
              }
            }}
          >
            <input
              ref={inputRef}
              className="input-element"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              autoComplete="off"
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClearInput}
                className={`clear-button ${customStyles?.clearButton || ''}`}
                aria-label="清除输入"
              >
                ×
              </button>
            )}
            <div
              className="dropdown-indicator"
              onClick={() => setIsOpen(!isOpen)}
              onTouchEnd={(e) => {
                e.preventDefault();
                setIsOpen(!isOpen);
              }}
            />
          </div>
        </form>
      )}

      {mode !== 'input-only' && (
        <ul
          ref={listRef}
          className={`option-list ${isOpen ? 'is-open' : ''} ${customStyles?.optionList || ''}`}
          style={{
            '--animate-duration': `${animateDuration}ms`
          } as React.CSSProperties}
        >
          {renderOptionList()}
        </ul>
      )}
    </div>
  );
};

export default SelectInput;
