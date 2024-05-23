from pymongo import MongoClient
import pandas as pd
from datetime import datetime

def connect_to_mongodb():
    """
    Establishes connection to MongoDB cluster and returns the collection object.
    """
    client = MongoClient("mongodb+srv://nhom10:fEqpbBnbszCefVlk@cluster0.tyqwvk8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = client.Group10
    collection = db.vehicles
    return collection

def process_and_update_data(collection, file_path):
    """
    Reads processed data from a CSV file, checks for existing documents in MongoDB collection,
    updates or inserts documents accordingly, and updates timestamps.
    
    Args:
    - collection: MongoDB collection object
    - file_path: Path to the CSV file containing processed data
    """
    processed_data = pd.read_csv(file_path)
    processed_data['updatedAt'] = datetime.utcnow()
    new_documents = processed_data.to_dict('records')

    for new_doc in new_documents:
        existing_doc = collection.find_one({'name': new_doc['name'], 'province': new_doc['province']})

        if existing_doc:
            attributes_changed = False
            for key, value in new_doc.items():
                if key not in ['name', 'province', 'updatedAt'] and existing_doc.get(key) != value:
                    existing_doc[key] = value
                    attributes_changed = True

            if attributes_changed:
                existing_doc['updatedAt'] = datetime.utcnow()
                collection.replace_one({'_id': existing_doc['_id']}, existing_doc)
            else:
                collection.update_one({'_id': existing_doc['_id']}, {'$set': {'updatedAt': datetime.utcnow()}})
        else:
            new_doc['createdAt'] = datetime.utcnow()
            collection.insert_one(new_doc)

collection = connect_to_mongodb()
process_and_update_data(collection, "/Users/haqn/vehicle_processed.csv")
