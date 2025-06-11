from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.table import TableCreate, TableUpdate, TableOut
from app.models.table import Table
from app.db import SessionLocal
from app.models.table_session import TableSession
from app.models.user import User
from app.schemas.table_session import TableSessionCreate, TableSessionOut
from datetime import datetime

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[TableOut])
def get_all_tables(db: Session = Depends(get_db)):
    return db.query(Table).all()

@router.post("/", response_model=TableOut)
def create_table(table: TableCreate, db: Session = Depends(get_db)):
    db_table = Table(**table.dict())
    db.add(db_table)
    db.commit()
    db.refresh(db_table)
    return db_table

@router.put("/{table_id}/status", response_model=TableOut)
def update_table_status(table_id: int, is_occupied: bool, db: Session = Depends(get_db)):
    db_table = db.query(Table).filter(Table.id == table_id).first()
    if not db_table:
        raise HTTPException(status_code=404, detail="Table not found")
    db_table.is_occupied = is_occupied
    db.commit()
    db.refresh(db_table)
    return db_table

@router.put("/{table_id}", response_model=TableOut)
def update_table(table_id: int, table: TableUpdate, db: Session = Depends(get_db)):
    db_table = db.query(Table).filter(Table.id == table_id).first()
    if not db_table:
        raise HTTPException(status_code=404, detail="Table not found")
    for key, value in table.dict(exclude_unset=True).items():
        setattr(db_table, key, value)
    db.commit()
    db.refresh(db_table)
    return db_table

@router.delete("/{table_id}")
def delete_table(table_id: int, db: Session = Depends(get_db)):
    db_table = db.query(Table).filter(Table.id == table_id).first()
    if not db_table:
        raise HTTPException(status_code=404, detail="Table not found")
    db.delete(db_table)
    db.commit()
    return {"message": "Table deleted"}

@router.get("/session/active/{table_id}", response_model=TableSessionOut)
def get_active_session(table_id: int, db: Session = Depends(get_db)):
    session = db.query(TableSession).filter_by(table_id=table_id, is_active=True).first()
    if not session:
        raise HTTPException(status_code=404, detail="Aktif oturum yok")
    return session

@router.post("/session/start", response_model=TableSessionOut)
def start_session(session: TableSessionCreate, db: Session = Depends(get_db)):
    # Önce o masada aktif oturum var mı kontrol et
    active = db.query(TableSession).filter_by(table_id=session.table_id, is_active=True).first()
    if active:
        raise HTTPException(status_code=400, detail="Bu masada zaten aktif oturum var")
    new_session = TableSession(
        table_id=session.table_id,
        waiter_id=session.waiter_id,
        is_active=True
    )
    db.add(new_session)
    # Masayı dolu yap
    table = db.query(Table).filter_by(id=session.table_id).first()
    if table:
        table.is_occupied = True
    db.commit()
    db.refresh(new_session)
    return new_session

@router.post("/session/end/{session_id}")
def end_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(TableSession).filter_by(id=session_id, is_active=True).first()
    if not session:
        raise HTTPException(status_code=404, detail="Oturum bulunamadı veya zaten kapalı")
    session.is_active = False
    session.ended_at = datetime.utcnow()
    # Masayı boş yap
    table = db.query(Table).filter_by(id=session.table_id).first()
    if table:
        table.is_occupied = False
    db.commit()
    return {"message": "Oturum kapatıldı"}