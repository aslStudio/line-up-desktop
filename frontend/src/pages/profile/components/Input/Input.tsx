import React, { useRef, useState } from "react";
import { ReactComponent as PenIcon } from "@/assets/icons/buttons/pen.svg";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  inputClassname?: string;
  label?: string;
}
const Input: React.FC<InputProps> = (props) => {
  const [isEditing, setEditing] = useState(false);
  const {
    className,
    label = "test",
    placeholder,
    inputClassname,
    ...others
  } = props;
  const divClassname = twMerge(
    className,
    "flex h-[50px] bg-gray-600 items-center rounded-xl overflow-hidden px-4 py-2  gap-x-3 dark:bg-gray-300",
  );
  const insideInputClassname = twMerge(
    inputClassname,
    " bg-transparent w-full outline-none text-white-100 text-[15px] leading-4 dark:text-black-100",
  );
  const inputRef = useRef(null);

  const onPenClick = () => {
    setEditing(true);
    (inputRef.current as unknown as HTMLInputElement).focus();
  };

  const onSaveInput = () => {
    setEditing(false);
    (inputRef.current as unknown as HTMLInputElement).blur();
  };
  return (
    <div className={`${divClassname}`}>
      <div className='flex w-full flex-col items-start justify-center'>
        {label && !isEditing ? (
          <span className='text-[12px] leading-3 text-gray-400'>{label}</span>
        ) : null}
        <input
          ref={inputRef}
          defaultValue={"Тест value"}
          placeholder={placeholder}
          className={insideInputClassname}
          readOnly={!isEditing}
          {...others}
        />
      </div>
      {!isEditing ? (
        <PenIcon
          onClick={onPenClick}
          className='dark:fill-accent-900 ml-auto fill-accent-100'
          height={21}
          width={24}
        />
      ) : (
        <span
          className='cursor-pointer text-[13px] text-accent-100'
          onClick={onSaveInput}
        >
          Сохранить
        </span>
      )}
    </div>
  );
};

export default Input;
