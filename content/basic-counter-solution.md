---
title: Basic Counter (Solution)
layout: layouts/lesson.njk
---

Here is one possible solution.

```js
startButtonClicks$.subscribe(() => {
  interval(1000).subscribe(setCount);
});
```

This works, but it has a lot of problems. Mostly, there isn't really a great way to stop it once it gets started.

Could we do some hack like store a variable outside of the scope of the subscription and then unsubscribe from it when another button was hit? We _could_, but that kind of defeats the purpose. There is a better way to do this, but we just need to learn a little bit more first.

**Disclaimer**: You should not do this something like the code below.

```js
let interval$;

startButtonClicks$.subscribe(() => {
  interval$ = interval(1000).subscribe(setCount);
});

stopButtonClicks$.subscribe(() => {
  interval$.unsubscribe();
});
```

It will work, but it's _not_ idiomatic. Let's table this and come back to it a little later.

The answer is that we need some more tools. We need the ability to work with and manipulate observable streams. (For those of you that cannot live with not knowing how this story ends, you might want to take a look at [`switchMap`](/lessons/switch-map).)
