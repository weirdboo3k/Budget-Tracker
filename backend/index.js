const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// Lưu transactions trong bộ nhớ
let transactions = [];

// --------------------------
// API
// --------------------------

// GET all
app.get("/transactions", (req, res) => {
  res.json(transactions);
});

// POST add
app.post("/transactions", (req, res) => {
  const tx = {
    id: Date.now(),
    ...req.body,
  };
  transactions.push(tx);
  res.json(tx);
});

// DELETE by id
app.delete("/transactions/:id", (req, res) => {
  transactions = transactions.filter(t => t.id != req.params.id);
  res.json({ success: true });
});

// --------------------------
// Serve frontend
// --------------------------
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// --------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
