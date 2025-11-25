import path from "path";
import chalk from "chalk";
import { isSupportedFormat } from "../utils/formatValidator";
import { generateUniqueFileName } from "../utils/nameGenerator";
import { convertImage, convertImageToPDF } from "../utils/fileHelper";

type ConversionFunction = (
  input: string,
  output: string
) => Promise<{ path: string }>;

export class ConvertService {
  private conversionMap: Record<
    string,
    (input: string, output: string) => Promise<{ path: string }>
  > = {
    png: (i, o) => convertImage(i, o, "png"),
    jpg: (i, o) => convertImage(i, o, "jpeg"),
    jpeg: (i, o) => convertImage(i, o, "jpeg"),
    webp: (i, o) => convertImage(i, o, "webp"),
    gif: (i, o) => convertImage(i, o, "gif"),
    avif: (i, o) => convertImage(i, o, "avif"),
    pdf: convertImageToPDF,
  };

  async convertFile(file: Express.Multer.File, type: string) {
    const normalizedType = type.toLowerCase(); // Usuário pode enviar arquivos com a extensão em minúsculo
    const originalName =
      file.originalname || file.filename || path.basename(file.path);
    const originalExt = path
      .extname(originalName)
      .toLowerCase()
      .replace(".", "");

    if (!isSupportedFormat(originalName)) {
      throw new Error("Formato não suportado");
    }

    if (originalExt === normalizedType) {
      throw new Error(
        `Arquivo enviado já está no formato ${normalizedType.toUpperCase()}`
      );
    }

    const convertFn = this.conversionMap[normalizedType];
    if (!convertFn) {
      throw new Error(`Tipo de conversão "${type}" não suportado`);
    }

    // Define a extensão final
    const extension = normalizedType;

    // Gera nome único
    const uniqueName = generateUniqueFileName(originalName);

    // Caminho de saída
    const outputPath = path.resolve("temp", `${uniqueName}.${extension}`);

    // Realiza a conversão
    const result = await convertFn(file.path, outputPath);

    console.log(
      chalk.greenBright(
        `✔ Arquivo "${originalName}" convertido para "${uniqueName}.${extension}"`
      )
    );

    return result;
  }
}
