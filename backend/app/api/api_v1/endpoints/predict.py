import asyncio
import time
from fastapi import APIRouter
from pydantic import BaseModel
from summarizer import TransformerSummarizer
from transformers import pipeline
import tensorflow as tf
import numpy as np
from flair.data import Sentence
from flair.nn import Classifier

summarizer_transformer = TransformerSummarizer(transformer_type="GPT2",transformer_model_key="gpt2-medium")
sentiment_classifier = Classifier.load('sentiment')
topic_labels_classifier = Classifier.load('ner-ontonotes-large')

router = APIRouter()

class InputText(BaseModel):
    text: str

async def predict_summary(text: str) -> str:
    summary = ''.join(summarizer_transformer(text, min_length=60))
    return summary

async def predict_sentiment(text: str):
    
    sentence = Sentence(text)

    sentiment_classifier.predict(sentence)

    return sentence.labels[0].value

async def predict_topics(text: str):

    sentence = Sentence(text)

    topic_labels_classifier.predict(sentence)

    topics = []
    labels = []
    topic_labels = {}

    for entity in sentence.get_spans('ner'):
        topics.append(entity.text)
        labels.append(entity.tag)
        topic_labels[entity.text] = entity.tag

    return topic_labels, topics, labels

async def process_predictions(text):
    tasks = []
    results = []

    task = asyncio.create_task(predict_summary(text))
    tasks.append(task)

    task = asyncio.create_task(predict_sentiment(text))
    tasks.append(task)

    task = asyncio.create_task(predict_topics(text))
    tasks.append(task)
    
    # Await the completion of all tasks
    results = await asyncio.gather(*tasks)

    return results

@router.post("/")
async def analyze(input_text: InputText):

    # Measure execution time without concurrency
    # start_time = time.time()
    # summary = predict_summary(input_text.text)
    # sentiment = predict_sentiment(input_text.text)
    # topic_labels, topics, labels = predict_topics(input_text.text)
    # end_time = time.time()
    # execution_time_without_concurrency = end_time - start_time
    # print("execution time: {0}s".format(execution_time_without_concurrency))

    # Measure execution time with concurrency
    start_time = time.time()
    
    results = await process_predictions(input_text.text)
    # for value in results:
    #     print(f"Value: {value}")
    summary = results[0]
    sentiment = results[1]
    topic_labels = results[2][0]
    topics = results[2][1]
    labels = results[2][2]

    end_time = time.time()
    execution_time_with_concurrency = end_time - start_time
    print("execution time: {0}s".format(execution_time_with_concurrency))

    return {
        'summary': summary,
        'sentiment': sentiment,
        'topic_labels': topic_labels,
        'topics': topics,
        'labels': labels,
    }
