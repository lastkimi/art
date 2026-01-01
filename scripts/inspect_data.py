import pandas as pd
import requests
import io

url = "https://huggingface.co/api/datasets/parrotzone/sdxl-1.0/parquet/default/train/0.parquet"
print(f"Downloading {url}...")
response = requests.get(url)
print("Download complete. Reading parquet...")
df = pd.read_parquet(io.BytesIO(response.content))

print("\nColumns:")
print(df.columns.tolist())

print("\nFirst row:")
print(df.iloc[0])

# Check if we can find style name
if 'style' in df.columns:
    print("\nStyle column found.")
elif 'name' in df.columns:
    print("\nName column found.")
