import AuthTemplate from "../auth-template";
import Input from "@/components/common/input";
import Button from "@/components/common/button";
import React, { SetStateAction, useState } from "react";
import ReactPasswordChecklist from "react-password-checklist";

interface PastNewPasswordProps {
  onNext: () => void;
  password: string;
  setPassword: React.Dispatch<SetStateAction<string>>;
}
const PastNewPassword: React.FC<PastNewPasswordProps> = (props) => {
  const { onNext, password, setPassword } = props;
  const [rePassword, setRePassword] = useState("");

  const [formValid, setFormValid] = useState(false);

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onRePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRePassword(e.target.value);
  };

  const onNextClick = () => {
    if (formValid) onNext();
  };

  return (
    <AuthTemplate
      title='Пароль'
      subTitle='Будет использоваться для входа'
    >
      <Input
        placeholder='Пароль'
        value={password}
        onChange={onPasswordChange}
        className='mt-4 border'
        type='password'
      />
      <Input
        placeholder='Повторите пароль'
        value={rePassword}
        onChange={onRePasswordChange}
        type='password'
        className='mb-4 mt-4 border'
      />
      <ReactPasswordChecklist
        rules={[
          "minLength",
          "specialChar",
          "number",
          "capital",
          "match",
          "noSpaces",
        ]}
        minLength={8}
        value={password}
        onChange={(isValid) => setFormValid(isValid)}
        valueAgain={rePassword}
        iconSize={12}
        itemClassName='text-[13px] text-white-100 gap-x-2.5 text-left flex items-center mb-2 dark:text-black-100'
        messages={{
          minLength: "Минимальная длина пароля должна быть 8 символов.",
          specialChar: "Пароль должен содержать специальные символы.",
          number: "Пароль должен содержать хотя бы одну цифру.",
          capital: "Пароль должен содержать хотя бы одну заглавную букву.",
          match: "Пароли должны совпадать.",
          noSpaces: "Пароль не должен содержать пробелов",
        }}
      />
      <Button
        onClick={onNextClick}
        className='dark:!bg-accent-900 mt-6 !rounded-2xl !bg-accent-100 !py-[20px] text-[15px] font-medium text-black-100 dark:text-white-100'
      >
        Далее
      </Button>
    </AuthTemplate>
  );
};

export default PastNewPassword;
