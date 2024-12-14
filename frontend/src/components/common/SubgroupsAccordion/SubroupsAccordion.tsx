import { IComponentProps } from "@/types/component";
import "./SubgroupsAccordion.css";
import { twMerge } from "tailwind-merge";
import Typography from "@/components/common/typography";

import { ReactComponent as ArrowIcon } from "@/assets/icons/buttons/arrow.svg";
import { useState } from "react";

interface IAccordion extends IComponentProps {
  title: string;
  collapsed?: boolean;
}

export default function SubgroupsAccordion({
  title,
  className,
  children,
  collapsed,
}: IAccordion) {
  const mergedClass = twMerge(
    "accordion cursor-pointer bg-[#373737] dark:bg-white-100 py-2 rounded-lg mt-4 px-4",
    className,
  );

  const [isCollapsed, setCollapse] = useState(collapsed);

  return (
    <div className={mergedClass}>
      <div
        className='flex h-[39px] justify-between border-b border-solid border-gray-500'
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
        className='overflow-y-hidden duration-500'
        style={{ height: isCollapsed ? "0px" : "auto" }}
      >
        {children}
      </div>
    </div>
  );
}
