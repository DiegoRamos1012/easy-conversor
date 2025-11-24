import fs from "fs";
import path from "path";

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
      console.log(`Arquivo removido: ${filePath}`);
    }
  }
}

// Exporta função para iniciar o job
export function startCleanupJob() {
  const FIVE_MINUTES = 5 * 60 * 1000; // 5 min em ms

  console.log("Job de limpeza iniciado...");

  setInterval(() => {
    console.log("🧽 Limpando arquivos antigos...");
    deleteOldFiles(TEMP_DIR, FIVE_MINUTES);
    deleteOldFiles(UPLOADS_DIR, FIVE_MINUTES);
  }, FIVE_MINUTES);
}
