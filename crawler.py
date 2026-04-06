import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
import os

# MongoDB connection (GitHub secret se)
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client['DigiD_Search']
collection = db['web_index']

def crawl_and_index(url, category="General"):
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        title = soup.title.string if soup.title else url
        text_content = soup.get_text(separator=' ', strip=True)[:2000]
        
        collection.update_one(
            {"url": url},
            {"$set": {
                "title": title, 
                "content": text_content, 
                "url": url,
                "category": category
            }},
            upsert=True
        )
        print(f"✅ Indexed: {title[:50]} - {url}")
    except Exception as e:
        print(f"❌ Error crawling {url}: {e}")

# Websites to index (apni marzi ki sites daal sakte ho)
urls_to_crawl = [
    {"url": "https://en.wikipedia.org/wiki/Artificial_intelligence", "category": "All"},
    {"url": "https://news.ycombinator.com", "category": "News"},
    {"url": "https://books.google.com", "category": "Books"},
    {"url": "https://finance.yahoo.com", "category": "Finance"},
    {"url": "https://unsplash.com", "category": "Images"},
    {"url": "https://youtube.com", "category": "Videos"},
    {"url": "https://github.com", "category": "All"},
    {"url": "https://openai.com", "category": "All"},
]

print("🚀 Starting crawler...")
for site in urls_to_crawl:
    crawl_and_index(site["url"], site["category"])
print("✅ Crawling complete!")