"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const Score_1 = require("./models/Score");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 🔗 Conexão com o MongoDB
mongoose_1.default
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Conectado ao MongoDB"))
    .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));
app.post("/api/scores", async (req, res) => {
    const { name, score } = req.body;
    if (!name || typeof score !== "number") {
        return res.status(400).json({ error: "Nome e pontuação são obrigatórios" });
    }
    const existing = await Score_1.Score.findOne({ name });
    if (existing) {
        // Atualiza se o novo score for maior
        if (score > existing.score) {
            existing.score = score;
            await existing.save();
        }
    }
    else {
        await Score_1.Score.create({ name, score });
    }
    res.json({ success: true });
});
// 🔹 Rota para buscar ranking (ordenado)
app.get("/api/scores", async (req, res) => {
    try {
        const scores = await Score_1.Score.find().sort({ score: -1 }).limit(10);
        res.json(scores);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
