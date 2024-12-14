import { IDay } from "@/types/calendar";
import { eachDayOfInterval, format } from "date-fns";
import { EventData, Project, Subgroup } from "@/types";
export const getDaysWithEvents = (events: EventData[], start_date: Date, endDate: Date): IDay[] => {
  const days = eachDayOfInterval({ start: start_date!, end: endDate! });

  const daysWithEventsMap = days.reduce<Record<string, EventData[]>>((acc, date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    acc[formattedDate] = [];
    return acc;
  }, {});

  events?.forEach((event) => {
    const eventDate = format(new Date(event.start_date), "yyyy-MM-dd");

    if (daysWithEventsMap[eventDate]) {
      daysWithEventsMap[eventDate].push(event);
    }
  });

  return days.map((date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return {
      date,
      plans: daysWithEventsMap[formattedDate] || [],
    };
  });
};

export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export function createQueryParams(params: Record<string, string | number | boolean | (string | number | boolean)[] | undefined | null>): string {
  return Object.entries(params)
    .flatMap(([key, value]) => {
      if (value === undefined || value === null) return [];
      if (Array.isArray(value)) {
        return value.map((item) => `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    })
    .join("&");
}

export function collectSubgroups(data: Project[]): Subgroup[] {
  const allSubgroups = new Set();
  data.forEach((project) => {
    project.events!.forEach((event) => {
      event?.subgroups.forEach((subgroup) => {
        allSubgroups.add(subgroup);
      });
    });
  });
  return Array.from(allSubgroups) as Subgroup[];
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Текст успешно скопирован в буфер обмена!");
  } catch (err) {
    console.error("Ошибка копирования в буфер обмена: ", err);
  }
}
