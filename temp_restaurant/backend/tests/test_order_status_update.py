from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_order_status_update():
    # 1. Waiter starts session for Table 3
    response = client.post("/tables/session/start", json={"table_id": 3, "waiter_id": 1})
    assert response.status_code == 200
    session_id = response.json()["id"]

    # 2. Customer creates an order (pending)
    order_payload = {
        "table_id": 1,
        "status": "pending",
        "session_id": session_id,
        "items": [
            {"menu_item_id": 1, "quantity": 1, "special_instructions": ""}
        ],
        "amount": 240.0,
        "method": "credit_card"
    }
    response = client.post("/order", json=order_payload)
    assert response.status_code == 200
    order_id = response.json()["id"]

    # 3. Kitchen staff updates status to 'preparing'
    response = client.put(f"/order/{order_id}/status", json={"status": "preparing"})
    assert response.status_code == 200
    # 4. Check status
    response = client.get(f"/order/{order_id}")
    assert response.json()["status"] == "preparing"

    # 5. Kitchen staff updates status to 'ready'
    response = client.put(f"/order/{order_id}/status", json={"status": "ready"})
    assert response.status_code == 200
    # 6. Check status
    response = client.get(f"/order/{order_id}")
    assert response.json()["status"] == "ready" 