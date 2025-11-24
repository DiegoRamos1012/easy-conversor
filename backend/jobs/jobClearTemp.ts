import fs from "fs";
import path from "path";
import chalk from "chalk";

const TEMP_DIR = path.resolve("temp");
const UPLOADS_DIR = path.resolve("uploads");

// Função que limpa arquivos mais antigos que X ms
function deleteOldFiles(directory: string, maxAgeMs: number) {
  if (!fs.existsSync(directory)) return 0;

  const files = fs.readdirSync(directory);
  const now = Date.now();

  let removedCount = 0;

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    const age = now - stats.mtimeMs;

    if (age > maxAgeMs) {
      fs.unlinkSync(filePath);
      removedCount++;
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

  setInterval(() => {
    console.log(chalk.yellow("Limpando arquivos antigos..."));

    const removedTemp = deleteOldFiles(TEMP_DIR, FIVE_MINUTES);
    const removedUploads = deleteOldFiles(UPLOADS_DIR, FIVE_MINUTES);

    const totalRemoved = removedTemp + removedUploads;

    console.log(
      chalk.greenBright(
        `🧹 Total de arquivos removidos: ${chalk.bold(totalRemoved)}`
      )
    );
  }, FIVE_MINUTES);
}
