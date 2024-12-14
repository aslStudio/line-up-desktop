import React, { useEffect, useState } from "react";
import { useUpdateProfilSettingsMutation } from "@/api/profile";
import { useGetMeQuery } from "@/api/auth";
import Typography from "@/components/common/typography";
import Switch from "@/components/common/switch";

// Define the mapping of settings keys to Russian labels and categories
const settingsMapping = {
  Общее: {
    is_from_app: "Уведомления от приложения",
    is_reminder_about_event: "Напоминание о событии",
    is_user_confirmed_event: "Пользователь подтвердил событие",
  },
  "Для расписания": {
    is_invite_to_schedule: "Приглашение в расписание",
    is_invite_to_event: "Приглашение в событие",
    is_change_in_event: "Изменение в событии",
    is_cancellation_event: "Отмена события",
    is_new_open_event: "Новое открытое событие",
  },
  "Для проекта": {
    is_new_application: "Новая заявка",
    is_project_change_in_event: "Изменение в событии",
    is_user_refused_to_participate: "Пользователь отказался от участия",
    is_user_left_project: "Пользователь покинул проект",
    is_user_joined_project: "Пользователь вступил в проект",
  },
};

const NotificationSettings: React.FC = () => {
  const { data: me } = useGetMeQuery();
  const [settings, setSettings] = useState<any | null>(null);
  const [updateSettings] = useUpdateProfilSettingsMutation();

  useEffect(() => {
    if (me?.settings?.notification_settings) {
      setSettings(me.settings.notification_settings);
    }
  }, [me]);

  const handleToggle = (settingKey: string) => {
    if (!me || !settings) return;

    const updatedSettings = {
      ...settings,
      [settingKey]: !settings[settingKey],
    };
    setSettings(updatedSettings);

    updateSettings({
      ...me,
      settings: {
        ...me.settings,
        notification_settings: settings,
      },
    })
      .unwrap()
      .then(() => {
        console.log(`Successfully updated setting: ${settingKey}`);
      })
      .catch((error) => {
        console.error("Failed to update notification settings:", error);

        setSettings(settings);
      });
  };

  if (!me || !settings) return <p>Загрузка...</p>;

  return (
    <div className='flex flex-col p-4 pb-20 pt-0'>
      {Object.entries(settingsMapping).map(([category, categorySettings]) => (
        <div
          key={category}
          className='border-white mb-2 border-b border-solid border-gray-600 pt-6'
        >
          <Typography className='mb-2.5 text-[17px] font-semibold text-white-100'>
            {category}
          </Typography>
          <div className='flex flex-col gap-y-[2px]'>
            {Object.entries(categorySettings).map(([key, label]) => (
              <div
                key={key}
                className='flex items-center justify-between py-[9px]'
              >
                <Typography className='text-[15px] text-white-100'>
                  {label}
                </Typography>
                <Switch
                  state={settings[key as keyof typeof settings]}
                  onSwitch={() => handleToggle(key)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSettings;
