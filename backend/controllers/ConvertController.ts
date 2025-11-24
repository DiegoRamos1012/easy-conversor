import { Request, Response } from "express";
import { ConvertService } from "../services/ConvertService";

export class ConvertController {
  private service: ConvertService;

  // Todas as requisições irão usar apenas este service por instância, economizando memória
  constructor() {
    this.service = new ConvertService();
  }

  async convert(req: Request, res: Response) {
    try {
      const { type } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }

      if (!type) {
        return res
          .status(400)
          .json({ error: "Tipo de conversão não informado" });
      }

      const result = await this.service.convertFile(req.file, type);

      return res.status(200).json({
        message: "Conversão bem sucedida",
        output: result.path,
        // Retorno esperado: "message": "...", "output": "temp/abc.png"
      });
    } catch (error: any) {
      return res.status(400).json({
        error: error.message || "Erro inesperado ao converter o arquivo",
      });
    }
  }
}
