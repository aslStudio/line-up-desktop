import { IMonth } from "@/types/calendar";
import "./index.css";
import Typography from "@/components/common/typography";
import { format } from "date-fns";
import Plan from "../plan";
import { useNavigate } from "react-router-dom";

interface IWeekGridProps {
  month: IMonth;
}

export default function WeekGrid({ month }: IWeekGridProps) {
  const nav = useNavigate();

  function addNewEvent() {
    nav("/new-event");
  }

  return (
    <div className='week-grid'>
      <div className='flex w-fit'>
        {month.days.length &&
          month?.days?.map((day, index) => (
            <div
              className='column'
              key={index}
            >
              {/* label: */}
              <div
                className={`label ${day.date.getDate() === new Date().getDate() ? "bg-gray-600 dark:bg-gray-300" : ""}`}
              >
                <Typography className='my-auto ml-auto mr-2 text-[15px]'>
                  {format(day.date, "EEEEEE")}
                </Typography>
                <Typography className='my-auto mr-auto text-[15px] text-fontPrimary'>
                  {format(day.date, "d")}
                </Typography>
              </div>
              {/* plans: */}
              <div className='plan-column'>
                {day.plans.length ? (
                  day.plans.map((plan, index) => (
                    <Plan
                      plan={plan}
                      key={index}
                    />
                  ))
                ) : (
                  <div className='h-full w-full px-[7px] pb-1 pt-2'>
                    <div
                      className='new-block'
                      onClick={addNewEvent}
                    >
                      <Typography className='m-auto flex h-fit w-fit text-[13px] font-medium !text-accent-100'>
                        <div className='dark:text-accent-900 m-auto mr-2 text-[15px]'>
                          +
                        </div>
                        <div className='m-auto flex flex-col'>
                          <div className='dark:text-accent-900'>Создать</div>
                          <div className='dark:text-accent-900'>событие</div>
                        </div>
                      </Typography>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
