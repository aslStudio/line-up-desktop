import { IClassProps } from "@/types/component";
import { twMerge } from "tailwind-merge";
import Typography from "@/components/common/typography";
import { ReactComponent as ArrowIcon } from "@/assets/icons/buttons/arrow.svg";

interface ITagProps extends IClassProps {
  title: string;
  active?: boolean;
  onClick?: () => void;
}

export default function SubgroupsTag({
  title,
  className,
  active,
  onClick,
}: ITagProps) {
  const mergedClass = twMerge(
    "py-[11px] flex justify-start items-center min-w-full gap-x-4",
    className,
  );

  return (
    <div
      className={mergedClass}
      onClick={onClick}
    >
      <div
        className={`flex w-[22px] items-center justify-center rounded-full ${active ? "dark:bg-accent-900 bg-accent-100" : "bg-none"} h-[22px] cursor-pointer border border-solid border-gray-500`}
        onClick={onClick}
      >
        {active && (
          <ArrowIcon
            className={`max-h-[10px] max-w-[10px] brightness-50 dark:fill-white-100 dark:brightness-200`}
          />
        )}
      </div>
      <Typography className={"text-[17px] text-white-100"}>{title}</Typography>
    </div>
  );
}
