import type { DOMElement } from "../vdom";

export function mount(v:DOMElement) {
    if(v.type === "text") {
        return document.createTextNode(v.props.text);
    } else {
        const el = document.createElement(v.type as string);
        for(let prop in v.props) {
            if(prop === "children") {
                v.props[prop].forEach((child:DOMElement) => {
                    el.appendChild(mount(child));
                });
            } else {
                (el as any)[prop] = v.props[prop];
            }
        }
        for(let child of v.children) {    
            el.appendChild(mount(child));
        }
        return el;
    }
    
}




export function renderToString(v: DOMElement): string {
  if (v.type === "text") {
    return v.props.text;
  }

  const props = Object.entries(v.props || {})
    .filter(([key]) => key !== "children")
    .map(([key, value]) => ` ${key}="${value}"`)
    .join("");

  const children = v.children.map(renderToString).join("");

  return `<${v.type}${props}>${children}</${v.type}>`;
}