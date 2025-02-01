#!/bin/zsh

# Ensure required tools are installed
if ! command -v jq &> /dev/null; then
    echo "jq is not installed. Please install it to continue."
    exit 1
fi

# Fetch the JSON data from the local file
JSON_FILE="${PWD}/data/all_surahs.json"

# Check if the JSON file exists
if [[ ! -f "$JSON_FILE" ]]; then
    echo "JSON file not found at $JSON_FILE"
    exit 1
fi

JSON_DATA=$(cat "$JSON_FILE")

# Template for individual surah pages
HTML_TEMPLATE="${PWD}/public/surahs/surah-template.html"
JS_TEMPLATE="${PWD}/public/surahs/surah-template.js"

# Loop through each surah in the JSON data
jq -c '.children[]' "$JSON_FILE" | while IFS= read -r surah_json; do
  # Extract information using jq
  surah_number=$(echo "$surah_json" | jq -r '.number')
  surah_name=$(echo "$surah_json" | jq -r '.englishName')
  surah_arabic_name=$(echo "$surah_json" | jq -r '.name')
  surah_english_translation=$(echo "$surah_json" | jq -r '.englishNameTranslation')
  surah_num_ayahs=$(echo "$surah_json" | jq -r '.numberOfAyahs')
  surah_revelation_type=$(echo "$surah_json" | jq -r '.revelationType')

  # Sanitize the surah name for filenames
  sanitized_name=$(echo "$surah_name" | tr '[:upper:]' '[:lower:]' | tr -d "'" | sed 's/ /-/g')

  # Create directory for the surah if it doesn't exist
  mkdir -p "surahs/$sanitized_name"

  # Create HTML file for each surah, replacing placeholders with actual data
  sed "s/{surah-id}/$sanitized_name/g" "$HTML_TEMPLATE" > "surahs/$sanitized_name/$sanitized_name.html"

  # Create JS file for each surah, replacing placeholders with actual data
  sed "s/{surah-id}/$sanitized_name/g" "$JS_TEMPLATE" > "surahs/$sanitized_name/$sanitized_name.js"

  echo "Created files for $surah_name: surahs/$sanitized_name/$sanitized_name.html and surahs/$sanitized_name/$sanitized_name.js"
done

echo "Surah directories and files created successfully!"
