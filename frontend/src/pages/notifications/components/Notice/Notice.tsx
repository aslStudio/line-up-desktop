import React, { useState } from "react";
import {
  Notification,
  NotificationForExecutor,
  NotificationForOrganizer,
} from "@/types/index";
import Draggable from "react-draggable";
import { ReactComponent as ArchiveIcon } from "@/assets/icons/buttons/archive.svg";

interface NoticeProps {
  notification:
    | Notification
    | NotificationForExecutor
    | NotificationForOrganizer;
  toggleState: (arg0: number, arg1: "read" | "archive") => void;

  onAccept?: () => void;
  onReject?: () => void;
}

const Notice: React.FC<NoticeProps> = ({
  notification,
  onAccept,
  onReject,
  toggleState,
}) => {
  const {
    id,
    type_notification,
    message,
    recipient_type,
    is_read,
    for_executor,
    for_organizer,
    sender,
    createdAt,
    is_archived,
  } = notification as Notification;
  const status = for_executor?.status || for_organizer?.status;
  const isApplication =
    type_notification === "invitation" && status?.status === "consideration";
  const applicationStatus = status?.status ?? null;
  const isOrganizerToParticipant = status?.is_organizer_to_participant ?? false;

  const [isDragging, setIsDragging] = useState(false);

  const getEventOrProjectDetails = () => {
    if (status?.specific_event) {
      const event = status.specific_event;
      return `${event.start_date} - ${event.end_date} (${event.payment} ₽)`;
    }
    if (status?.project) {
      const project = status.project;
      return project.name;
    }
    return "";
  };

  const timeAgo = "10 min ago";

  const renderNotificationMessage = () => {
    const eventOrProjectDetails = getEventOrProjectDetails();

    switch (type_notification) {
      case "new contact":
        return `${sender?.name} создал новое открытое событие ${eventOrProjectDetails}`;
      case "invitation":
        if (isApplication) {
          return isOrganizerToParticipant
            ? `${sender?.name} пригласил вас в событие ${eventOrProjectDetails}`
            : `${sender?.name} хочет присоединиться к вашему событию ${eventOrProjectDetails}`;
        }
        return `${sender?.name} приглашает вас на событие ${eventOrProjectDetails}`;
      case "cancellation":
        return `${sender?.name} отменил ваше участие в событии ${eventOrProjectDetails}`;
      case "system":
        return `${message}`;
      case "reminder":
        return `${eventOrProjectDetails} начнется уже через час`;
      default:
        return message;
    }
  };

  const handleStopDrag = () => {
    setIsDragging(false); // Reset the dragging state
    toggleState(id, "archive");
  };

  const handleStartDrag = () => {
    setIsDragging(true); // Mark that dragging has started
  };

  const handleRead = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!isDragging) {
      // Only trigger onClick if not dragging
      toggleState(id, "read");
    }
  };

  return (
    <div className='relative rounded-2xl border-none bg-accent-500 dark:bg-[#F0FAF6]'>
      <Draggable
        bounds={{ top: 0, left: -100, right: 0, bottom: 0 }}
        onStop={handleStopDrag}
        onStart={handleStartDrag} // Track drag start
      >
        <div
          className={`relative z-[2] flex flex-col rounded-2xl bg-gray-600 dark:bg-gray-300 ${is_read ? "opacity-70" : ""}`}
          onClick={handleRead}
        >
          <div className='flex flex-col px-5 py-4'>
            <div className='flex items-start gap-x-4'>
              <img
                width={40}
                height={40}
                className='max-h-[40px] min-h-[40px] min-w-[40px] max-w-[40px] rounded-full'
                src='https://via.placeholder.com/40'
                alt='Avatar'
              />
              <div className='flex flex-col'>
                <span className='mb-2 text-[15px] font-semibold text-white-100 dark:text-black-100'>
                  {renderNotificationMessage()}
                </span>
              </div>
            </div>
          </div>
          {isApplication && (
            <div className='flex border-t border-solid border-[#323232] dark:border-gray-400'>
              <button
                className='flex w-full items-center justify-center border-r border-solid border-[#323232] py-[14px] text-[15px] font-medium text-accent-100 dark:border-gray-400 dark:text-accent-900'
                onClick={onAccept}
              >
                Принять
              </button>
              <button
                className='flex w-full items-center justify-center py-[14px] text-[15px] font-medium text-gray-300 dark:text-gray-400'
                onClick={onReject}
              >
                Отклонить
              </button>
            </div>
          )}

          {status?.status === "confirmed" && (
            <div className='flex border-t border-solid border-[#323232]'>
              <button className='flex w-full items-center justify-center py-[14px] text-[15px] font-medium text-accent-100'>
                Подтвердить участие
              </button>
            </div>
          )}
        </div>
      </Draggable>
      <div className='absolute bottom-[0] right-[20px] top-[0] z-[1] my-auto flex flex-col items-center justify-center'>
        <ArchiveIcon
          className='fill-accent-500 stroke-accent-100 dark:fill-[#F0FAF6] dark:stroke-accent-900'
          width={20}
          height={20}
        />
        <span className='text-[15px] font-semibold text-accent-100 dark:text-accent-900'>
          {is_archived ? "Вернуть" : "В Архив"}
        </span>
      </div>
    </div>
  );
};

export default Notice;
