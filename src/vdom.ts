/// <reference lib="dom" />

export type DOMElement = {
  type: string;
  props: any;
  children: DOMElement[];
  dom: HTMLElement | Text | null;
};

export function createElement(
  type: string,
  props: any,
  ...children: any[]
): DOMElement {
  return {
    type,
    props: props || {},
    children: children.flat().map(child =>
      typeof child === "object"
        ? child
        : {
            type: "text",
            props: { text: String(child) },
            children: [],
            dom: null
          }
    ),
    dom: null
  };
}
