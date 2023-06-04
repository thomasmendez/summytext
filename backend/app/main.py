from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()
env = os.getenv('ENV')

if env != None and env != 'local':
    # root_dir = os.path.abspath('/')
    root_dir = os.environ['LAMBDA_TASK_ROOT']
    os.environ['HF_HOME'] = os.path.join(root_dir, './tmp')
    os.environ['TRANSFORMERS_CACHE'] = os.path.join(root_dir, './tmp/transformers/cache/')

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

if env == 'local':
    origins.append('http://localhost')
    origins.append('http://localhost:8080')

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(api_router, prefix='/api/v1')
handler = Mangum(app)