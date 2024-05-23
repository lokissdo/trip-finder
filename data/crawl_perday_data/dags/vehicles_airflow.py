from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import timedelta
from airflow.utils.dates import days_ago

from data.crawl_perday_data.dags.vehicles_selenium import main as run_selenium
from data.crawl_perday_data.dags.vehicles_processing import main as run_spark
from data.crawl_perday_data.dags.vehicles_mongo import compare_and_update

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': days_ago(1),
    'email': ['lethihongha30@example.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'vehicle_processing_workflow',
    default_args=default_args,
    description='A workflow for processing vehicle data',
    schedule_interval=timedelta(days=1),
)

scrape_hotel_data = PythonOperator(
    task_id='scrape_vehicle_data',
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
    op_kwargs={'json_folder_path': '/Users/haqn/datalake'},
    dag=dag,
)

scrape_hotel_data >> process_data >> push_to_mongodb
