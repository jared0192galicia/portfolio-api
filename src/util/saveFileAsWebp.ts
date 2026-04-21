import sharp from 'sharp';

export async function saveFileAsWebp(file: File, outputPath: string) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await sharp(buffer).webp({ quality: 80 }).toFile(outputPath);
}
