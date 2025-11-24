import { Router } from "express";
import multer from "multer"; // Lib pra upload de arquivos
import { ConvertController } from "../controllers/ConvertController";

const upload = multer({ dest: "uploads/" });
const controller = new ConvertController();

/*
Retorno esperado:
req.file = {
  filename: "...",
  path: "uploads/meuarquivo.jpg",
  mimetype: "image/jpeg",
  size: 12345
}
*/

const router = Router();

router.post("/convert", upload.single("file"), (req, res) =>
  controller.convert(req, res)
);

export default router;
