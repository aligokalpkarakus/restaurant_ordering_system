from pydantic import BaseModel
from typing import Optional

class OrderItemBase(BaseModel):
    menu_item_id: int
    quantity: int
    special_instructions: Optional[str] = None

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemOut(OrderItemBase):
    id: int
    menu_item_name: str
    price: float

    class Config:
        orm_mode = True