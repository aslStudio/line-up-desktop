import Typography from "@/components/common/typography";
import { IClassProps } from "@/types/component";
import { twMerge } from "tailwind-merge";
import { IDay } from "@/types/calendar";
import { format } from "date-fns";
import "./index.css";

interface IShortDay extends IClassProps {
  day: IDay;
  isCurrent: boolean;
}

export default function ShortDay({ className, day, isCurrent }: IShortDay) {
  const mergedClass = twMerge("short-day", isCurrent ? "active" : "", className);
  return (
    <div className={mergedClass}>
      <Typography className="date">{format(day.date, "dd")}</Typography>
      <div className="flex w-fit mx-auto mt-auto mb-[5px]">
        {day?.plans?.map((plan, index) => (
          <div
            key={index}
            className="plan"
            style={{ background: plan?.event?.color || "#FF6D33" }}
          />
        ))}
      </div>
    </div>
  );
}
