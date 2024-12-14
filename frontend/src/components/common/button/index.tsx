import { IComponentProps } from "@/types/component";
import { twMerge } from "tailwind-merge";
import "./index.css";

interface IButtonProps extends IComponentProps {
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({ children, className, onClick, disabled }: IButtonProps) {
  const mergedClass = twMerge("button primary", className);

  return (
    <button
      className={mergedClass}
      onClick={onClick}
      disabled={disabled}>
      {children}
    </button>
  );
}
