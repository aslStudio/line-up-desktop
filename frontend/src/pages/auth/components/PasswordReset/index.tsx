import React, { ReactNode, useState } from "react";
import PastPhone from "./PastPhone";
import PastCode from "./PastCode";
import PastNewPassword from "./PastNewPassword";

const PasswordReset: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const onNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const steps: { [key: number]: ReactNode } = {
    0: (
      <PastPhone
        onNext={onNext}
        phone={phone}
        setPhone={setPhone}
      />
    ),
    1: (
      <PastNewPassword
        password={password}
        onNext={onNext}
        setPassword={setPassword}
      />
    ),
    2: (
      <PastCode
        phone={phone}
        password={password}
      />
    ),
  };

  return steps[currentStep];
};

export default PasswordReset;
