import Typography from "@/components/common/typography";
import React from "react";

const Agreement = () => {
  const sections: { [key: string]: string[] } = {
    "Куча текста": [
      "Разливайте напитки и следите, чтобы на столах всегда было достаточно воды, сока, и других напитков.",
      "Быстро реагируйте на запросы гостей, если нужно пополнить запасы или убрать пустые стаканы.",
    ],
    "Поддержание чистоты": [
      "Убирайте использованные стаканы, салфетки и другой мусор с зоны обслуживания.",
      "Следите за тем, чтобы в зале и в местах для гостей было чисто и уютно.",
    ],
    "Заполнение и перенос запасов:": [
      "Обеспечивайте, чтобы холодильники и барные стойки всегда были полны. При необходимости, пополняйте запасы напитков.",
      "Переносите коробки с напитками из склада к месту раздачи.",
    ],
    "Поддержка работы кухни и бара:": [
      "Помогайте кухонному персон",
      "Помогайте с переносом чистой посуды и возвращением использованной посуды на кухню для мытья.",
      "Убедитесь, что на кухне все готово для своевременной подачи напитков и закусок.",
    ],
  };

  return (
    <div className='flex w-full flex-col px-4 pb-[70px] pt-8'>
      <Typography className='mb-7 text-[22px] font-semibold text-white-100'>
        Пользовательское соглашениие
      </Typography>

      {Object.keys(sections).map((section) => (
        <>
          <Typography className='font-semibold text-white-100'>
            {section}
          </Typography>
          <ul className='my-3 ml-4 list-disc text-white-100 dark:text-black-100'>
            {sections[section].map((paragraph: string) => (
              <li className='text-[14px] text-gray-100 dark:text-black-100'>
                {paragraph}
              </li>
            ))}
          </ul>
        </>
      ))}
    </div>
  );
};

export default Agreement;
