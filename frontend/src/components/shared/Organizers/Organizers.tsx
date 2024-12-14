import React from "react";
import Typography from "@/components/common/typography";
import UserTab from "@/pages/event/components/user-tab";
import { Profile } from "@/types";

interface OrganizersProps {
  organizers: Profile[];
  onClick: () => void;
}
const Organizers: React.FC<OrganizersProps> = (props) => {
  const { organizers, onClick } = props;

  return (
    <div className='block flex flex-col'>
      <Typography className='mt-4 pb-2 text-[20px] font-bold'>
        Организаторы
      </Typography>
      <Typography className='mb-4 text-[15px] dark:text-gray-400'>
        Ответственные за мероприятие
      </Typography>
      <div className='flex flex-col'>
        {organizers?.map((item, index) => (
          <UserTab
            name={item?.user?.username}
            key={index}
          />
        ))}
      </div>
      <div
        className='flex py-[14px] pl-4'
        onClick={onClick}
      >
        <Typography className='text-[20px] text-accent-100 dark:text-accent-900'>
          +
        </Typography>
        <Typography className='my-auto ml-[10px] text-[15px] text-accent-100 dark:text-accent-900'>
          Добавить
        </Typography>
      </div>
    </div>
  );
};

export default Organizers;
