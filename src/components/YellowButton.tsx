import styled from "styled-components";

type BaseProps = {
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  fontSize?: number | string;
  backgroundColor?: string;
  disabled?: boolean;
  className?: string;
};

type ButtonProps = BaseProps & {
  type?: "button";
  children: React.ReactNode;
  onClick?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLButtonElement>) => void;
};

type TextInputProps = BaseProps & {
  type: "text-input";
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type YellowButtonProps = ButtonProps | TextInputProps;

const toPx = (v: number | string) => (typeof v === "number" ? `${v}px` : v);

const YellowButton = (props: YellowButtonProps) => {
  const {
    width = 73,
    height = 33,
    borderRadius = 4,
    fontSize = 16,
    backgroundColor = "#FFDE21",
    disabled = false,
    className,
  } = props;

  const styleProps = {
    $width: toPx(width),
    $height: toPx(height),
    $borderRadius: toPx(borderRadius),
    $fontSize: toPx(fontSize),
    $backgroundColor: backgroundColor,
  };

  if (props.type === "text-input") {
    return (
      <TextInputWrapper
        {...styleProps}
        className={className}
        onClick={(e) => e.currentTarget.querySelector("input")?.focus()}
      >
        <Input
          type="text"
          value={props.value ?? ""}
          onChange={props.onChange}
          placeholder={props.placeholder ?? ""}
          disabled={disabled}
          $fontSize={styleProps.$fontSize}
        />
      </TextInputWrapper>
    );
  }

  return (
    <Button
      type="button"
      onClick={props.onClick}
      disabled={disabled}
      className={className}
      draggable={props.draggable}
      onDragStart={props.onDragStart}
      {...styleProps}
    >
      {props.children}
    </Button>
  );
};

export default YellowButton;

type StyleProps = {
  $width: string;
  $height: string;
  $borderRadius: string;
  $fontSize: string;
  $backgroundColor: string;
};

const Button = styled.button<StyleProps>`
  width: ${(p) => p.$width};
  height: ${(p) => p.$height};
  min-width: ${(p) => p.$width};
  min-height: ${(p) => p.$height};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: ${(p) => p.$borderRadius};
  background: ${(p) => p.$backgroundColor};
  color: #1f1f1f;
  font-family: "Pretendard Variable";
  font-size: ${(p) => p.$fontSize};
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  transition: opacity 0.2s, transform 0.1s;

  &:hover:not(:disabled) {
    opacity: 0.95;
  }
  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TextInputWrapper = styled.div<StyleProps>`
  width: ${(p) => p.$width};
  height: ${(p) => p.$height};
  min-width: ${(p) => p.$width};
  min-height: ${(p) => p.$height};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: ${(p) => p.$borderRadius};
  background: ${(p) => p.$backgroundColor};
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  cursor: text;
`;

const Input = styled.input<{ $fontSize: string }>`
  border: none;
  background: transparent;
  color: #1F1F1F;
  font-size: ${(p) => p.$fontSize};
  font-weight: 700;
  text-align: center;
  outline: none;

  &::placeholder {
    color: #1F1F1F;
    text-align: center;
  }
`;
