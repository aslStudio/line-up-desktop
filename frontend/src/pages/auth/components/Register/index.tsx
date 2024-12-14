import React, { ReactNode, useState } from "react";
import PastPhone from "./PastPhone";
import PastCode from "./PastCode";
import PastNewPassword from "./PastNewPassword";
import СontactData from "./ContactData";
import { useRegisterUserMutation } from "@/api/auth";
import { useNavigate } from "react-router-dom";

const Registration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [fio, setFio] = useState("");
  const [register] = useRegisterUserMutation();
  const navigate = useNavigate();

  const onNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const onRegistrationEnd = async () => {
    console.log(phone);
    const data = {
      username: nickname,
      re_password: password,
      phone: phone.replace(/[^\d+]/g, ""),
      password,
    };
    try {
      await register(data).unwrap();
      navigate("/login");
      return true;
    } catch (err) {
      return false;
    }
  };

  const steps: { [key: number]: ReactNode } = {
    0: (
      <PastPhone
        phone={phone}
        onNext={onNext}
        setPhone={setPhone}
      />
    ),
    1: (
      <PastCode
        onNext={onNext}
        phone={phone}
      />
    ),
    2: (
      <PastNewPassword
        onNext={onNext}
        password={password}
        setPassword={setPassword}
      />
    ),
    3: (
      <СontactData
        onNext={onRegistrationEnd}
        nickname={nickname}
        setNickname={setNickname}
        fio={fio}
        setFio={setFio}
      />
    ),
  };
  return steps[currentStep];
};

export default Registration;
