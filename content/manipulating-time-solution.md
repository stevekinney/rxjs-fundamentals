---
title: Markdown Renderer (Solution)
layout: layouts/lesson.njk
---

Our first pass might look something like this:

```js
const textAreaChanges$ = fromEvent(deepThoughtInput, 'input').pipe(
  map((event) => event.target.value),
  debounceTime(333),
);

textAreaChanges$.subscribe(setTextArea);
```

We might use `tap` to create side effects that reflect the current state of our observable.

```js
const textAreaChanges$ = fromEvent(deepThoughtInput, 'input').pipe(
  map((event) => event.target.value),
  tap(() => setStatus('Rendering…')),
  debounceTime(2000),
  tap(renderMarkdown),
  tap(() => setStatus('')),
);

textAreaChanges$.subscribe();
```

In this case, `subscribe()` is just setting up our observable, but everything else is happing as part of the stream. I'm not going to tell you that there is a right or wrong way to do this. It depends on what you're trying to do with a healthy dose of personal preference.
