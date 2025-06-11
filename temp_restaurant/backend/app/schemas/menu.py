from pydantic import BaseModel
from typing import Optional

class MenuItemBase(BaseModel):
    name: str
    description: Optional[str]
    price: float
    category: str
    image_url: Optional[str]
    dietary_info: Optional[str]

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemOut(MenuItemBase):
    id: int

    class Config:
        orm_mode = True