import express from "express";
import path from "path";

const app = express();

app.use(express.static(path.join(import.meta.dirname, "public")));
app.use(express.json());

app.listen(3000, () => {
  console.log("server started in 3000");
});
