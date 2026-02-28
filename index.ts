import express from "express";
import path from "path";
import { jsx2tokens } from "./src/tokenizer/tokenizer.ts";
import { tokensToVDOM } from "./src/vdom.ts";
import { renderToString } from "./src/dom/mount.ts";


const app = express();

app.use(express.static(path.join(import.meta.dirname, "public")));
app.use(express.json());


app.post("/api/render",async (req, res) => {
  const { code } = req.body;
  console.log(code);
  const tokens = await  jsx2tokens(code);
  console.log(tokens);
  
  const vdom = tokensToVDOM(tokens);
  console.log(vdom);
  const html = renderToString(vdom);
  res.json({
     html,
    message: "Code received",
    length: code.length,
   
  });
});

app.listen(3000, () => {
  console.log("server started in 3000");
});
