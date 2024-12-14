import React from "react";
import Canvas from "@/components/common/canvas";
import Typography from "@/components/common/typography";
import Button from "@/components/common/button";
import { useNavigate } from "react-router-dom";
import { BottomSheet } from "react-spring-bottom-sheet";

interface ExitScheduleProps {
  onExit: () => void;
  hidden: boolean;
  close: () => void;
}
const ExitSchedule: React.FC<ExitScheduleProps> = (props) => {
  const { hidden, close, onExit } = props;

  return (
    <BottomSheet
      open={hidden}
      onDismiss={close}
    >
      <div className='flex w-full flex-col px-4 pb-8 pt-12 pt-2'>
        <Typography className='mx-auto mb-2 max-w-[240px] text-center text-[17px] font-semibold dark:text-white-100'>
          Вы уверены, что хотите удалить расписание?
        </Typography>
        <Typography className='mx-auto mb-8 max-w-[241px] text-center text-[13px]'>
          Вы автоматически покинете все текущие события расписания
        </Typography>
        <Button
          onClick={onExit}
          className='mb-2 mt-4 !bg-[#FF3333] text-[17px] font-medium text-white-100'
        >
          Да
        </Button>
        <Button
          className='!bg-[#353535] text-white-100'
          onClick={close}
        >
          Назад
        </Button>
      </div>
    </BottomSheet>
  );
};

export default ExitSchedule;
