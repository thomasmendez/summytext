from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()
env = os.getenv('ENV')
proxy = os.getenv('PROXY')
import flair
from pathlib import Path

if env != None and env != 'local':
    os.environ['TRANSFORMERS_CACHE'] = '/tmp/transformers/cache/'
    flair.cache_root = Path('/tmp/.flair')

from summarizer import TransformerSummarizer
from flair.nn import Classifier

summarizer_transformer = TransformerSummarizer(transformer_type='GPT2',transformer_model_key='gpt2-medium')
sentiment_classifier = Classifier.load('sentiment')
topic_labels_classifier = Classifier.load('ner-ontonotes-large')

from app.api.api_v1.api import router as api_router
from mangum import Mangum

app = FastAPI()

origins = []

if (env != None and env != 'local') and (proxy != None and proxy == 'true'):
    app.root_path = f'/{env}'

if env == 'local':
    origins.append('http://localhost')
    origins.append('http://localhost:8080')

if env == 'dev':
    origins.append('*')

if env == 'stg':
    origins.append('http://summytext-stg.s3-website.us-east-2.amazonaws.com')

if env == 'prd':
    origins.append('https://summytext.com')

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

from fastapi.responses import JSONResponse
from cachetools import LRUCache
import asyncio
import time

cache = LRUCache(maxsize=500)  # Adjust the cache size as needed

RATE_LIMIT = 60  # Maximum number of requests allowed per hour
CACHE_EXPIRATION = 3600  # Expiration time for cache entries in seconds

@app.middleware("http")
async def cache_requests(request, call_next):
    ip_address = request.client.host

    # Get the current timestamp
    current_time = time.time()

    if ip_address not in cache:
        # If the IP address is not in the cache, initialize it with the request count and the time of first access
        cache[ip_address] = {"request_count": 1, "first_access_time": current_time}
    else:
        # If the IP address is already in the cache, update the request count and check the rate limit
        cache[ip_address]["request_count"] += 1

        # Check if the rate limit has been exceeded
        if cache[ip_address]["request_count"] > RATE_LIMIT:
            elapsed_time = current_time - cache[ip_address]["first_access_time"]

            # If the elapsed time is less than an hour, return a rate limit error
            if elapsed_time < CACHE_EXPIRATION:
                error_message = f"Rate limit exceeded. Maximum {RATE_LIMIT} requests per hour."
                return JSONResponse(status_code=429, content={"error": error_message})

            # If an hour has passed, reset the request count and update the first access time
            cache[ip_address]["request_count"] = 1
            cache[ip_address]["first_access_time"] = current_time

    response = await call_next(request)

    return response

def clear_expired_cache():
    current_time = time.time()
    expired_entries = []

    for ip_address, entry in cache.items():
        elapsed_time = current_time - entry["first_access_time"]
        if elapsed_time > CACHE_EXPIRATION:
            expired_entries.append(ip_address)

    for ip_address in expired_entries:
        cache.pop(ip_address, None)


async def clear_cache_periodically():
    while True:
        clear_expired_cache()
        await asyncio.sleep(CACHE_EXPIRATION)  # Run every hour

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(clear_cache_periodically())

app.include_router(api_router, prefix='/api/v1')
handler = Mangum(app)