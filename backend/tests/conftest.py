import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.models.model_loader import load_models


@pytest.fixture(scope="session")
def client():
    # Ensure models are loaded before tests run.
    try:
        load_models()
    except Exception:
        # If loading fails in CI, tests will still run but may fail; keep silent here
        pass
    with TestClient(app) as c:
        yield c
