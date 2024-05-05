import fs from 'fs';
import path from 'path';
import obj2gltf from 'obj2gltf';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directoryPath = path.join(__dirname, 'objs');

async function convertObjToGlb(source, destination) {
    try {
        const options = { binary: true };
        const glb = await obj2gltf(source, options);
        fs.writeFileSync(destination, Buffer.from(glb));
        console.log(`Converted ${source} to ${destination}`);
    } catch (error) {
        console.error(`Error converting ${source}: ${error}`);
        if (error.code === 'ENOENT' && error.message.includes('.mtl')) {
            console.log(`Missing material file for ${source}, proceeding without materials.`);
            try {
                const options = { binary: true, materialsCommon: {} }; // Using default materials
                const glb = await obj2gltf(source, options);
                fs.writeFileSync(destination, Buffer.from(glb));
                console.log(`Converted ${source} without materials to ${destination}`);
            } catch (secondError) {
                console.error(`Error converting ${source} without materials: ${secondError}`);
            }
        }
    }
}

function walkDirectory(dir, callback) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
        let dirPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkDirectory(dirPath, callback);
        } else if (entry.isFile()) {
            callback(dirPath);
        }
    });
}

walkDirectory(directoryPath, function(filePath) {
    if (path.extname(filePath) === '.obj') {
        let base = path.basename(filePath, '.obj');
        let directory = path.dirname(filePath);
        let outputPath = path.join(directory, `${base}.glb`);
        convertObjToGlb(filePath, outputPath);
    }
});

console.log('Conversion process started... Check console for progress.');
