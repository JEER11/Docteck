# Flask service Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./
RUN apt-get update \
	&& apt-get install -y --no-install-recommends curl tesseract-ocr libsm6 libxext6 libxrender1 build-essential \
	&& rm -rf /var/lib/apt/lists/* \
	&& pip install --no-cache-dir -r requirements.txt
COPY . .
ENV FLASK_ENV=production
EXPOSE 5000
# Run with gunicorn in production; Celery worker can be started with 'celery -A tasks.celery worker --loglevel=info'
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app", "--workers", "2"]
