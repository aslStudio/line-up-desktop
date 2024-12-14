import React, { useState, useRef } from "react";
import DatePicker from "../../../../components/shared/DatePicker/DatePicker";
import Button from "@/components/common/button";
import Typography from "@/components/common/typography";
import { da } from "date-fns/locale";

interface AddStartDateProps {
  onSelect: (date: Date) => void;
  date: Date;
}
const AddStartDate: React.FC<AddStartDateProps> = (props) => {
  const { onSelect, date: prevDate } = props;

  const [date, setDate] = useState<Date | null>(prevDate);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const minutesInputRef = useRef<HTMLInputElement>(null);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (parseInt(value) <= 24 || value === "") {
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

  const inputBlur = (name: "hours" | "minutes") => {
    if (name == "hours") {
      if (parseInt(hours) < 10) {
        setHours(`0${hours}`);
      }
    }

    if (name == "minutes") {
      if (parseInt(minutes) < 10) {
        setMinutes(`0${minutes}`);
      }
    }
  };

  const onSaveButton = () => {
    const finalDate = new Date(date!);
    if (parseInt(hours) > 0) finalDate.setHours(parseInt(hours));
    if (parseInt(minutes) > 0) finalDate.setMinutes(parseInt(minutes));
    onSelect(finalDate);
  };

  return (
    <div className='event flex h-screen flex-col'>
      <DatePicker
        date={date!}
        setDate={setDate}
      />
      <div className='mt-4 flex justify-between'>
        <Typography className='text-[17px] font-semibold text-white-100'>
          Время
        </Typography>
        <div className='!dark:text-white-100 flex w-[80px] items-center justify-center rounded-[6px] px-[10px] py-[6px] dark:bg-gray-600'>
          <input
            type='text'
            onBlur={() => inputBlur("hours")}
            value={hours}
            placeholder='00'
            onChange={handleHoursChange}
            maxLength={3}
            className='!dark:text-white-100 w-full border-none bg-transparent text-center text-white-100 outline-none'
          />
          <span className='text-white-100'>:</span>
          <input
            type='text'
            value={minutes}
            onBlur={() => inputBlur("minutes")}
            onChange={handleMinutesChange}
            maxLength={2}
            placeholder='00'
            ref={minutesInputRef}
            className='!dark:text-white-100 w-full border-none bg-transparent text-center text-white-100 outline-none'
          />
        </div>
      </div>
      <Button
        className='approve !mt-auto'
        onClick={onSaveButton}
      >
        Сохранить
      </Button>
    </div>
  );
};

export default AddStartDate;
