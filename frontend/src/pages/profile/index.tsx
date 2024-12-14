import Typography from "@/components/common/typography";
import Card from "../../components/shared/Card/Card";
import { ReactComponent as CopyIcon } from "@/assets/icons/buttons/copy.svg";
import { ReactComponent as HeartIcon } from "@/assets/icons/heart.svg";
import { ReactComponent as ChatIcon } from "@/assets/icons/chat.svg";
import { ReactComponent as SecurityIcon } from "@/assets/icons/security.svg";
import { ReactComponent as LightningIcon } from "@/assets/icons/lightning.svg";
import { ReactComponent as ContactsIcon } from "@/assets/icons/contacts.svg";
import { ReactComponent as ArrowIcon } from "@/assets/icons/buttons/arrow.svg";

import Button from "@/components/common/button";
import Switch from "@/components/common/switch";
import AccountDelete from "./components/AccountDelete/AccountDelete";
import { useState } from "react";
import Logout from "./components/Logout/Logout";
import { useNavigate } from "react-router-dom";
import { useGetMeQuery } from "@/api/auth";
import { copyToClipboard } from "@/utils";
import { useTheme } from "@/router/theme";

const settings = [
  "Найти меня по никнейму",
  "Предупреждать о ближайших событиях при ключевых действиях",
];
const tabs = [
  {
    icon: (
      <HeartIcon
        height={22}
        width={24}
      />
    ),
    name: "Избранное",
    path: "",
  },
  {
    icon: (
      <ContactsIcon
        height={22}
        width={32}
      />
    ),
    name: "Контакты",
    path: "/contacts",
  },
  {
    icon: (
      <ChatIcon
        height={22}
        width={26}
      />
    ),
    name: "Поддержка",
    path: "/support",
  },
  {
    icon: (
      <SecurityIcon
        height={22}
        width={28}
      />
    ),
    name: "Безопасность",
    path: "/security",
  },
  {
    icon: (
      <LightningIcon
        width={18}
        height={22}
      />
    ),
    name: "Подписка",
    path: "",
  },
];
const Profile = () => {
  const { data: me } = useGetMeQuery();
  const { toggleTheme, theme } = useTheme();
  const [showDelete, setShowDelete] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  const toggleDelete = () => {
    setShowDelete((prev) => !prev);
  };
  const toggleLogout = () => {
    setShowLogout((prev) => !prev);
  };

  const onProfileEdit = () => {
    navigate("/profile/edit");
  };

  return (
    <div className='flex flex-col px-4 py-8 pb-[80px]'>
      <Typography className='mb-4 text-[22px] font-semibold text-white-100'>
        Профиль
      </Typography>
      <Card className='mb-2 flex items-center gap-x-3'>
        <img
          width={36}
          height={36}
          className='max-h-[36px] min-h-[36px] min-w-[36px] max-w-[36px] rounded-full'
          src='https://s3-alpha-sig.figma.com/img/4515/5dff/c65a2619764273bb6846fd50b4fb7185?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=APVwTdVAYF7zZe9mdv6Rd1YTQxfDMQgCRp863gRfGHOXVCjCOZOvIk2jAZq~CLCnSPy9kuUgf~VJMJTAUGZVL9NgOZDtVdPLRBdgViwNG2m5aGmQ9Uaz5duzNLs28vP5YgjQc51JX-~tUE92tYKGtxhTGgDxVzOLXkQDff~Ne3ku234tCqAT7~GzDGYE~RmmPtPKvFj~FhYujJeusfTQI1DjW5evs9Jml~bvc74hZIHMMO8B4R91XK8LUXHbsuKwgUQNEG07aK4Adh6YG1msFZp-kxciehoOqBtiMWwBv27tBeAoc-j3PsaRS2Zqob7eh4IZLzPHF~~ZBnylrGO7DA__'
        />
        <div className='flex flex-col'>
          <Typography className='text-[15px] text-white-100'>
            {me?.user?.username}
          </Typography>
          <Typography className='text-[13px]'>{me?.name}</Typography>
        </div>
      </Card>
      <div className='mb-2 flex gap-x-2'>
        <Card className='flex w-full flex-col'>
          <div className='flex items-center justify-between'>
            <Typography className='max-w-[107px] truncate text-white-100'>
              {me?.telegram}
            </Typography>
            <CopyIcon
              className='dark:stroke-accent-900 cursor-pointer stroke-accent-100'
              width={20}
              height={20}
              onClick={() => copyToClipboard(me?.telegram || "")}
            />
          </div>
          <Typography className='text-[13px]'>Телеграм</Typography>
        </Card>
      </div>
      <Button
        className='dark:!bg-accent-900 !text:black-100 mb-7 !bg-accent-100 dark:!text-white-100'
        onClick={onProfileEdit}
      >
        Редактировать профиль
      </Button>
      <Typography className='mb-4 text-[22px] font-semibold text-white-100'>
        Настройки
      </Typography>
      <div className='mb-2 flex flex-col gap-y-2'>
        <Card className='flex items-center justify-between gap-x-3'>
          <Typography className='text-[15px] text-white-100 dark:text-black-100'>
            Темная тема
          </Typography>{" "}
          <Switch
            onSwitch={toggleTheme}
            state={theme != "dark"}
          />
        </Card>
        {settings.map((rule, index) => (
          <Card
            key={index}
            className='flex items-center justify-between gap-x-3'
          >
            <Typography className='text-[15px] text-white-100 dark:text-black-100'>
              {rule}
            </Typography>{" "}
            <Switch />
          </Card>
        ))}
      </div>
      <Card className='mb-2 flex flex-col'>
        {tabs.map((tab) => (
          <div
            className='flex cursor-pointer items-center gap-x-[21px] pl-[9px]'
            onClick={() => navigate(tab.path)}
          >
            <div className='j flex min-w-[32px] max-w-[32px] items-end justify-center'>
              {tab.icon}
            </div>
            <div className='flex w-full items-center justify-between border-b border-solid border-gray-500 py-3'>
              <Typography className='text-[17px] text-white-100'>
                {tab.name}
              </Typography>
              <ArrowIcon className='-rotate-90' />
            </div>
          </div>
        ))}
      </Card>

      <button
        className='py-4'
        onClick={toggleLogout}
      >
        <Typography className='text-[15px] !text-gray-500'>
          Выйти из аккаунта
        </Typography>
      </button>
      <button
        className='py-4'
        onClick={toggleDelete}
      >
        <Typography className='text-[15px] !text-[#FF3333]'>
          Удалить аккаунт
        </Typography>
      </button>
      <AccountDelete
        hide={toggleDelete}
        open={showDelete}
      />
      <Logout
        hide={toggleLogout}
        open={showLogout}
      />
    </div>
  );
};

export default Profile;
