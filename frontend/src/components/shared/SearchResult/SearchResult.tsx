import { useGetEventsFromSearchQuery, useGetEventsQuery } from "@/api/events";
import PlanCard from "@/components/calendar/components/plan-card";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const SearchResult: React.FC = () => {
  const dispatch = useDispatch();
  //@ts-ignore
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const { data: events } = useGetEventsFromSearchQuery(searchTerm, {
    skip: searchTerm.length == 0,
  });

  useEffect(() => {
    if (events && searchTerm) {
      const header = document.getElementById("header");
      if (header) {
        header.style.display = "none";
      }
    } else {
      const header = document.getElementById("header");
      if (header) {
        header.style.display = "flex";
      }
    }

    return () => {
      const header = document.getElementById("header");
      if (header) {
        header.style.display = "none";
      }
    };
  }, [events, searchTerm]);

  return (
    <div
      className={`fixed inset-0 h-full h-screen w-full px-4 pt-[65px] transition-opacity duration-300 dark:bg-white-100 ${searchTerm && events?.length! ? "z-[70] overflow-hidden opacity-100" : "z-[-1] opacity-0"} bg-[#1E1E1E]`} // Optional: semi-transparent background
    >
      <div
        style={{
          maxHeight: "calc(100vh - 52px)",
        }}
        className='gap-t-4 flex flex-col overflow-y-auto pb-[50px]'
      >
        {events?.map((event) => <PlanCard plan={event} />)}
      </div>
    </div>
  );
};

export default SearchResult;
