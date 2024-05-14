from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import os

# Import các hàm từ các file
from hotel_selenium import main as run_selenium
from processing_spark import main as run_spark
from mongodbpush import compare_and_update

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2024, 6, 1),
    'email': ['airflow@example.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

# Khởi tạo một DAG
dag = DAG(
    'hotel_processing_workflow',
    default_args=default_args,
    description='A workflow for processing hotel data',
    schedule_interval=timedelta(days=1),
)

# Định nghĩa các công việc
scrape_hotel_data = PythonOperator(
    task_id='scrape_hotel_data',
    python_callable=run_selenium,
    dag=dag,
)

process_data = PythonOperator(
    task_id='process_data',
    python_callable=run_spark,
    dag=dag,
)

push_to_mongodb = PythonOperator(
    task_id='push_to_mongodb',
    python_callable=compare_and_update,
    op_kwargs={'json_folder_path': '/Users/thao/datalake'},  # Thêm đối số op_kwargs
    dag=dag,
)

# Xác định phụ thuộc giữa các công việc
scrape_hotel_data >> process_data >> push_to_mongodb
