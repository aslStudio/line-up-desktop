import Button from "@/components/common/button";
import Typography from "@/components/common/typography";
import { logout } from "@/store/authSlice";
import React from "react";
import { useDispatch } from "react-redux";
import { BottomSheet } from "react-spring-bottom-sheet";

interface LogoutProps {
  open: boolean;
  hide: () => void;
}
const Logout: React.FC<LogoutProps> = (props) => {
  const { open, hide } = props;

  const dispatch = useDispatch();

  const onLogoutClick = () => {
    dispatch(logout());
  };

  return (
    <BottomSheet
      open={open}
      onDismiss={hide}
      className='bg-[#1E1E1E] px-4 py-[22px]'
    >
      <div className='justfy-center flex flex-col items-center px-4 py-8'>
        <Typography className='mb-8 max-w-[241px] text-center text-[17px] font-semibold text-white-100'>
          Вы уверены, что хотите выйти из аккаунта?
        </Typography>

        <Button
          className='mb-2 w-full !bg-[#FF3333] text-[17px] text-white-100'
          onClick={onLogoutClick}
        >
          Выйти
        </Button>
        <Button
          className='dark:!bg-gray-350 w-full !bg-[#292929] text-white-100 dark:text-black-100'
          onClick={hide}
        >
          Отмена
        </Button>
      </div>
    </BottomSheet>
  );
};

export default Logout;
