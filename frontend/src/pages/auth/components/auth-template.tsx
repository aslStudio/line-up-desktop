import Typography from "@/components/common/typography";
import { IComponentProps } from "@/types/component";
import "./index.css";

interface IAuthTemplate extends IComponentProps {
  title: string;
  subTitle: string;
}

export default function AuthTemplate({
  title,
  subTitle,
  children,
}: IAuthTemplate) {
  return (
    <main className='auth'>
      <div className='m-auto flex h-fit w-[343px] flex-col text-center'>
        <Typography className='title dark:!text-black-100'>{title}</Typography>
        <Typography className='sub-title dark:text-[#888888]'>
          {subTitle}
        </Typography>
        {children}
      </div>
    </main>
  );
}
