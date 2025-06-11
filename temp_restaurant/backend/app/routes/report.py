from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.schemas.report import ReportCreate, ReportOut
from app.models.report import Report
from app.db import SessionLocal
from app.models.payment import Payment
from app.models.inventory import Inventory
from app.models.order_item import OrderItem
from app.models.menu import MenuItem
from app.models.order import Order

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[ReportOut])
def get_reports(db: Session = Depends(get_db)):
    return db.query(Report).all()

@router.post("/", response_model=ReportOut)
def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    db_report = Report(**report.dict())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

@router.get("/income")
def get_income(
    start_date: str = Query(None),
    end_date: str = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(func.sum(Payment.amount)).filter(Payment.is_paid == True)
    if start_date:
        query = query.filter(Payment.created_at >= start_date)
    if end_date:
        query = query.filter(Payment.created_at <= end_date)
    total_income = query.scalar() or 0.0
    return {"total_income": float(total_income)}

@router.get("/order-count")
def get_order_count(
    start_date: str = Query(None),
    end_date: str = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Payment).filter(Payment.is_paid == True)
    if start_date:
        query = query.filter(Payment.created_at >= start_date)
    if end_date:
        query = query.filter(Payment.created_at <= end_date)
    total_orders = query.count()
    return {"total_orders": total_orders}

@router.get("/low-stock")
def get_low_stock(db: Session = Depends(get_db)):
    items = db.query(Inventory).all()
    result = []
    for item in items:
        if item.quantity <= item.low_stock_threshold:
            result.append({
                "item": item.item_name,
                "current_stock": item.quantity,
                "minimum_stock": item.low_stock_threshold
            })
    return result

@router.get("/best-sellers")
def get_best_sellers(
    start_date: str = Query(None),
    end_date: str = Query(None),
    db: Session = Depends(get_db)
):
    # Sadece ödenmiş siparişler ve tarih aralığına göre
    order_query = db.query(Order.id)
    if start_date:
        order_query = order_query.filter(Order.created_at >= start_date)
    if end_date:
        order_query = order_query.filter(Order.created_at <= end_date)
    paid_order_ids = [p.order_id for p in db.query(Payment).filter(Payment.is_paid == True, Payment.order_id.in_(order_query)).all()]
    # En çok satılan ürünleri bul
    best_sellers = (
        db.query(
            OrderItem.menu_item_id,
            func.sum(OrderItem.quantity).label("total_quantity")
        )
        .filter(OrderItem.order_id.in_(paid_order_ids))
        .group_by(OrderItem.menu_item_id)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(10)
        .all()
    )
    result = []
    for item_id, total_quantity in best_sellers:
        menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
        if menu_item:
            result.append({
                "product": menu_item.name,
                "quantity": int(total_quantity),
                "revenue": float(menu_item.price) * int(total_quantity)
            })
    return result