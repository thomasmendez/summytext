from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.api.api_v1.api import router as api_router
from mangum import Mangum

load_dotenv()
env = os.getenv("ENV")

app = FastAPI()

origins = []

if env != None and env != "local":
    print(env)
    app.root_path = f"/{env}"

if env == "local":
    origins.append("http://localhost")
    origins.append("http://localhost:8080")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")
handler = Mangum(app)