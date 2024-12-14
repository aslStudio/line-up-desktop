import React, { useState } from "react";
import Typography from "@/components/common/typography";
import Note from "@/components/shared/Note/Note";
import UserTab from "../event/components/user-tab";
import Toggle from "@/components/common/toggle";
import "./index.css";
import Button from "@/components/common/button";
import DeleteProject from "./components/DeleteProject/DeleteProject";
import {
  useDeleteProjectMutation,
  useGetProjectByIdQuery,
} from "@/api/projects";
import { useNavigate, useParams } from "react-router-dom";

const variants = ["Приглашены", "Участники"];
const Project = () => {
  const [isProjectDelete, setIsProjectDelete] = useState(false);
  const [deleteProject] = useDeleteProjectMutation();
  const navigate = useNavigate();
  const onClickDelete = () => {
    setIsProjectDelete(true);
  };
  const { id } = useParams();
  const { data: project } = useGetProjectByIdQuery(Number(id), { skip: !id });

  const onDeleteClick = () => {
    deleteProject(Number(id!));
    navigate("/projects");
  };

  const onEditClick = () => {
    navigate(`/project-edit/${id}`);
  };

  return (
    <div className='project pb-[80px]'>
      <div className='block'>
        <Typography className='text-[20px] !text-gray-100'>
          {project?.name}
        </Typography>
      </div>
      {project?.comment && (
        <div className='block flex flex-col'>
          <Typography className='mb-2.5 text-[14px] font-semibold !text-gray-100'>
            Комментарий организатора
          </Typography>
          <Typography className='text-[15px] !text-gray-100'>
            {project?.comment}
          </Typography>
        </div>
      )}
      <div className='block flex flex-col'>
        <Note>{project?.personal_note}</Note>
        <Typography className='! mb-2 mt-4 text-[20px] font-bold !text-gray-100'>
          Организатор
        </Typography>
        <Typography className='mb-4 text-[15px]'>
          Создатель расписания
        </Typography>
        {project?.organizers.map((organizer) => (
          <UserTab
            key={organizer.user.username}
            name={organizer.user.username}
          />
        ))}
      </div>
      <div className='mb-2 block flex flex-col'>
        <Typography className='mt-4 pb-2 text-[20px] font-bold dark:text-white-100'>
          Доступ
        </Typography>
        {project?.access == "all" ? (
          <div className='flex flex-col'>
            <Typography className='text-[15px] dark:text-gray-400'>
              Участники будут видеть{" "}
            </Typography>
            <Typography className='text-[15px] dark:text-gray-400'>
              {" "}
              все события и всех участников
            </Typography>
          </div>
        ) : (
          <Typography className='text-[15px] dark:text-gray-400'>
            {" "}
            Участники будут видеть только свои события и только организаторов
            среди участников
          </Typography>
        )}
        <div className='flex flex-col'>
          <div className='flex items-center gap-x-5'>
            <div className='flex min-h-[22px] min-w-[22px] items-center justify-center rounded-full border-2 border-solid border-sky-600 bg-sky-600'></div>
            <Typography className='w-full border-b border-gray-600 py-5 text-[17px] text-white-100'>
              Для всех
            </Typography>
            <div className='split'></div>
          </div>
        </div>
      </div>
      <div className='block flex flex-col'>
        <Typography className='mt-4 pb-2 text-[20px] font-bold dark:text-white-100'>
          Участники
        </Typography>
        <Typography className='mb-4 text-[15px] dark:text-gray-400'>
          Вы можете управлять заявками и участниками в режиме редактирования
        </Typography>
        <Toggle
          variants={variants}
          onChange={() => {}}
        />
        <div className='pt-5'>
          {project?.participants?.map((item, index) => (
            <UserTab
              name={item.user.username}
              key={index}
            />
          ))}
        </div>
      </div>
      <Button
        className='approve'
        onClick={onEditClick}
      >
        Редактировать
      </Button>
      <Button
        className='delete'
        onClick={onClickDelete}
      >
        Удалить проект
      </Button>
      {isProjectDelete ? (
        <DeleteProject
          onDelete={onDeleteClick}
          hidden={isProjectDelete}
          close={() => setIsProjectDelete(false)}
        />
      ) : null}
    </div>
  );
};

export default Project;
