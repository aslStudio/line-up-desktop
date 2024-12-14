import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ReactComponent as DisLikeIcon } from "@/assets/icons/buttons/dislike.svg";
import { ReactComponent as LikeIcon } from "@/assets/icons/buttons/like.svg";
import { ReactComponent as PlaceIcon } from "@/assets/icons/buttons/place.svg";
import Typography from "@/components/common/typography";
import UserTab from "./components/user-tab";
import Button from "@/components/common/button";
import ConfirmDecline from "./components/confirm-decline";
import Note from "@/components/shared/Note/Note";
import "./index.css";

export default function Event() {
  const [isLiked, setLike] = useState(false);
  const like = () => setLike(!isLiked);
  const [declineModal, setDecline] = useState(false);
  const [isApproved, setApprove] = useState(false);
  const [isConfirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();

  function clickButton() {
    if (isApproved) {
      setDecline(true);
    } else {
      setApprove(true);
      setTimeout(() => {
        if (!isApproved) {
          setConfirmed(true);
        }
      }, 3000);
    }
  }

  function decline() {
    setApprove(false);
    setDecline(false);
  }

  const onConfirmClick = () => {
    navigate("/cross-events");
  };

  return (
    <main className="event">
      <div className="w-full h-[343px] bg-gray-600 rounded-btn" />
      <div className="flex flex-col split">
        <div className="w-full flex justify-between mt-4">
          <div className="bg-accent-500 py-[2px] px-[6px] rounded-[4px] text-accent-100 text-[13px]">Открыто</div>
          <div
            className="ml-auto"
            onClick={like}>
            {isLiked ? <LikeIcon className="h-[24px] w-auto" /> : <DisLikeIcon className="h-[24px] w-auto" />}
          </div>
        </div>
        <Typography className="dark:text-white-100 my-2 text-[20px]">Персонал на корпаратив с Бастой</Typography>
        <Typography className="mb-4 !text-accent-100 text-[11px] font-semibold">BASTA SHOW · Бар 777</Typography>
      </div>
      <Note>123</Note>
      <Typography className="mt-4 font-semibold pb-[10px] text-[14px] dark:text-white-100">О событии</Typography>
      <Typography className="pb-4 split text-[15px] dark:text-white-100">
        Подача напитков: Разливайте напитки и следите, чтобы на столах всегда было достаточно воды, сока, и других напитков. Быстро реагируйте на запросы гостей, если нужно пополнить запасы или убрать
        пустые стаканы.
      </Typography>
      <Typography className="my-4 font-bold text-[20px] dark:text-white-100">Место и время</Typography>
      <div className="flex">
        <div className="box flex flex-col w-[40px] h-[40px]">
          <Typography className="text-[9px] w-full text-center dark:bg-gray-600 dark:text-white-100">Авг.</Typography>
          <Typography className="w-full text-center text-white-100 mb-2 text-[15px] dark:text-white-100 font-medium">6</Typography>
        </div>
        <div className="ml-[11px] flex flex-col">
          <Typography className="text-[15px] leading-[20px] dark:text-white-100 font-medium">Среда, 18 августа</Typography>
          <Typography className="text-[15px] leading-[20px] dark:text-gray-400">16:25 - 4:00, 11 часов 45 минут</Typography>
        </div>
      </div>
      <div className="flex split mt-2 pb-4">
        <div className="box flex flex-col w-[40px] h-[40px]">
          <PlaceIcon className="h-[19px] w-auto m-auto" />
        </div>
        <div className="ml-[11px] flex flex-col">
          <Typography className="text-[15px] leading-[20px] dark:text-white-100 font-medium">Красный проспект, 41</Typography>
          <Typography className="text-[15px] leading-[20px] dark:text-gray-400">Г. Новосибирск</Typography>
        </div>
      </div>
      <Typography className="mt-4 dark:text-white-100 font-bold font-[20px]">Оплата</Typography>
      <Typography className="pb-4 split dark:text-white-100 font-[20px]">3000 ₽</Typography>
      <Typography className="mt-4 dark:text-white-100 font-bold pb-2 font-[20px]">Организаторы</Typography>
      <Typography className="mb-4 dark:text-gray-400 font-[15px]">Ответственные за мероприятие</Typography>
      <div className="flex flex-col">
        <UserTab name="Oleg" />
        <UserTab name="Tima" />
      </div>
      <Typography className="mt-4 dark:text-white-100 font-bold pb-2 font-[20px]">Участники</Typography>
      <div className="flex flex-col">
        <UserTab name="Yeezy" />
        <UserTab name="Beyonce" />
      </div>
      {isConfirmed ? (
        <Button
          onClick={onConfirmClick}
          className={`button approve`}>
          Подтвердить участие
        </Button>
      ) : null}
      {!isConfirmed ? (
        <Button
          onClick={clickButton}
          className={`button ${isApproved ? "decline" : "approve"}`}>
          {isApproved ? "Отменить" : "Отправить"} заявку
        </Button>
      ) : (
        <Button
          onClick={clickButton}
          className={`button decline`}>
          Отказаться
        </Button>
      )}

      <ConfirmDecline
        hidden={declineModal}
        close={() => setDecline(false)}
        decline={decline}
      />
    </main>
  );
}
