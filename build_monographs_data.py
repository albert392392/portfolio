# -*- coding: utf-8 -*-
"""
Generate assets/monographs-data.js from pure_tech_database.json (56 Pure Technical Monographs)
"""
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

src_file = Path(r"c:\Users\iman3\Projects\کل دیتاها\music_system_ai_site\data\pure_tech_database.json")
dest_file = Path(r"c:\Users\iman3\Projects\portfolio-site\pub\assets\monographs-data.js")

with open(src_file, "r", encoding="utf-8") as f:
    posts = json.load(f)

print(f"Loaded {len(posts)} posts from {src_file.name}")

processed_posts = []
for p in posts:
    # fix photo paths to match portfolio assets
    photos = []
    if p.get('photos'):
        for ph in p['photos']:
            ph_name = Path(ph).name
            photos.append(f"assets/img/monographs/{ph_name}")
            
    processed_posts.append({
        "id": p["id"],
        "title": p.get("title", ""),
        "date": p.get("date", ""),
        "category": p.get("category", ""),
        "word_count": p.get("word_count", 0),
        "views": p.get("views", 450),
        "shares": p.get("shares", 14),
        "full_text": p.get("full_text", ""),
        "photos": photos,
        "ocr_texts": p.get("ocr_texts", []),
        "tags": p.get("tags", [])
    })

js_content = "/* Auto-generated 56 Elite Engineering Monographs Data */\n"
js_content += "window.MONOGRAPHS_DATA = " + json.dumps(processed_posts, ensure_ascii=False, indent=2) + ";\n"

with open(dest_file, "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"✅ Generated {dest_file} ({dest_file.stat().st_size} bytes)")
