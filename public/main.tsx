/** @jsx createElement */

import { createElement } from "../src/vdom";
import { mount } from "../src/dom/mount";

function Card() {
  return (
    <div>
      <h1>Hello JSX</h1>
      <p>This is Babel compiled</p>
    </div>
  );
}

const app = document.getElementById("app")!;
app.appendChild(mount(Card()));