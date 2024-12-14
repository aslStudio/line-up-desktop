import React, { useState } from "react";
import Typography from "@/components/common/typography";
import Toggle from "@/components/common/toggle";
import Participant from "../Participant/Participant";
import { Profile } from "@/types";

interface ParticipantsProps {
  toggleWindow: (
    key:
      | "isAddMembers"
      | "isAddEventType"
      | "isAddAddress"
      | "isAddProject"
      | "isAddSubgroup"
      | "isAddOrganizers"
      | "isPersonalRemind"
      | "isAddRepeat",
    arg1: boolean,
  ) => void;
  removeMember: (arg0: number) => void;
  participants: Profile[];
}

const Participants: React.FC<ParticipantsProps> = (props) => {
  const { toggleWindow, participants, removeMember } = props;

  return (
    <div className='block flex flex-col'>
      <Typography className='mt-4 pb-2 text-[20px] font-bold'>
        Участники
      </Typography>
      <Typography className='mb-4 text-[15px] dark:text-gray-400'>
        Вы можете управлять заявками и участниками в режиме редактирования
      </Typography>

      <div className=''>
        {participants?.map((item, index) => (
          <Participant
            removeMember={removeMember}
            profile={item}
            index={index}
            key={index}
          />
        ))}
      </div>
      <div
        className='flex py-[14px]'
        onClick={() => toggleWindow("isAddMembers", true)}
      >
        <Typography className='text-[20px] text-accent-100 dark:text-accent-900'>
          +
        </Typography>
        <Typography className='my-auto ml-[10px] text-[15px] text-accent-100 dark:text-accent-900'>
          Добавить из контактов
        </Typography>
      </div>
    </div>
  );
};

export default Participants;
