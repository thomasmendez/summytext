FROM public.ecr.aws/lambda/python:3.10

COPY requirements.txt  .
RUN  pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

COPY . ${LAMBDA_TASK_ROOT}
# RUN python ${LAMBDA_TASK_ROOT}/app/models.py
# RUN python -c "from transformers import pipeline; pipeline('text-generation', model='gpt2')"
RUN python -c "import os; os.environ['HF_HOME'] = './temp/transformers/cache/'"
RUN python -c "from summarizer import TransformerSummarizer; TransformerSummarizer(transformer_type='GPT2',transformer_model_key='gpt2-medium')"
RUN python -c "from flair.nn import Classifier; Classifier.load('sentiment'); Classifier.load('ner-ontonotes-large')"

CMD [ "app.main.handler" ]