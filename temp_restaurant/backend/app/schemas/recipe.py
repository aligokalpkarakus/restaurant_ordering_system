from pydantic import BaseModel

class RecipeBase(BaseModel):
    menu_item_id: int
    inventory_item_id: int
    amount: int

class RecipeCreate(RecipeBase):
    pass

class RecipeOut(RecipeBase):
    id: int
    class Config:
        orm_mode = True 