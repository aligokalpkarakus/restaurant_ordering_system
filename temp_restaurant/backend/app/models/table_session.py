from sqlalchemy import Column, Integer, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db import Base

class TableSession(Base):
    __tablename__ = "table_sessions"
    id = Column(Integer, primary_key=True, index=True)
    table_id = Column(Integer, ForeignKey("tables.id"), nullable=False)
    waiter_id = Column(Integer, ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True) 