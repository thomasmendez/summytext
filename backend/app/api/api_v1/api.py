from fastapi import APIRouter

from .endpoints import predict

router = APIRouter()
router.include_router(predict.router, prefix="/predict", tags=["Predict"])