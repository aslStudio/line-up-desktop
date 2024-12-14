import Typography from "@/components/common/typography";
import React from "react";

interface EventTypeProps {
  onEventClick: (arg0: "public" | "private") => void;
}

const EventType: React.FC<EventTypeProps> = (props) => {
  const { onEventClick } = props;
  return (
    <main className='event'>
      <Typography className='mb-[20px] text-[16px] text-accent-100 dark:text-accent-900'>
        Выберите тип события
      </Typography>
      <div className='split'></div>
      <div
        className='flex cursor-pointer flex-col gap-y-2 py-4'
        onClick={() => onEventClick("public")}
      >
        <Typography className='text-[20px] text-white-100'>
          Общее событие
        </Typography>
        <Typography>
          В это событие вы сможете приглашать участников и принимать их заявки.
          Сбор заявок можно приостанавливать
        </Typography>
      </div>
      <div className='split'></div>
      <div
        className='flex cursor-pointer flex-col gap-y-2 py-4'
        onClick={() => onEventClick("private")}
      >
        <Typography className='text-[20px] text-white-100'>
          Личное событие
        </Typography>
        <Typography>В этом событии можете быть только вы</Typography>
      </div>
      <div className='split'></div>
    </main>
  );
};

export default EventType;
