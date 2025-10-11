import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Score } from "./models/Score";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// 🔗 Conexão com o MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

app.post("/api/scores", async (req, res) => {
  const { name, score } = req.body;

  if (!name || typeof score !== "number") {
    return res.status(400).json({ error: "Nome e pontuação são obrigatórios" });
  }

  const existing = await Score.findOne({ name });

  if (existing) {
    // Atualiza se o novo score for maior
    if (score > existing.score) {
      existing.score = score;
      await existing.save();
    }
  } else {
    await Score.create({ name, score });
  }

  res.json({ success: true });
});

// 🔹 Rota para buscar ranking (ordenado)
app.get("/api/scores", async (req: Request, res: Response): Promise<void> => {
  try {
    const scores = await Score.find().sort({ score: -1 }).limit(10);
    res.json(scores);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
