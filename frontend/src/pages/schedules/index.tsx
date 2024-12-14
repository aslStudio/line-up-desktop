import Calendar from "@/components/calendar";
import SearchBar from "../../components/shared/SearchBar";
import useCalendar from "@/hooks/useCalendar";
import SearchResult from "@/components/shared/SearchResult/SearchResult";
import PageSelect from "@/components/shared/PageSelect/PageSelect";
import Header from "@/components/shared/Header/Header";
import { useDispatch, useSelector } from "react-redux";

import { useGetMeQuery } from "@/api/auth";
import Filter from "./components/Filter/Filter";
import { createQueryParams } from "@/utils";
import { Project } from "@/types";
import { useGetProjectsWithSearchQuery } from "@/api/projects";
import { setFilters, toggleFilters } from "@/store/schedulesSlice";
import { useNavigate } from "react-router-dom";
import Typography from "@/components/common/typography";

export default function Schedules() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //@ts-ignore
  const schedule = useSelector((state) => state?.schedules?.project);
  //@ts-ignore
  const { opened, project, ...others } = useSelector((state) => state.schedules);
  const { data: user } = useGetMeQuery();
  const { data: schedules } = useGetProjectsWithSearchQuery(createQueryParams({ participants: user?.user?.username }), { skip: !user?.user?.username });
  const { days } = useCalendar({ ...others, project: schedule?.name, participants: user?.user?.username });

  const selectSchedule = (schedule: Project) => {
    dispatch(setFilters({ key: "project", value: schedule }));
  };

  const clearSchedule = () => {
    dispatch(setFilters({ key: "project", value: "" }));
  };

  const navigateToSchedule = (project: Project) => {
    navigate(`/schedule/${project.id}`);
  };

  const toggle = () => {
    dispatch(toggleFilters());
  };

  if (!schedule) {
    return (
      <PageSelect
        title="Выберите расписание"
        onClick={selectSchedule}
        items={schedules!}
        onInfoClick={navigateToSchedule}
      />
    );
  }
  return (
    <main className="flex flex-col py-2 pb-[200px]">
      <Header
        title="Расписание"
        current={schedule.name}
        open={clearSchedule}
      />
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
