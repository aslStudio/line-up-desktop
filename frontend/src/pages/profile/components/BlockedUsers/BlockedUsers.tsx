import Typography from "@/components/common/typography";
import React from "react";

type BlockedUsersProps = {};

const BlockedUsers: React.FC<BlockedUsersProps> = (props) => {
  const blockedContacts = [
    { info: "Dr.Dre", photo: "", checked: false, id: 4 },
    { info: "Rick Rubin", photo: "", checked: false, id: 5 },
  ];

  return (
    <div className='px-4 py-6'>
      <Typography className='mb-6 text-[22px] font-semibold text-white-100'>
        Заблокированные контакты
      </Typography>
      {blockedContacts?.map((contact) => (
        <div
          className='flex items-center py-1'
          key={contact.id}
        >
          <div className='flex w-full items-center'>
            <div className='min-h-[52px] min-w-[52px] rounded-full bg-gray-600'></div>
            <div className='flex w-full flex-col border-b border-solid border-gray-600'>
              <div className='flex w-full items-center justify-between px-3 py-5'>
                <span className='text-[17px] text-white-100'>
                  {contact.info}
                </span>
                <div className='flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full bg-[#FF6D33]'>
                  <div className='h-[1px] w-[10px] rounded-full bg-black-100'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlockedUsers;
