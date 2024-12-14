# Use the official Python image as the base image
FROM python:3.12.7-slim as development

ARG TELEGRAM_TOKEN
ARG URI

ENV TELEGRAM_TOKEN=$TELEGRAM_TOKEN
ENV URI=$URI


ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /bot

COPY bot/requirements.txt /bot/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /bot/


CMD ["/bin/bash", "-c", "python main.py"]