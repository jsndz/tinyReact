
import { jsx2tokens } from "../src/tokenizer/tokenizer";
import { tokensToVDOM } from "../src/vdom";
import { mount } from "../src/dom/mount";



// const input = document.getElementById("input");
// const renderButton = document.getElementById("render-button");
// const output = document.getElementById("output") ;



// renderButton.addEventListener("click", async () => {
//   const code = input.value;


//   const response = await fetch("http://localhost:3000/api/render", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ code }),
//   });

//   const data = await response.json();
//   console.log("API response:", data);
//   output.innerHTML = data.html;
// });



// Example JSX string (for now)
const jsx = `
<div className="card">
  <h1>Hello from browser</h1>
  <p>This is client-side rendered</p>
</div>
`;

// Build UI in the browser
const tokens = jsx2tokens(jsx);
const vdom = tokensToVDOM(tokens);

// Mount into real DOM
const container = document.getElementById("app");
container?.appendChild(mount(vdom));