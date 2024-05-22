import json
import os
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def convert_rating(rating):
    """
    Convert a string representing a rating to a float.

    Args:
        rating (str): A string representing a rating.

    Returns:
        float: The rating converted to a float.
    """
    return float(rating.replace(',', '.')) if rating else None

def process_json_file(json_file_path):
    """
    Process a JSON file containing travel data.

    Args:
        json_file_path (str): The file path to the JSON file to process.

    """
    try:
        # Opening and loading JSON data
        with open(json_file_path, 'r') as file:
            data = [json.loads(line) for line in file]

        processed_data = []
        # Processing each entry in the JSON data
        for entry in data:
            new_doc = {
                "platform": "Google Travel",
                "price": entry.get("price_platform"),
            } if entry.get("platform") else None

            # Creating a new processed entry
            processed_entry = {
                "description": entry.get("description"),
                "image_url": entry.get("image_url"),
                "brand": entry.get("name"),
                "province": entry.get("province"),
                "duration": entry.get("duration"),
                "departureTime": entry.get("departure_time"),
                "departure": entry.get("departure"),
                "arrival": entry.get("arrival"),
                "detail": entry.get("detail"),
                "new_doc": new_doc,
            }
            processed_data.append(processed_entry)

        # Writing processed data to a new JSON file
        output_path = os.path.splitext(json_file_path)[0] + "_processed.json"
        with open(output_path, 'w') as file:
            for entry in processed_data:
                file.write(json.dumps(entry) + '\n')

        logging.info(f"Successfully processed and saved {json_file_path}")
    except Exception as e:
        logging.error(f"Error processing file {json_file_path}: {e}")

def main():
    """
    Main function to process all JSON files in a folder.
    """
    json_folder_path = "/Users/haqn/datalake"

    for filename in os.listdir(json_folder_path):
        if filename.endswith(".json"):
            json_file_path = os.path.join(json_folder_path, filename)
            process_json_file(json_file_path)

if __name__ == "__main__":
    main()