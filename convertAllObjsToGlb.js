import fs from 'fs';
import path from 'path';
import obj2gltf from 'obj2gltf';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the directory where the OBJ files are stored and the start index for naming
const directoryPath = path.join(__dirname, 'objs');
const baseModelPath = path.join(__dirname, 'models');
let modelIndex = 14; // Start naming from model_14

// Ensure the base model directory exists
if (!fs.existsSync(baseModelPath)) {
    fs.mkdirSync(baseModelPath, { recursive: true });
}

// Function to convert OBJ files to GLB format and save in a structured directory
async function convertObjToGlb(source, destination, outputDir) {
    try {
        const options = { binary: true };
        const glb = await obj2gltf(source, options);
        fs.writeFileSync(destination, Buffer.from(glb));
        console.log(`Converted ${source} to ${destination}`);
    } catch (error) {
        console.error(`Error converting ${source}: ${error}`);
    }
}

// Function to recursively walk through a directory and its subdirectories
function walkDirectory(dir, callback) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
        let dirPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkDirectory(dirPath, callback);
        } else if (entry.isFile() && path.extname(entry.name) === '.obj') {
            callback(dirPath);
        }
    });
}

// Start the conversion process for each OBJ file found
walkDirectory(directoryPath, function(filePath) {
    if (path.extname(filePath) === '.obj') {
        let modelName = `model_${modelIndex}`;
        let modelDir = path.join(baseModelPath, modelName);
        if (!fs.existsSync(modelDir)) {
            fs.mkdirSync(modelDir, { recursive: true });
        }

        let glbFileName = `${modelName}.glb`;
        let outputPath = path.join(modelDir, glbFileName);

        // Create a simple index.html for each model
        let htmlContent = `<html><body><model-viewer src="${glbFileName}" alt="${modelName}" auto-rotate camera-controls></model-viewer></body></html>`;
        fs.writeFileSync(path.join(modelDir, 'index.html'), htmlContent);

        convertObjToGlb(filePath, outputPath, modelDir);

        modelIndex++; // Increment to prepare for the next model
    }
});

console.log('Conversion process started... Check console for progress.');
