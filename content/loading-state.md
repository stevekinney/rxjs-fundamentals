# Loading State

We need some amount of DOM manipulation:

```js
const timeForAPICall = document.getElementById('call-time');
const timeToShowSpinner = document.getElementById('time-to-show-spinner');
const minimumSpinnerTime = document.getElementById('minimum-spinner-time');
```

**TODO**: This code is too abstracted. You're going to need to tie this to a real world example.

```js
fromEvent(start, 'click').pipe(
  // Don't restart at until the first one is complete.
  exhaustMap(() => {
    const fetch$ = fetchData().pipe(share());
    return forkJoin([createTimer(fetch$), fetch$]);
  }),
);

const fetchData$ = () => {
  const apiDuration = +timeForAPICall.value;
  const showAfter = +timeToShowSpinner.value;
  const showFor = +minimumSpinnerTime.value;

  // Could this be a factory function? Maybe.
  // Also: I don't think we need to simulate an API call. We have real APIs.
  const data$ = of(true).pipe(delay(apiDuration), tap(console.log));

  return data$;
};
```

First things first: we need to show a spinner.

```js
fromEvent(start, 'click').pipe(
  // Don't restart at until the first one is complete.
  exhaustMap(() => {
    const fetch$ = fetchData().pipe(share());
    return forkJoin([createTimer(fetch$), fetch$]);
  }),
);

const fetchData$ = () => {
  const apiDuration = +timeForAPICall.value;
  const showAfter = +timeToShowSpinner.value;
  const showFor = +minimumSpinnerTime.value;

  const data$ = of(true).pipe(delay(apiDuration), tap(console.log));

  const showSpinner$ = of(true).pipe(
    delay(showAfter),
    tap((amount) => showSpinnerInUI(amount)),
  );

  return data$;
};
```

Do you need `of(true).pipe(delay(…))` or just use a timer.

```js
const spinner$ = concat(
  showSpinner$,
  data$.pipe(tap(() => toggleSpinner(false))),
);
```

Okay, so here is the thing that nobody talks about when it comes to showing a loading spinner. They're great when something is taking a bit, but they're obnoxious when the API call is super fast. It's like a wild flash of a spinner for a hot minute.

We have to deal with this in Temporal's UI. In production, you might have a ton of real-world data on a remote machine. Okay, this could take a few hundred milliseconds. Great, we'll show a spinner. But, you can also point Temporal at a local development instance running on your machine. In development, you also have a relatively small dataset. So, everything is going to be wicked fast. This means, the spinner could be a flash. This is distracting and doesn't feel great.

Okay, so what do we do? We could race two observables:

- One which is just timing our values around the spinner.
- One where we fetch the data.
- If the timer is hits whatever the lower threshold is for our spinner, then we'll show it.
- But, if the data has already completed, the nevermind.

**Spoiler Alert**: We're going to have a third issue here: What happens if we hit that threshold for the spinner and then our API call completes like _just_ after. This is basically our original problem just pushed down the road. We're going to need to do something similar where we choose to show the loading indicator for just a little bit longer as to not stress out our users.

```js
return race(data$, spinner$);
```

`race` is cool, whichever of the two observables emits first is the one we go with. This is kind of similar to `Promise.race`.

But this takes too long. It takes the combination of the two times. This is because we're racing the fetching of our data with the spinner, which also is basically fetching the data.

So, here is what goes down:

- Fetching the data takes 2 seconds.
- `spinner$` emits its first event after 500ms.
- It wins the race and becomes our winner in the race.
- It then fires off a _new_ data request in order to figure out how long it should show the spinner for.
- The original `data$` observable completes.
- The spinner is still waiting on _its_ `data$` stream.

Okay, so how would we fix this:

- Kick off our `data$` stream to fetch the data.
- Race it with a spinner.
- Instead of having the spinner listen it it's own `data$` stream, have the one making the API request share itself with the once keeping track of the spinner.

```js
const data$ = of(true).pipe(
  delay(apiDuration),
  shareReplay(1),
  tap(console.log),
);
```

## Dealing with Close Calls

Okay, this works but we have the spoiler from before. If the calls come back fairly close, then they could be a flash content.

```js
const delaySpinner$ = timer(showFor).pipe(first());

const spinner$ = concat(
  showSpinner$,
  delaySpinner$,
  data$.pipe(tap(() => toggleSpinner(false))),
);
```

Alright, so what are we doing here. `concat` takes things in sequence. So, show me a spinner. Wait for whatever the minimum amount of time, and _then_ check in on that `data$` that was sharing its value and kicked off when we started the race.
