from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_menu_item_creation():
    # 1. Admin creates a new menu item
    new_item = {
        "name": "Test Pizza",
        "description": "A test pizza for unit testing.",
        "price": 420.0,
        "category": "Main Course",
        "image_url": "/uploads/vegan_pizza.jpg",
        "dietary_info": "Vegan"
    }
    response = client.post("/menu", json=new_item)
    assert response.status_code == 200
    item_id = response.json()["id"]

    # 2. Check that the item appears in the menu list
    response = client.get("/menu")
    assert response.status_code == 200
    items = response.json()
    assert any(item["id"] == item_id and item["name"] == "Test Pizza" for item in items)
