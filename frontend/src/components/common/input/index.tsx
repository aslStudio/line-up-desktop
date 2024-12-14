import React, { ForwardedRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { FunctionComponent } from "react";
import "./index.css";

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: FunctionComponent<React.SVGProps<SVGSVGElement>>;
  postIcon?: FunctionComponent<React.SVGProps<SVGSVGElement>>;
  inputClassname?: string;
  innerRef?: ForwardedRef<HTMLInputElement>;
  error?: string;
  iconStyle?: string;
}
export default function Input(props: IInputProps) {
  const {
    placeholder,
    className,
    inputClassname,
    innerRef,
    value,
    onChange,
    error,
    iconStyle,
    ...others
  } = props; // Destructure `value` and `onChange`

  const mergedClass = twMerge(
    "input dark:border-[#D4D4D4] dark:text-black-100",
    error ? "!border-red-500 !text-red-500 " : "",
    props.icon ? "pl-[22px]" : "",
    className,
  );

  const mergedInputClass = twMerge(
    "dark:text-black-100",
    error ? "!text-red-500" : "",
    inputClassname,
  );

  const iconClassname = twMerge("post-icon", iconStyle);

  return (
    <>
      <div className={mergedClass}>
        {props.icon ? <props.icon className='icon' /> : <></>}
        <input
          ref={innerRef}
          className={mergedInputClass}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...others}
        />
        {props.postIcon ? <props.postIcon className={iconClassname} /> : <></>}
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
}
