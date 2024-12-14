import React, { useRef, useState } from "react";
import Typography from "@/components/common/typography";
import { ReactComponent as ArrowRight } from "@/assets/icons/buttons/arrow.svg";
import Button from "@/components/common/button";
import { Project } from "@/types";
import { useGetProjectsQuery } from "@/api/projects";
import { useNavigate } from "react-router-dom";

interface AddProjectProps {
  onSelect: (arg0: Project) => void;
}
const AddProject: React.FC<AddProjectProps> = (props) => {
  const { onSelect } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { data: projects } = useGetProjectsQuery();
  const navigate = useNavigate();

  const onCeateProject = () => {
    navigate("/new-project");
  };
  return (
    <div className='event min-h-screen'>
      <div>
        <div
          className='mb-6 flex cursor-pointer items-center gap-x-4 p-4'
          onClick={onCeateProject}
        >
          <Typography className='text-[20px] !text-accent-100'>+</Typography>
          <Typography className='text-[15px] !text-accent-100'>
            Создать проект
          </Typography>
        </div>
        <Typography className='mb-[6px]'>Последние проекты</Typography>
        <div className='flex flex-col'>
          {projects?.map((project) => (
            <div
              key={project.name}
              onClick={() => onSelect(project)}
            >
              <div className='flex cursor-pointer items-center justify-between py-[19px]'>
                <Typography className='text-[17px] text-white-100'>
                  {project.name}
                </Typography>
                <ArrowRight className='rotate-[-90deg]' />
              </div>
              <div className='split'></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddProject;
