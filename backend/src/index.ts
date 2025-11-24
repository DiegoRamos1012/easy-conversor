import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger";
import ConvertRoutes from "../routes/ConvertRoutes";
import { startCleanupJob } from "../jobs/jobClearTemp";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const API_PREFIX = "/api";

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Rota teste para verificar funcionamento do servidor",
  });
});

app.use("/", ConvertRoutes);

app.use(
  `${API_PREFIX}/api-docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

startCleanupJob();

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
