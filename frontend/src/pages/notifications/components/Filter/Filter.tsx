import Typography from "@/components/common/typography";

import { ReactComponent as CloseIcon } from "@/assets/icons/buttons/close.svg";
import Accordion from "@/components/common/accordion";
import Tag from "@/components/common/tag";
import Button from "@/components/common/button";
import { useGetProjectsWithSearchQuery } from "@/api/projects";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "@/api/auth";
import { collectSubgroups, createQueryParams } from "@/utils";
import { setFilters, toggleFilters } from "@/store/homeSlice";
import { useState, useEffect } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useGetColorsQuery } from "@/api/color";
import SubgroupsTag from "@/components/common/SubgroupsTag/SubgroupsTag";
import SubgroupsAccordion from "@/components/common/SubgroupsAccordion/SubroupsAccordion";

export default function Filter({
  hidden,
  hide,
}: {
  hidden: boolean;
  hide: () => void;
}) {
  const dispatch = useDispatch();

  const { data: palette } = useGetColorsQuery();
  const { data: user } = useGetMeQuery();
  const { data: userProjects } = useGetProjectsWithSearchQuery(
    createQueryParams({
      organizers: user?.user?.username,
    }),
    { skip: !user?.user?.username },
  );

  const { data: userSchedules } = useGetProjectsWithSearchQuery(
    createQueryParams({
      participants: user?.user?.username,
    }),
    { skip: !user?.user.username },
  );

  //@ts-ignore
  const filterState = useSelector((state) => state.notifications);

  const [selectedProjects, setSelectedProjects] = useState<string[]>([
    ...filterState.project,
  ]);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([
    ...filterState.schedules,
  ]);

  const [selectedSubgroups, setSelectedSubgroups] = useState<string[]>([
    ...filterState.subgroups,
  ]);

  const onProjectClick = (project: string) => {
    setSelectedProjects((prev) =>
      prev.includes(project)
        ? prev.filter((p) => p !== project)
        : [...prev, project],
    );
  };

  const onScheduleClick = (schedule: string) => {
    setSelectedSchedules((prev) =>
      prev.includes(schedule)
        ? prev.filter((s) => s !== schedule)
        : [...prev, schedule],
    );
  };

  const onSubgroupClick = (subgroup: string) => {
    setSelectedSubgroups((prev) =>
      prev.includes(subgroup)
        ? prev.filter((s) => s !== subgroup)
        : [...prev, subgroup],
    );
  };

  const onSaveClick = () => {
    dispatch(setFilters({ key: "project", value: selectedProjects }));
    dispatch(setFilters({ key: "schedules", value: selectedSchedules }));
    dispatch(setFilters({ key: "subgroups", value: selectedSubgroups }));
    dispatch(toggleFilters());
  };

  useEffect(() => {
    setSelectedProjects([...filterState?.project]);
    setSelectedSchedules([...filterState?.schedules]);
    setSelectedSubgroups([...filterState?.subgroups]);
  }, [filterState]);

  return (
    <BottomSheet
      snapPoints={({ maxHeight }) => [(maxHeight * 9.5) / 10]}
      open={hidden}
      className='filter-canvas fixed !z-[80]'
      onDismiss={hide}
    >
      <div className='flex min-h-[90vh] flex-col px-4 py-[22px]'>
        <div className='flex justify-between'>
          <Typography className='my-auto text-[17px] font-semibold dark:text-gray-400'>
            Фильтр
          </Typography>
          <CloseIcon
            onClick={hide}
            className='mx-[13px] my-3 h-[20px] w-auto'
          />
        </div>

        <Accordion
          title='Проект'
          className='mt-4'
        >
          <div className='flex flex-wrap'>
            {userProjects?.map((project) => (
              <Tag
                key={project.id}
                title={project.name}
                onClick={() => onProjectClick(project.name)}
                active={selectedProjects.includes(project.name)}
                className='mb-1 mr-1'
              />
            ))}
          </div>
        </Accordion>
        {selectedProjects?.map((project) => {
          const foundProject = userProjects?.find(
            (item) => item.name === project,
          );
          const subgroups = foundProject
            ? collectSubgroups([foundProject])
            : null;

          if (subgroups?.length && foundProject) {
            return (
              <SubgroupsAccordion
                key={foundProject.id}
                title={project}
              >
                {subgroups.map((tag) => (
                  <SubgroupsTag
                    key={tag.id}
                    title={tag.name}
                    active={selectedSubgroups?.includes(tag.name)}
                    onClick={() => onSubgroupClick(tag.name)}
                  />
                ))}
              </SubgroupsAccordion>
            );
          }

          return null;
        })}

        <Accordion
          title='Расписание'
          className='mt-4'
        >
          <div className='flex flex-wrap'>
            {userSchedules?.map((schedule) => (
              <Tag
                key={schedule.id}
                title={schedule.name}
                onClick={() => onScheduleClick(schedule.name)}
                active={selectedSchedules.includes(schedule.name)}
                className='mb-1 mr-1'
              />
            ))}
          </div>
        </Accordion>

        <Button
          onClick={onSaveClick}
          className='mt-auto'
        >
          <Typography className='button-text'>Применить</Typography>
        </Button>
      </div>
    </BottomSheet>
  );
}
