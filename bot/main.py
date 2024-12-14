from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import MenuButtonWebApp, WebAppInfo
from handlers import start
import os
import asyncio
from aiogram.client.bot import DefaultBotProperties
from aiogram.enums import ParseMode

dp = Dispatcher(storage=MemoryStorage())
bot = Bot(
    token=os.getenv("TELEGRAM_TOKEN"),
    default=DefaultBotProperties(parse_mode=ParseMode.HTML),
)
url = "https://" + os.getenv("URI")


async def main():
    dp.include_routers(start.router)
    await bot.set_chat_menu_button(
        menu_button=MenuButtonWebApp(text="Play", web_app=WebAppInfo(url=url))
    )
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
