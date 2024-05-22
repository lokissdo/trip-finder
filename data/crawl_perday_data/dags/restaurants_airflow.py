from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from airflow.utils.dates import days_ago
from datetime import timedelta
from airflow.operators.python_operator import PythonOperator

default_args = {
    'owner': 'airflow_restaurant',
    'depends_on_past': False,
    'start_date': days_ago(1),
    'email': ['phuongthaoadn@gmail.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=7),
}

# Initialize DAG
dag = DAG(
    'restaurants_scraping',
    default_args=default_args,
    description='DAG to scrape restaurant data',
    schedule_interval='0 8 * * *',
)

# Define tasks
run_processing = BashOperator(
    task_id='run_processing_script',
    bash_command='source /Users/thao/hotel_crawl_perday/.venv/bin/activate && python /Users/thao/hotel_crawl_perday/dags/restaurants_processing.py',
    dag=dag,
)

run_mongo = BashOperator(
    task_id='run_mongo_script',
    bash_command='source /Users/thao/hotel_crawl_perday/.venv/bin/activate && python /Users/thao/hotel_crawl_perday/dags/restaurants_mongo.py',
    dag=dag,
)

run_scraping_script = BashOperator(
    task_id='run_scraping_script',
    bash_command='source /Users/thao/hotel_crawl_perday/.venv/bin/activate && python /Users/thao/hotel_crawl_perday/dags/restaurants_selenium.py',
    dag=dag,
)

# Set task dependencies
run_scraping_script >> run_processing >> run_mongo
