from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    name: Optional[str]
    email: Optional[EmailStr]
    role: Optional[str]
    password: Optional[str]