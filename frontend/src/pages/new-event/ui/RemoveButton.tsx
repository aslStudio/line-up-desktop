import React from "react";

interface RemoveButtonProps {
  onClick: () => void;
}
const RemoveButton: React.FC<RemoveButtonProps> = (props) => {
  const { onClick } = props;
  return (
    <div
      className="rounded-full flex items-center justify-center w-[22px] bg-[#FF6D33] h-[22px] cursor-pointer"
      onClick={onClick}>
      <div className="w-[10px] bg-black-100 h-[1px] rounded-full"></div>
    </div>
  );
};

export default RemoveButton;
