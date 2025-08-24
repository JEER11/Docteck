from celery import Celery
import os
from file_analysis import ocr_image

REDIS_URL = os.environ.get('REDIS_URL', 'redis://redis:6379/0')
celery = Celery('docteck_tasks', broker=REDIS_URL, backend=REDIS_URL)


@celery.task(name='tasks.create_ocr_task')
def create_ocr_task(file_path):
    text = ocr_image(file_path)
    try:
        os.remove(file_path)
    except Exception:
        pass
    return {'text': text}
