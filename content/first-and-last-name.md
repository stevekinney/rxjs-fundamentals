---
title: First and Last Name (Exercise)
layout: layouts/lesson.njk
---

Functions and operators used:

- `merge`
- `startWith`
- `map`
- `combineLatestAll`

---

Let's start with something simple here.

```js
fromEvent(firstNameInput, 'input').subscribe(console.log);
fromEvent(lastNameInput, 'input').subscribe(console.log);
```

This works, but its not very DRY and it actually doesn't really work nearly as well as we'd like.

Let's merge the streams into one.

```js
import { fromEvent, merge } from 'rxjs';

const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');

const firstName$ = fromEvent(firstName, 'keyup');
const lastName$ = fromEvent(lastName, 'keyup');

merge(firstName$, lastName$).subscribe(console.log);
```

Alright, now we don't need the `KeyboardEvent`, we need the actual value of that input.

```js
import { combineLatest, fromEvent, map, merge, startWith } from 'rxjs';

const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');

const firstName$ = fromEvent(firstName, 'keyup', (e) => e.target.value).pipe(
  startWith(''),
);

const lastName$ = fromEvent(lastName, 'keyup', (e) => e.target.value).pipe(
  startWith(''),
);

combineLatest(firstName$, lastName$)
  .pipe(map(([first, last]) => `${first} ${last}`))
  .subscribe(console.log);
```

```js
import { combineLatest, fromEvent, map, startWith } from 'rxjs';

const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');

const firstName$ = fromEvent(firstName, 'keyup', (e) => e.target.value).pipe(
  startWith(firstName.value),
);

const lastName$ = fromEvent(lastName, 'keyup', (e) => e.target.value).pipe(
  startWith(lastName.value),
);

combineLatest(firstName$, lastName$)
  .pipe(map(([first, last]) => `${first} ${last}`))
  .subscribe(console.log);
```
