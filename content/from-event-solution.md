---
title: fromEvent (Solution)
layout: layouts/lesson.njk
---

This one is pretty simple and it's not _that_ much different than just using an event listener. But, we're building to something bigger. I promise.

```js
const buttonClicks$ = fromEvent(button, 'click');

buttonClicks$.subscribe(() => {
  addMessageToDOM();
});
```

You can even shorted it as follows:

```js
const buttonClicks$ = fromEvent(button, 'click');

buttonClicks$.subscribe(addMessageToDOM);
```
