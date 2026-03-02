import type { DOMElement } from "../vdom";
import { mount } from "./mount";

export function diff(
  prevdom: DOMElement,
  currDOM: DOMElement,
  app: HTMLElement,
) {
  console.log("diffing", prevdom.type, "→", currDOM.type);
  compare(prevdom, currDOM, app);
}

function compare(
  oldNode: DOMElement|null,
  newNode: DOMElement|null,
  parentDom: HTMLElement,
) {
  if (!oldNode && newNode) {
    parentDom.appendChild(mount(newNode));
  }
  if (!newNode && oldNode) {
    parentDom.removeChild(mount(oldNode));
  }
  if (newNode!.type !== oldNode!.type) {
    parentDom.replaceChild(mount(oldNode!), mount(newNode!));
  }
    newNode!.dom = oldNode!.dom;
  if (newNode!.type === "text") {
    console.log(newNode,oldNode);
    
    if (oldNode!.props.text !== newNode!.props.text) {
      (oldNode!.dom as Text).nodeValue = newNode!.props.text;
    }
    return;
  }

  const max = Math.max( 
    oldNode!.children.length,
    newNode!.children.length
  );

  for (let i = 0; i < max; i++) {
    console.log("helloi");
    
    compare(
      oldNode!.children[i]! || null,
      newNode!.children[i]! ||null,
      oldNode!.dom as HTMLElement,
    );
  }
}
