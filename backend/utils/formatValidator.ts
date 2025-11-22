// Verifica se o arquivo enviado é suportado pelo algoritmo

export function isSupportedFormat(filename: string) {
  const allowed = ["jpg", "jpeg", "png"];
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext ? allowed.includes(ext) : false;
}
