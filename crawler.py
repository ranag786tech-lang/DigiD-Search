# crawler.py
import requests
from bs4 import BeautifulSoup
import json

# آپ کے موجودہ data.js سے URLs نکالنا
def load_existing_data():
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
        # data.js میں const data = [...] ہے
        start = content.find('[')
        end = content.rfind(']') + 1
        return json.loads(content[start:end])

# نئے URLs کو crawl کرنا
def crawl_new_data(existing_data):
    new_data = []
    
    for item in existing_data:
        try:
            response = requests.get(item['link'], timeout=5)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # صفحہ سے extra info نکالنا
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            if meta_desc and len(item['description']) < 50:
                item['description'] = meta_desc.get('content', item['description'])
            
            new_data.append(item)
        except:
            new_data.append(item)  # error پر بھی پرانا ڈیٹا رکھو
    
    return new_data

# Run karo
existing = load_existing_data()
updated = crawl_new_data(existing)

# نئی data.js فائل بناؤ
with open('data_updated.js', 'w', encoding='utf-8') as f:
    f.write("const data = ")
    json.dump(updated, f, indent=4, ensure_ascii=False)
    f.write(";\n\nexport default data;")
