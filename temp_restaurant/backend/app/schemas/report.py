from pydantic import BaseModel
from typing import Dict
from datetime import datetime

class ReportBase(BaseModel):
    type: str
    data_json: Dict

class ReportCreate(ReportBase):
    pass

class ReportOut(ReportBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True