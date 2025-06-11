from sqlalchemy import Column, Integer, String, Numeric, Text
from app.db import Base

class MenuItem(Base):
    __tablename__ = "menu_items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    price = Column(Numeric(10, 2))
    category = Column(String)
    image_url = Column(Text)
    dietary_info = Column(String)