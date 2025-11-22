import path from "path";
import { isSupportedFormat } from "../utils/formatValidator";
import { generateUniqueFileName } from "../utils/nameGenerator";
import { convertJPGtoPNG } from "../utils/fileHelper";
import { convertPNGtoJPG } from "../utils/fileHelper";

export class ConvertService {
  async convertFile(file: { filename: string; path: string }, type: string) {
    // Valida se o arquivo é suportado
    if (!isSupportedFormat(file.filename)) {
      throw new Error("Formato não suportado");
    }

    // Gera nome único
    const uniqueName = generateUniqueFileName(file.filename);

    // Define caminho de saída e chama a função adequada
    let outputPath: string;

    if (type === "png") {
      outputPath = path.resolve("temp", `${uniqueName}.png`);
      await convertJPGtoPNG(file.path, outputPath);
    } else if (type === "jpg" || type === "jpeg") {
      outputPath = path.resolve("temp", `${uniqueName}.jpg`);
      await convertPNGtoJPG(file.path, outputPath);
    } else {
      throw new Error(`Tipo de conversão "${type}" não suportado`);
    }

    // Retorna o caminho do arquivo convertido
    return { path: outputPath };
  }
}
