import "./index.css";
import ShortDay from "./components/short-day";
import WeekGrid from "./components/week-grid";
import { IDay } from "@/types/calendar";

export default function Week({ days }: { days: IDay[] }) {
  const today = new Date().getDay();

  return (
    <div>
      <div className="week">
        <div className="carousel">
          {days?.length &&
            days?.map((day, i) => (
              <ShortDay
                key={i}
                isCurrent={i === today}
                day={day}
              />
            ))}
        </div>
      </div>
      <WeekGrid month={{ days }} />
    </div>
  );
}
