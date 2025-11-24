import path from "path";
import { Express } from "express";
import { isSupportedFormat } from "../utils/formatValidator";
import { generateUniqueFileName } from "../utils/nameGenerator";
import {
  convertImageToPDF,
  convertJPGtoPNG,
  convertPNGtoJPG,
} from "../utils/fileHelper";
import chalk from "chalk";

type ConversionFunction = (
  input: string,
  output: string
) => Promise<{ path: string }>;

export class ConvertService {
  // Mapa de tipos de conversão
  private conversionMap: Record<string, ConversionFunction> = {
    png: convertJPGtoPNG,
    jpg: convertPNGtoJPG,
    jpeg: convertPNGtoJPG,
    pdf: convertImageToPDF,
  };

  async convertFile(file: Express.Multer.File, type: string) {
    const normalizedType = type.toLowerCase();

    const originalName =
      file.originalname || file.filename || path.basename(file.path);

    if (!isSupportedFormat(originalName)) {
      throw new Error("Formato não suportado");
    }

    const convertFn = this.conversionMap[normalizedType];
    if (!convertFn) {
      throw new Error(`Tipo de conversão "${type}" não suportado`);
    }

    // Define a extensão correta conforme o tipo pedido
    const extension = normalizedType; // png, jpg/jpeg ou pdf

    const uniqueName = generateUniqueFileName(originalName);

    const outputPath = path.resolve("temp", `${uniqueName}.${extension}`);

    const result = await convertFn(file.path, outputPath);

    console.log(
      chalk.greenBright(
        `Arquivo "${originalName}" convertido para ${uniqueName}.${extension}`
      )
    );

    return result;
  }
}
