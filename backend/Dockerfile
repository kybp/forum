FROM python:3.12.6-slim

WORKDIR /usr/src/app

# Unbuffered IO
ENV PYTHONUNBUFFERED 1

# Install dependencies before copying the rest of the app, so that
# this step can be cached.
RUN pip install --upgrade pip
COPY ./requirements.txt ./
RUN pip install -r requirements.txt

# Copy the rest of the project.
COPY . ./
