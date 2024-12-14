//@ts-nocheck
import React, { useEffect, useState } from "react";
import { Project, Profile } from "@/types";
import { useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "@/api/projects";

const useEditProject = () => {
  const [toggles, setToggles] = useState({
    isAddOrganizers: false,
    isAddMembers: false,
  });

  const [project, setProject] = useState<Omit<Project, "id">>({
    name: "",
    link: "",
    access: "all",
    reminder_delta: 0,
    comment: "",
    personal_note: "",
    organizers: [],
    participants: [],
    events: [],
  });

  const { id } = useParams();
  const { data } = useGetProjectByIdQuery(Number(id)!, { skip: !id });

  useEffect(() => {
    if (data) {
      setProject(data);
    }
  }, [data]);

  const toggleWindow = (key: keyof typeof toggles, value: boolean) => {
    setToggles((prev) => ({ ...prev, [key]: value }));
  };

  const onProjectValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (e.target.name == "comment") {
      value = value.slice(0, 100);
    }
    setProject((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const onAcceessSelect = (access: "all" | "me") => {
    setProject((prev) => ({ ...prev, access: access }));
  };

  const onParticipationSwitch = (value: boolean) => {
    setProject((prev) => ({ ...prev, participationСofirm: value }));
  };

  const selectOrganizers = (organizers: Partial<Profile>[]) => {
    setProject((prev) => ({ ...prev, organizers: organizers as Profile[] }));
    toggleWindow("isAddOrganizers", false);
  };

  const selectMembers = (members: Partial<Profile>[]) => {
    setProject((prev) => ({ ...prev, participants: members as Profile[] }));
    toggleWindow("isAddMembers", false);
  };

  const onLinkType = (type: "public" | "limited") => {
    setProject((prev) => ({ ...prev, link: type }));
  };

  return { project, onProjectValueChange, onParticipationSwitch, onAcceessSelect, selectOrganizers, selectMembers, toggles, toggleWindow, onLinkType };
};

export default useEditProject;
