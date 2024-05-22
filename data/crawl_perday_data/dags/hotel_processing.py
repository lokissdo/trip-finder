from pyspark.sql import SparkSession
from azure.storage.blob import BlobServiceClient
import pandas as pd
from io import StringIO
import re
from datetime import datetime

# Initialize Spark session
spark = SparkSession.builder \
    .appName("HotelDataProcessing") \
    .getOrCreate()

# Connection string to Blob Storage
connection_string = "DefaultEndpointsProtocol=https;AccountName=datalakegroup10;AccountKey=OaZXaAK7tDLzMih9jwkU57hXfyus9mDCXxO4HVtKrCr9Y2PYx9QvKQhFrRfvB0z895rH9wvFwPa3+AStq6y0aQ==;EndpointSuffix=core.windows.net"

# Initialize BlobServiceClient
blob_service_client = BlobServiceClient.from_connection_string(connection_string)

# Function to process data from CSV file and return Spark DataFrame
def process_csv(blob):
    blob_client = blob_service_client.get_blob_client(container=blob.container_name, blob=blob.name)
    data = blob_client.download_blob().readall().decode("utf-8")
    file_name = blob.name
    
    # Create DataFrame from CSV data
    df = pd.read_csv(StringIO(data))

    # Perform data processing steps
    # Step 1: Extract longitude and latitude from the link
    def extract_longitude_latitude(link):
        match = re.search(r'3d(-?\d+\.\d+)!4d(-?\d+\.\d+)', link)
        if match:
            latitude = float(match.group(1))
            longitude = float(match.group(2))
            return latitude, longitude
        else:
            return None, None

    df['latitude'], df['longitude'] = zip(*df['link'].map(extract_longitude_latitude))

    # Step 2: Create new rows and combine with the original DataFrame
    extended_info_list = []

    unique_combinations = df[['name', 'checkin', 'checkout']].drop_duplicates()

    for index, row in unique_combinations.iterrows():
        hotel_info = df[(df['name'] == row['name']) & (df['checkin'] == row['checkin']) & (df['checkout'] == row['checkout'])].iloc[0]
        
        new_df = pd.DataFrame({
            'image_url': [hotel_info['image_url']],
            'standard': [hotel_info['standard']],
            'rating': [hotel_info['rating']],
            'name': [hotel_info['name']],
            'checkin': [hotel_info['checkin']],
            'checkout': [hotel_info['checkout']],
            'price_platform': [hotel_info['price']],
            'url_platform': [hotel_info['link']],
            'platform': ['Google Maps'],
            'latitude': [hotel_info['latitude']],
            'longitude': [hotel_info['longitude']],
            'current_time': [hotel_info['current_time']],
            'description': [hotel_info['description']],
            'province': [hotel_info['province']],
            'price': [hotel_info['price']],
            'link': [hotel_info['link']]
        })
        
        extended_info_list.append(new_df)

    extended_info = pd.concat([df] + extended_info_list, ignore_index=True)

    # Step 3: Drop rows with missing values in 'platform' column and replace values in 'image_url' column
    extended_info = extended_info.dropna(subset=['platform'])
    default_image_url = "https://media-cdn.tripadvisor.com/media/photo-s/1b/fa/f1/c9/diamond-stars-ben-tre.jpg"
    extended_info['image_url'] = extended_info['image_url'].apply(lambda x: default_image_url if 'lh3' in str(x) else x)

    # Step 4: Convert data types of 'rating', 'current_time', 'checkin', 'checkout' columns and save the result to a Spark DataFrame
    extended_info['rating'] = extended_info['rating'].str.replace(',', '.').astype(float)
    extended_info['current_time'] = pd.to_datetime(extended_info['current_time'], utc=True)
    extended_info['checkin'] = pd.to_datetime(extended_info['checkin'])
    extended_info['checkout'] = pd.to_datetime(extended_info['checkout'])

    # Convert Pandas DataFrame to Spark DataFrame
    spark_df = spark.createDataFrame(extended_info)
    
    return spark_df

# Get the list of files in the container and processing date
container_name = datetime.datetime.utcnow().strftime('%Y-%m-%d')
container_client = blob_service_client.get_container_client(container_name)
blob_list = container_client.list_blobs()

# Process CSV files in parallel and write the results to a Spark DataFrame
dfs = [process_csv(blob) for blob in blob_list]
final_df = spark.union(dfs)

# Step 5: Process data to rename columns and save the resulting DataFrame to Spark's temporary memory
final_df = final_df.drop('price', 'link') \
    .withColumnRenamed('price_platform', 'price') \
    .withColumnRenamed('url_platform', 'page_url')

# Show the final result
final_df.show()

# Save the final DataFrame to a CSV file locally
final_df.toPandas().to_csv("/Users/thao/hotel_processed.csv", index=False)

# Stop Spark session
spark.stop()
