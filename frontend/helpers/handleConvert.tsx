import { api } from "@/api";
import { AxiosError, isAxiosError } from "axios";

export async function convertFile(
  file: File,
  type: string
): Promise<string | null> {
  const form = new FormData();
  form.append("file", file);
  form.append("type", type);

  try {
    const res = await api.post("/convert", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const data = res.data;
    return data.output || data.outputFile || data.path || null;
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      const axiosErr = err as AxiosError<{ error?: string }>;
      const message =
        axiosErr.response?.data?.error ||
        axiosErr.message ||
        "Erro ao realizar conversão";
      throw new Error(message);
    }

    if (err instanceof Error) throw err;

    throw new Error("Erro inesperado ao realizar conversão");
  }
}
