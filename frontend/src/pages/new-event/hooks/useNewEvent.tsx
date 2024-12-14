//@ts-nocheck

import { useGetColorsQuery } from "@/api/color";
import { Project, Subgroup, Profile, Color } from "@/types";
import React, { useEffect } from "react";
import { useState } from "react";

const useNewEvent = () => {
  const [colors, setColors] = useState<Color[]>();
  const { data: eventColors } = useGetColorsQuery();

  useEffect(() => {
    if (eventColors) {
      setColors(eventColors);
    }
  }, [eventColors]);
  const [toggles, setToggles] = useState({
    isAddEventType: true,
    isAddAddress: false,
    isAddProject: false,
    isAddSubgroup: false,
    isAddOrganizers: false,
    isAddMembers: false,
    isPersonalRemind: false,
    isAddRepeat: false,
    isDeleteCanvas: false,
    isAddStartDate: false,
  });

  const [event, setEvent] = useState<WholeEvent>({
    name: "",
    project: null,
    event_type: "",
    is_owl_mode: false,
    start_date: new Date(),
    end_date: new Date(),
    payment: 0,
    address: "",
    is_open: true,
    description: "",
    comment: "",
    personal_note: "",
    subgroups: [],
    is_reminder: false,
    reminder_date: new Date(),
    organizers: [],
    participants: [],
    color: "",
  });

  const [errors, setErrors] = useState({
    project: false,
    title: false,
    description: false,
    color: false,
  });

  const onCreateEvent = () => {
    let isAnyError = false;
    if (!event.project) {
      setErrors((prev) => ({ ...prev, project: true }));
      isAnyError = true;
    }

    if (event.name.length == 0) {
      setErrors((prev) => ({ ...prev, title: true }));
      isAnyError = true;
    }

    if (event.comment!.length == 0) {
      setErrors((prev) => ({ ...prev, comment: true }));
      isAnyError = true;
    }

    if (event.color!.length == 0) {
      setErrors((prev) => ({ ...prev, color: true }));
      isAnyError = true;
    }

    if (!isAnyError) {
      // api call to create event and navigate to event page
      return;
    }

    setTimeout(() => {
      setErrors({ project: false, title: false, description: false, color: false });
    }, 5000);
  };

  const onEventValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (e.target.name == "desciption") {
      value = value.slice(0, 300);
    }

    if (e.target.name == "comment") {
      value = value.slice(0, 100);
    }
    setEvent((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const toggleWindow = (key: keyof typeof toggles, value: boolean) => {
    setToggles((prev) => ({ ...prev, [key]: value }));
  };

  const selectSubgroup = (subgroup: Subgroup) => {
    setEvent((prev) => ({ ...prev, subgroups: [...prev.subgroups!, subgroup] }));
    toggleWindow("isAddSubgroup", false);
  };

  const selectProject = (project: Project) => {
    setEvent((prev) => ({ ...prev, project: project }));
    toggleWindow("isAddProject", false);
  };

  const selectStartDate = (date: Date) => {
    setEvent((prev) => ({ ...prev, start_date: date }));
    toggleWindow("isAddStartDate", false);
  };

  const selectAddress = (address: string) => {
    setEvent((prev) => ({ ...prev, address: address }));
    toggleWindow("isAddAddress", false);
  };

  const selectRepeat = () => {
    setEvent((prev) => ({ ...prev, repeat: true }));
    toggleWindow("isAddRepeat", false);
  };

  const onLinkType = (type: "public" | "limited") => {
    setEvent((prev) => ({ ...prev, link: type }));
  };

  const onEventClick = (type: "public" | "private") => {
    setEvent((prev) => ({ ...prev, type: type }));
    toggleWindow("isAddEventType", false);
  };

  const onColorClick = (color: { id: number; name: string }) => {
    setEvent((prev) => ({ ...prev, color: color }));
  };

  const toggleDeleteEvent = () => {
    setToggles((prev) => ({ ...prev, isDeleteCanvas: !prev.isDeleteCanvas }));
  };

  const closeAddAddress = () => {
    toggleWindow("isAddAddress", false);
  };

  const selectOrganizers = (organizers: Partial<Profile>[]) => {
    setEvent((prev) => ({ ...prev, organizers: organizers as Profile[] }));
    toggleWindow("isAddOrganizers", false);
  };

  const selectMembers = (members: Partial<Profile>[]) => {
    setEvent((prev) => ({ ...prev, participants: members as Profile[] }));
    toggleWindow("isAddMembers", false);
  };

  const removeProject = () => {
    setEvent((prev) => ({ ...prev, project: null }));
  };

  const removeSubgroup = () => {
    setEvent((prev) => ({ ...prev, subgroups: [] }));
  };

  const removeMember = (position: number) => {
    setEvent((prev) => ({ ...prev, participants: prev.participants!.filter((item, index) => index != position) }));
  };

  const removeOrganizers = (position: number) => {
    setEvent((prev) => ({ ...prev, members: prev.organizers!.filter((item, index) => index != position) }));
  };

  return {
    colors,
    closeAddAddress,
    selectProject,
    selectSubgroup,
    selectAddress,
    selectMembers,
    selectOrganizers,
    selectStartDate,
    selectRepeat,
    toggleWindow,
    toggles,
    toggleDeleteEvent,
    onEventValueChange,
    onCreateEvent,
    onEventClick,
    onLinkType,
    onColorClick,
    removeProject,
    removeSubgroup,
    removeMember,
    removeOrganizers,
    errors,
    event,
  };
};

export default useNewEvent;
