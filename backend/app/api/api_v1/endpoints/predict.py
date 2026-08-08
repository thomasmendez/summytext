import asyncio
import time
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from summarizer import TransformerSummarizer
from flair.nn import Classifier
from flair.data import Sentence

from app.models import get_sentiment_classifier, get_summarizer, get_topic_classifier

router = APIRouter()

class InputText(BaseModel):
    text: str

async def predict_summary(text: str, summarizer_transformer: TransformerSummarizer) -> str:
    summary = ''.join(summarizer_transformer(text, min_length=60))
    return summary

async def predict_sentiment(text: str, sentiment_classifier: Classifier):

    sentence = Sentence(text)

    sentiment_classifier.predict(sentence)

    return sentence.labels[0].value

async def predict_topics(text: str, topic_labels_classifier: Classifier):

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

async def process_predictions(
        text: str,
        summarizer_transformer: TransformerSummarizer,
        sentiment_classifier: Classifier,
        topic_labels_classifier: Classifier,
    ):
    tasks = []
    results = []

    task = asyncio.create_task(predict_summary(text, summarizer_transformer))
    tasks.append(task)

    task = asyncio.create_task(predict_sentiment(text, sentiment_classifier))
    tasks.append(task)

    task = asyncio.create_task(predict_topics(text, topic_labels_classifier))
    tasks.append(task)

    # Await the completion of all tasks
    results = await asyncio.gather(*tasks)

    return results

# Route has NO trailing slash on purpose. A Lambda Function URL strips the
# trailing slash from the request path before the app sees it, so a request to
# /api/v1/predict/ arrives as /api/v1/predict. With the old "/" route, FastAPI
# kept 307-redirecting to add the slash back -- which the Function URL stripped
# again -- producing an infinite redirect loop. Matching the stripped path here
# returns 200 directly. (Stacking @router.post("") and @router.post("/") does
# NOT work on this FastAPI version -- it collapses to a route with no methods.)
@router.post("")
async def analyze(
        input_text: InputText,
        summarizer_transformer: TransformerSummarizer = Depends(get_summarizer),
        sentiment_classifier: Classifier = Depends(get_sentiment_classifier),
        topic_labels_classifier: Classifier = Depends(get_topic_classifier),
    ):

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

    results = await process_predictions(
        input_text.text,
        summarizer_transformer,
        sentiment_classifier,
        topic_labels_classifier,
    )
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
