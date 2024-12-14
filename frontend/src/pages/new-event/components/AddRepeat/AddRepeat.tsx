import Button from "@/components/common/button";
import Select from "@/components/common/select";
import Typography from "@/components/common/typography";
import React, { useState } from "react";

interface AddRepeatProps {
  onSelect: () => void;
}
const AddRepeat: React.FC<AddRepeatProps> = (props) => {
  const { onSelect } = props;
  const [value, setValue] = useState("час");
  const [activeDay, setActiveDay] = useState("");

  const options = [
    { value: "час", label: "час" },
    { value: "день", label: "день" },
  ];

  const onSetDay = (value: string) => {
    setActiveDay(value);
  };

  const getDayClassname = (current: string) => {
    if (current !== activeDay) {
      return "text-white-100 min-w-[44px] bg-transparent cursor-pointer min-h-[44px] flex items-center justify-center border border-solid border-gray-600 rounded-full";
    }
    return "min-w-[44px] min-h-[44px] flex cursor-pointer items-center justify-center border border-solid border-accent-100 bg-accent-100 rounded-full";
  };

  return (
    <div className='event h-screen'>
      <Typography className='mb-4 text-[20px] text-white-100'>
        Повторение
      </Typography>
      <Typography className='mb-2 text-[14px]'>Повторять каждые</Typography>
      <div className='mb-4 flex gap-x-2'>
        <input
          className='items-cetner flex max-w-[70px] justify-center rounded-2xl border border-solid border-gray-600 bg-transparent px-3 py-3 text-center text-[15px] text-white-100 outline-none'
          min={1}
          defaultValue={1}
          type='number'
        />
        <Select
          options={options}
          onChange={setValue}
          value={value}
          defaultValue={options[1].label}
          className='w-min min-w-[132px]'
        />
      </div>
      <Typography className='mb-2 text-[14px]'>Повторять по</Typography>
      <div className='flex justify-between'>
        {["пн", "вт", "ср", "чт", "пт", "сб", "вс"].map((day, index) => (
          <div
            key={index}
            onClick={() => onSetDay(day)}
            className={getDayClassname(day)}
          >
            {day}
          </div>
        ))}
      </div>
      <Button
        className='approve !mt-auto'
        onClick={onSelect}
      >
        Сохранить
      </Button>
    </div>
  );
};

export default AddRepeat;
