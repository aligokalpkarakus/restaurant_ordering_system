from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .order_item import OrderItemCreate, OrderItemOut

class OrderBase(BaseModel):
    table_id: int
    status: str
    session_id: Optional[int] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]
    amount: float
    method: str

class OrderOut(OrderBase):
    id: int
    created_at: datetime
    items: List[OrderItemOut]

    class Config:
        orm_mode = True