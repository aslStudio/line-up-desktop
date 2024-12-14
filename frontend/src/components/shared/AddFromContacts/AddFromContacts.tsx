import React, { useEffect, useState } from "react";
import Input from "@/components/common/input";
import { ReactComponent as SearchIcon } from "@/assets/icons/buttons/search.svg";
import { ReactComponent as CheckIcon } from "@/assets/icons/buttons/check-white.svg";
import { ReactComponent as ArrowRight } from "@/assets/icons/buttons/arrow.svg";
import Button from "@/components/common/button";
import { Profile } from "@/types";
import { useGetMeQuery } from "@/api/auth";
import { useSearchProfilesQuery } from "@/api/profile";

interface AddFromContactsProps {
  select: (contacts: Partial<Profile>[]) => void;
  selectedContacts: Partial<Profile>[];
}

type UserWithChecked = Partial<Profile> & { checked: boolean };

const AddFromContacts: React.FC<AddFromContactsProps> = (props) => {
  const { select, selectedContacts } = props;
  const [query, setQuery] = useState("");
  const [contacts, setContacts] = useState<UserWithChecked[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { data } = useGetMeQuery();
  const { data: suggestions = [], isFetching } = useSearchProfilesQuery(debouncedQuery, {
    skip: !debouncedQuery,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const baseContacts = query.length == 0 ? data?.contacts || [] : [];
    const searchResults = query.length > 0 ? suggestions : [];

    const allContacts = [...baseContacts, ...searchResults];

    const mappedData = allContacts?.map((contact: Profile) => ({
      ...contact,
      checked: !!contacts?.find((item) => contact.id == item.id)?.checked,
    }));

    setContacts((prev) => {
      const hasChanged = JSON.stringify(prev) !== JSON.stringify(mappedData);
      return hasChanged ? mappedData : prev;
    });
  }, [data, suggestions, query, selectedContacts]);

  const onContactClick = (position: number) => {
    const user = contacts[position];
    setContacts((prev) => prev.map((item, index) => (index == position ? { ...user, checked: !user.checked } : item)));
  };

  const checkboxClassname = (checked: boolean) => {
    if (!checked) {
      return "flex items-center justify-center border-2 border-solid border-gray-500 rounded-full min-w-[22px] min-h-[22px]";
    }
    return "flex items-center justify-center border-2 bg-sky-600 border-solid border-sky-600 rounded-full min-w-[22px] min-h-[22px]";
  };

  const addUsers = () => {
    const usersToAdd = contacts
      .filter((item) => item.checked)
      .map(({ checked, ...user }) => {
        return user;
      });
    select(usersToAdd as Partial<Profile>[]);
  };

  return (
    <div className="event h-screen p-4 pb-[80px]">
      <div className="flex gap-x-2 ">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={SearchIcon}
          placeholder="Поиск"
          className="w-full"
        />
      </div>
      <div className="flex flex-col py-5 mb-auto">
        {contacts?.map((contact, index) => (
          <div
            onClick={() => onContactClick(index)}
            key={index}
            className="py-1 flex items-center">
            <div className={checkboxClassname(contact.checked!)}>{contact.checked ? <CheckIcon className="w-[10px] h-[10px]" /> : null}</div>
            <div className="flex items-center w-full">
              <div className="bg-gray-600 ml-4 min-h-[52px] min-w-[52px] rounded-full"></div>
              <div className="flex flex-col w-full">
                <div className="w-full flex justify-between items-center py-5 px-3">
                  <span className="text-[17px] text-white-100">{contact?.user?.username}</span>
                  <ArrowRight className="rotate-[-90deg]" />
                </div>
                <div className="split"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button
        className="approve"
        onClick={addUsers}>
        Добавть{" "}
        {contacts?.reduce((count, item) => {
          return item.checked ? count + 1 : count;
        }, 0)}{" "}
        контакта
      </Button>
    </div>
  );
};

export default AddFromContacts;
