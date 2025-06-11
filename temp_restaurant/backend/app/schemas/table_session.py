from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TableSessionBase(BaseModel):
    table_id: int
    waiter_id: Optional[int]
    is_active: Optional[bool] = True

class TableSessionCreate(TableSessionBase):
    pass

class TableSessionOut(TableSessionBase):
    id: int
    started_at: datetime
    ended_at: Optional[datetime]

    class Config:
        orm_mode = True 