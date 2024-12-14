import React from "react";
import Typography from "@/components/common/typography";
import Input from "@/components/common/input";
import Toggle from "@/components/common/toggle";

const linkOptions = ["Общедоступная", "Ограниченная"];

interface InviteLinkProps {
  type: "public" | "limited";
  onClick: (arg0: "public" | "limited") => void;
}
const InviteLink: React.FC<InviteLinkProps> = (props) => {
  const { type, onClick } = props;
  return (
    <div className='block flex flex-col'>
      <Typography className='pb-2 text-[20px] font-bold'>
        Ссылка-приглашение
      </Typography>
      <Typography className='mb-4 text-[15px] dark:text-gray-400'>
        Пригласите тех, кого бы вы хотели видеть у себя на мероприятии
      </Typography>
      <Toggle
        variants={linkOptions}
        onChange={(index) =>
          onClick(linkOptions[index] == "Общедоступная" ? "public" : "limited")
        }
      />
      {type == "limited" ? (
        <div className='flex flex-col items-start'>
          <Typography className='mb-2 mt-4 text-[14px]'>
            Количество использований
          </Typography>
          <div className='flex items-center gap-x-2'>
            <Input
              className='w-[60px] !rounded-2xl border border-solid border-gray-500 bg-transparent'
              type='number'
              inputClassname='text-center'
              defaultValue={10}
              max={100}
            />
            <Typography>человек</Typography>
          </div>
        </div>
      ) : null}
      <div className='mt-4 flex w-full justify-between rounded-2xl bg-[#00FFA10D] px-4 py-[14.5px]'>
        <Typography className='cursor-pointer text-[15px] text-accent-100 dark:text-accent-900'>
          https://t.me/a_study
        </Typography>
      </div>
    </div>
  );
};

export default InviteLink;
