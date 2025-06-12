from fastapi.testclient import TestClient
from app.main import app  

client = TestClient(app)

def test_full_order_and_payment_flow():
    # 1. Waiter starts session for Table 1
    response = client.post("/tables/session/start", json={"table_id": 1, "waiter_id": 1})
    assert response.status_code == 200
    session_id = response.json()["id"]

    # 2. Customer creates an order
    bruschetta_price = 240.0
    sparkling_water_price = 60.0
    amount = (1 * bruschetta_price) + (1 * sparkling_water_price)  # 300.0

    order_payload = {
        "table_id": 1,
        "status": "received",
        "session_id": session_id,
        "items": [
            {"menu_item_id": 1, "quantity": 1, "special_instructions": ""},
            {"menu_item_id": 26, "quantity": 1, "special_instructions": ""}
        ],
        "amount": amount,
        "method": "credit_card"
    }
    response = client.post("/order", json=order_payload)
    assert response.status_code == 200
    order_id = response.json()["id"]

    # 3. Check order status
    response = client.get(f"/order/{order_id}")
    assert response.status_code == 200
    assert response.json()["status"] == "received" 