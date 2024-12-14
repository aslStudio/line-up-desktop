import Typography from "@/components/common/typography";
import "./index.css";

import { addDays, format } from "date-fns";
import PlanCard from "../plan-card";
import Canvas from "@/components/common/canvas";
import { useNavigate } from "react-router-dom";
import { useGetEventsWithFiltersQuery } from "@/api/events";
import { newDate } from "react-datepicker/dist/date_utils";
import { useEffect, useState } from "react";
import { IDay } from "@/types/calendar";
import { createQueryParams, getDaysWithEvents } from "@/utils";
import { BottomSheet } from "react-spring-bottom-sheet";

const startDate = new Date();
const endDate = addDays(new Date(), 1);

export default function CanvasCalendar() {
  const nav = useNavigate();
  const [days, setDays] = useState<IDay[]>([]);
  const { data: events } = useGetEventsWithFiltersQuery(createQueryParams({ start_date: format(startDate, "yyyy-MM-dd"), end_date: format(endDate, "yyyy-MM-dd") }));

  useEffect(() => {
    if (events) {
      const formattedDays = getDaysWithEvents(events!, startDate, endDate);
      setDays(formattedDays);
    }
  }, [events]);

  function addNewEvent() {
    nav("/new-event");
  }

  if (!days?.filter((day) => day.plans.length > 0).length) {
    return null;
  }

  return (
    <BottomSheet
      expandOnContentDrag={true}
      blocking={false}
      snapPoints={({ maxHeight }) => [(maxHeight * 2) / 10, (maxHeight * 8.55) / 10]}
      open={true}
      className="canvas-calendar">
      <div className="flex flex-col p-4">
        <div className="header">
          <div className="flex flex-col">
            <Typography className="mt-[10px] dark:text-gray-400 text-[17px] font-semibold">След. событие через</Typography>
            <Typography className="dark:text-white-100 text-[17px] font-semibold">44 мин → 9:00</Typography>
          </div>
          <div
            className="my-auto flex w-[44px] h-[44px] dark:bg-accent-500 rounded-full"
            onClick={addNewEvent}>
            <Typography className="plus">+</Typography>
          </div>
        </div>
        {days.length &&
          days
            ?.filter((day) => day.plans.length > 0)
            ?.map((day, index) => (
              <div
                className="flex flex-col pt-4"
                key={index}>
                <div className="flex">
                  <Typography className="mr-[6px] text-[16px] dark:text-white-100 font-medium">{day.date.getDate() === new Date().getDate() ? "Сегодня" : "Завтра"}</Typography>
                  <Typography className="capitalize mr-[6px] text-[16px] dark:text-[#FFFFFF5C] font-medium">{format(day.date, "EEEE")}</Typography>
                  <div className="w-[24px] h-[24px] flex justify-center bg-accent-100 rounded-full">
                    <Typography className="text-[16px] m-auto dark:text-black-100 font-medium ">{day.plans.length}</Typography>
                  </div>
                </div>
                {day?.plans?.map((plan, index) => (
                  <PlanCard
                    plan={plan}
                    key={index}
                  />
                ))}
              </div>
            ))}
      </div>
    </BottomSheet>
  );
}
