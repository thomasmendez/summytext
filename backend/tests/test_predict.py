from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_predict_returns_summary_sentiment_and_topics():
    response = client.post(
        '/api/v1/predict/',
        json={'text': 'Apple Inc. announced record iPhone sales in California this quarter.'},
    )

    assert response.status_code == 200
    body = response.json()
    assert 'summary' in body
    assert 'sentiment' in body
    assert 'topics' in body
