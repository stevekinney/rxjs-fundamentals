---
title: Subjects
layout: layouts/lesson.njk
---

In the past, we saw that each observer got it's own special and unique subscription to an observable.

Subjects are a little bit different. A subject can broadcast the data to multiple subscribers. (If you've ever played around with EventEmitter in Node, then you might be somewhat familiar with this concept already.)

When an observer subscribes to a subject, the subject adds it to its internal list of subscribers. When something happens, it notifies everthing that it has on its mailing list.

You've got four basic varietals of subjects at your disposal:

- `Subject`: this is basically what we described above.
- `AsyncSubject`: Keeps quiet unit it completes and then it tells everyone subscribed.
- `BehaviorSubject`: Catches new subscribers up with the last value that it emitted.
- `ReplaySubject`: Let's you send a new subscriber the last _n_ values that were emitted. (Basically, this is similar to `BehaviorSubject`, but you're filling in even more of the back story.)

**Potential Task**: Read up on the Observer Pattern from _Design Patterns_ (e.g. the "Gang of Four" book).

> Probably a more important distinction between Subject and Observable is that a Subject has state, it keeps a list of observers. On the other hand, an Observable is really just a function that sets up observation.

—[Ben Lesh](https://benlesh.medium.com/on-the-subject-of-subjects-in-rxjs-2b08b7198b93)

Technically, a subject can act as both an observable as well as an observer. If you want to take one observable and pipe it out to two different observers, you can toss a subject in the middle to ack as your proxy. The subject acts as the first observables one subscriber, but it allows for multiple subscribers and can pump those messages (e.g. emitted values) out to it's buddies.

## Subjects are not reusable

We saw with observables that they'll tell the same story over and over again every time we hand them a new observer.

When a subject is done—it's done. That's it. No more. It's complete. It's said all it has to say.

# Observables and Operators

**Potential Task**: It might be interesting to build a simplified version of an observable or a subject by hand just so that everyone can see how it works. That said, it could also be a little too in the weeds. Inspiration: https://benlesh.com/posts/learning-observable-by-building-observable/

**Potential Task**: Build your own operators by hand. Inspiration: https://benlesh.com/posts/rxjs-operators-in-depth-part-1/
