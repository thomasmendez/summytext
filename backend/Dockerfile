FROM public.ecr.aws/lambda/python:3.10

COPY requirements.txt  .
RUN  pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

COPY . ${LAMBDA_TASK_ROOT}

# AWS Lambda says this as invalid image
# RUN python -c "import os; root_dir = os.path.abspath('/var/task'); os.environ['TRANSFORMERS_CACHE'] = os.path.join(root_dir, '/tmp/transformers/cache/'); from summarizer import TransformerSummarizer; TransformerSummarizer(transformer_type='GPT2',transformer_model_key='gpt2-medium')"
# RUN python -c "import os; root_dir = os.path.abspath('/var/task'); import flair; from pathlib import Path; flair.cache_root = Path(os.path.join(root_dir, '/tmp/.flair')); from flair.nn import Classifier; Classifier.load('sentiment'); Classifier.load('ner-ontonotes-large')"

CMD [ "app.main.handler" ]