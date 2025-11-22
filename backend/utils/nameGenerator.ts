// Gera nomes únicos para os arquivos, evitando duplicidade

export function generateUniqueFileName(originalName: string) {
  const timestamp = Date.now();
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
  return `${nameWithoutExt}-${timestamp}`;
}
