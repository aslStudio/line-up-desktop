import Button from "@/components/common/button";
import { ReactComponent as LikeIcon } from "@/assets/icons/buttons/like.svg";
import { ReactComponent as DisLikeIcon } from "@/assets/icons/buttons/dislike.svg";
import { ReactComponent as FilterIcon } from "@/assets/icons/buttons/filter.svg";
import { ReactComponent as SearchIcon } from "@/assets/icons/buttons/search.svg";
import { ReactComponent as CloseIcon } from "@/assets/icons/buttons/close.svg";

import Input from "@/components/common/input";
import { IClassProps } from "@/types/component";
import { twMerge } from "tailwind-merge";
import React, { useEffect, useRef, useState } from "react";
import Typography from "@/components/common/typography";
import Filter from "../../../pages/home/components/Filter/Filter";
import { setSearchTerm, clearSearchTerm } from "@/store/searchSlice";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "@/utils";

interface SearchBarProps {
  className: string;
  onFilterClick: () => void;
}
export default function SearchBar(props: SearchBarProps) {
  const { className, onFilterClick } = props;
  const mergedClass = twMerge("flex w-full z-[80]", className);
  const [isLiked, setLike] = useState(false);
  const [isFilters, setFilters] = useState(false);
  const [filtersCount, setFiltersCount] = useState(1);
  //@ts-ignore
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const [query, setQuery] = useState<string>(searchTerm);

  const dispatch = useDispatch();

  const debouncedDispatch = useRef(
    debounce((term: string) => {
      dispatch(setSearchTerm(term));
    }, 1000),
  ).current;

  function like() {
    setLike((status) => !status);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setQuery(term);
    debouncedDispatch(term);
  };

  const handleClearSearch = () => {
    dispatch(clearSearchTerm());
    setQuery("");
  };

  useEffect(() => {
    handleClearSearch();
  }, []);

  useEffect(() => {
    setQuery(searchTerm);
  }, [searchTerm]);

  return (
    <div className={mergedClass}>
      <div className='flex w-full gap-x-2'>
        <Input
          value={query}
          className='mr-1 flex-grow dark:!bg-gray-300'
          inputClassname='dark:!bg-gray-300'
          placeholder='Поиск'
          onChange={handleInputChange}
          icon={SearchIcon}
        />
        {searchTerm && (
          <div
            className='flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-gray-600 dark:bg-gray-300'
            onClick={handleClearSearch}
          >
            <CloseIcon />
          </div>
        )}
      </div>

      {!searchTerm && (
        <div className='flex gap-x-2'>
          <Button
            className='mr-1 dark:!bg-gray-300'
            onClick={() => setLike((status) => !status)}
          >
            {isLiked ? (
              <LikeIcon className='h-[24px] w-auto duration-300' />
            ) : (
              <DisLikeIcon className='h-[24px] w-auto' />
            )}
          </Button>
          <Button
            className='mr-1 flex dark:!bg-gray-300'
            onClick={onFilterClick}
          >
            <FilterIcon className='m-auto h-[24px] w-auto' />
            {filtersCount ? (
              <Typography className='my-auto ml-[6px] text-[20px] dark:text-gray-400'>
                {filtersCount}
              </Typography>
            ) : null}
          </Button>
        </div>
      )}
    </div>
  );
}
