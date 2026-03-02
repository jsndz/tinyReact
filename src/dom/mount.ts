import type { DOMElement } from "../vdom";

export function mount(v: DOMElement): HTMLElement | Text {
  let dom: HTMLElement | Text;

  if (v.type === "text") {
    dom = document.createTextNode(v.props.text);
  } else {
    dom = document.createElement(v.type);

    for (const key in v.props) {
      if (key.startsWith("on") && typeof v.props[key] === "function") {
        const event = key.slice(2).toLowerCase();
        dom.addEventListener(event, v.props[key]);
      } else {
        (dom as any)[key] = v.props[key];
      }
    }

    for (const child of v.children) {
      dom.appendChild(mount(child));
    }
  }

  v.dom = dom;
  return dom;
}