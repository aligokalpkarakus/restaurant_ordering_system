from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    table_id = Column(Integer, ForeignKey("tables.id"))
    status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    session_id = Column(Integer, ForeignKey("table_sessions.id"), nullable=True)

    items = relationship("OrderItem", backref="order")