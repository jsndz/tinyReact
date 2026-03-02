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
  console.log("dom for", v.type, "is", dom);
  v.dom = dom;
  return dom;
}

// src/dom/diff.ts
function diff(prevdom, currDOM, app) {
  console.log("diffing", prevdom.type, "→", currDOM.type);
  compare(prevdom, currDOM, app);
}
function compare(oldNode, newNode, parentDom) {
  if (!oldNode && newNode) {
    parentDom.appendChild(mount(newNode));
  }
  if (!newNode && oldNode) {
    parentDom.removeChild(mount(oldNode));
  }
  if (newNode.type !== oldNode.type) {
    parentDom.replaceChild(mount(oldNode), mount(newNode));
  }
  newNode.dom = oldNode.dom;
  if (newNode.type === "text") {
    console.log(newNode, oldNode);
    if (oldNode.props.text !== newNode.props.text) {
      oldNode.dom.nodeValue = newNode.props.text;
    }
    return;
  }
  const max = Math.max(oldNode.children.length, newNode.children.length);
  for (let i = 0;i < max; i++) {
    console.log("helloi");
    compare(oldNode.children[i] || null, newNode.children[i] || null, oldNode.dom);
  }
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
    diff(prevVDOM, nextVDOM, app);
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
  toggle = !toggle;
  render(app, App);
});
var toggle = false;
function App() {
  return /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("h1", null, toggle ? "Hello JSX" : "Hello World"), /* @__PURE__ */ createElement("p", null, "This is Babel compiled"), /* @__PURE__ */ createElement(FirstCard, null), /* @__PURE__ */ createElement(SecondCard, null));
}
function FirstCard() {
  return /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("h1", null, "First Card"), /* @__PURE__ */ createElement("p", null, "This is the first card"));
}
function SecondCard() {
  return /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("h1", null, "Second Card"), /* @__PURE__ */ createElement("p", null, "This is the second card"));
}
