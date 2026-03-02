/** @jsx createElement */

import { createElement } from "../src/vdom";
import { render } from "../src/dom/render";
const app = document.getElementById("app")!;

const renderButton = document.getElementById("render-button")!;
renderButton.addEventListener("click", () => {
  render(app, App);
});

const rerenderButton = document.getElementById("re-render-button")!;
rerenderButton.addEventListener("click", () => {
  toggle = !toggle;
  render(app, App);
});
let toggle = false;

function App() {
  return (
    <div>
      <h1>{toggle ? "Hello JSX" : "Hello World"}</h1>
      <p>This is Babel compiled</p>
      <FirstCard/>
      <SecondCard/>
    </div>
  );
}
function FirstCard(){
  return (
    <div>
      <h1>First Card</h1>
      <p>This is the first card</p>
    </div>
  )
}

function SecondCard(){
  return (
    <div>
      <h1>Second Card</h1>
      <p>This is the second card</p>
    </div>
  )
}


