import sharp from "sharp";
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";

// ---------------------------------------
// Criador de diretório seguro
// ---------------------------------------
function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

// ---------------------------------------
// Conversão genérica para PNG / JPG / WEBP / GIF / AVIF
// ---------------------------------------
export async function convertImage(
  inputFilePath: string,
  outputFilePath: string,
  format: "png" | "jpeg" | "webp" | "gif" | "avif"
) {
  ensureDir(outputFilePath);

  await sharp(inputFilePath)[format]({
    quality: 100, 
  }).toFile(outputFilePath);

  return { path: outputFilePath };
}

// ---------------------------------------
// IMAGEM → PDF (qualidade real preservada)
// ---------------------------------------
export async function convertImageToPDF(
  inputFilePath: string,
  outputFilePath: string
) {
  ensureDir(outputFilePath);

  return new Promise<{ path: string }>(async (resolve, reject) => {
    try {
      // Lê a imagem original sem recomprimir
      const imageBuffer = await fs.promises.readFile(inputFilePath);

      // Obtém metadados originais
      const metadata = await sharp(inputFilePath).metadata();

      const width = metadata.width ?? 595;  // fallback A4
      const height = metadata.height ?? 842;

      // Cria o PDF
      const pdf = new PDFDocument({
        autoFirstPage: false,
      });

      const stream = fs.createWriteStream(outputFilePath);
      pdf.pipe(stream);

      // Página do tamanho exato da imagem
      pdf.addPage({ size: [width, height] });

      // Insere a imagem original (sem reprocessar)
      pdf.image(imageBuffer, 0, 0, { width, height });

      pdf.end();

      stream.on("finish", () => resolve({ path: outputFilePath }));
      stream.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}
