import Accordion from "@/components/common/accordion";
import Typography from "@/components/common/typography";

const Faq = () => {
  return (
    <div className='flex w-full flex-col px-4 pb-[70px] pt-8'>
      <Typography className='mb-7 text-[22px] font-semibold text-white-100'>
        FAQ
      </Typography>

      {Array.from({ length: 10 }).map(() => (
        <div className='border-b border-gray-600 py-5'>
          <Accordion
            title='Какой-то крутой вопрос?'
            collapsed={true}
          >
            <span className='text-[14px] text-white-100 dark:text-black-100'>
              Не менее крутой ответ. Убирайте использованные стаканы, салфетки и
              другой мусор с зоны обслуживания. Следите за тем, чтобы в зале и в
              местах для гостей было чисто и уютно.
            </span>
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default Faq;
