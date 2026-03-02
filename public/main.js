// src/vdom.ts
function createElement(type, props, ...children) {
  if (typeof type === "function") {
    return type(props || {});
  }
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

// src/dom/diff.ts
function diff(prevdom, currDOM, app) {
  console.log("diffing", prevdom.type, "→", currDOM.type);
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

// src/dom/render.ts
var isFirstRender = true;
var prevVDOM = null;
function render(app, vdom) {
  const nextVDOM = vdom();
  if (isFirstRender) {
    app.appendChild(mount(nextVDOM));
    isFirstRender = false;
  } else {
    diff(nextVDOM, prevVDOM, app);
  }
  prevVDOM = nextVDOM;
}

// public/main.tsx
var app = document.getElementById("app");
var renderButton = document.getElementById("render-button");
renderButton.addEventListener("click", () => {
  render(app, App);
});
var rerenderButton = document.getElementById("re-render-button");
rerenderButton.addEventListener("click", () => {
  render(app, App);
});
function App() {
  return /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("h1", null, "Hello JSX"), /* @__PURE__ */ createElement("p", null, "This is Babel compiled"), /* @__PURE__ */ createElement(FirstCard, null), /* @__PURE__ */ createElement(SecondCard, null));
}
function FirstCard() {
  return /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("h1", null, "First Card"), /* @__PURE__ */ createElement("p", null, "This is the first card"));
}
function SecondCard() {
  return /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("h1", null, "Second Card"), /* @__PURE__ */ createElement("p", null, "This is the second card"));
}
