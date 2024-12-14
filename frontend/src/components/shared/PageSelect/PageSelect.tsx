import Typography from "@/components/common/typography";
import { ReactComponent as InfoIcon } from "@/assets/icons/buttons/info.svg";
import { Project } from "@/types";
import { ReactNode } from "react";

interface PageSelectProps {
  items: Project[];
  onClick: (arg0: Project) => void;
  onInfoClick: (arg0: Project) => void;
  title: string;
  children?: ReactNode;
}
const PageSelect: React.FC<PageSelectProps> = (props) => {
  const { items, onClick, title, onInfoClick, children } = props;
  return (
    <div className='flex flex-col px-4 py-6'>
      <Typography className='mb-3 text-[20px] font-bold'>{title}</Typography>
      <div className='flex flex-col'>
        {items?.map((item: Project, index: number) => (
          <div
            key={item.id}
            className='dark:border-gray-350 flex cursor-pointer items-center justify-between border-b border-solid border-gray-600 py-5'
            onClick={() => onClick(item)}
          >
            <span className='text-[17px] text-white-100 dark:text-black-100'>
              {item.name}
            </span>
            <InfoIcon
              className='stroke-accent-100 text-center dark:stroke-accent-900'
              onClick={() => onInfoClick(item)}
            />
          </div>
        ))}
      </div>
      {children}
    </div>
  );
};
export default PageSelect;
