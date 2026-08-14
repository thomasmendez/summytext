SHELL := /bin/bash

MODEL_CACHE := $(CURDIR)/model_cache
VENV := env
PIP := $(VENV)/bin/pip

install: # @HELP python install project packages
install: $(PIP)
	$(PIP) install -r requirements.txt

install-dev: # @HELP python install project + test packages
install-dev: $(PIP)
	$(PIP) install -r requirements.txt -r requirements-dev.txt

env-windows: # @HELP python make virtualenv locally windows
env-windows:
	py -m pip install --user virtualenv
	py -m venv env

env-linux: # @HELP python make virtualenv locally linux/mac
env-linux: $(PIP)

$(PIP):
	python3 -m venv $(VENV)
	$(PIP) install --upgrade pip

bake-models: # @HELP download the flair/transformers models into a local model_cache/ dir (same models baked into the Docker image)
bake-models:
	mkdir -p $(MODEL_CACHE)/huggingface/hub $(MODEL_CACHE)/flair
	HF_HOME=$(MODEL_CACHE)/huggingface \
	FLAIR_CACHE_ROOT=$(MODEL_CACHE)/flair \
	PYTHONPATH=. $(VENV)/bin/python3 scripts/bake_models.py

serve: # @HELP python run locally (requires `make bake-models` first)
serve:
	HF_HOME=$(MODEL_CACHE)/huggingface \
	FLAIR_CACHE_ROOT=$(MODEL_CACHE)/flair \
	$(VENV)/bin/uvicorn app.main:app --reload

test: # @HELP python run application test (requires `make bake-models` first)
test:
	HF_HOME=$(MODEL_CACHE)/huggingface \
	FLAIR_CACHE_ROOT=$(MODEL_CACHE)/flair \
	$(VENV)/bin/pytest -v
