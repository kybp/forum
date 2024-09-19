FROM mcr.microsoft.com/playwright/python:v1.47.0-noble

WORKDIR /usr/src/e2e

# Unbuffered IO
ENV PYTHONUNBUFFERED 1

# Install dependencies before copying the rest of the app, so that
# this step can be cached.
RUN pip install --upgrade pip
COPY requirements.txt ./
RUN pip install -r requirements.txt
RUN playwright install

# Copy the rest of the project
COPY . ./
