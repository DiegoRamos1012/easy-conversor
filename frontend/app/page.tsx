"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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
import Image from "next/image";
import { convertFile } from "@/helpers/handleConvert";
import { Input } from "@/components/ui/input";
import { Loader2, WandSparkles } from "lucide-react";

export default function Home() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [type, setType] = useState<string>("png");
  const [loading, setLoading] = useState(false);
  const [outputPath, setOutputPath] = useState<string | null>(null);

  // Estado para controle de drag'n'drop
  const [isDragging, setIsDragging] = useState(false);

  const outputFormats = ["png", "jpg", "jpeg", "webp", "gif", "avif", "pdf"];

  const handlePickFile = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const f = e.dataTransfer.files?.[0] ?? null;
    if (f) {
      setFile(f);
      setOutputPath(null);
      setPreview(URL.createObjectURL(f));
    }
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0] ?? null;
      setFile(f);
      setOutputPath(null);

      if (f) {
        setPreview(URL.createObjectURL(f));
      } else {
        setPreview(null);
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleConvert = useCallback(async () => {
    if (!file) return;

    setLoading(true);
    setOutputPath(null);

    try {
      const resultPath = await convertFile(file, type);
      setOutputPath(resultPath);
    } catch (err) {
      console.error("Erro ao converter:", err);
      const message = err instanceof Error ? err.message : "Erro inesperado";
      alert(message);
    } finally {
      setLoading(false);
    }
  }, [file, type]);

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
              <Input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png,image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <div
                onClick={handlePickFile}
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`cursor-pointer rounded-lg border border-dashed p-6 text-center transition-colors ${
                  isDragging
                    ? "border-white/30 bg-white/3"
                    : "border-white/10 bg-white/2 hover:bg-white/3"
                }`}
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
                  <div className="w-24 h-24 rounded overflow-hidden bg-white/5 relative">
                    {preview ? (
                      <Image
                        src={preview}
                        alt="preview"
                        priority={false}
                        loading="lazy"
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/60 text-xs">
                        Preview
                      </div>
                    )}
                  </div>

                  <div className="text-white text-sm">
                    <div className="font-medium">{file.name}</div>
                    <div className="text-white/60 text-xs mt-2">
                      Tamanho do arquivo: {(file.size / 1024).toFixed(0)} KB
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
                      <SelectTrigger className="text-white w-25">
                        <SelectValue placeholder="Selecionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {outputFormats.map((fmt) => (
                          <SelectItem key={fmt} value={fmt.toLowerCase()}>
                            {fmt.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="mt-5"
                    disabled={loading}
                    onClick={handleConvert}
                  >
                    <WandSparkles />
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Convertendo...
                      </>
                    ) : (
                      "Converter"
                    )}
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
          Github: Diego1012
        </footer>
      </div>
    </div>
  );
}
