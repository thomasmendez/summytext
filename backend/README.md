# Python FastAPI Starter Project (Serverless)

Simple Python FastAPI Starter Project Intended for AWS Serverless Development

## Run Locally

### Clone Repository or Use Template

Clone this repository `git clone https://github.com/thomasmendez/python-template-fast-api-serverless` or click `'Use this template'` in the Github UI to use the current project as a template.

### Install Python

Install the latest version of Python [here](https://www.python.org/downloads/)

Verify Python is installed by checking the Python version with `python --version`

### Install Makefile

This project uses the `Makefile` in order to easily run sets of commands. The commands can also be run invidually using the commands listed for the makefile command

### Install Dependencies

Run `pip install -r requirements.txt` in order to install the required python libraries to run the project

### Run Locally

Run `make serve` in order to run the project locally

## Build

To build the project (zip file) run

```
cd env/lib/python3.7/site-packages/
zip -r9 ../../../../function.zip .
cd ../../../../
zip -g ./function.zip -r app
```

_Note: The `zip` command only work with Linux machines (not Windows)_

## Tests

### Unit Tests

To run the unit test for the project, run `make test`

## Libraries Used

### FastAPI

[FastAPI](https://fastapi.tiangolo.com/) is a high performance framework in Python
