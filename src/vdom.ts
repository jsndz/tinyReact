/// <reference lib="dom" />

import {  TOKEN_TYPES, type TypeToken } from "./tokenizer/tokenizer";

export type DOMElement = {
  type: string | Text;
  props: any;
  children: DOMElement[];
  dom: HTMLElement | Text | null;
};

function createElement(type: string): DOMElement {
  return {
    type,
    props: {},
    children: [],
    dom: null
  };
}

export function createTextNode(text: string) {
  return {
    type: "text",
    props: { text },
    children: [],
    dom: null
  };
}



export function tokensToVDOM(tokens: TypeToken[]): DOMElement {
  const root: DOMElement = createElement("ROOT");
  const stack: DOMElement[] = [root];

  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token?.type === TOKEN_TYPES.JSX_TAG_OPENER_START) {
      const tagNameToken = tokens[++i];
      const el = createElement(tagNameToken!.value);

      i++;
      while (
        tokens[i] &&
        tokens[i]?.type !== TOKEN_TYPES.JSX_TAG_OPENER_END &&
        tokens[i]?.type !== TOKEN_TYPES.JSX_TAG_OPENER_END_CHILDLESS
      ) {
        const attr = tokens[i];

        if (attr?.type === TOKEN_TYPES.IDENTIFIER) {
          const key = attr.value;
          const next = tokens[i + 1];

          if (next?.type === TOKEN_TYPES.STRING) {
            el.props[key] = next.value;
            i += 2;
            continue;
          }

          if (next?.type === TOKEN_TYPES.JSX_EXPRESSION_START) {
            let expr = "";
            i += 2;

            while (tokens[i]?.type !== TOKEN_TYPES.JSX_EXPRESSION_END) {
              expr += tokens[i]?.value;
              i++;
            }

            el.props[key] = expr;
            i++;
            continue;
          }

          el.props[key] = true;
          // setting default value true for key
        }

        i++;
      }

      stack[stack.length - 1]?.children.push(el);

      if (tokens[i]?.type === TOKEN_TYPES.JSX_TAG_OPENER_END_CHILDLESS) {
        i++;
        continue;
      }


      stack.push(el);
      i++;
      continue;
    }


    if (token?.type === TOKEN_TYPES.JSX_TAG_CLOSER_START) {
      stack.pop();
      i += 2; 
      continue;
    }


    if (token?.type === TOKEN_TYPES.JSX_TEXT) {
      stack[stack.length - 1]?.children.push(
        createTextNode(token.value as string)
      );
      i++;
      continue;
    }

    i++;
  }

  return root;
}

// using stack for putting tag into stack so that we can add chidren to its parent 


