import type { DOMElement } from "../vdom";

export function diff(prevdom:DOMElement,currDOM:DOMElement,app:HTMLElement) {
    console.log("diffing", prevdom.type, "→", currDOM.type);
}