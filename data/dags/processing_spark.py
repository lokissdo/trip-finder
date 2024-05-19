import json
import os
import re
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def extract_latitude(link):
    match = re.search(r'@(-?\d+\.\d+),(-?\d+\.\d+)', link)
    return match.group(1) if match else None

def extract_longitude(link):
    match = re.search(r'@(-?\d+\.\d+),(-?\d+\.\d+)', link)
    return match.group(2) if match else None

def convert_rating(rating):
    return float(rating.replace(',', '.')) if rating else None

def process_json_file(json_file_path):
    try:
        with open(json_file_path, 'r') as file:
            data = [json.loads(line) for line in file]

        processed_data = []
        for entry in data:
            latitude = extract_latitude(entry.get("url_platform"))
            longitude = extract_longitude(entry.get("url_platform"))
            rating = convert_rating(entry.get("rating"))
            new_doc = {
                "platform": "Google Maps",
                "price": entry.get("price_platform"),
                "page_url": entry.get("url_platform")
            } if entry.get("platform") else None

            processed_entry = {
                "checkin": entry.get("checkin"),
                "checkout": entry.get("checkout"),
                "description": entry.get("description"),
                "image_url": entry.get("image_url"),
                "name": entry.get("name"),
                "province": entry.get("province"),
                "rating": rating,
                "standard": entry.get("standard"),
                "new_doc": new_doc,
                "latitude": latitude,
                "longitude": longitude
            }
            processed_data.append(processed_entry)

        output_path = os.path.splitext(json_file_path)[0] + "_processed.json"
        with open(output_path, 'w') as file:
            for entry in processed_data:
                file.write(json.dumps(entry) + '\n')

        logging.info(f"Successfully processed and saved {json_file_path}")
    except Exception as e:
        logging.error(f"Error processing file {json_file_path}: {e}")

def main():
    json_folder_path = "/Users/thao/datalake"

    for filename in os.listdir(json_folder_path):
        if filename.endswith(".json"):
            json_file_path = os.path.join(json_folder_path, filename)
            process_json_file(json_file_path)

if __name__ == "__main__":
    main()
