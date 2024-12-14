import React from "react";
import { ReactComponent as ArrowIcon } from "@/assets/icons/buttons/arrow.svg";

interface ApproveButtonProps {
  onClick: () => void;
}
const ApproveButton: React.FC<ApproveButtonProps> = (props) => {
  const { onClick } = props;
  return (
    <div
      className="rounded-full flex items-center justify-center w-[22px] bg-accent-100 h-[22px] cursor-pointer"
      onClick={onClick}>
      <ArrowIcon className="max-w-[10px] max-h-[10px] brightness-50" />
    </div>
  );
};

export default ApproveButton;
