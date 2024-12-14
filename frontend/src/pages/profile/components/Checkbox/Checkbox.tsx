import { twMerge } from "tailwind-merge";
import { ReactComponent as CheckIcon } from "@/assets/icons/buttons/check.svg";
import { useState } from "react";

interface CheckboxProps {
  className?: string;
  checked: boolean;
}

export function Checkbox({ className, checked }: CheckboxProps) {
  const mergedClass = twMerge("checkbox-wrap", className);

  return (
    <div
      className={`flex h-[28px] w-[28px] overflow-hidden rounded-full border-[1.5px] border-white-100 dark:border-gray-300 ${checked ? "dark:bg-accent-900 dark:!border-accent-900 !border-accent-100 bg-accent-100" : ""}`}
    >
      <CheckIcon
        className={`m-auto h-[15px] w-auto transition-transform ${checked ? "brightness-0 dark:brightness-200" : ""}`}
        style={{ transform: `translate(${+!checked * 200}%)` }}
      />
    </div>
  );
}
