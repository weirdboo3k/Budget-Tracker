const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

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

// PUT update
app.put("/transactions/:id", (req, res) => {
  const index = transactions.findIndex(t => t.id == req.params.id);
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...req.body };
    res.json(transactions[index]);
  } else {
    res.status(404).json({ error: "Transaction not found" });
  }
});

// DELETE by id
app.delete("/transactions/:id", (req, res) => {
  transactions = transactions.filter(t => t.id != req.params.id);
  res.json({ success: true });
});

// --------------------------
// Serve frontend
// --------------------------
app.use(express.static(path.join(__dirname, "../")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// --------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
