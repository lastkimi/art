import csv
import json
import urllib.parse

csv_path = 'scripts/styles.csv'
output_path = 'public/data/styles.json'

styles = []

with open(csv_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    rows = list(reader)

# Find header row
header_index = -1
target_col_idx = -1
tags_col_idx = -1

for i, row in enumerate(rows):
    # Check if this row looks like the header
    # We look for "Copy/Paste Name"
    for j, cell in enumerate(row):
        if "Copy/Paste Name" in cell:
            header_index = i
            target_col_idx = j
        if "Tags" in cell:
            tags_col_idx = j
            
    if header_index != -1:
        break

print(f"Header found at row index: {header_index}")
print(f"Copy/Paste Name column index: {target_col_idx}")
print(f"Tags column index: {tags_col_idx}")

if header_index != -1 and target_col_idx != -1:
    count = 0
    for i in range(header_index + 1, len(rows)):
        row = rows[i]
        
        if len(row) <= target_col_idx:
            continue
            
        name = row[target_col_idx].strip()
        
        if not name or name == "Copy/Paste Name":
            continue
            
        # Clean up name: remove "N/A " prefix
        if name.startswith("N/A "):
            # print(f"Removing N/A prefix from: {name}")
            name = name[4:]
            # print(f"New name: {name}")
            
        # Generate Image URLs
        # Each artist should have two images: _1.jpg and _2.jpg
        safe_name = name.replace(' ', '_')
        image_url = f"https://huggingface.co/datasets/parrotzone/sdxl-1.0/resolve/main/grids/{safe_name}_0.jpg"
        image_url2 = f"https://huggingface.co/datasets/parrotzone/sdxl-1.0/resolve/main/grids/{safe_name}_1.jpg"
        
        tags = []
        if tags_col_idx != -1 and len(row) > tags_col_idx:
            tags_raw = row[tags_col_idx]
            tags = [t.strip() for t in tags_raw.split(',') if t.strip()]
        
        style_data = {
            "id": count + 1,
            "name": name,
            "tags": tags,
            "imageUrl": image_url,
            "proxyImageUrl": f"https://sdxl.parrotzone.art/proxy-image?url={urllib.parse.quote(image_url, safe='')}",
            "imageUrl2": image_url2,
            "proxyImageUrl2": f"https://sdxl.parrotzone.art/proxy-image?url={urllib.parse.quote(image_url2, safe='')}"
        }
        
        styles.append(style_data)
        count += 1

    print(f"Processed {len(styles)} styles.")

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump({"styles": styles, "total": len(styles)}, f, indent=2, ensure_ascii=False)
        
    print(f"Saved to {output_path}")
else:
    print("Could not find header row.")
