import os

# Define a function to save the translated JSON data to a file
def save_translated_json(translated_data, language_code):
    file_name = f"translated_json_{language_code}.json"
    file_path = os.path.join('/mnt/data', file_name)
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(translated_data, file, ensure_ascii=False, indent=4)
    return file_path

# Save the translated JSON data for each language and generate download links
download_links = {}
for lang, data in translated_json_data.items():
    file_path = save_translated_json(data, lang)
    download_links[lang] = file_path

# Output the download links for each language
download_links
