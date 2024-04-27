import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from my Node.js server! 42 32");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Hello World ");

  console.log(`Server listening on port ${port}`);
});
