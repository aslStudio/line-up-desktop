import Calendar from "@/components/calendar";
import SearchBar from "../../components/shared/SearchBar";
import useCalendar from "@/hooks/useCalendar";
import SearchResult from "@/components/shared/SearchResult/SearchResult";
import Filter from "@/pages/home/components/Filter/Filter";
import { toggleFilters } from "@/store/homeSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function Home() {
  //@ts-ignore
  const { opened, ...others } = useSelector((state) => state.home);
  const dispatch = useDispatch();
  const { days } = useCalendar(others);

  const toggle = () => {
    dispatch(toggleFilters());
  };

  return (
    <main className="flex flex-col py-2 pb-[200px]">
      <SearchBar
        className="px-4"
        onFilterClick={toggle}
      />
      <Filter
        hidden={opened}
        hide={toggle}
      />
      <SearchResult />
      <Calendar
        className="mt-2 px-2"
        days={days}
      />
    </main>
  );
}
