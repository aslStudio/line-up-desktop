import { PlanStatus, statusTranslate } from "@/types/calendar";
import Typography from "../typography";
import './index.css'
import { IClassProps } from "@/types/component";
import { twMerge } from "tailwind-merge";

interface IPlanStatusProps extends IClassProps {
  status: PlanStatus
}

export default function PlanStatusLabel({ status, className }: IPlanStatusProps) {
  const mergedClass = twMerge('status-label', status, className)
  return (
    <div className={mergedClass}>
      <Typography className={`text-[10px] font-medium`}>
        { statusTranslate[status] }
      </Typography>
    </div>
  )
}