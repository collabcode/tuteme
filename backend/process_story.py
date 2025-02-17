import os
import azure.cognitiveservices.speech as speechsdk
import csv
import json
import shutil

def csv_to_json(csv_file, json_file):   
    os.makedirs(os.path.dirname(json_file), exist_ok=True) 

    #---Copy Images
    # Create the image directory if it doesn't exist
    image_source_dir = os.path.join(os.path.dirname(csv_file), 'images')
    image_dest_dir = os.path.join(os.path.dirname(json_file), 'images') 
    os.makedirs(image_dest_dir, exist_ok=True)

    # Copy images from source to destination
    for filename in os.listdir(image_source_dir):
        shutil.copy(os.path.join(image_source_dir, filename), image_dest_dir)

    #---Convert CSV to JSON
    data = []
    with open(csv_file, 'r', newline='', encoding='utf-8') as csvfile:
        # Use csv.DictReader with appropriate quoting settings
        reader = csv.DictReader(csvfile, quotechar='"', skipinitialspace=True)
        for row in reader:
            cleaned_row = {}
            for key, value in row.items():
                if isinstance(value, str):
                    # Remove leading/trailing spaces and extra quotes if present
                    cleaned_row[key] = value.strip()
                else:
                    # Handle cases where a value is mistakenly a list
                    cleaned_row[key] = value
            data.append(cleaned_row)

    with open(json_file, 'w', encoding='utf-8') as jsonfile:
        json.dump(data, jsonfile, indent=4, ensure_ascii=False)


    #---Generate Audio Files
    for idx, row in enumerate(data):
        if row['Narration']:
            print(f"{idx}/{row['Narration']}")
            audio_filename = f"data/story1/audio/{idx}.mp3" 
            createAudioFile(row['Narration'], audio_filename)
            

    #---Copy Audio Files
    # Create the audio directory if it doesn't exist
    image_source_dir = os.path.join(os.path.dirname(csv_file), 'audio')
    image_dest_dir = os.path.join(os.path.dirname(json_file), 'audio') 
    os.makedirs(image_dest_dir, exist_ok=True)

    # Copy images from source to destination
    for filename in os.listdir(image_source_dir):
        shutil.copy(os.path.join(image_source_dir, filename), image_dest_dir)

def createAudioFile(text, filenameWithPath):
    return #To not call this every time
    # This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    speech_config = speechsdk.SpeechConfig(subscription=os.environ.get('SPEECH_KEY'), region=os.environ.get('SPEECH_REGION'))
    # audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
    audio_config = speechsdk.audio.AudioOutputConfig(filename=filenameWithPath)

    # The neural multilingual voice can speak different languages based on the input text.
    speech_config.speech_synthesis_voice_name='en-US-AvaMultilingualNeural'

    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

    speech_synthesis_result = speech_synthesizer.speak_text_async(text).get()

    if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        print("Speech synthesized for text [{}]".format(text))
    elif speech_synthesis_result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = speech_synthesis_result.cancellation_details
        print("Speech synthesis canceled: {}".format(cancellation_details.reason))
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            if cancellation_details.error_details:
                print("Error details: {}".format(cancellation_details.error_details))
                print("Did you set the speech resource key and region values?")

csv_file = 'data/story1/story.csv'
json_file = 'public/data/story1/story.json' 

csv_to_json(csv_file, json_file)