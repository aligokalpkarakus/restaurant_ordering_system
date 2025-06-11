from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.schemas.menu import MenuItemCreate, MenuItemOut
from app.models.menu import MenuItem
from app.db import SessionLocal
import os
from fastapi.responses import JSONResponse

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload-image")
def upload_image(file: UploadFile = File(...)):
    file_ext = os.path.splitext(file.filename)[1]
    if file_ext.lower() not in [".png", ".jpg", ".jpeg", ".gif", ".webp"]:
        raise HTTPException(status_code=400, detail="Geçersiz dosya türü")
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    return {"image_url": f"/{UPLOAD_DIR}/{file.filename}"}

@router.get("/", response_model=list[MenuItemOut])
def get_menu_items(db: Session = Depends(get_db)):
    return db.query(MenuItem).all()

@router.get("/category/{category}", response_model=list[MenuItemOut])
def get_menu_items_by_category(category: str, db: Session = Depends(get_db)):
    return db.query(MenuItem).filter(MenuItem.category == category).all()

@router.post("/", response_model=MenuItemOut)
def create_menu_item(item: MenuItemCreate, db: Session = Depends(get_db)):
    db_item = MenuItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{item_id}")
def delete_menu_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    db.delete(db_item)
    db.commit()
    return {"message": "Menu item deleted"}

@router.put("/{item_id}", response_model=MenuItemOut)
def update_menu_item(item_id: int, item: MenuItemCreate, db: Session = Depends(get_db)):
    db_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    for key, value in item.dict().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item