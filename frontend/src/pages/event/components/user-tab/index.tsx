import Typography from "@/components/common/typography";
import { ReactComponent as ArrowIcon } from '@/assets/icons/buttons/arrow.svg';

import './index.css'

interface IUserTabProps {
  name: string
}

export default function UserTab({ name }: IUserTabProps) {

  return (
    <div className="user-tab">
      <div className="bg-gray-600 min-w-[52px] h-[52px] my-auto rounded-full" />
      <div className="user-tab-name">
        <Typography className="dark:text-white-100 my-auto">
          { name }
        </Typography>
        <ArrowIcon className="my-auto rotate-[-100grad] !fill-[#EBEBF54D]" />
      </div>
    </div>
  )
}