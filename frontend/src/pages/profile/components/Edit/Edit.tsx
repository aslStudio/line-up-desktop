import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as ProfileIcon } from "@/assets/icons/user.svg";
import { ReactComponent as TrashIcon } from "@/assets/icons/buttons/trash.svg";
import { ReactComponent as GrabberIcon } from "@/assets/icons/buttons/grabber.svg";
import Input from "../Input/Input";
import Button from "@/components/common/button";
import Typography from "@/components/common/typography";
import { useNavigate } from "react-router-dom";
import { useGetMeQuery } from "@/api/auth";
import { useUpdateProfileMutation } from "@/api/profile";
import { Profile } from "@/types";

const urlRegex =
  /^(https?:\/\/)?((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|((t\.me|telegram\.me|telegram\.org)\/[a-zA-Z0-9_]+))(\/[^\s]*)?$/;

const Edit = () => {
  const [userLinks, setUserLinks] = useState<string[]>([]);
  const [isAddLink, setIsAddLink] = useState(false);
  const [newLinkValue, setNewLinkValue] = useState<string>("");
  const [linkError, setLinkError] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const navigate = useNavigate();
  const { data: me, refetch: updateUser } = useGetMeQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const imageRef = useRef();

  useEffect(() => {
    if (me) {
      setProfile(me);
      setUserLinks(me.personal_links || []);
    }
  }, [me]);

  const handleInputChange = (
    field: keyof Profile,
    value: string | number | undefined,
  ) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const onLinkDelete = (value: string) => {
    setUserLinks((prev) => prev.filter((item) => item !== value));
  };

  const navigateToReset = () => {
    navigate("/password-reset");
  };

  const onLinkSave = () => {
    const isLinkValid = urlRegex.test(newLinkValue);
    if (isLinkValid) {
      setUserLinks((prev) => [...prev, newLinkValue]);
      setNewLinkValue("");
      setIsAddLink(false);
      return;
    }
    setLinkError(true);
    setTimeout(() => {
      setLinkError(false);
    }, 2000);
  };

  const onProfileSave = async () => {
    if (profile) {
      try {
        const { user, ...updatedProfile } = {
          ...profile,
          personal_links: userLinks,
        };
        await updateProfile(updatedProfile);
        await updateUser();
        navigate("/profile");
      } catch (error) {
        console.error("Failed to save profile:", error);
      }
    }
  };

  const onAddLink = () => {
    if (userLinks.length < 5) setIsAddLink(true);
  };

  const onProfileIconClick = () => {
    const inputFile = document.getElementById("file");
    inputFile!.click();
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className='flex min-h-screen flex-col px-4 py-6 pb-[80px]'>
      <div className='mx-auto mb-2 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gray-700'>
        <ProfileIcon
          width={48}
          height={48}
          onClick={onProfileIconClick}
        />
      </div>

      <div className='mb-5 flex flex-col gap-y-2'>
        <input
          type='file'
          id='file'
          accept='*'
          className='hidden'
          defaultValue={""}
        />
        <Input
          label='Имя'
          value={profile.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
        <Input
          label='Фамилия'
          value={profile.surname || ""}
          onChange={(e) => handleInputChange("surname", e.target.value)}
        />
        <Input
          label='Электронная почта'
          value={profile.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
        <Input
          label='О себе'
          value={profile.info}
          onChange={(e) => handleInputChange("info", e.target.value)}
        />
        <Input
          label='Telegram'
          value={profile.telegram || ""}
          onChange={(e) => handleInputChange("telegram", e.target.value)}
        />
        <Button
          className='bg-[#292929] !py-[15px] text-[17px] text-white-100 dark:bg-gray-300 dark:!text-black-100'
          onClick={navigateToReset}
        >
          Изменить пароль
        </Button>
      </div>

      <div>
        <Typography>Пользовательские ссылки (до 5 штук)</Typography>
        {userLinks?.map((item) => (
          <div
            className='flex items-center border-b border-gray-500 py-5 text-[17px] text-white-100'
            key={item}
          >
            <span className='min-w-[250px] max-w-[250px] text-ellipsis'>
              {item}
            </span>
            <TrashIcon
              width={20}
              onClick={() => onLinkDelete(item)}
              height={20}
            />
            <GrabberIcon
              className='ml-auto'
              width={22}
              height={22}
            />
          </div>
        ))}
        {!isAddLink ? (
          <button
            className='flex py-[14px] pl-4'
            onClick={onAddLink}
          >
            <Typography className='dark:text-accent-900 !text-accent-900 text-[20px]'>
              +
            </Typography>
            <Typography className='dark:text-accent-900 !text-accent-900 my-auto ml-[10px] text-[15px]'>
              Добавить
            </Typography>
          </button>
        ) : (
          <>
            <div
              className={`flex items-center gap-x-3 border-b py-4 ${linkError ? "border-[#FF0000]" : "border-gray-500"}`}
            >
              <input
                onChange={(e) => setNewLinkValue(e.target.value)}
                value={newLinkValue}
                placeholder='Введите ссылку'
                className='w-full bg-transparent text-gray-100 outline-none dark:text-black-100'
              />
              <span
                className='ml-auto cursor-pointer text-[13px] text-accent-100'
                onClick={onLinkSave}
              >
                Сохранить
              </span>
            </div>
            {linkError && (
              <span className='text-[#FF0000]'>
                Введите валидную ссылку, https://link.com
              </span>
            )}
          </>
        )}
      </div>

      <Button
        className='dark:bg-accent-900 mt-3 mt-auto bg-accent-100 dark:text-white-100'
        onClick={onProfileSave}
      >
        Сохранить
      </Button>
    </div>
  );
};

export default Edit;
