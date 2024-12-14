import { statusTranslate } from "@/types/calendar";
import "./index.css";
import { IClassProps } from "@/types/component";
import { twMerge } from "tailwind-merge";
import Typography from "@/components/common/typography";
import { ReactComponent as LikeIcon } from "@/assets/icons/buttons/like.svg";
import { ReactComponent as DisLikeIcon } from "@/assets/icons/buttons/dislike.svg";
import { ReactComponent as LockIcon } from "@/assets/icons/lock.svg";
import { ReactComponent as OwlIcon } from "@/assets/icons/owl.svg";
import GuestsList from "../guest-list";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EventData } from "@/types";
import { format } from "date-fns";

interface IPlanCardProps extends IClassProps {
  plan: EventData;
  short?: Boolean;
}

export default function PlanCard({ plan, className, short }: IPlanCardProps) {
  const { payment, personal_note, participants, event, additional_detail } =
    plan as EventData;
  const { is_open, is_owl_mode, address, project, color, comment, name } =
    event;

  const navigate = useNavigate();
  const mergedClass = twMerge("plan-card shrink-0", className);
  const [isLiked, setLike] = useState(false);

  function like() {
    setLike((status) => !status);
  }

  const navigateToEvent = () => {
    navigate(`/event/${event.id}`);
  };

  const navigateToProject = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigate(`/project/${project.id}`);
  };

  return (
    <div
      className={mergedClass}
      onClick={navigateToEvent}
    >
      {short ? (
        <></>
      ) : (
        <div className={`header ${status}`}>
          <Typography className='m-auto flex text-[14px]'>
            {/* {statusTranslate[status]} */}
            {!is_open ? <LockIcon className='my-auto ml-1' /> : <></>}
          </Typography>
        </div>
      )}
      <div
        className='flex flex-col border-l-[2px] px-[20px] py-4'
        style={{ borderColor: color || "#FF6D33" }}
      >
        <div className='flex justify-between'>
          <Typography
            className='time flex'
            style={{ color: is_owl_mode ? "#F92E3B" : "" }}
          >
            {`${format(new Date(plan.start_date), "HH:mm")} - ${format(new Date(plan.end_date), "HH:mm")}`}
            {is_owl_mode ? (
              <OwlIcon className='my-auto ml-1 h-[16px] w-[16px]' />
            ) : (
              <></>
            )}
          </Typography>
          <div
            className='ml-auto'
            onClick={like}
          >
            {isLiked ? (
              <LikeIcon className='h-[24px] w-auto' />
            ) : (
              <DisLikeIcon className='h-[24px] w-auto' />
            )}
          </div>
        </div>
        <Typography
          className='mt-3 text-[14px] font-semibold'
          style={{ color: color || "#FF6D33" }}
        >
          {project?.name} {address ? "· " + address : ""}
        </Typography>
        <Typography className='mt-[5px] text-[16px] font-semibold dark:text-black-100'>
          {name}
        </Typography>
        {participants?.length ? (
          <GuestsList
            guests={additional_detail?.participants}
            guestCount={additional_detail.number_of_participants}
            className='mt-3 flex'
          />
        ) : (
          <></>
        )}
        {!short && payment ? (
          <>
            <Typography className='text-[13px] dark:text-gray-400'>
              Оплата
            </Typography>
            <Typography className='mt-1 text-[20px] font-semibold dark:text-black-100'>
              {payment} ₽
            </Typography>
          </>
        ) : (
          <></>
        )}
        {comment && (
          <>
            <Typography className='text-[13px] dark:text-gray-400'>
              Комментарий
            </Typography>
            <Typography className='mt-1 text-[15px] dark:text-black-100'>
              {comment}{" "}
            </Typography>
          </>
        )}

        {personal_note && (
          <>
            <Typography className='text-[13px] dark:text-gray-400'>
              Личная заметка
            </Typography>
            <Typography className='mt-1 text-[15px] dark:text-black-100'>
              {personal_note}{" "}
            </Typography>
          </>
        )}
      </div>
      {/* FOOTER */}
      {short ? (
        <></>
      ) : (
        <div className='footer'>
          <button
            className='button text-accent-100 dark:!border-r-2 dark:!border-gray-300 dark:text-accent-900'
            onClick={navigateToEvent}
          >
            Заметка
          </button>
          <button
            className='button text-gray-300 dark:text-[#BABABA]'
            onClick={navigateToProject}
          >
            К проекту
          </button>
        </div>
      )}
    </div>
  );
}
