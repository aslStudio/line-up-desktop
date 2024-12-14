from celery import shared_task

@shared_task
def my_job():
    print("Job executed!")