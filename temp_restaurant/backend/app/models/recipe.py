from sqlalchemy import Column, Integer, ForeignKey
from app.db import Base

class Recipe(Base):
    __tablename__ = "recipes"
    id = Column(Integer, primary_key=True, index=True)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id", ondelete="CASCADE"), nullable=False)
    inventory_item_id = Column(Integer, ForeignKey("inventory.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Integer, nullable=False) 