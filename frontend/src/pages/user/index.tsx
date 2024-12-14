import { ReactComponent as ProfileIcon } from "@/assets/icons/user.svg";
import { ReactComponent as ArrowIcon } from "@/assets/icons/buttons/arrow.svg";
import Typography from "@/components/common/typography";
import Card from "@/components/shared/Card/Card";
import { useState } from "react";
import BlockUser from "./components/BlockUser/BlockUser";
import { useParams } from "react-router-dom";
import { useGetProfileQuery } from "@/api/profile/index";

const User = () => {
  const { id } = useParams();
  const { data: user } = useGetProfileQuery(Number(id), { skip: !id });
  const [isBlocked, setIsBlocked] = useState(false);
  const [isBlockModal, setIsBlockModal] = useState(false);

  const onBlockUser = () => {
    setIsBlocked(true);
    toggleModal();
  };

  const toggleModal = () => {
    setIsBlockModal((prev) => !prev);
  };

  const onUnblockUser = () => {
    setIsBlocked(false);
  };

  const renderField = (
    field: boolean,
    value: string | null | undefined,
    hiddenText = "Скрыто",
  ) => {
    return field || user?.safety == "open" ? (
      value || "Не указано"
    ) : (
      <span className='text-accent-100 dark:text-accent-900'>{hiddenText}</span>
    );
  };

  if (!user) {
    return <Typography className='text-gray-400'>Loading...</Typography>;
  }

  return (
    <div className='flex min-h-screen flex-col items-center p-4 pb-[60px] pt-8'>
      <BlockUser
        onBlockClick={onBlockUser}
        username={user.user.username}
        open={isBlockModal}
        hide={toggleModal}
      />
      <div className='mx-auto mb-5 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-gray-700'>
        <ProfileIcon
          width={64}
          height={64}
        />
      </div>
      <div className='flex flex-col pb-5 text-center'>
        <Typography className='mb-1.5 text-[19px] text-white-100'>
          {user?.user.username} ·{" "}
          {user?.settings?.is_name ? (
            user?.name
          ) : (
            <span className='text-accent-100 dark:text-accent-900'>Скрыто</span>
          )}
        </Typography>
        <Typography className='text-[15px] text-gray-400'>
          {renderField(
            user?.settings?.is_phone,
            user?.user?.phone,
            "***********",
          )}
        </Typography>
      </div>
      <div className='flex w-full flex-col gap-y-2'>
        <Card className='flex w-full flex-col px-[18px] py-[9px]'>
          <Typography className='text-[15px] text-white-100'>
            {renderField(user?.settings?.is_about_me, user?.info)}
          </Typography>
          <Typography className='!text-gray-400'>О себе</Typography>
        </Card>
        <Card className='flex w-full flex-col px-[18px] py-[9px]'>
          <Typography className='text-[15px] text-white-100'>
            {renderField(user?.settings?.is_email, user?.email)}
          </Typography>
          <Typography className='!text-gray-400'>Электронная почта</Typography>
        </Card>
        <Card className='flex w-full items-center justify-between bg-[#52B5FC] py-[10px]'>
          <div className='flex flex-col'>
            <Typography className='text-[15px] text-white-100'>
              {renderField(
                user?.settings?.is_link_to_telegram,
                `${user?.telegram}`,
              )}
            </Typography>
            <Typography className='!text-gray-400'>Телеграм</Typography>
          </div>
          <ArrowIcon className='-rotate-90 sepia' />
        </Card>
        {user?.safety == "open" &&
          user?.personal_links?.map((link, index) => (
            <Card
              key={index}
              className='flex w-full items-center justify-between px-[18px] py-[19px]'
            >
              <Typography className='text-[17px] text-white-100'>
                {link}
              </Typography>
              <ArrowIcon className='-rotate-90' />
            </Card>
          ))}

        {!isBlocked ? (
          <button
            className='rounded-2xl bg-[#FF3333] py-4 text-[15px] text-white-100'
            onClick={toggleModal}
          >
            Заблокировать
          </button>
        ) : (
          <button
            className='rounded-2xl bg-[#33FFAA] py-4 text-[15px] text-black-100'
            onClick={onUnblockUser}
          >
            Разблокировать
          </button>
        )}
      </div>
    </div>
  );
};

export default User;
