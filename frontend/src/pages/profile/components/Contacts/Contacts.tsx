import React, { useEffect, useMemo, useState } from "react";
import Input from "@/components/common/input";
import { ReactComponent as SearchIcon } from "@/assets/icons/buttons/search.svg";
import Typography from "@/components/common/typography";
import Contact from "../Contact/Contact";
import Button from "@/components/common/button";
import { useNavigate } from "react-router-dom";
import { Profile } from "@/types";
import { useGetMeQuery } from "@/api/auth";
import { useSearchProfilesQuery } from "@/api/profile";

const Contacts: React.FC = () => {
  const navigate = useNavigate();
  const { data: me } = useGetMeQuery();
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data: suggestions = [], isFetching } = useSearchProfilesQuery(
    debouncedQuery,
    {
      skip: !debouncedQuery,
    },
  );
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const navigateToBlockedUsers = () => {
    navigate("/blocked-users");
  };

  return (
    <div className='event h-screen pb-[60px]'>
      <div className='mb-4 flex gap-x-2'>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={SearchIcon}
          placeholder='Поиск'
          className='w-full dark:bg-gray-300'
          inputClassname='dark:bg-gray-300'
        />
      </div>
      {query.length == 0 ? (
        <>
          <Typography className='text-[13px]'>Ваши контакты</Typography>
          <div className='mb-3 flex flex-col py-1.5'>
            {me?.contacts?.map((contact, index) => (
              <Contact
                contact={contact}
                onClick={() => {}}
              />
            ))}
          </div>
          <Typography className='text-[13px]'>Глобальный поиск</Typography>
          <div className='mb-4 flex flex-col py-1.5'>
            {me?.contacts.map((contact, index) => (
              <Contact
                contact={contact}
                onClick={() => {}}
              />
            ))}
          </div>
        </>
      ) : (
        <div className='mb-3 flex flex-col py-1.5'>
          {suggestions?.map((contact, index) => (
            <Contact
              contact={contact}
              onClick={() => {}}
            />
          ))}
        </div>
      )}
      <button className='mb-4 rounded-2xl border border-solid border-accent-100 bg-transparent py-[15px] text-[15px] text-accent-100'>
        􀉣 Одноразовая ссылка приглашение
      </button>
      {query.length == 0 ? (
        <button
          className='border-none bg-transparent py-1 text-center text-[15px] text-[#575757]'
          onClick={navigateToBlockedUsers}
        >
          Заблокированные контакты
        </button>
      ) : null}
    </div>
  );
};

export default Contacts;
