import { IToggleProps } from "@/types/component";
import { twMerge } from "tailwind-merge";
import Typography from "../typography";
import "./index.css";
import { useState } from "react";

export default function Toggle({
  className,
  variants,
  onChange,
}: IToggleProps) {
  const [currentVariant, setVariant] = useState(variants.at(0));

  const mergedClass = twMerge("toggle", className);

  function change(variant: string, i: number) {
    onChange(i);
    setVariant(variant);
  }

  return (
    <div className={mergedClass}>
      {variants.map((variant, i) => (
        <div
          onClick={() => change(variant, i)}
          key={i}
          className={`variant ${variant === currentVariant ? "selected" : ""}`}
        >
          <span className='m-auto text-center text-[13px] font-semibold'>
            {variant}
          </span>
        </div>
      ))}
    </div>
  );
}
