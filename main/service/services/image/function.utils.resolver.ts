import path from "path";
import fs from "fs";
import sharp from "sharp";

// variable root du dossier image
const directory = '../../../image';

export async function processAndSaveImage(file: Buffer, userId: string, imageName: string): Promise<string> {
    const imagesDirectory = `${directory}/${userId}`;
    const imageFullPath = path.join(imagesDirectory, imageName);
    const imageWebPPath = imageFullPath.replace(/\.[^/.]+$/, ".webp");

    if (!fs.existsSync(imagesDirectory)) {
        fs.mkdirSync(imagesDirectory, { recursive: true });
    }

    await sharp(file)
        .resize(800)
        .toFormat('webp', { quality: 100 })
        .toFile(imageWebPPath);

    return imageWebPPath;
}