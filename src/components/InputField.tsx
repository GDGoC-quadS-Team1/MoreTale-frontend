import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

export type InputFieldType = "text" | "dropdown" | "number";

export interface InputFieldProps {
    type?: InputFieldType;
    width?: number;
    height?: number;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    options?: { value: string; label: string }[];
    onSelect?: (value: string) => void;
    disabled?: boolean;
    className?: string;
    /** type == number */
    min?: number;
    max?: number;
    step?: number;
}

const DEFAULT_WIDTH = 160;
const DEFAULT_HEIGHT = 32;

const InputField = ({
    type = "text",
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    placeholder = "",
    value = "",
    onChange,
    min = 0,
    max,
    step = 1,
    options = [],
    onSelect,
    disabled = false,
    className,
}: InputFieldProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (type === "dropdown" && value && options.length > 0) {
            const option = options.find((o) => o.value === value);
            setSelectedLabel(option ? option.label : value);
        } else if (type === "dropdown" && !value) {
            setSelectedLabel("");
        }
    }, [type, value, options]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string, optionLabel: string) => {
        setSelectedLabel(optionLabel);
        onSelect?.(optionValue);
        setIsOpen(false);
    };

    if (type === "dropdown") {
        return (
            <DropdownWrapper ref={dropdownRef} className={className} $width={width} $height={height}>
                <DropdownInput $height={height}>
                    <DropdownDisplay $height={height}>
                        {selectedLabel || placeholder}
                    </DropdownDisplay>
                    <DropdownTrigger
                        type="button"
                        $height={height}
                        onClick={() => !disabled && setIsOpen((prev) => !prev)}
                        disabled={disabled}
                        aria-expanded={isOpen}
                    >
                        <ArrowIcon $isOpen={isOpen} />
                    </DropdownTrigger>
                </DropdownInput>
                {isOpen && options.length > 0 && (
                    <DropdownList $width={width}>
                        {options.map((opt) => (
                            <DropdownItem
                                key={opt.value}
                                onClick={() => handleSelect(opt.value, opt.label)}
                                $active={opt.value === value}
                            >
                                {opt.label}
                            </DropdownItem>
                        ))}
                    </DropdownList>
                )}
            </DropdownWrapper>
        );
    }

    if (type === "number") {
        const numValue = value === "" || value === undefined ? min : Math.max(min, parseInt(value, 10) || min);
        const clamped = max !== undefined ? Math.min(numValue, max) : numValue;
        const displayValue = value === "" || value === undefined ? String(min) : String(clamped);

        const handleDecrement = () => {
            const next = Math.max(min, clamped - step);
            onChange?.(String(next));
        };
        const handleIncrement = () => {
            const next = max !== undefined ? Math.min(max, clamped + step) : clamped + step;
            onChange?.(String(next));
        };
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value;
            if (v === "") {
                onChange?.("");
                return;
            }
            const n = parseInt(v, 10);
            if (!Number.isNaN(n)) {
                const clampedN = max !== undefined ? Math.min(max, Math.max(min, n)) : Math.max(min, n);
                onChange?.(String(clampedN));
            }
        };

        return (
            <NumberWrapper className={className} $height={height}>
                <StepperButton
                    type="button"
                    $height={height}
                    onClick={handleDecrement}
                    disabled={disabled || clamped <= min}
                    aria-label="감소"
                >
                    −
                </StepperButton>
                <NumberInput
                    type="text"
                    inputMode="numeric"
                    $height={height}
                    value={displayValue}
                    onChange={handleInputChange}
                    disabled={disabled}
                    min={min}
                    max={max}
                    aria-label={placeholder || "숫자 입력"}
                />
                <StepperButton
                    type="button"
                    $height={height}
                    onClick={handleIncrement}
                    disabled={disabled || (max !== undefined && clamped >= max)}
                    aria-label="증가"
                >
                    +
                </StepperButton>
            </NumberWrapper>
        );
    }

    return (
        <TextInput
            type="text"
            $width={width}
            $height={height}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className={className}
        />
    );
};

export default InputField;

const TextInput = styled.input<{ $width: number; $height: number }>`
    width: ${(p) => p.$width}px;
    height: ${(p) => p.$height}px;
    padding: 0 10px;
    box-sizing: border-box;
    background: #ffffff;
    border: 1.5px solid #606060;
    border-radius: 6px;
    color: #171717;
    font-size: 15px;
    font-weight: 600;
    outline: none;

    &::placeholder {
        color: #949494;
    }
`;

const DropdownWrapper = styled.div<{ $width: number; $height: number }>`
    position: relative;
    width: ${(p) => p.$width}px;
    min-height: ${(p) => p.$height}px;
`;

const DropdownInput = styled.div<{ $height: number }>`
    display: flex;
    align-items: stretch;
    height: ${(p) => p.$height}px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    overflow: hidden;
`;

const DropdownDisplay = styled.span<{ $height: number }>`
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 12px;
    color: #333333;
    font-size: 14px;
    font-weight: 500;
    min-width: 0;
`;

const DropdownTrigger = styled.button<{ $height: number }>`
    width: ${(p) => p.$height}px;
    height: ${(p) => p.$height}px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e8e8e8;
    border: none;
    border-left: 1px solid #e0e0e0;
    cursor: pointer;
    padding: 0;

    &:hover:not(:disabled) {
        background: #dddddd;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const ArrowIcon = styled.span<{ $isOpen: boolean }>`
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid #333333;
    transform: ${(p) => (p.$isOpen ? "rotate(180deg)" : "none")};
    transition: transform 0.2s;
`;

const DropdownList = styled.ul<{ $width: number }>`
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    width: ${(p) => p.$width}px;
    max-height: 200px;
    overflow-y: auto;
    margin: 0;
    padding: 4px 0;
    list-style: none;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 10;
`;

const DropdownItem = styled.li<{ $active?: boolean }>`
    padding: 8px 12px;
    color: #333333;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    background: ${(p) => (p.$active ? "rgba(0, 0, 0, 0.05)" : "transparent")};

    &:hover {
        background: rgba(0, 0, 0, 0.06);
    }
`;

const NumberWrapper = styled.div<{ $height: number }>`
    display: inline-flex;
    align-items: stretch;
    height: ${(p) => p.$height}px;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #B0B0B0;
    background: #ffffff;
`;

const StepperButton = styled.button<{ $height: number }>`
    width: ${(p) => p.$height}px;
    height: ${(p) => p.$height}px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e8e8e8;
    border: none;
    color: #171717;
    font-size: 18px;
    font-weight: 600;
    line-height: 1;
    cursor: pointer;
    padding: 0;

    &:hover:not(:disabled) {
        background: #dddddd;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const NumberInput = styled.input<{ $height: number }>`
    width: 48px;
    min-width: 48px;
    height: ${(p) => p.$height - 4}px;
    margin: 2px 0;
    padding: 0 8px;
    box-sizing: border-box;
    border: none;
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    background: #ffffff;
    color: #171717;
    font-size: 15px;
    font-weight: 600;
    text-align: center;
    outline: none;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;
