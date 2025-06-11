from sqlalchemy import Column, Integer, Numeric, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db import Base

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    amount = Column(Numeric(10, 2))
    method = Column(String(50))
    is_paid = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 