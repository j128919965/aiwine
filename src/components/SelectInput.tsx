import React, { 
    useState, 
    useEffect, 
    useRef, 
    useCallback,
    KeyboardEvent,
    ChangeEvent,
    FormEvent
  } from 'react';
  import styled, { css } from 'styled-components';
  
  interface SelectInputProps {
    options: Array<{ value: string; label: string }>;
    value?: string;
    onChange?: (value: string, isCustomValue?: boolean) => void;
    placeholder?: string;
    animateDuration?: number;
    allowInput?: boolean;
    allowCustomValue?: boolean;
    size?: 'small' | 'medium' | 'large';
    customStyles?: {
      container?: string;
      input?: string;
      optionList?: string;
      optionItem?: string;
      clearButton?: string;
    };
    renderOption?: (option: { value: string; label: string }) => React.ReactNode;
  }
  
  const SelectInput: React.FC<SelectInputProps> = ({
    options,
    value,
    onChange,
    placeholder = '请选择',
    animateDuration = 300,
    allowInput = false,
    allowCustomValue = false,
    size = 'medium',
    customStyles,
    renderOption
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
        const selectedOption = options.find(opt => opt.value === value);
        if (selectedOption) {
          setInputValue(selectedOption.label);
        }
      } else {
        setInputValue('');
      }
    }, [value, options]);

    // 过滤选项
    useEffect(() => {
      if (allowInput && inputValue) {
        const filtered = options.filter(option => 
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredOptions(filtered);
      } else {
        setFilteredOptions(options);
      }
    }, [inputValue, options, allowInput]);

    // 处理输入变化
    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setIsOpen(true);
      
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
      
      if (allowCustomValue && inputValue) {
        // 如果允许自定义值且有输入内容
        if (filteredOptions.length === 0) {
          // 没有匹配选项，使用输入值作为自定义值
          onChange?.(inputValue, true);
          setIsOpen(false);
        } else if (filteredOptions.length === 1) {
          // 只有一个匹配选项，自动选择
          onChange?.(filteredOptions[0].value);
          setInputValue(filteredOptions[0].label);
          setIsOpen(false);
        } else if (highlightedIndex >= 0) {
          // 有高亮选项，选择高亮项
          const selectedOption = filteredOptions[highlightedIndex];
          onChange?.(selectedOption.value);
          setInputValue(selectedOption.label);
          setIsOpen(false);
        } else {
          // 有多个选项但没有高亮项，使用输入值作为自定义值
          onChange?.(inputValue, true);
          setIsOpen(false);
        }
      } else if (filteredOptions.length === 1) {
        // 不允许自定义值但只有一个选项时，自动选择
        onChange?.(filteredOptions[0].value);
        setInputValue(filteredOptions[0].label);
        setIsOpen(false);
      } else if (filteredOptions.length > 0 && highlightedIndex >= 0) {
        // 有多个选项且有高亮选项
        const selectedOption = filteredOptions[highlightedIndex];
        onChange?.(selectedOption.value);
        setInputValue(selectedOption.label);
        setIsOpen(false);
      }
    }, [allowCustomValue, inputValue, filteredOptions, onChange, highlightedIndex]);


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
          if (allowCustomValue && inputValue) {
            if (filteredOptions.length === 0) {
              // 没有匹配选项，使用输入值作为自定义值
              onChange?.(inputValue, true);
              setIsOpen(false);
            } else if (highlightedIndex >= 0) {
              // 有高亮选项，选择高亮项
              const selectedOption = filteredOptions[highlightedIndex];
              onChange?.(selectedOption.value);
              setInputValue(selectedOption.label);
              setIsOpen(false);
            } else if (filteredOptions.length === 1) {
              // 只有一个匹配选项，自动选择
              onChange?.(filteredOptions[0].value);
              setInputValue(filteredOptions[0].label);
              setIsOpen(false);
            } else {
              // 有多个选项但没有高亮项，使用输入值作为自定义值
              onChange?.(inputValue, true);
              setIsOpen(false);
            }
          } else if (highlightedIndex >= 0) {
            // 不允许自定义值且有高亮选项
            const selectedOption = filteredOptions[highlightedIndex];
            onChange?.(selectedOption.value);
            setInputValue(selectedOption.label);
            setIsOpen(false);
          } else if (filteredOptions.length === 1) {
            // 不允许自定义值但只有一个选项
            onChange?.(filteredOptions[0].value);
            setInputValue(filteredOptions[0].label);
            setIsOpen(false);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          // 恢复为选中的值
          if (value) {
            const selectedOption = options.find(opt => opt.value === value);
            if (selectedOption) {
              setInputValue(selectedOption.label);
            }
          }
          break;
        case 'Tab':
          setIsOpen(false);
          break;
      }
    }, [isOpen, highlightedIndex, filteredOptions, options, onChange, value, allowCustomValue, inputValue]);
  
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
        setHighlightedIndex(options.findIndex(opt => opt.value === value));
      }
      setIsOpen(prev => !prev);
    }, [isOpen, options, value]);
  
    return (
      <Container
        ref={containerRef}
        className={customStyles?.container}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {allowInput ? (
          <form onSubmit={handleSubmit}>
            <InputContainer
              className={customStyles?.input}
              isOpen={isOpen}
              size={size}
              onClick={() => {
                if (!isOpen) {
                  setIsOpen(true);
                  inputRef.current?.focus();
                }
              }}
            >
              <InputElement
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                autoComplete="off"
              />
              {inputValue && (
                <ClearButton 
                  type="button"
                  onClick={handleClearInput}
                  className={customStyles?.clearButton}
                  aria-label="清除输入"
                >
                  ×
                </ClearButton>
              )}
              <DropdownIndicator 
                onClick={() => setIsOpen(!isOpen)} 
                onTouchEnd={(e) => {
                  e.preventDefault();
                  setIsOpen(!isOpen);
                }}
              />
            </InputContainer>
          </form>
        ) : (
          <InputField
            className={customStyles?.input}
            onClick={() => setIsOpen(!isOpen)}
            onTouchEnd={handleTouchInteraction}
            isOpen={isOpen}
            size={size}
          >
            {value ? options.find(opt => opt.value === value)?.label : placeholder}
            {value && (
              <ClearButton 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange?.('');
                }}
                className={customStyles?.clearButton}
                aria-label="清除选择"
              >
                ×
              </ClearButton>
            )}
          </InputField>
        )}
  
        <OptionList
          ref={listRef}
          className={customStyles?.optionList}
          animateDuration={animateDuration}
          isOpen={isOpen}
        >
          {(() => {
            const displayOptions = [...filteredOptions];
            if (allowCustomValue && inputValue && filteredOptions.length === 0) {
              displayOptions.push({
                value: inputValue,
                label: `${inputValue}`
              });
            }
            return displayOptions.map((option, index) => (
              <OptionItem
                key={option.value}
                className={customStyles?.optionItem}
                highlighted={index === highlightedIndex}
                onClick={() => {
                  onChange?.(option.value, option.value === inputValue);
                  setInputValue(option.label.startsWith('创建: ') ? option.value : option.label);
                  setIsOpen(false);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  onChange?.(option.value, option.value === inputValue);
                  setInputValue(option.label.startsWith('创建: ') ? option.value : option.label);
                  setIsOpen(false);
                }}
                animateDuration={animateDuration}
              >
                {renderOption ? renderOption(option) : option.label}
              </OptionItem>
            ));
          })()}
        </OptionList>
      </Container>
    );
  };
  
  // 样式组件部分
  const Container = styled.div`
    position: relative;
    width: 100%;
    max-width: 400px;
  `;
  
  const getSizeStyles = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return {
        padding: '6px 10px',
        fontSize: '14px',
        borderRadius: '12px',
      };
    case 'large':
      return {
        padding: '14px 18px',
        fontSize: '18px',
        borderRadius: '20px',
      };
    default:
      return {
        padding: '8px 12px',
        fontSize: '16px',
        borderRadius: '16px',
      };
  }
};

const InputContainer = styled.div<{ isOpen: boolean; size: string }>`
  display: flex;
  align-items: center;
  border: 2px solid #ff6b6b;
  background: white;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  ${({ size }) => {
    const styles = getSizeStyles(size as 'small' | 'medium' | 'large');
    return css`
      padding: ${styles.padding};
      font-size: ${styles.fontSize};
      border-radius: ${styles.borderRadius};
    `;
  }}
  
  ${({ isOpen }) => isOpen && css`
    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
    transform: translateY(-2px);
  `}
  
  &:hover {
    border-color: #ff8787;
    transform: translateY(-2px) rotate(-1deg);
  }
`;
  
  const InputElement = styled.input`
    flex: 1;
    border: none;
    font-size: 16px;
    background: transparent;
    outline: none;
    padding: 4px;
    width: 100%;
    color: #ff6b6b;
    
    &::placeholder {
      color: rgba(255, 107, 107, 0.5);
    }
  `;
  
  const DropdownIndicator = styled.div`
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #ff6b6b;
    margin-left: 8px;
    cursor: pointer;
    box-sizing: content-box;
    margin-right: 0;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: rotate(180deg);
    }
  `;
  
  const ClearButton = styled.button`
    background: none;
    border: none;
    color: #ff6b6b;
    font-size: 18px;
    cursor: pointer;
    padding: 0 8px;
    margin-right: 4px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    min-height: 24px;
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    
    &:hover {
      background-color: rgba(255, 107, 107, 0.1);
      color: #ff8787;
      transform: rotate(90deg);
    }
    
    &:active {
      transform: scale(0.8) rotate(90deg);
    }
    
    &:focus {
      outline: none;
    }
  `;
  
  const InputField = styled.div<{ isOpen: boolean; size: string }>`
  border: 2px solid #ff6b6b;
  background: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ff6b6b;

  ${({ size }) => {
    const styles = getSizeStyles(size as 'small' | 'medium' | 'large');
    return css`
      padding: ${styles.padding};
      font-size: ${styles.fontSize};
      border-radius: ${styles.borderRadius};
    `;
  }}

  ${({ isOpen }) => isOpen && css`
    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
    transform: translateY(-2px);
  `}

  &:hover {
    border-color: #ff8787;
    transform: translateY(-2px) rotate(-1deg);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.3);
  }
`;
  
  const OptionList = styled.ul<{ isOpen: boolean; animateDuration: number }>`
    position: absolute;
    width: 100%;
    max-width: 400px;
    max-height: 300px;
    margin: 8px 0;
    padding: 0;
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.15);
    overflow-y: auto;
    opacity: 0;
    transform: translateY(-10px);
    transition: 
      opacity ${({ animateDuration }) => animateDuration}ms ease,
      transform ${({ animateDuration }) => animateDuration}ms ease;
    z-index: 9999;

    ${({ isOpen }) => isOpen ? css`
      opacity: 1;
      display: block
      transform: translateY(0);
    `: css`
      display: none;`
    }

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #fff;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #ff6b6b;
      border-radius: 4px;
    }
  `;
  
  const OptionItem = styled.li<{ highlighted: boolean; animateDuration: number }>`
    padding: 12px 16px;
    list-style: none;
    cursor: pointer;
    color: #ff6b6b;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    position: relative;
    overflow: hidden;
    max-width: 300px;
  
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 107, 107, 0.1);
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }
  
    ${({ highlighted }) => highlighted && css`
      background-color: rgba(255, 107, 107, 0.1);
      transform: scale(1.02) translateX(4px);
      font-weight: bold;
    `}
  
    &:hover {
      background-color: rgba(255, 107, 107, 0.1);
      transform: scale(1.02) translateX(4px);
      
      &:before {
        transform: translateX(0);
      }
    }
  
    &:active {
      transform: scale(0.98);
    }
  `;
  
  export default SelectInput;
  