from pydantic import BaseModel

class InventoryBase(BaseModel):
    item_name: str
    quantity: int
    low_stock_threshold: int

class InventoryCreate(InventoryBase):
    pass

class InventoryOut(InventoryBase):
    id: int

    class Config:
        orm_mode = True