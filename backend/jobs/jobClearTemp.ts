import fs from "fs";
import path from "path";
import chalk from "chalk";

const TEMP_DIR = path.resolve("temp");
const UPLOADS_DIR = path.resolve("uploads");

// Função assíncrona que limpa arquivos mais antigos que X ms
async function deleteOldFiles(directory: string, maxAgeMs: number) {
  if (!fs.existsSync(directory)) return 0;

  const files = await fs.promises.readdir(directory);
  const now = Date.now();
  let removedCount = 0;

  for (const file of files) {
    const filePath = path.join(directory, file);

    try {
      const stats = await fs.promises.stat(filePath);
      const age = now - stats.mtimeMs;

      if (age > maxAgeMs) {
        await fs.promises.unlink(filePath);
        removedCount++;
      }
    } catch (err) {
      console.error(chalk.red(`Erro ao processar ${filePath}:`), err);
    }
  }

  return removedCount;
}

// Exporta função para iniciar o job
export function startCleanupJob() {
  const FIVE_MINUTES = 5 * 60 * 1000; // 5 min em ms

  console.log(
    chalk.blue(
      "- Job de limpeza de arquivos temporários executando a cada 5 minutos"
    )
  );

  setInterval(async () => {
    console.log(chalk.yellow("- Limpando arquivos antigos..."));

    const removedTemp = await deleteOldFiles(TEMP_DIR, FIVE_MINUTES);
    const removedUploads = await deleteOldFiles(UPLOADS_DIR, FIVE_MINUTES);

    const totalRemoved = removedTemp + removedUploads;

    console.log(
      chalk.greenBright(
        `- Total de arquivos removidos: ${chalk.bold(totalRemoved)}`
      )
    );
  }, FIVE_MINUTES);
}
