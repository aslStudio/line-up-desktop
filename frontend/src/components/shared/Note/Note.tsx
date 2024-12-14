import React, { Children, ReactNode, useState } from "react";
import Typography from "@/components/common/typography";

interface NoteProps {
  children: ReactNode;
}
const Note: React.FC<NoteProps> = (props) => {
  const { children } = props;

  return (
    <div className="p-4 w-full rounded-[16px] h-fit dark:bg-gray-700 dark:border-[#FFFFFF0D] border-[1px]">
      <div className="w-full flex justify-between">
        <Typography className="!dark:text-gray-300 text-[15px]">Ваша заметка</Typography>
        <Typography className="!text-accent-100 text-[13px]">Изменить</Typography>
      </div>

      <Typography className="mt-3 text-[15px] dark:text-white-100">{children}</Typography>
    </div>
  );
};

export default Note;
