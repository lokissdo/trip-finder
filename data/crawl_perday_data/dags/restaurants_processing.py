from pyspark.sql import SparkSession
from azure.storage.blob import BlobServiceClient
import pandas as pd
from io import StringIO
import re
from datetime import datetime
import numpy as np
import functools
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

spark = SparkSession.builder \
    .appName("RestaurantDataProcessing") \
    .getOrCreate()
connection_string = "DefaultEndpointsProtocol=https;AccountName=datalakegroup10;AccountKey=OaZXaAK7tDLzMih9jwkU57hXfyus9mDCXxO4HVtKrCr9Y2PYx9QvKQhFrRfvB0z895rH9wvFwPa3+AStq6y0aQ==;EndpointSuffix=core.windows.net"
blob_service_client = BlobServiceClient.from_connection_string(connection_string)

# Function to process data from CSV file and return Spark DataFrame
def process_csv(blob):
    """
    This function processes data from a CSV file and returns a Spark DataFrame.
    
    Args:
        blob: Blob object from Blob Storage
    
    Returns:
        DataFrame: Processed Spark DataFrame
    """
    blob_client = blob_service_client.get_blob_client(container=blob.container_name, blob=blob.name)
    data = blob_client.download_blob().readall().decode("utf-8")
    
    df = spark.read.csv(StringIO(data), header=True, inferSchema=True)

    # Step 1: 
    df_cleaned = df.dropna(subset=['name'])

    # Step 2: Extract latitude and longitude from the address
    def get_location(row):
        try:
            # Use the value from the 'name' field to create an address
            address = row['name']
            # Look up coordinates from address
            location = geolocator.geocode(address, timeout=10)
            if location:
                return location.latitude, location.longitude
            else:
                return None, None
        except GeocoderTimedOut:
            return get_location(row)
    df_cleaned['latitude'], df_cleaned['longitude'] = zip(*df_cleaned.apply(get_location, axis=1))

    # Step 3
    def is_price(value):
        return "₫" in value if isinstance(value, str) else False

    df_cleaned["price"] = df_cleaned["price"].apply(lambda x: x.strip() if isinstance(x, str) else x)
    df_cleaned["temp"] = df_cleaned["price"].apply(lambda x: x if not is_price(x) else np.nan)
    df_cleaned["price"] = df_cleaned["price"].apply(lambda x: x if is_price(x) else np.nan)

    df_cleaned = df_cleaned.dropna(subset=["price"])
    df_cleaned.reset_index(drop=True, inplace=True)

    # Step 4
    df_cleaned = df_cleaned.dropna(subset=['latitude', 'longitude'])
    df_cleaned = df_cleaned.drop(columns=['temp']) 
    # Step 5: Drop the 'style' column and process the price column
    df_cleaned[['low_price', 'high_price']] = df_cleaned['price'].str.split(' – ', expand=True)
    df_cleaned['low_price'] = df_cleaned['low_price'].str.replace('₫', '').astype(float)
    df_cleaned['high_price'] = df_cleaned['high_price'].str.replace('₫', '').astype(float)
    df_cleaned['price'] = (df_cleaned['low_price'] + df_cleaned['high_price']) / 2 * 24000
    df_cleaned.drop(['low_price', 'high_price'], axis=1, inplace=True)
    df_cleaned['rating'] = df_cleaned['rating'].str.replace(',', '.').astype(float)
    df_cleaned['image'].fillna('https://posapp.vn/wp-content/uploads/2018/03/decor-nha-hang-dep.jpg', inplace=True)
    df_cleaned = df_cleaned[df_cleaned['price'] != 0]

    return df_cleaned

container_name = f"restaurants_{datetime.utcnow().strftime('%Y-%m-%d')}"
container_client = blob_service_client.get_container_client(container_name)
blob_list = container_client.list_blobs()

# Process CSV files in parallel and write the result to a Spark DataFrame
dfs = [process_csv(blob) for blob in blob_list]
final_df = functools.reduce(lambda df1, df2: df1.union(df2), dfs)

final_df.toPandas().to_csv("/Users/thao/restaurant_processed.csv", index=False)
spark.stop()
