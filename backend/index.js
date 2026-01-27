const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let transactions = [];

// ADD: them giao dich
app.post("/transactions", (req, res) => {
  const tx = {
    id: Date.now(),
    ...req.body,
  };
  transactions.push(tx);
  res.json(tx);
});



app.listen(3001, () => {
  console.log("API running at http://localhost:3001");
});
