import os
from pathlib import Path

import flair
from flair.nn import Classifier
from summarizer import TransformerSummarizer

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
        _summarizer = TransformerSummarizer(transformer_type='GPT2', transformer_model_key=GPT2_MODEL_KEY)
    return _summarizer


def get_sentiment_classifier() -> Classifier:
    global _sentiment_classifier
    if _sentiment_classifier is None:
        _sentiment_classifier = Classifier.load(FLAIR_SENTIMENT_MODEL)
    return _sentiment_classifier


def get_topic_classifier() -> Classifier:
    global _topic_classifier
    if _topic_classifier is None:
        _topic_classifier = Classifier.load(FLAIR_NER_MODEL)
    return _topic_classifier
