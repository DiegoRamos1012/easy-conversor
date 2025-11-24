import fs from "fs";
import path from "path";
import chalk from "chalk";

const TEMP_DIR = path.resolve("temp");
const UPLOADS_DIR = path.resolve("uploads");

// Função que limpa arquivos mais antigos que X ms
function deleteOldFiles(directory: string, maxAgeMs: number) {
  if (!fs.existsSync(directory)) return;

  const files = fs.readdirSync(directory);

  const now = Date.now();

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    const age = now - stats.mtimeMs;

    if (age > maxAgeMs) {
      fs.unlinkSync(filePath);
      console.log(chalk.greenBright(`Arquivo removido: ${filePath}`));
    }
  }
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
    deleteOldFiles(TEMP_DIR, FIVE_MINUTES);
    deleteOldFiles(UPLOADS_DIR, FIVE_MINUTES);
  }, FIVE_MINUTES);
}
