from pymongo import MongoClient
import pandas as pd
from datetime import datetime

client = MongoClient("mongodb+srv://nhom10:fEqpbBnbszCefVlk@cluster0.tyqwvk8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client.Group10
collection = db.restaurants

processed_data = pd.read_csv("/Users/thao/restaurant_processed.csv")

processed_data['updatedAt'] = datetime.utcnow()
new_documents = processed_data.to_dict('records')

# Iterate through each new document to check and update MongoDB
for new_doc in new_documents:
    # Check if the document already exists in the collection
    existing_doc = collection.find_one({'name': new_doc['name'], 'province': new_doc['province']})

    # If the document exists, update it with new values
    if existing_doc:
        # Flag to track if any attributes have changed
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
    # If the document does not exist, insert it into the collection
    else:
        new_doc['createdAt'] = datetime.utcnow()
        collection.insert_one(new_doc)
