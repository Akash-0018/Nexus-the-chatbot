import pytest
from app import create_app

def test_health_endpoint():
    app = create_app()
    client = app.test_client()
    
    response = client.get('/api/health')
    assert response.status_code == 200
    assert 'status' in response.get_json()
