---
title: Basic Async
layout: layouts/lesson.njk
---

Earlier, we saw that `fromFetch` will create an observable from the Fetch API. Knowing what we now know about promises. Can you head over to the [playground](/applications/playground) and implement an observable that hits our Pokémon API?

Here is what you need to know:

- The API should be running on `http://localhost:3333/api/pokemon`.
- Remember: You need to call the observable `example` and export it using `export const` for it to work.

**Nota bene**: If you're struggling to get your local server up and running, the API is also hosted at <a href="https://rxjs-api.glitch.me/api/pokemon">https://rxjs-api.glitch.me/api/pokemon</a>.
