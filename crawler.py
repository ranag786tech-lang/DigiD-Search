import os
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

print("=" * 50)
print("🤖 DigiD Crawler Starting...")
print("=" * 50)

# ============================================
# STEP 1: Get MongoDB URI from environment
# ============================================
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    print("❌ ERROR: MONGO_URI environment variable not found!")
    print("💡 Make sure GitHub Secret 'MONGO_URI' is set correctly")
    exit(1)

print("✅ MONGO_URI found (first 20 chars):", MONGO_URI[:20] + "...")

# ============================================
# STEP 2: Connect to MongoDB Atlas
# ============================================
try:
    print("\n📡 Connecting to MongoDB Atlas...")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("✅ MongoDB connection successful!")
    
    db = client['DigiD_Search']
    collection = db['web_index']
    print(f"📊 Database: DigiD_Search, Collection: web_index")
    
except ConnectionFailure as e:
    print(f"❌ MongoDB connection failed: {e}")
    exit(1)
except Exception as e:
    print(f"❌ Unexpected error: {e}")
    exit(1)

# ============================================
# STEP 3: Websites to crawl
# ============================================
websites = [
    {"url": "https://en.wikipedia.org/wiki/Artificial_intelligence", "category": "All"},
    {"url": "https://en.wikipedia.org/wiki/Machine_learning", "category": "All"},
    {"url": "https://news.ycombinator.com", "category": "News"},
    {"url": "https://www.bbc.com/news", "category": "News"},
    {"url": "https://books.google.com", "category": "Books"},
    {"url": "https://www.goodreads.com", "category": "Books"},
    {"url": "https://finance.yahoo.com", "category": "Finance"},
    {"url": "https://www.bloomberg.com", "category": "Finance"},
    {"url": "https://unsplash.com", "category": "Images"},
    {"url": "https://www.pexels.com", "category": "Images"},
    {"url": "https://github.com", "category": "All"},
    {"url": "https://openai.com", "category": "All"},
    {"url": "https://www.youtube.com", "category": "Videos"},
    {"url": "https://vimeo.com", "category": "Videos"},
]

# ============================================
# STEP 4: Crawl each website
# ============================================
print(f"\n🚀 Starting to crawl {len(websites)} websites...")
print("-" * 50)

success_count = 0
fail_count = 0

for site in websites:
    url = site["url"]
    category = site["category"]
    
    print(f"\n🕷️ Crawling: {url}")
    
    try:
        # Get the webpage
        response = requests.get(url, timeout=15, headers={
            'User-Agent': 'Mozilla/5.0 (DigiD Crawler)'
        })
        
        if response.status_code != 200:
            print(f"   ⚠️ HTTP {response.status_code} - skipping")
            fail_count += 1
            continue
        
        # Parse HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract title
        title = soup.title.string if soup.title else url
        title = title.strip()[:200]  # Limit length
        
        # Extract description (meta tag)
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        description = meta_desc.get('content', '') if meta_desc else ''
        description = description.strip()[:500]
        
        # Extract main text content (first 1000 chars)
        text_content = soup.get_text(separator=' ', strip=True)[:1000]
        
        # Save to MongoDB
        result = collection.update_one(
            {"url": url},
            {"$set": {
                "title": title,
                "description": description,
                "content": text_content,
                "url": url,
                "category": category,
                "status": "active"
            }},
            upsert=True
        )
        
        print(f"   ✅ Saved: {title[:60]}...")
        print(f"   📂 Category: {category}")
        success_count += 1
        
    except requests.exceptions.Timeout:
        print(f"   ❌ Timeout - website too slow")
        fail_count += 1
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Connection error - cannot reach site")
        fail_count += 1
    except Exception as e:
        print(f"   ❌ Error: {str(e)[:100]}")
        fail_count += 1

# ============================================
# STEP 5: Summary
# ============================================
print("\n" + "=" * 50)
print("📊 CRAWLING SUMMARY")
print("=" * 50)
print(f"✅ Successful: {success_count}")
print(f"❌ Failed: {fail_count}")
print(f"📚 Total websites in database: {collection.count_documents({})}")
print("=" * 50)

# Close connection
client.close()
print("🔒 MongoDB connection closed.")
print("🎉 DigiD Crawler finished!")