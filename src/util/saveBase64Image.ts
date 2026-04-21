import sharp from 'sharp';

export default async function saveBase64Image(base64Data, outputPath) {
  const base64String = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const binaryData = Buffer.from(base64String, 'base64');

  await sharp(binaryData).webp({ quality: 80 }).toFile(outputPath);
}
