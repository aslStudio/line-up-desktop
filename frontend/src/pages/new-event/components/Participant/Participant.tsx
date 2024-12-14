import Typography from "@/components/common/typography";
import React from "react";
import RemoveButton from "../../ui/RemoveButton";
import { Profile } from "@/types";

interface ParticipantProps {
  removeMember: (arg0: number) => void;
  profile: Profile;
  index: number;
}
const Participant: React.FC<ParticipantProps> = (props) => {
  const { removeMember, profile, index } = props;
  const { user } = profile;
  return (
    <div className='flex items-center'>
      <div className='mr-3 min-h-[52px] min-w-[52px] rounded-full bg-gray-600'></div>
      <div className='flex w-full items-center py-5'>
        <Typography className='text-[17px] text-white-100'>
          {user?.username}
        </Typography>
        <div className='ml-auto flex gap-x-7'>
          <RemoveButton onClick={() => removeMember(index)} />
        </div>
      </div>
    </div>
  );
};

export default Participant;
