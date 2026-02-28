
# Tiny UI Renderer (React Concepts, Simplified)

## Purpose

This project is a **learning exercise** to understand how React works internally, without rebuilding React itself.

By building this, you will understand:

* How JSX becomes UI
* How state triggers re-renders
* How hooks work internally
* How virtual DOM diffing updates only what changed
* Why render and DOM updates are separate steps

This project supports **one component only**.

---

## What This Project Is

A small UI engine that:

* Runs a single component function
* Supports `useState` and `useEffect`
* Converts JSX into a virtual DOM
* Updates the real DOM using a simple diff algorithm

---

## Step 1: Define the Virtual DOM Format

Create a simple JavaScript object structure to represent UI.

Rules:

* `type` is a string (for DOM elements) or `"text"`
* `props` is an object
* `children` is always an array
* Each virtual node stores a reference to its real DOM node

Example:

```js
{
  type: "button",
  props: {
    onclick: fn,
    children: ["Count: ", { type: "text", value: 0 }]
  },
  dom: null
}
```

This structure represents the UI as data.

---

## Step 2: Implement `createElement`

Create a function that turns JSX (or manual calls) into virtual DOM objects.

Responsibilities:

* Normalize children into an array
* Convert text into text nodes
* Attach props and children

This removes the idea that JSX is special.

---

## Step 3: Implement Initial Mounting

Write a `mount(vNode)` function.

What it should do:

* Create a real DOM node
* Set attributes and event listeners
* Recursively mount children
* Store the DOM reference on the virtual node

This is the initial render.

---

## Step 4: Implement the Render Loop

Create a `render()` function.

Responsibilities:

* Reset the hook index
* Run the component function
* Get a new virtual DOM tree
* If this is the first render, mount everything
* Otherwise, diff with the previous tree

This function represents React’s render cycle.

---

## Step 5: Implement a Minimal Diff Algorithm

Write a `diff(oldNode, newNode, parentDom)` function.

Handle only these cases:

1. Old node does not exist → mount new node
2. New node does not exist → remove old node
3. Node type changed → replace node
4. Text value changed → update text
5. Same type → update props and diff children

Do not support keys or reordering.

This step teaches why React keeps previous renders.

---

## Step 6: Implement Props Updates

Create a function to update DOM properties.

Responsibilities:

* Add new props
* Update changed props
* Remove old props
* Handle events by removing old listeners and adding new ones

Keep this minimal.

---

## Step 7: Implement Children Diffing

Diff children by index only.

Rules:

* Compare old and new children in order
* Recursively call `diff`
* Ignore list reordering

This is enough to understand reconciliation.

---

## Step 8: Implement `useState`

Create a simple hook system.

Requirements:

* Maintain a `hooks` array
* Maintain a `hookIndex`
* Reset `hookIndex` before every render

Behavior:

* `useState(initialValue)` reads or initializes state
* `setState` updates the value and triggers a re-render

This explains why hooks rely on call order.

---

## Step 9: Implement `useEffect`

Add basic effect support.

Behavior:

* Collect effects during render
* Run effects after DOM updates
* Run cleanup before re-running an effect or unmounting

Dependency handling can be shallow comparison.

This explains why effects run after render.

---

## Step 10: Trigger Re-render on State Updates

When `setState` is called:

* Re-run the render function
* Build a new virtual DOM tree
* Diff against the previous tree
* Apply only required DOM changes
* Run effects

This is the full update cycle.

---

## Step 11: Build a Demo Component

Create one component that demonstrates:

* State updates
* Conditional rendering
* Event handling
* Effects with cleanup

Example:

* Counter
* Toggle button
* Input field with state

---

## Step 12: Write the Learning Summary

Document:

* What you built
* What React does differently
* Why React needs more complexity
* What concepts now feel obvious

If you can explain this clearly, you understand React.

---
