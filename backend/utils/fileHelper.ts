import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

export async function convertJPGtoPNG(
  inputFilePath: string,
  outputFilePath: string
) {
  await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
  await sharp(inputFilePath).png().toFile(outputFilePath);
  return { path: outputFilePath };
}

export async function convertPNGtoJPG(
  inputFilePath: string,
  outputFilePath: string
) {
  await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
  await sharp(inputFilePath).jpeg().toFile(outputFilePath);
  return { path: outputFilePath };
}


