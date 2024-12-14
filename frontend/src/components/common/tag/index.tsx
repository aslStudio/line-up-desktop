import { IClassProps, IComponentProps } from "@/types/component";
import { twMerge } from "tailwind-merge";
import Typography from "../typography";
import "./index.css";

interface ITagProps extends IClassProps {
  title: string;
  active?: boolean;
  onClick?: () => void;
}

export default function Tag({ title, className, active, onClick }: ITagProps) {
  const mergedClass = twMerge("tag", className);

  return (
    <div
      className={`${active ? "dark:bg-accent-900 bg-accent-100 text-black-100 dark:!text-white-100" : "text-white-100 dark:bg-white-100 dark:text-black-100"} ${mergedClass}`}
      onClick={onClick}
    >
      <Typography className={`title !text-inherit`}>{title}</Typography>
    </div>
  );
}
