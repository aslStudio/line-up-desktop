import { IClassProps } from "@/types/component";
import "./index.css";
import React from "react";
import { twMerge } from "tailwind-merge";

interface SwitchProps extends IClassProps {
  onSwitch?: (state: boolean) => void;
  state?: boolean;
}
const Switch: React.FC<SwitchProps> = (props) => {
  const { className, onSwitch = () => {}, state = false } = props;

  const toggleSwitch = () => {
    onSwitch(!state);
  };

  const mergedClass = twMerge(
    "min-w-[51px] h-[31px] flex items-center rounded-full p-1 cursor-pointer",
    state
      ? "bg-green-400 dark:bg-accent-900"
      : "bg-[#78788052] dark:bg-[#48484A]",
    className,
  );

  return (
    <button
      className={mergedClass}
      onClick={toggleSwitch}
      aria-label={state ? "Turn off" : "Turn on"}
    >
      <span
        className={`h-6 w-6 transform rounded-full bg-white-100 shadow-md transition-transform duration-300 ease-in-out ${state ? "translate-x-5" : ""}`}
      />
    </button>
  );
};

export default Switch;
