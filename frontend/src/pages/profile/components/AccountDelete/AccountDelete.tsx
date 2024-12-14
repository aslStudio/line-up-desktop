import Button from "@/components/common/button";
import Typography from "@/components/common/typography";
import React from "react";
import { BottomSheet } from "react-spring-bottom-sheet";

interface AccountDeleteProps {
  open: boolean;
  hide: () => void;
}
const AccountDelete: React.FC<AccountDeleteProps> = (props) => {
  const { open, hide } = props;
  return (
    <BottomSheet
      onDismiss={hide}
      open={open}
      className='bg-[#1E1E1E] px-4 py-[22px]'
    >
      <div className='justfy-center flex flex-col items-center px-4 py-8'>
        <Typography className='mb-2 max-w-[241px] text-center text-[17px] font-semibold text-white-100'>
          Вы уверены, что хотите удалить аккаунт?
        </Typography>
        <Typography className='mb-8 max-w-[241px] text-center text-[13px] dark:text-gray-400'>
          Все данные связанные с аккаунтом будут безвозвратно утеряны
        </Typography>
        <Button
          className='mb-2 w-full !bg-[#FF3333] text-[17px] text-white-100'
          onClick={hide}
        >
          Удалить аккаунт
        </Button>
        <Button
          className='dark:!bg-gray-350 w-full !bg-[#292929] text-white-100 dark:!text-black-100'
          onClick={hide}
        >
          Отмена
        </Button>
      </div>
    </BottomSheet>
  );
};

export default AccountDelete;
