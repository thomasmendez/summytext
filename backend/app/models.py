import os
import time

_import_start = time.time()
print(f"[timing] models.py import start", flush=True)

from pathlib import Path

import flair
from flair.nn import Classifier
print(f"[timing] flair imported at {time.time() - _import_start:.1f}s", flush=True)
from summarizer import TransformerSummarizer
print(f"[timing] summarizer imported at {time.time() - _import_start:.1f}s", flush=True)

flair_cache_root = os.getenv('FLAIR_CACHE_ROOT')
if flair_cache_root:
    flair.cache_root = Path(flair_cache_root)

GPT2_MODEL_KEY = 'gpt2-medium'
FLAIR_SENTIMENT_MODEL = 'sentiment'
FLAIR_NER_MODEL = 'ner-ontonotes-large'

_summarizer = None
_sentiment_classifier = None
_topic_classifier = None


def get_summarizer() -> TransformerSummarizer:
    global _summarizer
    if _summarizer is None:
        t0 = time.time()
        print(f"[timing] loading summarizer...", flush=True)
        _summarizer = TransformerSummarizer(transformer_type='GPT2', transformer_model_key=GPT2_MODEL_KEY)
        print(f"[timing] summarizer loaded in {time.time() - t0:.1f}s", flush=True)
    return _summarizer


def get_sentiment_classifier() -> Classifier:
    global _sentiment_classifier
    if _sentiment_classifier is None:
        t0 = time.time()
        print(f"[timing] loading sentiment classifier...", flush=True)
        _sentiment_classifier = Classifier.load(FLAIR_SENTIMENT_MODEL)
        print(f"[timing] sentiment classifier loaded in {time.time() - t0:.1f}s", flush=True)
    return _sentiment_classifier


def get_topic_classifier() -> Classifier:
    global _topic_classifier
    if _topic_classifier is None:
        t0 = time.time()
        print(f"[timing] loading topic classifier...", flush=True)
        _topic_classifier = Classifier.load(FLAIR_NER_MODEL)
        print(f"[timing] topic classifier loaded in {time.time() - t0:.1f}s", flush=True)
    return _topic_classifier
