from pydantic import BaseModel, EmailStr
from typing import Optional, Literal

class UserBase(BaseModel):
    name: str
    login: str
    email: EmailStr
    role: Literal["admin", "user"]


class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    name: Optional[str] = None
    login: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[Literal["admin", "user"]] = None
    password: Optional[str] = None  # se quiser permitir atualizar a senha aqui também

    class Config:
        orm_mode = True



class User(UserBase):
    id: str

    class Config:
        orm_mode = True
