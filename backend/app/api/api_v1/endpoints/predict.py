from fastapi import APIRouter
from pydantic import BaseModel
from summarizer import TransformerSummarizer
from transformers import pipeline
import tensorflow as tf
import numpy as np
from flair.data import Sentence
from flair.nn import Classifier

router = APIRouter()

class InputText(BaseModel):
    text: str

def predict_summary(text: str) -> str:
    GPT2_model = TransformerSummarizer(transformer_type="GPT2",transformer_model_key="gpt2-medium")
    summary = ''.join(GPT2_model(text, min_length=60))
    return summary

def predict_sentiment(text: str):
    
    sentence = Sentence(text)

    tagger = Classifier.load('sentiment')

    tagger.predict(sentence)

    return sentence.labels[0].value

def predict_topics(text: str):

    sentence = Sentence(text)

    tagger = Classifier.load('ner-ontonotes-large')

    tagger.predict(sentence)

    topics = []
    labels = []
    topic_labels = {}

    for entity in sentence.get_spans('ner'):
        topics.append(entity.text)
        labels.append(entity.tag)
        topic_labels[entity.text] = entity.tag

    return topic_labels, topics, labels

@router.post("/")
async def analyze(input_text: InputText):

    topic_labels, topics, labels = predict_topics(input_text.text)

    return {
        'summary': predict_summary(input_text.text),
        'sentiment': predict_sentiment(input_text.text),
        'topic_labels': topic_labels,
        'topics': topics,
        'labels': labels,
    }
