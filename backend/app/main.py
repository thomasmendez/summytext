from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()
env = os.getenv('ENV')
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

if env != None and env != 'local':
    app.root_path = f'/{env}'

if env == 'local' or env == 'dev':
    origins.append('http://localhost:8080')

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

app.include_router(api_router, prefix='/api/v1')
handler = Mangum(app)