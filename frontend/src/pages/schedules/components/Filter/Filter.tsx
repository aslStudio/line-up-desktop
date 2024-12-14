import Typography from "@/components/common/typography";
import "./Filter.css";

import { ReactComponent as CloseIcon } from "@/assets/icons/buttons/close.svg";
import Accordion from "@/components/common/accordion";

import Button from "@/components/common/button";
import CheckList from "@/components/common/checklist";
import { useDispatch, useSelector } from "react-redux";

import { collectSubgroups } from "@/utils";
import { setFilters, toggleFilters } from "@/store/schedulesSlice";
import { useState } from "react";
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

  //@ts-ignore
  const filterState = useSelector((state) => state.schedules);

  const [selectedColor, setSelectedColor] = useState(filterState.color);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([
    ...filterState.event_type,
  ]);
  const [selectedSubgroups, setSelectedSubgroups] = useState<string[]>([
    ...filterState.subgroups,
  ]);

  const onColorClick = (color: string) => {
    setSelectedColor(color === selectedColor ? "" : color);
  };

  const onEventTypeClick = (eventType: string) => {
    setSelectedEventTypes((prev) =>
      prev.includes(eventType)
        ? prev.filter((e) => e !== eventType)
        : [...prev, eventType],
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
    dispatch(setFilters({ key: "color", value: selectedColor }));
    dispatch(setFilters({ key: "event_type", value: selectedEventTypes }));
    dispatch(setFilters({ key: "subgroups", value: selectedSubgroups }));
    dispatch(toggleFilters());
  };

  // Get the selected project from filterState
  const selectedProject = filterState.project;

  // Get subgroups for the selected project
  const subgroups = selectedProject ? collectSubgroups([selectedProject]) : [];

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

        <Typography className='text-[17px] font-semibold dark:text-black-100'>
          Цвета
        </Typography>
        <div className='mt-3 flex min-h-[40px] items-center'>
          {palette?.map((color) => (
            <div
              onClick={() => onColorClick(color.name)}
              key={color.name}
              style={{ background: color.name }}
              className={`color ${color.name !== selectedColor ? "max-h-[30px] max-w-[30px] opacity-50" : ""}`}
            />
          ))}
        </div>

        {selectedProject && subgroups.length > 0 && (
          <SubgroupsAccordion
            key={selectedProject.id}
            title={selectedProject.name}
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
        )}

        <Accordion
          title='Типы событий'
          className='mt-4'
        >
          <CheckList
            list={["Закрытые", "Открытые", "Личные"]}
            onClick={onEventTypeClick}
          />
        </Accordion>
        <Accordion
          title='Cтатус события'
          className='mt-4'
        >
          <CheckList
            list={["Я участник", "Подана заявка"]}
            onClick={onEventTypeClick}
          />
        </Accordion>

        <Button
          onClick={onSaveClick}
          className='mt-auto !bg-accent-100'
        >
          <Typography className='button-text'>Применить</Typography>
        </Button>
      </div>
    </BottomSheet>
  );
}
