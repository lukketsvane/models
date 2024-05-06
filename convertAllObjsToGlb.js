import fs from 'fs';
import path from 'path';
import obj2gltf from 'obj2gltf';

async function convertObjToGlb(sourceObj, destinationGlb) {
    try {
        const options = {
            binary: true,
            separateTextures: false, // Embed textures directly into the GLB
            checkTransparency: true,
            secure: true,
            ktx2: false, // Use this option if you require KTX 2.0 texture compression
            materialsCommon: false, // Set to true if using the Common Material extension
            specularGlossiness: false, // Choose either this or metallicRoughness based on your material specifications
            metallicRoughness: true, // Set this to true to use the Metallic-Roughness workflow
            unlit: false // Use for materials with no lighting or shading (only one of these three can be true)
        };

        const glb = await obj2gltf(sourceObj, options);
        fs.writeFileSync(destinationGlb, Buffer.from(glb));
        console.log(`Successfully converted ${sourceObj} to ${destinationGlb}`);
    } catch (error) {
        console.error(`Error converting ${sourceObj} to GLB: ${error}`);
    }
}

const objsDirectory = './objs'; // Adjusted to the path you provided
fs.readdirSync(objsDirectory).forEach(file => {
    if (file.endsWith('.obj')) {
        const objPath = path.join(objsDirectory, file);
        const glbPath = path.join(objsDirectory, file.replace('.obj', '.glb'));
        convertObjToGlb(objPath, glbPath);
    }
});

console.log('Conversion process started... Check console for progress.');