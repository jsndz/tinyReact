# Tiny UI Renderer (React Concepts, Simplified)

Uses babel for tokenizing the JSX and calls createElement on the various tags and keywords.
You can change the behaviour of createElement to whatever you like.

Babel replaces JSX with calls to a function named createElement.
You told Babel which createElement to use.
/\*_ @jsx createElement _/
This comment tells Babel to use your createElement
You need to import the

```tsx
import { createElement } from "../src/vdom";
```
