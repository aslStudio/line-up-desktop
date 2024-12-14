import AuthTemplate from "../auth-template";
import Input from "@/components/common/input";
import Button from "@/components/common/button";
import React, { SetStateAction, useState } from "react";
import { ReactComponent as UserIcon } from "@/assets/icons/user.svg";

interface ContactDataProps {
  nickname: string;
  fio: string;
  setFio: React.Dispatch<SetStateAction<string>>;
  setNickname: React.Dispatch<SetStateAction<string>>;
  onNext: () => Promise<boolean>;
}

const СontactData: React.FC<ContactDataProps> = (props) => {
  const { nickname, setNickname, fio, setFio, onNext } = props;
  const [error, setError] = useState("");
  const [regError, setRegError] = useState("");

  const onFioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFio(e.target.value);
  };

  const onNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const onNextClick = async () => {
    if (!nickname) {
      setError("Чтобы завершить регистрацию, обязательно заполните это поле");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    const registrationResult = await onNext();

    if (!registrationResult) {
      setRegError("Произошла ошибка при регистрации, попробуйте еще раз!");
      setTimeout(() => {
        setRegError("");
      }, 3000);
    }
  };

  return (
    <AuthTemplate
      title='Данные для связи'
      subTitle='Будут отображаться в вашем профиле'
    >
      <div className='m-auto mt-5 flex w-fit rounded-full p-[33px] dark:bg-gray-700'>
        <UserIcon className='m-auto h-auto w-[63px]' />
      </div>
      <Input
        onChange={onNicknameChange}
        value={nickname}
        error={error || regError}
        placeholder='Никнейм'
        className='mt-6 border'
      />
      <Input
        value={fio}
        error={regError}
        onChange={onFioChange}
        placeholder='Как вас зовут?'
        className='mt-4 border'
      />
      <Button
        className='!py=[20px] dark:!bg-accent-900 mt-4 !rounded-2xl !bg-accent-100 text-[15px] font-medium text-black-100 dark:text-white-100'
        onClick={onNextClick}
      >
        Далее
      </Button>
    </AuthTemplate>
  );
};

export default СontactData;
