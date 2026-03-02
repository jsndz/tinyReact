// src/vdom.ts
function createElement(type, props, ...children) {
  return {
    type,
    props: props || {},
    children: children.flat().map((child) => typeof child === "object" ? child : {
      type: "text",
      props: { text: String(child) },
      children: [],
      dom: null
    }),
    dom: null
  };
}

// src/dom/mount.ts
function mount(v) {
  let dom;
  if (v.type === "text") {
    dom = document.createTextNode(v.props.text);
  } else {
    dom = document.createElement(v.type);
    for (const key in v.props) {
      if (key.startsWith("on") && typeof v.props[key] === "function") {
        const event = key.slice(2).toLowerCase();
        dom.addEventListener(event, v.props[key]);
      } else {
        dom[key] = v.props[key];
      }
    }
    for (const child of v.children) {
      dom.appendChild(mount(child));
    }
  }
  v.dom = dom;
  return dom;
}

// public/main.tsx
function Card() {
  return /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("h1", null, "Hello JSX"), /* @__PURE__ */ createElement("p", null, "This is Babel compiled"));
}
var app = document.getElementById("app");
app.appendChild(mount(Card()));
