import type { DOMElement } from "../vdom";
import { diff } from "./diff";
import { mount } from "./mount";

let isFirstRender = true;
let prevVDOM: DOMElement | null = null;

export function render(app: HTMLElement, vdom: () => DOMElement) {
  const nextVDOM = vdom();
  if (isFirstRender) {
    app.appendChild(mount(nextVDOM));
    isFirstRender = false;
  } else {
    diff(prevVDOM!, nextVDOM!, app);
  }
  prevVDOM = nextVDOM;
}

// function for re-rendering the whole dom
// export function render(app:HTMLElement,vdom:()=>DOMElement){
//   app.appendChild(mount(vdom()))
// }
