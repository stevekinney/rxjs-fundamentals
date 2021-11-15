---
title: fromEvent (Exercise)
layout: layouts/lesson.njk
---

`fromEvent` allows you to create observables from event listeners. This might seem a little bit silly at first, but we'll see that this allows for us to do some sophisticated things with events later on.

We can take an event listener that looks like this:

```js
const button = document.querySelector('button');

button.addEventListener('click', (event) => {
  console.log(event);
});
```

And we can use `fromEvent` instead.

```js
const buttonClicks$ = fromEvent(button, 'click');

buttonClicks$.subscribe(console.log);
```

The one thing that you'll notice is that you need to subscribe to the observable in order for the event listener to be registered.

You can even pass it a callback function if you want to format the event.

```js
const inputChanges$ = fromEvent(input, 'input', (event) => {
  event.target.value;
});
```

## Your Mission

In [`applications/from-event`][exercise], we have an incredibly basic example. Can you use `fromEvent` as an alternative to an event listener?

- Use `fromEvent` to create an observable that streams click events.
- Subscribe to that observable.
- Use `addMessageToDOM` to add a useless message to the DOM whenever the stream emits a value.

[exercise]: https://github.com/stevekinney/rxjs-fundamentals/tree/master/applications/from-event
