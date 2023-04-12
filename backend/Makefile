SHELL := /bin/bash

install: # @HELP python install project packages
install:
	pip install -r requirements.txt

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

serve: # @HELP python run locally
serve:
	uvicorn app.main:app --reload

test: # @HELP python run application test
test:
	python test ./... -count=1 -v

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