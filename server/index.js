import express from "express";
const port = 8000;

const app = express();

app.listen(port, () => {
  console.log("server running")
})
