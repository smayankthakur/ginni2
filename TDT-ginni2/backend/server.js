const express = require("express");
const cors = require("cors");
const path = require("path");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;
const ROOT_DIR = path.join(__dirname, "..");

app.use(cors());
app.use(express.json());

app.use("/ginni-kb", express.static(path.join(ROOT_DIR, "ginni-kb"), {
  setHeaders: (res, filePath) => {
    if (path.extname(filePath) === ".json") {
      res.setHeader("Content-Type", "application/json");
    }
  }
}));

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Tarot Reading API",
    version: "1.0.0",
    endpoints: {
      questions: "GET /api/questions",
      deck: "GET /api/deck",
      topics: "GET /api/topics",
      cardInterpretation: "GET /api/card/:name/:topic",
      reading: "POST /api/reading { questionNumber }"
    }
  });
});

app.listen(PORT, () => {
  console.log(`Tarot backend server running on http://localhost:${PORT}`);
});
