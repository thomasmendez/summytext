FROM public.ecr.aws/lambda/python:3.12

COPY requirements.txt .
RUN pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# Bake models into the image at build time instead of downloading them at Lambda
# cold start. The cache lives under LAMBDA_TASK_ROOT (/var/task), not /tmp -- Lambda
# always mounts a fresh, empty /tmp at runtime, so anything baked into /tmp during
# the build is discarded and would just re-trigger a download on every cold start.
ENV HF_HOME=${LAMBDA_TASK_ROOT}/model_cache/huggingface
ENV FLAIR_CACHE_ROOT=${LAMBDA_TASK_ROOT}/model_cache/flair

COPY app/__init__.py app/__init__.py
COPY app/models.py app/models.py
COPY scripts/bake_models.py scripts/bake_models.py
RUN mkdir -p "${HF_HOME}" "${FLAIR_CACHE_ROOT}" && \
    PYTHONPATH="${LAMBDA_TASK_ROOT}" python3 scripts/bake_models.py

# Only go offline after baking -- the RUN step above needs network access to
# populate the cache. Everything after this point (including the running Lambda)
# must never attempt a network call for model files.
ENV HF_HUB_OFFLINE=1
ENV TRANSFORMERS_OFFLINE=1

COPY . ${LAMBDA_TASK_ROOT}

CMD [ "app.main.handler" ]
