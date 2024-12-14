import { IDay } from "@/types/calendar";
import "./index.css";
import Typography from "@/components/common/typography";
import { format } from "date-fns";

interface IMonthGridProps {
  days: IDay[];
}

export default function Month({ days }: IMonthGridProps) {
  return (
    <div className="grid grid-cols-7 gap-[2px]">
      {["пн", "вт", "ср", "чт", "пт", "сб", "вс"].map((day, index) => (
        <div className="flex justify-center w-[50px] h-[32px] opacity-[30%]">
          <Typography
            className="m-auto"
            key={index}>
            {day}
          </Typography>
        </div>
      ))}
      {days.length &&
        days?.map((day, index) => (
          <div
            className={`month-calendar ${day.date.getDate() === new Date().getDate() ? "active" : ""}`}
            key={index}>
            <Typography className="date">{format(day.date, "d")}</Typography>
            {day.plans.map((plan) => (
              <div className="w-full flex mb-1">
                <div
                  className="min-w-[1.53px] mb-[0.84px] h-[9.16px] rounded-[3px]"
                  style={{ background: plan?.event?.color || "#FF6D33" }}
                />
                <span
                  className="ml-[1.3px] leading-[10px] text-[10px] line-clamp-1 text-ellipsis"
                  style={{ color: plan?.event?.color || "#FF6D33" }}>
                  {plan?.event.name}
                </span>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
