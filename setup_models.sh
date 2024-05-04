#!/bin/bash

# Define base directory for the models (assuming you're in the root directory of your repo)
base_dir="."

# Loop through model numbers 1 to 13
for i in {1..13}
do
    # Create directory if not exists
    mkdir -p "$base_dir/model_$i"

    # Move the model file into the correct directory
    # Correcting any typo in names such as 'moel_9.glb' to 'model_9.glb'
    mv "$base_dir/models/model_$i.glb" "$base_dir/model_$i/model_$i.glb" 2>/dev/null || echo "Model file for model_$i not found. Skipping."

    # Create the index.html with the necessary HTML setup
    cat > "$base_dir/model_$i/index.html" <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Model Viewer - Model $i</title>
    <script type="module" src="https://unpkg.com/@google/model-viewer@latest"></script>
</head>
<body>
    <model-viewer
        src="model_$i.glb"
        alt="3D Model $i"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        tone-mapping="neutral"
        poster="poster.webp"
        shadow-intensity="1"
        auto-rotate
        style="width: 100%; height: 100vh;">

        <button slot="ar-button" id="ar-button">
            View in your space
        </button>
        <div slot="progress-bar" class="hide">
            <div class="update-bar"></div>
        </div>
        <div id="ar-prompt">
            <img src="https://modelviewer.dev/shared-assets/icons/hand.png">
        </div>
    </model-viewer>
</body>
</html>
EOF

    echo "Setup completed for model_$i"
done

echo "All models are set up."
