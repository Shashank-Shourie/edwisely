from pydantic import BaseModel

class UserLogin(BaseModel):
    email: str
    password: str


class AdminLogin(BaseModel):
    name: str
    password: str