#!/bin/bash

echo "Starting file renaming process..."

# Function to rename files in a directory
rename_files_in_dir() {
    local dir="$1"
    echo "Processing directory: $dir"
    
    for file in "$dir"/*.json; do
        if [ -f "$file" ]; then
            # Get the filename without path
            filename=$(basename "$file")
            
            # Convert to lowercase and replace underscores with hyphens
            new_filename=$(echo "$filename" | tr '[:upper:]' '[:lower:]' | tr '_' '-')
            
            # Only rename if the name actually changed
            if [ "$filename" != "$new_filename" ]; then
                echo "Renaming: $filename -> $new_filename"
                mv "$file" "$dir/$new_filename"
            fi
        fi
    done
}

# Process each developer directory
directories=("damas" "emaar" "nakheel" "sobha")

for dir in "${directories[@]}"; do
    if [ -d "public/data/$dir" ]; then
        rename_files_in_dir "public/data/$dir"
    else
        echo "Directory public/data/$dir not found"
    fi
done

echo "File renaming completed!"
