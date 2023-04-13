from fastapi import APIRouter
from pydantic import BaseModel
from summarizer import TransformerSummarizer
from transformers import pipeline
import tensorflow as tf
import numpy as np
# import language_tool_python
from transformers import BertTokenizer, TFBertForSequenceClassification

router = APIRouter()
# tool = language_tool_python.LanguageTool('en-US')

# Define the request body schema
class InputText(BaseModel):
    text: str

# def check_grammar(text):
#     matches = tool.check(text)
#     return [str(match) for match in matches]

def predict_sentiment(text: str) -> str:
    # Perform topic modeling
    # Load the BERT tokenizer and model
    model_name = 'bert-base-uncased'
    tokenizer = BertTokenizer.from_pretrained(model_name)
    model = TFBertForSequenceClassification.from_pretrained(model_name)
    
    # Define the labels for the classification task
    labels = ['Negative', 'Positive']
    
    # Tokenize the input text
    input_ids = tokenizer.encode(text, add_special_tokens=True, max_length=512, truncation=True, padding='max_length', return_tensors="tf")
    
    # Make predictions on the input text
    outputs = model(input_ids)[0]
    probas = tf.nn.softmax(outputs, axis=-1).numpy()[0]
    predicted_label = labels[np.argmax(probas)]
    return predicted_label

def predict_summary(text: str) -> str:
    GPT2_model = TransformerSummarizer(transformer_type="GPT2",transformer_model_key="gpt2-medium")
    summary = ''.join(GPT2_model(text, min_length=60))
    return summary

@router.post("/")
async def analyze(input_text: InputText):

    # Load the BERT summarization, sentiment analysis, and grammatical correctness models
    # summarizer = pipeline('summarization', model='bert-base-uncased', tokenizer='bert-base-uncased')
    # sentiment_analyzer = pipeline('sentiment-analysis', model='bert-base-uncased', tokenizer='bert-base-uncased')
    # grammar_checker = spacy.load('en_core_web_sm')
    
    # Load the topic modeling model
    # topic_modeler = pipeline("text-generation", model="gpt2", max_length=1024, num_return_sequences=1)

    # Perform summarization
    # summary = summarizer(input_text.text, max_length=50, min_length=10, do_sample=False)[0]['summary_text']

    # Perform sentiment analysis
    # sentiment = sentiment_analyzer(input_text.text)[0]['label']

    # Perform grammatical correctness analysis
    # doc = grammar_checker(input_text.text)
    # num_errors = len(doc._.language_tool_annotations)

    

    # text = "I am a engeneer and I likes to play football"
    # grammar_errors = check_grammar(text)
    # print(grammar_errors)

    # Return the analysis results
    return {
        'summary': predict_summary(input_text.text),
        'sentiment': predict_sentiment(input_text.text),
        # 'grammar_errors': grammar_errors,
        # 'topic': predicted_label
    }
