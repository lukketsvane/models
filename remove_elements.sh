#!/bin/bash

# Define the base directory for the models
base_dir="."

# Loop through the model directories
for i in {1..13}; do
    # Check if index.html exists in the directory
    if [[ -f "$base_dir/model_$i/index.html" ]]; then
        # Use sed to delete lines containing specific patterns
        sed -i '/View in your space/d' "$base_dir/model_$i/index.html" # Remove the AR button
        sed -i '/hand.png/d' "$base_dir/model_$i/index.html"           # Remove the hand symbol image

        echo "Updated model_$i/index.html"
    else
        echo "No index.html found in model_$i, skipping..."
    fi
done

echo "All applicable files have been updated."
