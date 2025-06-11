from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from app.db import Base

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    data_json = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())