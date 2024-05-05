#!/bin/bash

# Define the base directory for the models (assuming you're in the root directory of your repository)
base_dir="."

# Start with model 14 and end with model 32
for i in {14..32}
do
    # Create directory if not exists
    mkdir -p "$base_dir/model_$i"

    # Check if GLB file exists to move, if not print a warning
    if [ -f "$base_dir/models/model_$i.glb" ]; then
        mv "$base_dir/models/model_$i.glb" "$base_dir/model_$i/model_$i.glb"
    else
        echo "Model file model_$i.glb not found. Skipping file move."
    fi

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

echo "All models from 14 to 32 are set up."
