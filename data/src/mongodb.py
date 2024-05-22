from pymongo import MongoClient
import os
import json
from datetime import datetime
import pandas as pd

# Connect to MongoDB
client = MongoClient("mongodb+srv://nhom10:fEqpbBnbszCefVlk@cluster0.tyqwvk8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["Group10"]

def compare_and_update(folder_path, collection):
    """
    Compare data in JSON or CSV files with existing data in a MongoDB collection.
    If the data exists and is unchanged, update the crawl_day.
    If the data is new or has changed, insert it into the collection.

    Parameters:
    - folder_path (str): Path to the folder containing JSON or CSV files.
    - collection: MongoDB collection object.
    """
    try:
        for filename in os.listdir(folder_path):
            if filename.endswith(".json") or filename.endswith(".csv"):
                file_path = os.path.join(folder_path, filename)
                if filename.endswith(".json"):
                    with open(file_path, "r") as file:
                        data = json.load(file)
                        process_data(data, collection)
                elif filename.endswith(".csv"):
                    with open(file_path, newline='', encoding='utf-8') as file:
                        data = pd.read_csv(file)
                        data_dict = data.to_dict(orient='records')
                        process_data(data_dict, collection)
    except FileNotFoundError:
        print(f"File {file_path} not found.")

def process_data(data, collection):
    """
    Process data and update MongoDB collection.

    Parameters:
    - data: Data to be processed (list of dictionaries).
    - collection: MongoDB collection object.
    """
    for item in data:
        existing_data = collection.find_one({field: item[field] for field in item if field != "crawl_day"})
        if existing_data:
            if {k: v for k, v in item.items() if k != "crawl_day"} == {k: v for k, v in existing_data.items() if k != "crawl_day"}:
                item["crawl_day"] = datetime.now().strftime("%Y-%m-%d")
                collection.update_one({"_id": existing_data["_id"]}, {"$set": {"crawl_day": item["crawl_day"]}})
            else:
                collection.insert_one(item)
        else:
            item["crawl_day"] = datetime.now().strftime("%Y-%m-%d")
            collection.insert_one(item)
