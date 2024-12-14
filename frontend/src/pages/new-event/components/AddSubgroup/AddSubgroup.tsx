import React, { useRef, useState } from "react";
import Typography from "@/components/common/typography";
import Button from "@/components/common/button";
import { Subgroup } from "@/types";
import {
  useGetSubgroupsQuery,
  useCreateSubgroupMutation,
} from "@/api/subgroups";
import { ReactComponent as ArrowRight } from "@/assets/icons/buttons/arrow.svg";

interface AddSubgroupProps {
  onSelect: (arg0: Subgroup) => void;
}
const AddSubgroup: React.FC<AddSubgroupProps> = (props) => {
  const { onSelect } = props;
  const [isEditing, setIsEditing] = useState(false);

  const { data: groups, refetch } = useGetSubgroupsQuery();
  const [createGroup] = useCreateSubgroupMutation();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onAddSubgroupClick = () => {
    setIsEditing(true);
  };

  const onGroupSave = async () => {
    const groupValue = inputRef.current!.value;
    await createGroup({ name: groupValue });
    await refetch();
    setIsEditing(false);
  };

  return (
    <div className='event min-h-screen'>
      {!isEditing ? (
        <>
          <div
            className='mb-6 flex items-center gap-x-4 p-4'
            onClick={onAddSubgroupClick}
          >
            <Typography className='text-[20px] !text-accent-100'>+</Typography>
            <Typography className='text-[15px] !text-accent-100'>
              Создать подгруппу
            </Typography>
          </div>
          <Typography className='mb-[6px]'>Последние подгруппы</Typography>
          <div className='flex flex-col'>
            {groups?.map((group) => (
              <div
                key={group.id}
                onClick={() => onSelect(group)}
              >
                <div className='flex cursor-pointer items-center justify-between py-[19px]'>
                  <Typography className='text-[17px] text-white-100'>
                    {group.name}
                  </Typography>
                  <ArrowRight className='rotate-[-90deg]' />
                </div>
                <div className='split'></div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className='flex h-full grow flex-col'>
          <input
            ref={inputRef}
            type='text'
            className='w-full appearance-none border-none bg-transparent text-[28px] text-white-100 outline-none'
            placeholder='Hазвание'
          />
          <Button
            className='approve !mt-auto w-full'
            onClick={onGroupSave}
          >
            Сохранить
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddSubgroup;
