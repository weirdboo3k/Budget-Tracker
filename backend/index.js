const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let transactions = [];

app.get("/transactions", (req, res) => {
  res.json(transactions);
});

app.post("/transactions", (req, res) => {
  const tx = {
    id: Date.now(),
    ...req.body,
  };
  transactions.push(tx);
  res.json(tx);
});

app.delete("/transactions/:id", (req, res) => {
  transactions = transactions.filter(t => t.id != req.params.id);
  res.json({ success: true });
});

app.listen(3001, () => {
  console.log("API running at http://localhost:3001");
});
