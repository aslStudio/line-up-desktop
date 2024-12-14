import { IClassProps } from "@/types/component";
import { EventData } from "@/types";
import "./index.css";

import { twMerge } from "tailwind-merge";
import Typography from "@/components/common/typography";
import PlanStatusLabel from "@/components/common/status-label";
import GuestsList from "../../../guest-list";
import { useNavigate } from "react-router-dom";
import { PlanStatus } from "@/types/calendar";
import { format } from "date-fns";

interface IPlanProps extends IClassProps {
  plan: EventData;
}

export default function Plan({ className, plan }: IPlanProps) {
  const mergedClass = twMerge("week-plan", className);
  const navigate = useNavigate();
  const { event, additional_detail, start_date, end_date, participants } = plan as EventData;
  const { name, color, address } = event;

  const navigateToEvent = () => {
    navigate(`/event/${event.id}`);
  };

  return (
    <div
      className={mergedClass}
      onClick={navigateToEvent}>
      <div className="card">
        <div
          className="highlight"
          style={{ background: color || "#FF6D33" }}
        />
        <Typography
          className="header"
          style={{ color: color || "#FF6D33" }}>
          {event?.project?.name}
        </Typography>
        <Typography
          className="header"
          style={{ color: color || "#FF6D33" }}>
          {address}
        </Typography>
        <Typography className="title">{name}</Typography>
        <Typography className="time">{`${format(new Date(start_date), "HH:mm")} - ${format(new Date(end_date), "HH:mm")}`}</Typography>
        {participants?.length ? (
          <GuestsList
            guests={additional_detail?.participants}
            guestCount={additional_detail?.number_of_participants}
          />
        ) : (
          <></>
        )}
        <PlanStatusLabel
          status={PlanStatus.Pending}
          className="mt-auto"
        />
      </div>
    </div>
  );
}
