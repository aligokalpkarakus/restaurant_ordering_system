from sqlalchemy import Column, Integer, String
from app.db import Base

class Inventory(Base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String)
    quantity = Column(Integer)
    low_stock_threshold = Column(Integer)