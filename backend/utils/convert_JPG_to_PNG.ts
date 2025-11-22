import sharp from "sharp";
import path from "path";
import fs from "fs";

export async function convertJPGtoPNG(file: { filename: string; path: string }) {
  const outputPath = path.resolve("temp", `${file.filename}.png`);
  await sharp(file.path).png().toFile(outputPath);
  return { path: outputPath };
}