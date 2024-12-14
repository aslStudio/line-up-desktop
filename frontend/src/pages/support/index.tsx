import Typography from "@/components/common/typography";
import Card from "@/components/shared/Card/Card";
import { ReactComponent as ArrowIcon } from "@/assets/icons/buttons/arrow.svg";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const navigate = useNavigate();
  const tabs = {
    Помощь: [
      { title: "FAQ", route: "/faq" },
      { title: "Обучение", route: "/education" },
      { title: "Пользовательское соглашение", route: "/agreement" },
    ],
    Поддержка: [{ title: "Открыть чат с поддержкой", route: "" }],
  };

  const onTabClick = (path: string) => {
    navigate(path);
  };
  return (
    <div className='flex flex-col px-4 pt-8'>
      <Typography className='mb-4 text-[22px] font-bold text-white-100'>
        Помощь
      </Typography>
      <div className='mb-7 flex flex-col gap-y-2'>
        {tabs["Помощь"].map((item) => {
          return (
            <Card
              className='flex w-full cursor-pointer items-center justify-between py-5 text-[17px] text-white-100'
              onClick={() => onTabClick(item.route)}
            >
              <span>{item.title}</span>
              <ArrowIcon className='-rotate-90' />
            </Card>
          );
        })}
      </div>
      <Typography className='mb-4 text-[22px] font-bold text-white-100'>
        Поддержка
      </Typography>
      <div className='flex flex-col gap-y-2'>
        {tabs["Поддержка"].map((item) => {
          return (
            <Card
              className='flex w-full cursor-pointer items-center justify-between py-5 text-[17px] text-white-100'
              onClick={() => onTabClick(item.route)}
            >
              <span>{item.title}</span>
              <ArrowIcon className='-rotate-90' />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Support;
