import AuthTemplate from "../auth-template";
import Input from "@/components/common/input";
import Button from "@/components/common/button";
import React, { SetStateAction, useState } from "react";
import { useSendVerificationCodeMutation } from "@/api/auth";
import PhoneInput from "@/components/common/phoneInput";

interface PastPhoneProps {
  onNext: () => void;
  setPhone: React.Dispatch<SetStateAction<string>>;
  phone: string;
}
const phoneTest = /^(\+7|8)?\s?(\d{3})\s?(\d{3})\s?(\d{2})\s?(\d{2})$/;

const PastPhone: React.FC<PastPhoneProps> = (props) => {
  const { onNext, setPhone, phone } = props;
  const [error, setError] = useState("");
  const [sendCode, result] = useSendVerificationCodeMutation();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const onNextClick = async () => {
    const testResult = phoneTest.test(phone.replace(/[^\d+]/g, ""));
    if (testResult) {
      setPhone(phone.replace(/[^\d+]/g, ""));
      onNext();
      return;
    }
    setError("Введите валидный номер телефона");
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  return (
    <AuthTemplate
      title='Восстановления пароля'
      subTitle='Введите номер телефона, к которому привязан аккаунт. На него придёт код подтверждения'
    >
      <PhoneInput
        error={error}
        onChange={onInputChange}
        placeholder='+7 XXX 000 00 00'
        className='mt-4 border'
      />
      <Button
        className='dark:!bg-accent-900 mt-6 !rounded-2xl !bg-accent-100 !py-[20px] text-[15px] font-medium text-black-100 dark:text-white-100'
        onClick={onNextClick}
      >
        Далее
      </Button>
    </AuthTemplate>
  );
};

export default PastPhone;
