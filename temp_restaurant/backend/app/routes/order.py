from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.order import OrderCreate, OrderOut
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.menu import MenuItem
from app.db import SessionLocal
from app.models.payment import Payment
from app.models.recipe import Recipe
from app.models.inventory import Inventory

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=OrderOut)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    try:
        if not order.session_id:
            raise HTTPException(status_code=400, detail="Oturum (session_id) zorunlu")

        # --- STOK KONTROLÜ ---
        insufficient = []
        for item in order.items:
            recipes = db.query(Recipe).filter(Recipe.menu_item_id == item.menu_item_id).all()
            for recipe in recipes:
                inventory_item = db.query(Inventory).filter(Inventory.id == recipe.inventory_item_id).first()
                required = recipe.amount * item.quantity
                if not inventory_item or inventory_item.quantity < required:
                    insufficient.append({
                        "ingredient": inventory_item.item_name if inventory_item else "Unknown",
                        "required": required,
                        "in_stock": inventory_item.quantity if inventory_item else 0
                    })
        if insufficient:
            msg = ", ".join([f"{i['ingredient']} (needed: {i['required']}, in stock: {i['in_stock']})" for i in insufficient])
            raise HTTPException(status_code=400, detail=f"Insufficient stock for: {msg}")
        # --- STOK KONTROLÜ SONU ---

        # 1. Order oluştur
        db_order = Order(table_id=order.table_id, status=order.status, session_id=order.session_id)
        db.add(db_order)
        db.flush()  # Order'ı DB'ye ekle ve ID al

        # 2. OrderItem'ları oluştur
        for item in order.items:
            db_item = OrderItem(
                order_id=db_order.id,
                menu_item_id=item.menu_item_id,
                quantity=item.quantity,
                special_instructions=item.special_instructions
            )
            db.add(db_item)

        db.flush()  # OrderItem'lar için ID al

        # 3. Payment oluştur
        payment = Payment(
            order_id=db_order.id,
            amount=order.amount,
            method=order.method,
            is_paid=True
        )
        db.add(payment)

        db.commit()
        db.refresh(db_order)

        # 4. OrderItem'lara menu_item_name ekle (response için)
        for item in db_order.items:
            menu_item = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first()
            if menu_item:
                setattr(item, 'menu_item_name', menu_item.name)
                setattr(item, 'price', menu_item.price)

        return db_order
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/paid", response_model=list[OrderOut])
def get_paid_orders(db: Session = Depends(get_db)):
    # Payment tablosunda is_paid=True olan order_id'leri bul
    paid_order_ids = [p.order_id for p in db.query(Payment).filter(Payment.is_paid == True).all()]
    orders = db.query(Order).filter(Order.id.in_(paid_order_ids)).all()
    # Her order için OrderItem'ları çekerken menu_item_name ve price alanını doldur
    for order in orders:
        for item in order.items:
            menu_item = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first()
            if menu_item:
                item.menu_item_name = menu_item.name
                item.price = menu_item.price
    return orders

@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    # OrderItem'ları çekerken menu_item_name ve price alanını doldur
    for item in db_order.items:
        menu_item = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first()
        if menu_item:
            item.menu_item_name = menu_item.name
            item.price = menu_item.price
    return db_order

@router.get("/table/{table_id}", response_model=list[OrderOut])
def get_orders_by_table(table_id: int, db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.table_id == table_id).all()
    # Her order için OrderItem'ları çekerken menu_item_name ve price alanını doldur
    for order in orders:
        for item in order.items:
            menu_item = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first()
            if menu_item:
                item.menu_item_name = menu_item.name
                item.price = menu_item.price
    return orders

@router.put("/{order_id}/status")
def update_order_status(order_id: int, status: dict, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    db_order.status = status.get("status")
    db.commit()
    db.refresh(db_order)

    # Sipariş hazırlandıysa stok düş
    if db_order.status == "ready":
        for item in db_order.items:
            recipes = db.query(Recipe).filter(Recipe.menu_item_id == item.menu_item_id).all()
            for recipe in recipes:
                inventory_item = db.query(Inventory).filter(Inventory.id == recipe.inventory_item_id).first()
                if inventory_item:
                    inventory_item.quantity -= recipe.amount * item.quantity
                    if inventory_item.quantity < 0:
                        inventory_item.quantity = 0
        db.commit()

    return {"message": "Order status updated", "order_id": order_id, "status": db_order.status}

@router.get("/session/{session_id}", response_model=list[OrderOut])
def get_orders_by_session(session_id: int, db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.session_id == session_id).all()
    for order in orders:
        for item in order.items:
            menu_item = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first()
            if menu_item:
                item.menu_item_name = menu_item.name
                item.price = menu_item.price
    return orders