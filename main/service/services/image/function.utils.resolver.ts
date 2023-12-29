import path from "path";
import fs from "fs";
import sharp from "sharp";

const rootPath = '../../../../';

/**
 * Processes and saves an image file.
 *
 * @param {Buffer} file - The image file to be processed and saved.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} imageName - The name of the image file.
 * @param {string} type - The type of the image.
 * @return {Promise<string>} - The path of the saved image.
 */
export async function processAndSaveImage(file: Buffer, userId: string, imageName: string, type: string): Promise<string> {
    const imagesDirectory = `${rootPath}public/images/${userId}/${type}/`;
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

/**
 * Deletes the image(s) at the given path(s).
 *
 * @param {string | string[]} imagePath - The path(s) of the image(s) to delete. Can be a single string or an array of strings.
 *
 * @return {void} - This method does not return anything.
 */
export function deleteImage(imagePath: string | [string]): void {
    if (Array.isArray(imagePath)) {
        imagePath.forEach((image) => {
            fs.unlinkSync(image);
        });
    } else {
        fs.unlinkSync(imagePath);
    }
}