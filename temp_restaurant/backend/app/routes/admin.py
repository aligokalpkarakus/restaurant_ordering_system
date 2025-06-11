from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models.user import User
from app.models.table import Table
from app.models.menu import MenuItem
from app.models.report import Report

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    user_count = db.query(User).count()
    table_count = db.query(Table).count()
    menu_count = db.query(MenuItem).count()
    report_count = db.query(Report).count()
    return {
        "user_count": user_count,
        "table_count": table_count,
        "menu_count": menu_count,
        "report_count": report_count
    } 