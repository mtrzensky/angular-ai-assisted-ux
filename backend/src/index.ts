import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});