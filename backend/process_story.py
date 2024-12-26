import os
import csv
import json

def csv_to_json(csv_file, json_file):
  """
  Converts a CSV file to a JSON file.

  Args:
      csv_file: Path to the input CSV file.
      json_file: Path to the output JSON file.
  """
  os.makedirs(os.path.dirname(json_file), exist_ok=True) 

  data = []
  with open(csv_file, 'r') as csvfile:
      reader = csv.DictReader(csvfile)
      for row in reader:
          data.append(row)

  with open(json_file, 'w') as jsonfile:
      json.dump(data, jsonfile, indent=4)

# Example usage:
csv_file = 'data/story1/story.csv'
json_file = 'public/data/story1/story.json' 
csv_to_json(csv_file, json_file)