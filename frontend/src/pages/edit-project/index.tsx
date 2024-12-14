//@ts-nocheck
import React from "react";
import Input from "@/components/common/input";
import "./index.css";
import Note from "@/components/shared/Note/Note";
import Typography from "@/components/common/typography";
import Switch from "@/components/common/switch";
import Organizers from "@/components/shared/Organizers/Organizers";
import InviteLink from "@/components/shared/InviteLink/InviteLink";
import Button from "@/components/common/button";
import useEditProject from "./hooks/useEditProject";
import AddFromContacts from "@/components/shared/AddFromContacts/AddFromContacts";
import UserTab from "../event/components/user-tab";
import RemidFor from "@/components/shared/RemindFor/RemidFor";

const NewProject: React.FC = () => {
  const {
    project,
    onProjectValueChange,
    onAcceessSelect,
    selectOrganizers,
    selectMembers,
    toggles,
    toggleWindow,
    onLinkType,
    onParticipationSwitch,
  } = useEditProject();

  if (toggles.isAddOrganizers)
    return <AddFromContacts select={selectOrganizers} />;
  if (toggles.isAddMembers) return <AddFromContacts select={selectMembers} />;

  const getRadioClassname = (value: string) => {
    if (value != project.access) {
      return "flex items-center justify-center border-2 border-solid border-gray-500 rounded-full min-w-[22px] min-h-[22px]";
    }
    return "flex items-center justify-center border-2 bg-sky-600 border-solid border-sky-600 rounded-full min-w-[22px] min-h-[22px]";
  };

  return (
    <div className='new-project pb-[80px]'>
      <Input
        name='name'
        value={project.name}
        onChange={onProjectValueChange}
        className='line title -ml-2 mt-4'
        placeholder='Название'
      />
      <div className='relative'>
        <Input
          name='comment'
          value={project.comment}
          onChange={onProjectValueChange}
          className='line -ml-2 mt-3 !border-b-0 pr-6'
          inputClassname='!pr-[60px] '
          placeholder='Комментарий'
        />
        <span
          className={`absolute right-0 top-[23px] bg-gray-700 text-[14px] text-gray-400 ${(project.comment?.length ?? 0) >= 100 ? "text-red-600" : ""}`}
        >
          {project.comment?.length ?? 0}/100
        </span>
      </div>
      <Note>123</Note>
      <div className='block'>
        <div className='flex flex-col'>
          <div className='flex gap-x-4'>
            <div className='flex flex-col'>
              <Typography className='text-[17px] dark:text-white-100'>
                Подтверждение участия
              </Typography>
              <Typography className='text-[13px] dark:text-[#FFFFFF66]'>
                Будет приходить за определённой вами количество часов перед
                каждым событием
              </Typography>
            </div>
            <Switch
              className='my-0 my-auto self-start'
              onSwitch={onParticipationSwitch}
            />
          </div>
          {/* {project.participationСofirm ? <RemidFor /> : null} */}
        </div>
      </div>
      <Organizers
        organizers={project.organizers!}
        onClick={() => toggleWindow("isAddOrganizers", true)}
      />
      <div className='block flex flex-col'>
        <Typography className='mt-4 pb-2 text-[20px] font-bold dark:text-white-100'>
          Участники
        </Typography>
        <Typography className='mb-4 max-w-[316px] text-[15px] dark:text-gray-400'>
          Добавьте участников, чтобы они могли следить и откликаться на ваши
          события
        </Typography>
        <div className='flex flex-col'></div>
        <div
          className='flex py-[14px]'
          onClick={() => toggleWindow("isAddMembers", true)}
        >
          <Typography className='text-[20px] !text-accent-100'>+</Typography>
          <Typography className='my-auto ml-[10px] text-[15px] !text-accent-100'>
            Добавить из контактов
          </Typography>
        </div>
        <div className='flex flex-col'>
          {project.participants?.map((item, index) => (
            <UserTab
              name={item.info}
              key={index}
            />
          ))}
        </div>
      </div>
      <div className='mb-2 block flex flex-col'>
        <Typography className='mt-4 pb-2 text-[20px] font-bold dark:text-white-100'>
          Доступ
        </Typography>
        {project.access == "all" ? (
          <div className='flex flex-col'>
            <Typography className='text-[15px] dark:text-gray-400'>
              Участники будут видеть{" "}
            </Typography>
            <Typography className='text-[15px] dark:text-gray-400'>
              {" "}
              все события и всех участников
            </Typography>
          </div>
        ) : (
          <Typography className='text-[15px] dark:text-gray-400'>
            {" "}
            Участники будут видеть только свои события и только организаторов
            среди участников
          </Typography>
        )}
        <div className='flex flex-col'>
          <div
            className='flex items-center gap-x-5'
            onClick={() => onAcceessSelect("all")}
          >
            <div className={getRadioClassname("all")}></div>
            <Typography className='w-full border-b border-gray-600 py-5 text-[17px] text-white-100'>
              Для всех
            </Typography>
            <div className='split'></div>
          </div>
          <div
            className='flex items-center gap-x-5'
            onClick={() => onAcceessSelect("me")}
          >
            <div className={getRadioClassname("me")}></div>
            <Typography className='w-full border-b border-gray-600 py-5 text-[17px] text-white-100'>
              Только я
            </Typography>
            <div className='split'></div>
          </div>
        </div>
      </div>
      <InviteLink
        type={"public"}
        onClick={onLinkType}
      />
      <Button className='approve'>Сохранить</Button>
      <Button className='!bg-[#FF3030] text-white-100'>Удалить проект</Button>
    </div>
  );
};

export default NewProject;
