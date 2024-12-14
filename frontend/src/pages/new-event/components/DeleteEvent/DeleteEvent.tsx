import React from "react";
import Canvas from "@/components/common/canvas";
import Typography from "@/components/common/typography";
import Button from "@/components/common/button";
import { useNavigate } from "react-router-dom";
import { BottomSheet } from "react-spring-bottom-sheet";

interface DeleteEventProps {
  hidden: boolean;
  close: () => void;
}
const DeleteEvent: React.FC<DeleteEventProps> = (props) => {
  const { hidden, close } = props;
  const navigate = useNavigate();
  const navigateToMain = () => {
    navigate("/");
  };
  return (
    <BottomSheet
      open={hidden}
      onDismiss={close}
    >
      <div className='flex w-full flex-col px-4 pb-8 pt-2'>
        <Typography className='mx-auto mb-8 max-w-[240px] text-center text-[17px] font-semibold dark:text-white-100'>
          Вы удаляете повторяемое событие
        </Typography>
        <Button
          onClick={navigateToMain}
          className='!bg-[#FF3333] text-[17px] font-medium text-white-100'
        >
          Удалить этот экземпляр
        </Button>
        <Button
          onClick={navigateToMain}
          className='mt-2 !bg-[#FF3333] text-[17px] font-medium text-white-100'
        >
          Удалить весь ряд событий
        </Button>
        <Button
          className='mt-2 !bg-[#353535] text-white-100'
          onClick={close}
        >
          Назад
        </Button>
      </div>
    </BottomSheet>
  );
};

export default DeleteEvent;
