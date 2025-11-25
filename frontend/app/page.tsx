"use client";

import React, { useRef, useState } from "react";

// shadcn component placeholders (you will install these later)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [type, setType] = useState<string>("png");
  const [loading, setLoading] = useState(false);
  const [outputPath, setOutputPath] = useState<string | null>(null);

  function handlePickFile() {
    fileRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setOutputPath(null);
    if (f) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  }

  async function handleConvert() {
    if (!file) return;
    setLoading(true);
    setOutputPath(null);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("type", type);

      // endpoint matches backend route (you may need to add /api prefix)
      const res = await fetch("/convert", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (res.ok) {
        setOutputPath(data.output || data.outputFile || data.path || null);
      } else {
        alert(data.error || "Erro na conversão");
      }
    } catch (err) {
      console.error(err);
      alert("Falha ao enviar o arquivo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <header className="text-center text-white mb-6">
          <h1 className="text-3xl font-semibold">EasyConverter</h1>
          <p className="text-sm text-white/80 mt-1">
            Converta imagens com facilidade
          </p>
        </header>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Envie sua imagem</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png,image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <div
                onClick={handlePickFile}
                className="cursor-pointer rounded-lg border border-dashed border-white/10 p-6 text-center bg-white/2 hover:bg-white/3"
              >
                <p className="text-white/80">
                  Arraste e solte ou clique para selecionar um arquivo
                </p>
                <p className="text-xs text-white/60 mt-2">
                  JPG, JPEG, PNG, WEBP, GIF, AVIF
                </p>
              </div>
            </div>

            {file && (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded overflow-hidden bg-white/5 flex items-center justify-center">
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={preview}
                        alt="preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="text-white/60 text-xs">Preview</div>
                    )}
                  </div>

                  <div className="text-white text-sm">
                    <div className="font-medium">{file.name}</div>
                    <div className="text-white/60 text-xs">
                      {(file.size / 1024).toFixed(0)} KB
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <Label className="text-white/80 mb-1">
                      Formato de saída
                    </Label>

                    <Select
                      onValueChange={(v: string) => setType(v)}
                      defaultValue={type}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Selecionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpg">JPG</SelectItem>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="webp">WEBP</SelectItem>
                        <SelectItem value="gif">GIF</SelectItem>
                        <SelectItem value="avif">AVIF</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button disabled={loading} onClick={handleConvert}>
                    {loading ? "Convertendo..." : "Converter"}
                  </Button>
                </div>
              </div>
            )}

            {outputPath && (
              <div className="pt-2 border-t border-white/6">
                <p className="text-white/80 text-sm">Conversão concluída</p>
                <a
                  href={`/${outputPath}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-indigo-300 underline"
                >
                  Abrir arquivo convertido
                </a>
              </div>
            )}

            {!file && (
              <div className="text-center text-white/60 text-sm">
                Selecione um arquivo para começar
              </div>
            )}
          </CardContent>
        </Card>

        <footer className="mt-6 text-center text-white/60 text-sm">
          Projeto rápido com design inspirado no shadcn — instale os componentes
          para ativar estilos e interações.
        </footer>
      </div>
    </div>
  );
}
