import os
import csv
import json
import shutil

def csv_to_json(csv_file, json_file):   
    os.makedirs(os.path.dirname(json_file), exist_ok=True) 

    # Create the image directory if it doesn't exist
    image_source_dir = os.path.join(os.path.dirname(csv_file), 'images')
    image_dest_dir = os.path.join(os.path.dirname(json_file), 'images') 
    os.makedirs(image_dest_dir, exist_ok=True)

    # Copy images from source to destination
    for filename in os.listdir(image_source_dir):
        shutil.copy(os.path.join(image_source_dir, filename), image_dest_dir)

    data = []
    with open(csv_file, 'r') as csvfile:
        reader = csv.DictReader(csvfile, quotechar='"', quoting=csv.QUOTE_ALL) 
        for row in reader:
            # Join the "Narration" and "RemoveElements" fields 
            row['Narration'] = ' '.join(row['Narration'].split()) 
            row['RemoveElements'] = ' '.join(row['RemoveElements'].split()) 

            data.append(row)

    with open(json_file, 'w') as jsonfile:
        json.dump(data, jsonfile, indent=4)

csv_file = 'data/story1/story.csv'
json_file = 'public/data/story1/story.json' 
csv_to_json(csv_file, json_file)