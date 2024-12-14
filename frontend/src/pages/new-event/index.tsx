//@ts-nocheck
import Typography from "@/components/common/typography";
import Input from "@/components/common/input";
import Switch from "@/components/common/switch";
import Button from "@/components/common/button";

import EventType from "./components/EventType/EventType";
import AddProject from "./components/AddProject/AddProject";
import AddSubgroup from "./components/AddSubgroup/AddSubgroup";
import AddAddress from "./components/AddAddress/AddAddress";
import AddStartDate from "./components/AddStartDate/AddStartDate";

import useNewEvent from "./hooks/useNewEvent";
import RemoveButton from "./ui/RemoveButton";
import AddRepeat from "./components/AddRepeat/AddRepeat";
import InputDuration from "./components/InputDuration/InputDuration";
import Participants from "./components/Participants/Participants";

import DeleteEvent from "./components/DeleteEvent/DeleteEvent";
import Organizers from "@/components/shared/Organizers/Organizers";
import InviteLink from "@/components/shared/InviteLink/InviteLink";
import AddFromContacts from "@/components/shared/AddFromContacts/AddFromContacts";
import { ReactComponent as ArrowIcon } from "@/assets/icons/buttons/arrow.svg";
import { ReactComponent as RubIcon } from "@/assets/icons/rub.svg";
import { format } from "date-fns";
import "./index.css";

export default function NewEvent() {
  const {
    closeAddAddress,
    selectProject,
    selectSubgroup,
    selectAddress,
    selectMembers,
    selectOrganizers,
    selectRepeat,
    toggleWindow,
    toggleDeleteEvent,
    toggles,
    onEventValueChange,
    onCreateEvent,
    onEventClick,
    onColorClick,
    onLinkType,
    removeProject,
    removeSubgroup,
    colors,
    errors,
    selectStartDate,
    removeMember,
    event,
  } = useNewEvent();

  if (toggles.isAddRepeat) return <AddRepeat onSelect={selectRepeat} />;
  if (toggles.isAddStartDate)
    return (
      <AddStartDate
        date={event.start_date}
        onSelect={selectStartDate}
      />
    );
  if (toggles.isAddOrganizers)
    return (
      <AddFromContacts
        select={selectOrganizers}
        selectedContacts={event.organizers}
      />
    );
  if (toggles.isAddMembers)
    return (
      <AddFromContacts
        select={selectMembers}
        selectedContacts={event.participants}
      />
    );
  if (toggles.isAddEventType) return <EventType onEventClick={onEventClick} />;
  if (toggles.isAddProject) return <AddProject onSelect={selectProject} />;
  if (toggles.isAddSubgroup) return <AddSubgroup onSelect={selectSubgroup} />;
  if (toggles.isAddAddress)
    return (
      <AddAddress
        close={closeAddAddress}
        selectAddress={selectAddress}
      />
    );

  return (
    <main className='new-event'>
      <div className='image'>
        <Typography className='m-auto text-center text-[17px] text-accent-100 dark:text-accent-900'>
          <div className='m-auto text-[24px]'>+</div>
          Добавить фотографию
        </Typography>
      </div>

      <Input
        name='name'
        value={event.name}
        onChange={onEventValueChange}
        className='line title -ml-2 mt-4'
        placeholder='Название'
      />
      {errors.title && (
        <Typography className='mt-1 !text-red-600'>
          Укажите название события
        </Typography>
      )}
      <div className='relative'>
        <Input
          name='description'
          value={event.description}
          inputClassname='!pr-[60px]'
          onChange={onEventValueChange}
          className='line -ml-2 mt-3'
          placeholder='Описание'
        />
        <span
          className={`absolute right-0 top-[23px] bg-gray-700 text-[14px] text-gray-400 dark:bg-white-100 ${event.description!.length >= 300 ? "text-red-600" : ""}`}
        >
          {event.description!.length}/300
        </span>
      </div>
      {errors.description && (
        <Typography className='mt-1 !text-red-600'>
          Укажите описание события
        </Typography>
      )}
      <div className='relative'>
        <Input
          name='comment'
          value={event.comment}
          onChange={onEventValueChange}
          className='line -ml-2 mt-3 pr-6'
          inputClassname='!pr-[60px]'
          placeholder='Комментарий'
        />

        <span
          className={`absolute right-0 top-[23px] bg-gray-700 text-[14px] text-gray-400 dark:bg-white-100 ${event.comment!.length >= 100 ? "text-red-600" : ""}`}
        >
          {event.comment!.length}/100
        </span>
      </div>
      {!event.is_open ? (
        <div className='block'>
          <div className='flex flex-col'>
            <Typography className='text-[17px]'>Закрытое событие</Typography>
            <Typography className='text-[13px] dark:text-[#FFFFFF66]'>
              На событие будет нельзя подать заявку
            </Typography>
          </div>
          <Switch className='my-auto' />
        </div>
      ) : null}
      <div className='block'>
        <div className='flex flex-col'>
          <Typography className='text-[17px]'>Личное напоминание</Typography>
          <Typography className='text-[13px] dark:text-[#FFFFFF66]'>
            Будут приходить только вам
          </Typography>
        </div>
        <Switch className='my-auto' />
      </div>
      <div className='color-pick block'>
        <div className='flex w-fit items-center'>
          {colors?.map((color, index) => (
            <div
              key={index}
              className={`color ${color.id == event.color.id ? "" : "max-h-[30px] max-w-[30px] opacity-50"}`}
              onClick={() => onColorClick(color)}
              style={{ background: color.name }}
            />
          ))}
        </div>
      </div>

      <Typography className='mt-4 text-[20px] font-bold'>
        Место и время
      </Typography>
      <div
        className='flex justify-between'
        onClick={() => toggleWindow("isAddAddress", true)}
      >
        <div className='flex flex-col'>
          <Typography className='mt-2 text-[17px]'>
            {!event.address ? "Укажите место здесь" : event.address}
          </Typography>
          <Typography className='text-[15px] dark:text-gray-400'>
            {!event.address ? "Местоположение" : "Новосибирск"}
          </Typography>
        </div>
        <ArrowIcon className='my-auto h-[22px] rotate-[-100grad] fill-gray-500' />
      </div>
      <div className='mt-2 flex flex-col rounded-2xl bg-gray-700 px-4 py-2 dark:bg-white-100'>
        <div className='flex justify-between'>
          <Typography className='my-auto size-[17px]'>Начало</Typography>
          <div
            className='flex cursor-pointer'
            onClick={() => toggleWindow("isAddStartDate", true)}
          >
            <Typography className='mr-[6px] rounded-[6px] bg-gray-600 px-[10px] py-[6px] dark:bg-gray-300'>
              {format(event.start_date, "EEEEEE, d MMM")}
            </Typography>
            <Typography className='rounded-[6px] bg-gray-600 px-[10px] py-[6px] dark:bg-gray-300'>
              {format(event.start_date, "HH:mm")}
            </Typography>
          </div>
        </div>
        <div className='my-[5px] flex justify-between'>
          <Typography className='! my-auto size-[17px]'>
            Длительность
          </Typography>
          <InputDuration />
        </div>
      </div>
      <div
        className='mt-3 flex justify-between rounded-2xl bg-gray-700 p-4 dark:bg-white-100'
        onClick={() => toggleWindow("isAddRepeat", true)}
      >
        <div className='flex flex-col'>
          <Typography className='text-[17px]'>Повторение</Typography>
          <Typography className='! mt-2 rounded-[6px] bg-gray-600 px-[10px] py-[6px] dark:bg-gray-300'>{`${event.is_reminder ? "Еженедельно в ср, чт, пт" : "Без повторений"}`}</Typography>
        </div>
        <ArrowIcon className='my-auto h-[22px] rotate-[-100grad] fill-gray-500' />
      </div>
      <div className='block'>
        <div className='flex flex-col'>
          <Typography className='text-[17px]'>Режим “Сова”</Typography>
          <Typography className='text-[13px] dark:text-[#FFFFFF66]'>
            События в интервале 00:00-10:00 не будут переносится на следующий
            день
          </Typography>
        </div>
        <Switch className='mb-auto' />
      </div>
      <div className='block flex flex-col'>
        <Typography className='pb-2 text-[20px] font-bold'>Оплата</Typography>
        <Input
          name='payment'
          onChange={onEventValueChange}
          value={event.payment}
          className='!text-[20px]'
          inputClassname='dark:bg-white-100 bg-gray-700'
          placeholder='0'
          type='number'
          iconStyle='dark:fill-black-100'
          postIcon={RubIcon}
        />
      </div>

      <Organizers
        organizers={event.organizers!}
        onClick={() => toggleWindow("isAddOrganizers", true)}
      />
      <div className='block flex flex-col'>
        <Typography className='mt-4 pb-2 text-[20px] font-bold'>
          Проект
        </Typography>
        {errors.project && (
          <Typography className='!text-red-600'>
            Укажите проект, либо создайте личное событие
          </Typography>
        )}
        {event.project ? (
          <div className='flex cursor-pointer items-center justify-between'>
            <Typography className='text-[17px] text-white-100'>
              {event?.project?.name}
            </Typography>
            <RemoveButton onClick={removeProject} />
          </div>
        ) : (
          <div
            className='flex py-[14px]'
            onClick={() => toggleWindow("isAddProject", true)}
          >
            <Typography className='text-[20px] text-accent-100 dark:text-accent-900'>
              +
            </Typography>
            <Typography className='my-auto ml-[10px] text-[15px] text-accent-100 dark:text-accent-900'>
              Добавить
            </Typography>
          </div>
        )}
        <Typography className='mt-2 text-[14px] dark:text-gray-500'>
          Последние проекты
        </Typography>
      </div>
      <div className='block flex flex-col'>
        <Typography className='mt-4 pb-2 text-[20px] font-bold'>
          Подгруппа
        </Typography>
        {event.subgroups?.length ? (
          <>
            {event.subgroups.map((item) => (
              <div className='flex cursor-pointer items-center justify-between'>
                <Typography className='text-[17px] text-white-100'>
                  {item.name}
                </Typography>
                <RemoveButton onClick={removeSubgroup} />
              </div>
            ))}
          </>
        ) : (
          <div
            className='flex py-[14px]'
            onClick={() => toggleWindow("isAddSubgroup", true)}
          >
            <Typography className='text-[20px] text-accent-100 dark:text-accent-900'>
              +
            </Typography>
            <Typography className='my-auto ml-[10px] text-[15px] text-accent-100 dark:text-accent-900'>
              Добавить
            </Typography>
          </div>
        )}
      </div>
      <Participants
        removeMember={removeMember}
        toggleWindow={toggleWindow}
        participants={event.participants!}
      />
      <InviteLink
        type={"public"}
        onClick={onLinkType}
      />
      <Button
        className='button approve dark:!bg-accent-900 dark:!text-accent-100'
        onClick={onCreateEvent}
      >
        Сохранить
      </Button>
      <Button
        className='button decline'
        onClick={toggleDeleteEvent}
      >
        Удалить событие
      </Button>
      <DeleteEvent
        hidden={toggles.isDeleteCanvas}
        close={toggleDeleteEvent}
      />
    </main>
  );
}
