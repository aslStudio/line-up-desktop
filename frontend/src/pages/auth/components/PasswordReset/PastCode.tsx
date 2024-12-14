import AuthTemplate from "../auth-template";
import Input from "@/components/common/input";
import Button from "@/components/common/button";
import React, { useEffect, useState } from "react";
import {
  useConfirmVerificationCodeMutation,
  useSendVerificationCodeMutation,
} from "@/api/auth";

interface PastCodeProps {
  phone: string;
  password: string;
}

const codeTest = /^\d{6}$/;

const PastCode: React.FC<PastCodeProps> = (props) => {
  const { phone, password } = props;
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [getNewCode] = useSendVerificationCodeMutation();
  const [sendCode] = useConfirmVerificationCodeMutation();
  const [newCodeCounter, setNewCodeCounter] = useState(30);

  useEffect(() => {
    getNewCode({ phone });
  }, []);
  const onCodePast = async () => {
    const testResult = codeTest.test(code);

    if (testResult) {
      const data = {
        phone: phone.replace(/[^\d+]/g, ""),
        random_code: code,
        new_password: password,
      };
      try {
        await sendCode(data).unwrap();
      } catch (err) {
        setError("Ошибка при проверке кода, попробуйще еще раз");
        setTimeout(() => {
          setError("");
        }, 3000);
      }
      return;
    }

    setError("Введите смс-код состоящий из 6 цифр");
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNewCodeCounter((prev) => prev - 1);
      if (newCodeCounter - 1 <= 0) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const onCodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const onNewCodeClick = async () => {
    await getNewCode({ phone });
    setNewCodeCounter(30);
    const intervalId = setInterval(() => {
      setNewCodeCounter((prev) => prev - 1);
      if (newCodeCounter - 1 <= 0) {
        clearInterval(intervalId);
      }
    }, 1000);
  };

  return (
    <AuthTemplate
      title='Введите код из SMS'
      subTitle={`Код был отправлен на номер ${phone.replace(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, (match, p1, p2, p3, p4, p5) => `${p1} ${p2} *** ** ${p5}`)}`}
    >
      <Input
        error={error}
        placeholder='XXXXXX'
        onChange={onCodeInputChange}
        className='mt-4 border'
      />
      <Button
        className='dark:!bg-accent-900 mt-6 !rounded-2xl !bg-accent-100 !py-[20px] text-[15px] font-medium text-black-100 dark:text-white-100'
        onClick={onCodePast}
      >
        Далее
      </Button>
      <Button
        onClick={onNewCodeClick}
        className='mt-2 !rounded-2xl !bg-gray-600 !py-[20px] text-[14px] font-medium text-white-100 dark:!bg-[#F4F4F4] dark:!text-black-100'
        disabled={newCodeCounter > 0}
      >
        Отправить повторно{" "}
        {newCodeCounter > 0 ? (
          <span className='font-medium text-[#767676]'>
            0:{`${newCodeCounter}`.padStart(2, "0")}{" "}
          </span>
        ) : (
          ""
        )}
      </Button>
    </AuthTemplate>
  );
};

export default PastCode;
