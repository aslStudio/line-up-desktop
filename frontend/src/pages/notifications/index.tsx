import Typography from "@/components/common/typography";
import { ReactComponent as ArchiveIcon } from "@/assets/icons/buttons/archive.svg";
import { ReactComponent as FitlerIcon } from "@/assets/icons/buttons/filter.svg";
import Toggle from "@/components/common/toggle";
import { useEffect, useMemo, useState } from "react";
import Settings from "./components/Settings/Settings";
import Filter from "./components/Filter/Filter";
import { BottomSheet } from "react-spring-bottom-sheet";
import Notice from "./components/Notice/Notice";
import Button from "@/components/common/button";
import {
  useGetFilteredNotificationsQuery,
  useUpdateNotificationByIdMutation,
} from "@/api/notifications";
import { Notification } from "@/types";
import { useGetMeQuery } from "@/api/auth";
import { toggleFilters } from "@/store/notifications";
import { useDispatch, useSelector } from "react-redux";
import { createQueryParams } from "@/utils";
import { da } from "date-fns/locale";

const variants = ["Все", "Расписание", "Проекты"];
const Notifications = () => {
  const dispatch = useDispatch();
  const [settings, setSettings] = useState(false);
  const [notices, setNotices] = useState([]);
  const [isArchive, setIsArchive] = useState(false);
  const [activeVariant, setActiveVariant] = useState(0);
  const [updateNotification] = useUpdateNotificationByIdMutation();
  const { data: me } = useGetMeQuery();

  //@ts-ignore
  const { opened, ...others } = useSelector((state) => state.notifications);

  //@ts-ignore
  const { data } = useGetFilteredNotificationsQuery(createQueryParams(others));

  const toggleArchive = () => setIsArchive((prev) => !prev);

  const openSettings = () => {
    setSettings(true);
  };

  const toggle = () => {
    dispatch(toggleFilters());
  };

  useEffect(() => {
    if (data) {
      setNotices(data);
    }
  }, [data]);

  const toggledNotices = useMemo(() => {
    if (!notices || !notices.length) return [];

    if (activeVariant === 2)
      return notices.filter((item) => item.for_organizer !== null);
    if (activeVariant === 1)
      return notices.filter((item) => item.for_executor !== null);
    return notices;
  }, [activeVariant, notices]);

  const toggleState = async (id: number, status: "read" | "archive") => {
    const updateData = {};
    const notice = notices.find((item) => item.id == id);

    if (status == "read") {
      updateData["is_read"] = !notice.is_read;
    }

    if (status == "archive") {
      updateData["is_archived"] = !notice.is_archived;
    }

    try {
      // await updateNotification({
      //   id,
      //   updateData,
      // });
      // setNotices((prev) =>
      //   prev.map((notice) =>
      //     notice.id != id
      //       ? notice
      //       : {
      //           ...notice,
      //           is_archived: status == "archive" ? !notice.is_archived : notice.is_archived,
      //           is_read: status == "read" ? !notice.is_read : notice.is_read,
      //         }
      //   )
      // );
    } catch (err) {}
  };

  if (settings) {
    return <Settings />;
  }

  return (
    <div className='p-4'>
      <Filter
        hidden={opened}
        hide={toggle}
      />

      <div className='mb-4 flex items-center'>
        <Typography className='mr-2.5 text-[20px] font-bold text-white-100'>
          Уведомения
        </Typography>
        <div onClick={openSettings}>
          <Typography className='dark:text-accent-900 cursor-pointer text-[15px] text-accent-100'>
            Настроить
          </Typography>
        </div>
        <div className='ml-auto flex gap-x-[6px]'>
          <div
            className={`flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-lg bg-gray-600 dark:bg-gray-300 ${isArchive ? "!bg-accent-100" : ""}`}
            onClick={toggleArchive}
          >
            <ArchiveIcon />
          </div>
          <div
            className='flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-lg bg-gray-600 dark:bg-gray-300'
            onClick={toggle}
          >
            <FitlerIcon />
          </div>
        </div>
      </div>
      {isArchive ? (
        <div className='mb-5 flex flex-col'>
          <div className='mb-4 flex flex-col items-center justify-center gap-y-1'>
            <Typography className='text-[17px] font-semibold text-white-100'>
              Архив
            </Typography>
            <Typography className='text-[13px] !text-gray-400'>
              Уведомления из архива автоматически очищаются каждые 30 дней
            </Typography>
          </div>
          <Button
            className='w-full !bg-accent-100'
            onClick={toggleArchive}
          >
            Очистить архив
          </Button>
        </div>
      ) : null}
      <Toggle
        className='mb-4'
        variants={variants}
        onChange={setActiveVariant}
      />
      <div>
        {!toggledNotices?.length ? (
          <div className='flex flex-col items-center gap-y-3 py-5'>
            <span className='text-[50px]'>🙈</span>
            <Typography className='text-[18px] font-medium text-white-100'>
              Пока уведомлений нет
            </Typography>
          </div>
        ) : (
          <div className='flex flex-col gap-y-4 pb-[80px]'>
            {toggledNotices
              ?.filter(
                (notice) =>
                  (notice as unknown as Notification).is_archived == isArchive,
              )
              ?.map((notice) => (
                <Notice
                  toggleState={toggleState}
                  key={notice.id}
                  notification={notice}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
