SHELL := /bin/bash

MODEL_CACHE := $(CURDIR)/model_cache

install: # @HELP python install project packages
install:
	pip install -r requirements.txt

install-dev: # @HELP python install project + test packages
install-dev:
	pip install -r requirements.txt -r requirements-dev.txt

env-windows: # @HELP python make virtualenv locally windows
env-windows:
	py -m pip install --user virtualenv
	py -m venv env

env-linux: # @HELP python make virtualenv locally linux/mac
env-linux:
	python3 -m pip install --user virtualenv
	python3 -m venv env
	source env/bin/activate
	pip install -r requirements.txt

bake-models: # @HELP download the flair/transformers models into a local model_cache/ dir (same models baked into the Docker image)
bake-models:
	mkdir -p $(MODEL_CACHE)/huggingface/hub $(MODEL_CACHE)/flair
	HF_HOME=$(MODEL_CACHE)/huggingface \
	FLAIR_CACHE_ROOT=$(MODEL_CACHE)/flair \
	PYTHONPATH=. python3 scripts/bake_models.py

serve: # @HELP python run locally (requires `make bake-models` first)
serve:
	HF_HOME=$(MODEL_CACHE)/huggingface \
	FLAIR_CACHE_ROOT=$(MODEL_CACHE)/flair \
	uvicorn app.main:app --reload

test: # @HELP python run application test (requires `make bake-models` first)
test:
	HF_HOME=$(MODEL_CACHE)/huggingface \
	FLAIR_CACHE_ROOT=$(MODEL_CACHE)/flair \
	pytest -v

build: # @HELP build application binary and place in bin directory
build:
	cd env/lib/python3.7/site-packages/
	zip -r9 ../../../../function.zip .
	cd ../../../../
	zip -g ./function.zip -r app

build-ci-cd: # @HELP build application binary and place in bin directory
build-ci-cd:
	cd /home/runner/.local/lib/python3.10.10/site-packages
	zip -r9 ../../../../function.zip .
	cd ../../../../
	zip -g ./function.zip -r app
