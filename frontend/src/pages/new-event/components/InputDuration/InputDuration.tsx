import React, { useState, useRef } from "react";

interface InputDurationProps {}
const InputDuration = () => {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const minutesInputRef = useRef<HTMLInputElement>(null);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(value);
    if (parseInt(value) <= 40 || value === "") {
      setHours(value);
    } else {
      minutesInputRef.current?.focus();
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (parseInt(value) <= 59 || value === "") {
      setMinutes(value);
    }
  };

  return (
    <div className='flex w-[120px] items-center justify-center rounded-[6px] bg-gray-600 px-[10px] py-[6px] dark:bg-gray-300 dark:text-black-100'>
      <input
        type='text'
        value={hours}
        placeholder='0'
        onChange={handleHoursChange}
        maxLength={3}
        className='w-full border-none bg-transparent text-center text-white-100 outline-none dark:text-black-100'
      />
      <span className='text-gray-400'>ч</span>
      <input
        type='text'
        value={minutes}
        onChange={handleMinutesChange}
        maxLength={2}
        placeholder='0'
        ref={minutesInputRef}
        className='w-full border-none bg-transparent text-center text-white-100 outline-none dark:text-black-100'
      />
      <span className='text-gray-400'>мин</span>
    </div>
  );
};

export default InputDuration;
