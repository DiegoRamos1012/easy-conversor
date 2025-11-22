import path from "path";
import { isSupportedFormat } from "../utils/formatValidator";
import { generateUniqueFileName } from "../utils/nameGenerator";
import { convertJPGtoPNG, convertPNGtoJPG } from "../utils/fileHelper";

type ConversionFunction = (input: string, output: string) => Promise<{ path: string }>;

export class ConvertService {
  // Mapa de tipos de conversão para suas funções correspondentes
  private conversionMap: Record<string, ConversionFunction> = {
    png: convertJPGtoPNG,
    jpg: convertPNGtoJPG,
    jpeg: convertPNGtoJPG,
  };

  async convertFile(file: { filename: string; path: string }, type: string) {
    // Valida se o arquivo é suportado
    if (!isSupportedFormat(file.filename)) {
      throw new Error("Formato não suportado");
    }

    // Busca a função de conversão no mapa
    const convertFn = this.conversionMap[type.toLowerCase()];
    if (!convertFn) {
      throw new Error(`Tipo de conversão "${type}" não suportado`);
    }

    // Gera nome único e define caminho de saída
    const uniqueName = generateUniqueFileName(file.filename);
    const extension = type.toLowerCase() === "png" ? "png" : "jpg";
    const outputPath = path.resolve("temp", `${uniqueName}.${extension}`);

    // Executa a conversão usando a função correspondente
    const result = await convertFn(file.path, outputPath);

    // Retorna o resultado da conversão (ex: { path: "temp/arquivo-123456.png" })
    return result;
  }
}
