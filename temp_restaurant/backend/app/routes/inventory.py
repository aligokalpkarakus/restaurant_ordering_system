from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.inventory import InventoryCreate, InventoryOut
from app.models.inventory import Inventory
from app.db import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[InventoryOut])
def get_inventory(db: Session = Depends(get_db)):
    return db.query(Inventory).all()

@router.post("/", response_model=InventoryOut)
def add_inventory(item: InventoryCreate, db: Session = Depends(get_db)):
    db_item = Inventory(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.patch("/{item_id}/add")
def add_stock(item_id: int, amount: dict, db: Session = Depends(get_db)):
    db_item = db.query(Inventory).filter(Inventory.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    add_amount = amount.get("amount")
    if not isinstance(add_amount, int) or add_amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")
    db_item.quantity += add_amount
    db.commit()
    db.refresh(db_item)
    return {"message": "Stock updated", "item_id": item_id, "new_quantity": db_item.quantity}