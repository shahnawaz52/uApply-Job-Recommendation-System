import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

# Function to establish MongoDB connection
def connect_to_mongodb():
    mongodb_url = os.getenv("MONGODB_URL")
    client = pymongo.MongoClient(mongodb_url)
    db = client.get_database('job_recommendation')
    print("Connected to MongoDB database")
    return db
