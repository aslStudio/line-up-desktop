import { ReactComponent as ProfileIcon } from "@/assets/icons/user.svg";
import { ReactComponent as ArrowIcon } from "@/assets/icons/buttons/arrow.svg";
import Typography from "@/components/common/typography";
import Card from "@/components/shared/Card/Card";
import { Checkbox } from "../Checkbox/Checkbox";
import { useEffect, useState } from "react";
import Switch from "@/components/common/switch";
import { useGetMeQuery } from "@/api/auth";
import {
  useUpdateProfileMutation,
  useUpdateProfilSettingsMutation,
} from "@/api/profile";

type PartialSettingKeys =
  | "is_about_me"
  | "is_email"
  | "is_link_to_telegram"
  | "is_name"
  | "is_phone";

const CONSTANTS: { [key: string]: string } = {
  is_about_me: "О себе",
  is_email: "Почта",
  is_link_to_telegram: "Ссылка на телеграм",
  is_name: "Имя",
  is_phone: "Телефон",
};
const Security = () => {
  const [mode, setMode] = useState<"closed" | "open" | "partial">("open");
  const [partialSettings, setPartialSettings] = useState<
    Record<PartialSettingKeys, boolean>
  >({
    is_about_me: false,
    is_email: false,
    is_link_to_telegram: false,
    is_name: false,
    is_phone: false,
  });
  const [updateProfile] = useUpdateProfileMutation();
  const [updateSettings] = useUpdateProfilSettingsMutation();

  const onModeChange = (mode: "closed" | "open" | "partial") => {
    setMode(mode);

    try {
      updateProfile({ id: me?.id, safety: mode });
    } catch {
      console.log("Error when update profile");
    }
  };

  const onToggleClick = (key: PartialSettingKeys) => {
    setPartialSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    try {
      //@ts-ignore
      updateSettings({ id: me?.id, ...partialSettings });
    } catch {
      console.log("error when update settings");
    }
  };

  const { data: me } = useGetMeQuery();

  useEffect(() => {
    if (me) {
      setMode(me.safety);
      setPartialSettings({
        is_about_me: me?.settings?.is_about_me,
        is_email: me.settings.is_email,
        is_link_to_telegram: me.settings.is_link_to_telegram,
        is_name: me.settings.is_name,
        is_phone: me.settings.is_phone,
      });
    }
  }, [me]);

  return (
    <div className='flex min-h-screen flex-col items-center p-4 pb-[70px]'>
      <Typography className='mb-10 mr-auto !text-gray-500'>
        Так выглядит ваш профиль для других
      </Typography>
      <div className='mx-auto mb-5 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-gray-700'>
        <ProfileIcon
          width={48}
          height={48}
        />
      </div>
      <Typography className='mb-1.5 text-[18px] text-white-100'>{`${me?.user?.username} · ${mode == "open" || mode == "closed" || (mode == "partial" && partialSettings.is_name) ? me?.name : "********"}`}</Typography>
      <Typography className='mb-7 text-gray-400'>{`${(mode == "partial" && partialSettings.is_phone) || mode == "open" ? me?.user.phone : "***********"}`}</Typography>
      {mode != "closed" ? (
        <div className='mb-8 flex w-full flex-col gap-y-2'>
          <Card className='flex w-full flex-col px-[18px] py-[9px]'>
            <Typography className='text-[15px] text-white-100'>
              {(mode == "partial" && partialSettings.is_about_me) ||
              mode == "open" ? (
                me?.info
              ) : (
                <span className='dark:text-accent-900 text-accent-100'>
                  Скрыто
                </span>
              )}
            </Typography>
            <Typography className='text-gray-400'>О себе</Typography>
          </Card>
          <Card className='flex w-full flex-col px-[18px] py-[9px]'>
            <Typography className='text-[15px] text-white-100'>
              {(mode == "partial" && partialSettings.is_email) ||
              mode == "open" ? (
                me?.email
              ) : (
                <span className='dark:text-accent-900 text-accent-100'>
                  Скрыто
                </span>
              )}
            </Typography>
            <Typography className='text-gray-400'>Электронная почта</Typography>
          </Card>
          <div className='flex gap-x-2'>
            <Card className='flex w-full flex-col px-[18px] py-[9px]'>
              <Typography className='text-[15px] text-white-100'>
                {(mode == "partial" && partialSettings.is_link_to_telegram) ||
                mode == "open" ? (
                  me?.telegram
                ) : (
                  <span className='dark:text-accent-900 text-accent-100'>
                    Скрыто
                  </span>
                )}
              </Typography>
              <Typography className='text-gray-400'>Телеграм</Typography>
            </Card>
          </div>
          {mode == "open" ? (
            <>
              {me?.personal_links?.map((link) => (
                <Card className='flex w-full items-center justify-between px-[18px] py-[19px]'>
                  <Typography className='text-[17px]'>{link}</Typography>
                  <ArrowIcon className='-rotate-90' />
                </Card>
              ))}
            </>
          ) : null}
        </div>
      ) : null}
      <Typography className='mb-[18px] mr-auto text-[22px] font-bold text-white-100'>
        Безопасность
      </Typography>
      <div className='flex w-full flex-col'>
        <div
          className='flex items-center gap-x-4 py-[9px]'
          onClick={() => onModeChange("open")}
        >
          <Checkbox checked={mode == "open"} />
          <div className='flex flex-col'>
            <Typography>Открытый профиль</Typography>
            <Typography className='!text-gray-400'>Все данные видны</Typography>
          </div>
        </div>
        <div
          className='flex items-center gap-x-4 py-[9px]'
          onClick={() => onModeChange("partial")}
        >
          <Checkbox checked={mode == "partial"} />

          <div className='flex flex-col'>
            <Typography>Частичная информация</Typography>
            <Typography className='!text-gray-400'>
              Только отмеченное вами
            </Typography>
          </div>
        </div>
        {mode == "partial" ? (
          <div>
            {Object.keys(partialSettings).map((key) => (
              <div
                className='flex items-center justify-between py-[9px]'
                key={key}
              >
                <span className='text-[15px] text-white-100 dark:text-black-100'>
                  {CONSTANTS[key as PartialSettingKeys]}
                </span>
                <Switch
                  state={partialSettings[key as PartialSettingKeys]}
                  onSwitch={() => onToggleClick(key as PartialSettingKeys)}
                />
              </div>
            ))}
          </div>
        ) : null}
        <div
          className='flex items-center gap-x-4 py-[9px]'
          onClick={() => onModeChange("closed")}
        >
          <Checkbox checked={mode == "closed"} />
          <div className='flex flex-col'>
            <Typography>Закрытый профиль</Typography>
            <Typography className='!text-gray-400'>
              Только фото, имя и никнейм
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
