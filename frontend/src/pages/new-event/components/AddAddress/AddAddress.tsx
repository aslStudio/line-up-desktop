import React, { useRef, useState } from "react";
import Input from "@/components/common/input";
import Typography from "@/components/common/typography";
import { ReactComponent as CloseIcon } from "@/assets/icons/buttons/close.svg";
import { ReactComponent as SearchIcon } from "@/assets/icons/buttons/search.svg";
import { debounce } from "@/utils";
import { AddressSuggestion } from "@/types";
import { getSuggestions } from "@/api/address";

interface AddAddressProps {
  close: () => void;
  selectAddress: (arg0: string) => void;
}

const AddAddress: React.FC<AddAddressProps> = (props) => {
  const { close, selectAddress } = props;
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSuggestions = debounce(async () => {
    const query = inputRef.current?.value;
    if (query) {
      const response = await getSuggestions(query);
      setSuggestions(response.suggestions);
    }
  }, 800);

  return (
    <div className='event'>
      <div className='flex gap-x-2'>
        <Input
          innerRef={inputRef}
          onChange={fetchSuggestions}
          icon={SearchIcon}
          placeholder='Поиск'
          className='w-full'
        />
        <div
          className='flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-gray-600'
          onClick={close}
        >
          <CloseIcon />
        </div>
      </div>
      <div className='flex flex-col pt-4'>
        <div>
          {suggestions?.map((suggestion) => (
            <div
              className='flex flex-col py-4'
              onClick={() => selectAddress(suggestion.value)}
            >
              <Typography className='text-[15px] text-white-100'>
                {suggestion.value}
              </Typography>
              <Typography className='text-[13px]'>
                {suggestion.data.country}
              </Typography>
            </div>
          ))}

          <div className='split'></div>
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
