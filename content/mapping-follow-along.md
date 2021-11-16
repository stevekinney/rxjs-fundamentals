---
title: Adventures in Mapping (Follow Along)
layout: layouts/lesson.njk
---

Whether it's with arrays or observables, mapping values is a common endeavor. So far in this workshop, we've mapped values into other values, but things can get a little tricky when we want to map values into other observables.

We end up with nested observables.

We know that we can turn a promise into an observable pretty easily.

```js
const character$ = from(getCharacter(1)).pipe(pluck('name'));

character$.subscribe(render);
```

But, what if we wanted to get multiple characters?

```js
const characters$ = of(1, 2, 3, 4).pipe(map((id) => getCharacter(id)));

characters$.subscribe(render);
```

Well, that gives me back an array of promises, which I guess I could turn into observables or something?

```js
const characters$ = of(1, 2, 3, 4).pipe(
  map((id) => getCharacter(id)),
  map((promise) => from(promise)),
);

characters$.subscribe(render);
```

Ugh. Now I have an observable full of observables. If only I had a way to get them into one stream. Do we know of any way to do that?

Conceptually `merge` is the right choice. But we need it as an operator and not as a creator.

## mergeAll

What we want to do is take all of the observables in my stream and merge them back into the main timeline.

```js
const characters$ = of(1, 2, 3, 4).pipe(
  map((id) => getCharacter(id)),
  map((promise) => from(promise)),
  mergeAll(),
  pluck('name'),
);
```

## mergeMap

This is a common enough thing that we actually have a operator that combines mapping and merging into one operator.

It's called `mergeMap`.

```js
const characters$ = of(1, 2, 3, 4).pipe(
  map((id) => getCharacter(id)),
  mergeMap((promise) => from(promise)),
);

characters$.subscribe(render);
```

We could even make this a little shorter by wrapping those promises with `from` in one single operation.

```js
const characters$ = of(1, 2, 3, 4).pipe(
  mergeMap((id) => from(getCharacter(id))),
);

characters$.subscribe(render);
```

We can now go about our business as we did before.

```js
const characters$ = of(1, 2, 3, 4).pipe(
  mergeMap((id) => from(getCharacter(id))),
  pluck('name'),
);
```

## Returning Observables

Let's just play around with this just a little more.

This doesn't work.

```js
const example$ = of('John', 'Paul', 'George', 'Ringo').pipe(
  map((value, index) => interval(index * 1000).pipe(take(4))),
);

example$.subscribe(render);
```

But this does.

```js
const example$ = of(1, 2, 3, 4).pipe(
  mergeMap((value, index) => interval(index * 1000).pipe(take(4))),
);

example$.subscribe(render);
```

We can even get a little crazier with the mapping.

```js
const example$ = of('John', 'Paul', 'George', 'Ringo').pipe(
  mergeMap((beatle, index) =>
    interval(index * 1000).pipe(
      take(4),
      map((i) => `${beatle} ${i}`),
    ),
  ),
);

example$.subscribe(render);
```

## concatMap

This works, just like `concat`. It plays through each one in the order that it was received.

```js
const example$ = of('John', 'Paul', 'George', 'Ringo').pipe(
  concatMap((beatle, index) =>
    interval(index * 1000).pipe(
      take(4),
      map((i) => `${beatle} ${i}`),
    ),
  ),
);

example$.subscribe(render);
```

## switchMap

Anytime a new observable comes through the map, `switchMap` unsubscribes from the previous observable and switches to the new one.

```js
const example$ = of('John', 'Paul', 'George', 'Ringo').pipe(
  switchMap((beatle, index) =>
    interval(index * 1000).pipe(
      take(4),
      map((i) => `${beatle} ${i}`),
    ),
  ),
);

example$.subscribe(render);
```

Since the John, Paul, George, and Ringo are shooting through the pipe synchronously, `switchMap` quickly switches between them and ends up only subscribing to Ringo.

## exhaustMap

This is pretty much the opposite. `exhaustMap` grabs onto to the first one and ignores everything else until it is done doing what it's doing.

```js
const example$ = of('John', 'Paul', 'George', 'Ringo').pipe(
  exhaustMap((beatle, index) =>
    interval(index * 1000).pipe(
      take(4),
      map((i) => `${beatle} ${i}`),
    ),
  ),
);

example$.subscribe(render);
```

### combineLatestAll

`combineLatestAll` is a bit like `scan`. It will give you an array of the latest value emitted by each of the child observables. The only caveat is that each of them must have emitted once first.

```js
const example$ = of('John', 'Paul', 'George', 'Ringo').pipe(
  map((beatle, index) =>
    interval(index * 1000).pipe(
      take(4),
      map((i) => `${beatle} ${i}`),
    ),
  ),
  combineLatestAll(),
);
```

You'll notice that we don't hear anything until Ringo, the last to emit, emits a value.

If needed, we can kick things off with `startWith`.

```js
const example$ = of('John', 'Paul', 'George', 'Ringo').pipe(
  map((beatle, index) =>
    interval(index * 1000).pipe(
      startWith('(Not Started)'),
      take(5),
      map((i) => `${beatle} ${i}`),
    ),
  ),
  combineLatestAll(),
);

example$.subscribe(render);
```

**Bonus**: We also have `endWith` that we could use.

```js
const example$ = of('John', 'Paul', 'George', 'Ringo').pipe(
  map((beatle, index) =>
    interval(index * 1000).pipe(
      startWith('(Not Started)'),
      take(6),
      endWith('(Done)'),
      map((i) => `${beatle} ${i}`),
    ),
  ),
  combineLatestAll(),
);

example$.subscribe(render);
```

## Conclusion

Okay, that's all kind of silly. Let's review some of the operators and then we'll build some more practical things.
