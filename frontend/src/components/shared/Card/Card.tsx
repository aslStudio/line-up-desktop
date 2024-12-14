import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}
const Card: React.FC<CardProps> = (props) => {
  const { children, className, onClick } = props;
  const cardClassname = twMerge(
    "bg-gray-600 py-[13px] px-4 rounded-2xl dark:bg-[#F4F4F4] dark:text-black-100",
    className,
  );
  return (
    <div
      className={cardClassname}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
