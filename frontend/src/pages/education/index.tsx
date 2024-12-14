import Typography from "@/components/common/typography";
import { ReactComponent as ImageIcon } from "@/assets/img/education/phone.svg";
import React, { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";

const Education = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(0);

  const onNextStepClick = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      navigate("/support");
    }
  };

  const onSkipClick = () => {
    navigate("/support");
  };

  const steps: {
    [key: number]: {
      title: string;
      subtitle: string;
      img: ReactNode | string;
    };
  } = {
    0: {
      title: "Следите за событиями в удобном календаре",
      subtitle:
        "Создавайте свои проекты, добавляйте расписания, участвуйте в событиях!",
      img: (
        <ImageIcon
          width='300'
          height='300'
          className='mt-auto'
        />
      ),
    },
    1: {
      title: "Создавайте проекты и добавляйте события",
      subtitle:
        "На вкладке проекты вы можете создать и настроить проект с событиями!",
      img: (
        <ImageIcon
          width='300'
          height='300'
          className='mt-auto'
        />
      ),
    },
    2: {
      title: "Приглашайте участников в проекты и события!",
      subtitle:
        "Чтобы добавить участников, отправьте приглашения в режиме редактирования ",
      img: (
        <ImageIcon
          width='300'
          height='300'
          className='mt-auto'
        />
      ),
    },
    3: {
      title: "Участвуйте в проектах сами, сохраняйте расписания!",
      subtitle:
        "Получайте приглашения в события и расписания и участвуйте в мероприятиях!",
      img: (
        <ImageIcon
          width='300'
          height='300'
          className='mt-auto'
        />
      ),
    },
  };

  return (
    <div className='flex min-h-screen flex-col pb-[70px]'>
      <div className='flex grow flex-col items-center px-9 pt-7'>
        <div className='flex'>
          <span className='text-[15px] text-white-100 dark:text-black-100'>
            {step + 1}
          </span>
          <span className='text-[15px] text-gray-400'>/4</span>
        </div>
        <Typography className='mb-2.5 text-center text-[20px] font-bold'>
          {steps[step].title}
        </Typography>
        <Typography className='mb-6 text-center text-[15px] font-bold !text-gray-400'>
          {steps[step].subtitle}
        </Typography>
        {steps[step].img}
        <div className='flex w-full flex-col'>
          <button
            className='dark:bg-accent-900 rounded-2xl bg-accent-100 py-4 text-[15px] text-black-100 dark:text-white-100'
            onClick={onNextStepClick}
          >
            Далее
          </button>
          <button
            className='rounded-2xl py-4 text-[15px] !text-gray-400 text-white-100'
            onClick={onSkipClick}
          >
            Пропустить
          </button>
        </div>
      </div>
    </div>
  );
};

export default Education;
