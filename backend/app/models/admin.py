from beanie import Document
from pydantic import Field
from typing import Optional
from datetime import datetime

class Admin(Document):
    name: str = Field(..., min_length=2, max_length=50)
    password: str  # hash this using bcrypt

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"