import { IComponentProps } from "@/types/component";
import "./index.css";
import { twMerge } from "tailwind-merge";
import Typography from "../typography";

import { ReactComponent as ArrowIcon } from "@/assets/icons/buttons/arrow.svg";
import { useState } from "react";

interface IAccordion extends IComponentProps {
  title: string;
  collapsed?: boolean;
}

export default function Accordion({
  title,
  className,
  children,
  collapsed,
}: IAccordion) {
  const mergedClass = twMerge("accordion cursor-pointer", className);

  const [isCollapsed, setCollapse] = useState(collapsed);

  return (
    <div className={mergedClass}>
      <div
        className='flex h-[39px] justify-between'
        onClick={() => setCollapse(!isCollapsed)}
      >
        <Typography className='my-auto text-[17px] font-semibold'>
          {title}
        </Typography>
        <ArrowIcon
          className='arrow'
          style={{ transform: isCollapsed ? "rotate(-200grad)" : "" }}
        />
      </div>
      <div
        className='overflow-hidden duration-500'
        style={{ height: isCollapsed ? "0px" : "auto" }}
      >
        {children}
      </div>
    </div>
  );
}
