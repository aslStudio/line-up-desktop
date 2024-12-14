import Typography from "@/components/common/typography";
import React, { useState } from "react";
import Select from "@/components/common/select";

interface RemindForProps {}
const RemidFor: React.FC<RemindForProps> = (props) => {
  const [value, setValue] = useState("час");

  const options = [
    { value: "час", label: "час" },
    { value: "день", label: "день" },
  ];

  return (
    <div className="mt-4">
      <Typography className="text-[14px]">Напоминать за</Typography>
      <div className="flex gap-x-2">
        <input
          className="mt-2 flex text-center items-cetner justify-center max-w-[70px] px-3 py-3 rounded-2xl bg-transparent border border-solid border-gray-600 outline-none text-white-100 text-[15px]"
          min={1}
          defaultValue={1}
          type="number"
        />
        <Select
          options={options}
          onChange={setValue}
          value={value}
          defaultValue={options[1].label}
          className="mt-2 w-min min-w-[102px]"
        />
      </div>
    </div>
  );
};

export default RemidFor;
