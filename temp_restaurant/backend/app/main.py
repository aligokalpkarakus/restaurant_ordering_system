from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import menu, order, tables, user, inventory, report
from app.routes import admin
from app.routes import recipe

app = FastAPI()

# CORS ayarı
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend'in çalıştığı adres
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Statik dosyalar (resimler)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Route'ları ekle
app.include_router(menu.router, prefix="/menu", tags=["Menu"])
app.include_router(order.router, prefix="/order", tags=["Order"])
app.include_router(tables.router, prefix="/tables", tags=["Table"])
app.include_router(user.router, prefix="/users", tags=["User"])
app.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])
app.include_router(report.router, prefix="/reports", tags=["Reports"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(recipe.router, prefix="/recipe", tags=["Recipe"])

@app.get("/")
def root():
    return {"message": "Restaurant Ordering System API"}
