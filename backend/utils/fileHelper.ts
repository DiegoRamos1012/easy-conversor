import sharp from "sharp";
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";

// ------------------------------
// Criador de diretório seguro
// ------------------------------
function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

// ------------------------------
// JPG → PNG
// ------------------------------
export async function convertJPGtoPNG(
  inputFilePath: string,
  outputFilePath: string
) {
  ensureDir(outputFilePath);

  await sharp(inputFilePath).png().toFile(outputFilePath);

  return { path: outputFilePath };
}

// ------------------------------
// PNG → JPG
// ------------------------------
export async function convertPNGtoJPG(
  inputFilePath: string,
  outputFilePath: string
) {
  ensureDir(outputFilePath);

  await sharp(inputFilePath).jpeg({ quality: 100 }).toFile(outputFilePath);

  return { path: outputFilePath };
}

// ------------------------------
// IMAGEM → PDF (qualidade máxima real)
// ------------------------------
export async function convertImageToPDF(
  inputFilePath: string,
  outputFilePath: string
) {
  ensureDir(outputFilePath);

  return new Promise<{ path: string }>(async (resolve, reject) => {
    try {
      // Obtém metadados sem modificar a imagem
      const metadata = await sharp(inputFilePath).metadata();

      const width = metadata.width ?? 595;  // fallback A4
      const height = metadata.height ?? 842;

      // Evita recompressão usando o buffer original
      const imageBuffer = await fs.promises.readFile(inputFilePath);

      // Cria PDF
      const doc = new PDFDocument({
        autoFirstPage: false, // vamos criar a página com o tamanho exato
      });

      const stream = fs.createWriteStream(outputFilePath);
      doc.pipe(stream);

      // Adiciona página no tamanho exato da imagem
      doc.addPage({
        size: [width, height],
      });

      // Insere a imagem SEM ALTERAR
      doc.image(imageBuffer, 0, 0, {
        width,
        height,
      });

      doc.end();

      stream.on("finish", () => resolve({ path: outputFilePath }));
      stream.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}
