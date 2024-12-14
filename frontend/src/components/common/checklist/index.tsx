import { IClassProps } from "@/types/component";
import { twMerge } from "tailwind-merge";
import Typography from "../typography";
import "./index.css";

import { ReactComponent as CheckIcon } from "@/assets/icons/buttons/check.svg";
import { useState } from "react";

interface ICheckListProps extends IClassProps {
  list: string[];
  onClick?: (arg0: string) => void;
}

interface IChecboxProps extends IClassProps {
  label?: string;
  onClick?: (arg0: string) => void;
}

export function Checkbox({ label, className, onClick }: IChecboxProps) {
  const mergedClass = twMerge("checkbox-wrap", className);
  const [isChecked, setCheck] = useState(false);

  const onCheckboxClick = (value: string) => {
    setCheck((prev) => !prev);
    if (onClick) {
      onClick(value);
    }
  };

  return (
    <div
      className={mergedClass}
      onClick={() => onCheckboxClick(label!)}
    >
      <div className='checkbox'>
        <CheckIcon
          className='check storke-accent-100 dark:stroke-accent-900'
          style={{ transform: `translate(${+!isChecked * 200}%)` }}
        />
      </div>
      {label ? <Typography className='label'>{label}</Typography> : <></>}
    </div>
  );
}

export default function CheckList({ list, onClick }: ICheckListProps) {
  return (
    <div className='flex flex-col'>
      {list.map((label, index) => (
        <Checkbox
          onClick={onClick}
          key={index}
          label={label}
        />
      ))}
    </div>
  );
}
