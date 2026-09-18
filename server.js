const express = require("express");
const path = require("path");
const messageRoutes = require("./src/messageRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json({ limit: "32kb" }));
app.use("/api/messages", messageRoutes);
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
