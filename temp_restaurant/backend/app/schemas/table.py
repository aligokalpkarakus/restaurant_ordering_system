from pydantic import BaseModel
from typing import Optional

class TableBase(BaseModel):
    qr_code: str
    is_occupied: Optional[bool] = False
    assigned_server_id: Optional[int]

class TableCreate(TableBase):
    pass

class TableOut(TableBase):
    id: int

    class Config:
        orm_mode = True

class TableUpdate(BaseModel):
    qr_code: Optional[str]
    is_occupied: Optional[bool]
    assigned_server_id: Optional[int]