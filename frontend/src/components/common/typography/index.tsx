import { twMerge } from "tailwind-merge";
import "./index.css";

import { IComponentProps } from "@/types/component";

export default function Typography({
  children,
  className,
  style,
}: IComponentProps) {
  const mergedClass = twMerge("typography", className);

  return (
    <span
      className={mergedClass}
      style={style}
    >
      {children}
    </span>
  );
}
