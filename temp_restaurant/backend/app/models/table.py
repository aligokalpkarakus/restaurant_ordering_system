from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.db import Base

class Table(Base):
    __tablename__ = "tables"
    id = Column(Integer, primary_key=True, index=True)
    qr_code = Column(String, unique=True)
    is_occupied = Column(Boolean, default=False)
    assigned_server_id = Column(Integer, ForeignKey("users.id"))