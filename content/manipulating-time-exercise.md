---
title: Markdown Renderer (Exercise)
layout: layouts/lesson.njk
---

Most applications that have some kind of autosave functionality don't automatically save your work on every keystroke. Instead, they will save at regular intervals.

At the same time, there is no point saving if nothing have changed. We don't have a server, but we could use the same ideas to build a simple markdown renderer that only renders Markdown to the page when the user has stopped typing for a bit.

Can you implement the following in `applications/manipulating-time`:

- Listen for `input` events on the `textarea`.
- Map the event object to the value of the `textarea`.
- When our author has stopped typing for a bit go ahead and render the resulting Markdown using the `renderMarkdown` helper.
