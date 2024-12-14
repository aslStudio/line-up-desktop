import Button from "@/components/common/button";
import Typography from "@/components/common/typography";
import React from "react";
import { BottomSheet } from "react-spring-bottom-sheet";

interface BlockUserProps {
  open: boolean;
  hide: () => void;
  onBlockClick: () => void;
  username: string;
}
const BlockUser: React.FC<BlockUserProps> = (props) => {
  const { open, hide, onBlockClick, username } = props;
  return (
    <BottomSheet
      onDismiss={hide}
      open={open}
      className='bg-[#1E1E1E] px-4 py-[22px]'
    >
      <div className='justfy-center flex flex-col items-center px-4 py-8'>
        <Typography className='mb-2 max-w-[241px] text-center text-[17px] font-semibold text-white-100'>
          Вы уверены, что хотите заблокировать {username}?
        </Typography>
        <Typography className='mb-8 max-w-[241px] text-center text-[13px]'>
          Он не сможет участвовать в ваших проектах, событиях, а также
          приглашать вас в свои
        </Typography>
        <Button
          className='mb-2 w-full !bg-[#FF3333] text-[17px] text-white-100'
          onClick={onBlockClick}
        >
          Заблокировать пользователя
        </Button>
        <Button
          className='w-full !bg-[#292929] text-white-100'
          onClick={hide}
        >
          Отмена
        </Button>
      </div>
    </BottomSheet>
  );
};

export default BlockUser;
