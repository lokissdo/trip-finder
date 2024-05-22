from pymongo import MongoClient
import pandas as pd
from datetime import datetime

# Connect to MongoDB
client = MongoClient("mongodb+srv://nhom10:fEqpbBnbszCefVlk@cluster0.tyqwvk8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client.Group10
collection = db.hotels

# Read processed data from the CSV file
processed_data = pd.read_csv("/Users/thao/hotel_processed.csv")

# Add an 'updatedAt' field with the current timestamp to the processed data
processed_data['updatedAt'] = datetime.utcnow()

# Convert DataFrame to a list of dictionary documents
new_documents = processed_data.to_dict('records')

# Iterate through each new document to check and update MongoDB
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
