import PlanCard from "@/components/calendar/components/plan-card";
import Button from "@/components/common/button";
import Typography from "@/components/common/typography";
import { IDay } from "@/types/calendar";
import { useGetEventsWithFiltersQuery } from "@/api/events";
import { createQueryParams, getDaysWithEvents } from "@/utils";
import { useState, useEffect } from "react";
import { addDays, format } from "date-fns";
import "./index.css";

const startDate = new Date();
const endDate = addDays(new Date(), 1);
export default function CrossEvents() {
  const [days, setDays] = useState<IDay[]>([]);
  const { data: events } = useGetEventsWithFiltersQuery(createQueryParams({ start_date: format(startDate, "yyyy-MM-dd"), end_date: format(endDate, "yyyy-MM-dd") }));

  useEffect(() => {
    if (events) {
      const formattedDays = getDaysWithEvents(events!, startDate, endDate);
      setDays(formattedDays);
    }
  }, [events]);

  //     i + 1 === new Date().getDate()
  //       ? [
  //           {
  //             project: "BASTA SHOW",
  //             place: "Бар 777",
  //             title: "Поиск официантов",
  //             time: {
  //               from: "9:00",
  //               till: "18:00",
  //             },
  //             status: PlanStatus.Applications,
  //             isOwl: false,
  //             isClosed: false,
  //             color: "#33FFAA",
  //             guests: [{ name: "NikFive" }, { name: "NikFive" }, { name: "NikFive" }],
  //             price: 2000,
  //           },
  //           {
  //             project: "Операторы",
  //             title: "Персонал на корпаратив крупной компании",
  //             time: {
  //               from: "18:00",
  //               till: "23:00",
  //             },
  //             status: PlanStatus.Pending,
  //             isOwl: false,
  //             isClosed: true,
  //             color: "#FF6D33",
  //             guests: [{ name: "NikFive" }, { name: "NikFive" }, { name: "NikFive" }],
  //           },
  //           {
  //             project: "Мафия с коллегами",
  //             title: "Basta show сьемки",
  //             time: {
  //               from: "23:00",
  //               till: "3:00",
  //             },
  //             status: PlanStatus.Private,
  //             isOwl: true,
  //             isClosed: false,
  //             color: "#33B6FF",
  //           },
  //         ]
  //       : [],
  // }));

  return (
    <main className="cross-events">
      <Typography className="dark:text-white-100 text-[20px] font-bold">События, которые находятся рядом или пересекаются</Typography>
      <Typography className="mt-3 dark:text-gray-400 text-[15px]">Выключить эту функцию можете в профиле</Typography>
      <Button className="button approve">Подтвердить участие</Button>
      {days
        .filter((day) => day.plans.length > 0)
        .map((day) => (
          <div className="flex flex-col pt-4">
            <div className="flex">
              <Typography className="mr-[6px] text-[16px] dark:text-white-100 font-medium">
                {day.date.getDate() === new Date().getDate() ? "Сегодня" : day.date.getDate() === new Date().getDate() - 1 ? "Завтра" : format(day.date, "d")}
              </Typography>
              <Typography className="capitalize mr-[6px] text-[16px] dark:text-[#FFFFFF5C] font-medium">{format(day.date, "EEEE")}</Typography>
              <div className="w-[24px] h-[24px] flex justify-center bg-accent-100 rounded-full">
                <Typography className="text-[16px] m-auto dark:text-black-100 font-medium ">{day.plans.length}</Typography>
              </div>
            </div>
            {day.plans.map((plan) => (
              <PlanCard
                short={true}
                plan={plan}
              />
            ))}
          </div>
        ))}
    </main>
  );
}
