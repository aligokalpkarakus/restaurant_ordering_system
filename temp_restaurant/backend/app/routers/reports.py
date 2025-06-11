from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from ..database import get_db
from ..models import Order, OrderItem, MenuItem, Inventory
from sqlalchemy import func, desc

router = APIRouter()

@router.get("/income")
def get_income(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    query = db.query(func.sum(Order.total_amount))
    
    if start_date:
        query = query.filter(Order.created_at >= datetime.strptime(start_date, "%Y-%m-%d"))
    if end_date:
        query = query.filter(Order.created_at <= datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1))
    
    total_income = query.scalar() or 0
    return {"total_income": total_income}

@router.get("/best-sellers")
def get_best_sellers(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    limit: int = Query(5, description="Number of top items to return"),
    db: Session = Depends(get_db)
):
    query = db.query(
        MenuItem.name,
        func.sum(OrderItem.quantity).label('total_quantity'),
        func.sum(OrderItem.quantity * OrderItem.price).label('total_revenue')
    ).join(OrderItem, MenuItem.id == OrderItem.menu_item_id)\
     .join(Order, OrderItem.order_id == Order.id)\
     .group_by(MenuItem.id, MenuItem.name)
    
    if start_date:
        query = query.filter(Order.created_at >= datetime.strptime(start_date, "%Y-%m-%d"))
    if end_date:
        query = query.filter(Order.created_at <= datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1))
    
    best_sellers = query.order_by(desc('total_quantity')).limit(limit).all()
    
    return [{
        "name": item.name,
        "total_quantity": item.total_quantity,
        "total_revenue": item.total_revenue
    } for item in best_sellers]

@router.get("/low-stock")
def get_low_stock(db: Session = Depends(get_db)):
    low_stock_items = db.query(Inventory).filter(
        Inventory.current_stock <= Inventory.minimum_stock
    ).all()
    
    return [{
        "id": item.id,
        "item_name": item.item_name,
        "current_stock": item.current_stock,
        "minimum_stock": item.minimum_stock,
        "unit": item.unit
    } for item in low_stock_items]

@router.get("/order-count")
def get_order_count(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    query = db.query(func.count(Order.id))
    
    if start_date:
        query = query.filter(Order.created_at >= datetime.strptime(start_date, "%Y-%m-%d"))
    if end_date:
        query = query.filter(Order.created_at <= datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1))
    
    total_orders = query.scalar() or 0
    return {"total_orders": total_orders} 