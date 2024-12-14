import Calendar from "@/components/calendar";
import SearchBar from "../../components/shared/SearchBar";
import useCalendar from "@/hooks/useCalendar";
import SearchResult from "@/components/shared/SearchResult/SearchResult";
import PageSelect from "@/components/shared/PageSelect/PageSelect";
import Header from "@/components/shared/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "@/store/projectsSlice";
import { useGetProjectsWithSearchQuery } from "@/api/projects";
import { useGetMeQuery } from "@/api/auth";
import Filter from "./components/Filter/Filter";
import { toggleFilters } from "@/store/projectsSlice";
import { createQueryParams } from "@/utils";
import { Project } from "@/types";
import { useNavigate } from "react-router-dom";
import { id } from "date-fns/locale";
import { clearFilters } from "@/store/homeSlice";
import Typography from "@/components/common/typography";

export default function Projects() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectProject = (project: Project) => {
    dispatch(clearFilters());
    dispatch(setFilters({ key: "project", value: project }));
  };

  const clearProject = () => {
    dispatch(setFilters({ key: "project", value: "" }));
  };

  //@ts-ignore
  const project = useSelector((state) => state?.projects?.project);
  //@ts-ignore
  const { opened, project, ...others } = useSelector((state) => state.projects);
  const { data: user } = useGetMeQuery();
  const { data: projects } = useGetProjectsWithSearchQuery(
    createQueryParams({ organizers: user?.user.username as string }),
    { skip: !user?.user.username },
  );
  const { days } = useCalendar({
    ...others,
    project: project?.name,
    organizers: user?.user.username,
  });
  //@ts-ignore

  const toggle = () => {
    dispatch(toggleFilters());
  };

  const navigateToProject = (project: Project) => {
    navigate(`/project/${project.id}`);
  };

  const onCreateProjectClick = () => {
    navigate("/new-project");
  };

  if (!project) {
    return (
      <PageSelect
        title='Выберите проект'
        onInfoClick={navigateToProject}
        onClick={selectProject}
        items={projects!}
      >
        <div
          className='ml-4 mt-7 flex cursor-pointer items-center'
          onClick={onCreateProjectClick}
        >
          <Typography className='dark:text-accent-900 text-[20px] text-accent-100'>
            +
          </Typography>
          <Typography className='dark:text-accent-900 my-auto ml-[10px] text-[15px] text-accent-100'>
            Создать проект
          </Typography>
        </div>
      </PageSelect>
    );
  }
  return (
    <main className='flex flex-col py-2 pb-[200px]'>
      <Header
        title='Проекты'
        current={project.name}
        open={clearProject}
      />
      <SearchBar
        className='px-4'
        onFilterClick={toggle}
      />
      <Filter
        hidden={opened}
        hide={toggle}
      />
      <SearchResult />
      <Calendar
        className='mt-2 px-2'
        days={days}
      />
    </main>
  );
}
