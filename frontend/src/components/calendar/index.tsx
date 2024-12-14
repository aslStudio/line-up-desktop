import { format } from "date-fns";
import Typography from "../common/typography";
import { twMerge } from "tailwind-merge";
import Toggle from "../common/toggle";
import React, { useState } from "react";
import Week from "./components/week";
import Month from "./components/month";
import CanvasCalendar from "./components/canvas";
import { IDay } from "@/types/calendar";

interface CalendarProps {
  className?: string;
  days: IDay[];
}

const Calendar: React.FC<CalendarProps> = (props) => {
  const { className, days } = props;
  const mergedClass = twMerge("flex flex-col w-full h-full", className);
  const tabs = [
    {
      title: "Неделя",
      component: Week,
    },
    {
      title: "Месяц",
      component: Month,
    },
  ];

  const [currentTab, setTab] = useState(tabs.at(0));
  function changeTab(index: number) {
    setTab(tabs.at(index));
  }

  return (
    <div className={mergedClass}>
      <div className='flex w-full justify-between py-2'>
        <Typography className='my-auto ml-2 text-[22px] font-bold capitalize text-white-100'>
          {format(new Date(), "LLLL")}
        </Typography>
        <Toggle
          onChange={changeTab}
          variants={tabs.map((tab) => tab.title)}
          className='my-auto w-[178px]'
        />
      </div>
      {currentTab ? <currentTab.component days={days} /> : <></>}
      <CanvasCalendar />
    </div>
  );
};
export default Calendar;
