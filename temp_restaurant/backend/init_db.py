from app.db import Base, engine, SessionLocal
from app.models import user, table, menu, inventory
from app.models.user import User
from app.models.table import Table
from app.models.menu import MenuItem
from app.models.inventory import Inventory

# Tabloları oluştur
Base.metadata.create_all(bind=engine)

# Örnek veriler
def seed_data():
    db = SessionLocal()
    try:
        # Kullanıcılar
        admin = User(name="Admin", email="admin@example.com", password_hash="admin123", role="admin")
        kitchen = User(name="Chef", email="chef@example.com", password_hash="chef123", role="kitchen")

        # Masalar
        table1 = Table(qr_code="table1", is_occupied=False)
        table2 = Table(qr_code="table2", is_occupied=False)

        # Menü öğeleri
        burger = MenuItem(name="Cheeseburger", description="Juicy burger with cheese", price=49.99,
                          category="Main", image_url="", dietary_info="Contains dairy")
        pizza = MenuItem(name="Pepperoni Pizza", description="Thin crust pepperoni", price=69.99,
                         category="Main", image_url="", dietary_info="Halal")

        # Stok
        stock1 = Inventory(item_name="Beef Patty", quantity=20, low_stock_threshold=5)
        stock2 = Inventory(item_name="Mozzarella", quantity=15, low_stock_threshold=3)

        db.add_all([admin, kitchen, table1, table2, burger, pizza, stock1, stock2])
        db.commit()
        print("✅ Veritabanı örnek verilerle yüklendi.")
    except Exception as e:
        print("❌ Hata oluştu:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
