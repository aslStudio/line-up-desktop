import React, { ForwardedRef, FunctionComponent } from "react";
import InputMask from "react-input-mask";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: FunctionComponent<React.SVGProps<SVGSVGElement>>;
  postIcon?: FunctionComponent<React.SVGProps<SVGSVGElement>>;
  inputClassname?: string;
  innerRef?: ForwardedRef<HTMLInputElement>;
  error?: string;
}
const PhoneInput = (props: InputProps) => {
  const { value, error, onChange, inputClassname, className, name, ...others } =
    props;

  const mergedClass = twMerge(
    "input dark:border-[#D4D4D4]",
    error ? "!border-red-500 !text-red-500 " : "",
    props.icon ? "pl-[22px]" : "",
    className,
  );
  const mergedInputClass = twMerge(
    "dark:text-black-100",
    error ? "!text-red-500" : "",
    inputClassname,
  );
  return (
    <>
      <div className={mergedClass}>
        <InputMask
          className={mergedInputClass}
          mask={"+7 (999) 999-99-99"}
          value={value}
          name={name}
          placeholder='+7 XXX 000 00 00'
          onChange={onChange}
        />
      </div>
      {error ? (
        <p className='mr-auto mt-1 text-left text-[13px] text-red-500'>
          {error}
        </p>
      ) : (
        ""
      )}
    </>
  );
};

export default PhoneInput;
