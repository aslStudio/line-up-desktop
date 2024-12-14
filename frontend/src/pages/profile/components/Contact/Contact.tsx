import React from "react";
import { ReactComponent as ArrowRight } from "@/assets/icons/buttons/arrow.svg";
import { Profile } from "@/types";
import { useNavigate } from "react-router-dom";

interface ContactProps {
  onClick: (arg0: number) => void;
  contact: Profile;
}

const Contact: React.FC<ContactProps> = (props) => {
  const { contact } = props;
  const navigate = useNavigate();

  const navigateToUser = () => {
    navigate(`/user/${contact.id}`);
  };

  return (
    <div
      className='flex items-center py-1'
      onClick={navigateToUser}
    >
      <div className='flex w-full items-center'>
        <div className='min-h-[52px] min-w-[52px] rounded-full bg-gray-600'></div>
        <div className='flex w-full flex-col'>
          <div className='flex w-full items-center justify-between px-3 py-5'>
            <span className='text-[17px] text-white-100 dark:text-black-100'>
              {contact?.name}
            </span>
            <ArrowRight className='rotate-[-90deg]' />
          </div>
          <div className='split'></div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
