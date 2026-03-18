from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from models.admin import Admin
from models.user import User
from models.subject import Subject

async def init_db():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.mydb
    await init_beanie(database=db, document_models=[User,Admin,Subject])