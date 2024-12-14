import React, { useEffect, useState } from "react";
import Typography from "@/components/common/typography";
import Note from "@/components/shared/Note/Note";
import UserTab from "../event/components/user-tab";
import Button from "@/components/common/button";
import { useGetProjectByIdQuery } from "@/api/projects";
import { useNavigate, useParams } from "react-router-dom";
import ExitSchedule from "./components/ExitSchedule";
import "./index.css";
import { data } from "autoprefixer";
import { Project } from "@/types";

const projectData = {
  title: "Операторы",
  comment: "Приходите немного пораньше, лучше всего за 10 минут до начала мероприятия",
  organizers: [{ img: "", name: "Tima" }],
  participants: [
    { img: "", name: "Rick Rubin" },
    { img: "", name: "Timbaland" },
  ],
  access: "single",
};

const variants = ["Приглашены", "Участники"];
const Schedule = () => {
  const [isProjectExit, setIsProjectExit] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  const navigate = useNavigate();

  const onClickDelete = () => {
    setIsProjectExit(true);
  };
  const { id } = useParams();
  const { data } = useGetProjectByIdQuery(Number(id), { skip: !id });

  useEffect(() => {
    if (data) {
      setProject(data);
    }
  }, [data]);

  const onExitClick = () => {
    navigate("/schedules");
  };

  return (
    <div className="project pb-[80px]">
      <div className="block">
        <Typography className="!text-gray-100 text-[20px]">{project?.name}</Typography>
      </div>
      {project?.comment && (
        <div className="block flex flex-col">
          <Typography className="!text-gray-100 font-semibold text-[14px] mb-2.5">Комментарий организатора</Typography>
          <Typography className="!text-gray-100 text-[15px]">{project?.comment}</Typography>
        </div>
      )}
      <div className="block flex flex-col">
        <Note>{project?.personal_note}</Note>
        <Typography className="text-[20px] font-bold mb-2 ! mt-4 !text-gray-100">Организатор</Typography>
        <Typography className="text-[15px] mb-4">Создатель расписания</Typography>
        {project?.organizers?.map((organizer) => (
          <UserTab
            key={organizer.user.username}
            name={organizer.user.username}
          />
        ))}
      </div>
      <div className="block flex flex-col">
        <Typography className="mt-4 dark:text-white-100 font-bold pb-2 text-[20px]">Участники расписания</Typography>

        <div className="pt-5">
          {project?.participants?.map((item, index) => (
            <UserTab
              name={item.user.username}
              key={index}
            />
          ))}
        </div>
      </div>

      <Button
        className="delete"
        onClick={onClickDelete}>
        Выйти из расписания
      </Button>
      {isProjectExit ? (
        <ExitSchedule
          onExit={onExitClick}
          hidden={isProjectExit}
          close={() => setIsProjectExit(false)}
        />
      ) : null}
    </div>
  );
};

export default Schedule;
