import { useGetEventsWithFiltersQuery } from "@/api/events";
import { IDay } from "@/types/calendar";
import { createQueryParams, getDaysWithEvents } from "@/utils";
import { addMonths, format, eachDayOfInterval } from "date-fns";
import { useState, useEffect } from "react";
import { debounce } from "@/utils";

interface useCalendarProps {
  filters?: { [key: string]: string | string[] };
}
const useCalendar = (filters: useCalendarProps) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addMonths(new Date(), 2));
  const [days, setDays] = useState<IDay[]>([]);
  //@ts-ignore
  const { data: events } = useGetEventsWithFiltersQuery(createQueryParams({ ...filters, start_date: format(startDate, "yyyy-MM-dd"), end_date: format(endDate, "yyyy-MM-dd") }));
  console.log(events);

  useEffect(() => {
    const initialDays = eachDayOfInterval({ start: startDate, end: endDate }).map((date) => ({
      date,
      plans: [],
    }));
    setDays((prevDays) => mergeDays(prevDays, initialDays));
  }, [startDate, endDate]);

  useEffect(() => {
    if (events) {
      const updatedDays = getDaysWithEvents(events, startDate, endDate);

      setDays((prevDays) => mergeDays(prevDays, updatedDays));
    }
  }, [events, startDate, endDate]);

  const handleScroll = (e: any) => {
    const { scrollWidth, scrollLeft, clientWidth } = e.target;

    if (scrollWidth - scrollLeft <= clientWidth + 250) {
      const newStartDate = addMonths(startDate, 2);
      const newEndDate = addMonths(endDate, 2);
      setStartDate(newStartDate);
      setEndDate(newEndDate);

      const newDays = eachDayOfInterval({ start: newStartDate, end: newEndDate }).map((date) => ({
        date,
        plans: [],
      }));
      setDays((prevDays) => [...prevDays, ...newDays]);
    }
  };

  const debouncedHandleScroll = debounce(handleScroll, 100);

  useEffect(() => {
    const calendarContainer = document.querySelector(".week-grid");
    calendarContainer?.addEventListener("scroll", debouncedHandleScroll);

    return () => calendarContainer?.removeEventListener("scroll", debouncedHandleScroll);
  }, [debouncedHandleScroll]);

  const mergeDays = (prevDays: IDay[], newDays: IDay[]): IDay[] => {
    const daysMap = new Map(prevDays.map((day) => [format(day.date, "yyyy-MM-dd"), day]));
    newDays.forEach((day) => {
      const formattedDate = format(day.date, "yyyy-MM-dd");
      if (daysMap.has(formattedDate)) {
        daysMap.get(formattedDate)!.plans = day.plans;
      } else {
        daysMap.set(formattedDate, day);
      }
    });
    return Array.from(daysMap.values());
  };

  return { days };
};

export default useCalendar;
