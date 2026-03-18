from beanie import Document
from pydantic import BaseModel, Field
from datetime import datetime

class User(Document):
    name: str
    email: str
    password: str
    university: str
    college: str

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    university: str
    college: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    university: str
    college: str

    class Config:
        from_attributes = True