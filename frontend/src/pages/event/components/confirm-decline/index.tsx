import Button from "@/components/common/button";
import Typography from "@/components/common/typography";
import { BottomSheet } from "react-spring-bottom-sheet";

interface IDeclineProps {
  hidden: boolean;
  close: () => void;
  decline: () => void;
}

export default function ConfirmDecline({
  hidden,
  close,
  decline,
}: IDeclineProps) {
  return (
    <BottomSheet
      open={hidden}
      header
      className='bg-[#1E1E1E]'
      onDismiss={close}
    >
      <div className='flex w-full flex-col px-4 py-2'>
        <Typography className='m-auto px-10 py-8 text-center text-[17px] font-semibold dark:text-white-100'>
          Вы уверены, что хотите отменить заявку?
        </Typography>
        <Button
          onClick={decline}
          className='mb-2 mt-4 !bg-[#FF3333] text-[17px] font-medium dark:text-[#2B2D35]'
        >
          Да
        </Button>
        <Button
          onClick={close}
          className='text-white-100'
        >
          Назад
        </Button>
      </div>
    </BottomSheet>
  );
}
