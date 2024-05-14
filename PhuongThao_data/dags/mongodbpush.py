from pymongo import MongoClient
import os
import json
from datetime import datetime

client = MongoClient("mongodb+srv://nhom10:fEqpbBnbszCefVlk@cluster0.tyqwvk8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["Group10"]
collection = db["hotels_test"]

def compare_and_update(json_folder_path):
    try:
        for filename in os.listdir(json_folder_path):
            if filename.endswith(".json"):
                json_file_path = os.path.join(json_folder_path, filename)
                with open(json_file_path, "r") as file:
                    data = json.load(file)
                    for hotel in data:
                        existing_hotel = collection.find_one({field: hotel[field] for field in hotel if field != "crawl_day"})
                        if existing_hotel:
                            if {k: v for k, v in hotel.items() if k != "crawl_day"} == {k: v for k, v in existing_hotel.items() if k != "crawl_day"}:
                                hotel["crawl_day"] = datetime.now().strftime("%Y-%m-%d")
                                collection.update_one({"_id": existing_hotel["_id"]}, {"$set": {"crawl_day": hotel["crawl_day"]}})
                            else:
                                collection.insert_one(hotel)
                        else:
                            hotel["crawl_day"] = datetime.now().strftime("%Y-%m-%d")
                            collection.insert_one(hotel)
    except FileNotFoundError:
        print(f"File {json_file_path} not found.")

json_folder_path = "Users/thao/datalake"

compare_and_update(json_folder_path)
client.close()
