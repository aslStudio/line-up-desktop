import Typography from "@/components/common/typography";

import { IClassProps } from "@/types/component";
import "./index.css";
import { twMerge } from "tailwind-merge";
import { Profile } from "@/types";

interface IGuestsListProps extends IClassProps {
  guests: Profile[];
  guestCount: number;
}

export default function GuestsList({
  guests,
  guestCount,
  className,
}: IGuestsListProps) {
  const mergedClass = twMerge("guests", className);

  return (
    <div className={mergedClass}>
      {guests?.length ? (
        <>
          <div className='flex'>
            {guests.map((guest, index) => (
              <img
                key={index}
                className='avatar'
                src={guest.photo}
              />
            ))}
            {guestCount > 2 ? (
              <div className='avatar'>
                <Typography className='dakr:text-gray-400 m-auto text-[10px] font-medium text-[#FFFFFFA3]'>
                  +{guestCount - guests.length}
                </Typography>
              </div>
            ) : (
              <></>
            )}
          </div>
          <Typography className='nick'>
            {guests.at(0)?.name +
              (guestCount > 2 ? ` и ещё ${guestCount - guests?.length}` : "")}
          </Typography>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
