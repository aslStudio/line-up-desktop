import Typography from "@/components/common/typography";
import React from "react";
import { ReactComponent as CheckWhite } from "@/assets/icons/buttons/arrow.svg";

interface HeaderProps {
  current: string;
  open: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { current, open, title } = props;
  return (
    <div
      className='mb-3 flex justify-between px-4'
      id='header'
    >
      <Typography className='text-[20px] font-bold text-white-100'>
        {title}
      </Typography>
      <div
        className='flex cursor-pointer items-center gap-x-1.5'
        onClick={open}
      >
        <Typography className='fz-[16px] font-semibold text-white-100'>
          {current}
        </Typography>
        <CheckWhite
          className='brightness-200 dark:brightness-0'
          width='10'
          height='5'
        />
      </div>
    </div>
  );
};

export default Header;
