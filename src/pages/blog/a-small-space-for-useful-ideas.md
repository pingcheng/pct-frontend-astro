---
layout: ../../layouts/BlogPostLayout.astro
title: A small space for useful ideas
description: A sample entry about keeping notes, building small things, and leaving enough room to think.
publishedAt: "2026-10-26"
topic: Notes on building
sample: true
---

Some ideas arrive fully formed. Most begin as a question, a rough sketch, or a few lines of code that almost work. A notebook gives those unfinished thoughts somewhere to live.

This is a **sample article**: a small piece of writing to try out the blog’s reading experience. The topic is deliberately simple, leaving room for the typography, spacing, and details to do their work.

## Start with something small

A useful note does not need to explain an entire system. It might describe a decision, document a surprising behaviour, or capture a question worth returning to.

The aim is to make the next step a little easier. **Clarity** helps more than polish at this stage; _curiosity_ keeps the note open to revision.

> A good note leaves you with a clearer question, even when it does not yet contain the answer.

### Leave a little context

A few details make a note easier to revisit:

- What were you trying to understand?
- What did you observe, and what surprised you?
- Which trade-offs shaped the decision?
- What would be useful to try next?

These questions work for a small personal tool just as well as a larger software project. They also give the writing a practical centre.

## Show the working

Sometimes an example is the shortest route to understanding. A small function can make an idea more concrete than another paragraph of explanation.

```typescript
const notes = [
    { title: "Make it clear", useful: true },
    { title: "Keep it small", useful: true },
];

const nextReadingList = notes
    .filter((note) => note.useful)
    .map((note) => note.title);

console.log(nextReadingList);
```

Inline code such as `note.title` stays close to the sentence it belongs to. Longer examples get a little more room, with horizontal scrolling when a line needs it.

### A rhythm for revisiting ideas

1. Write down the observation while it is fresh.
2. Add just enough context for someone else to follow it.
3. Try the smallest useful example.
4. Return later and keep what still makes sense.

There is no perfect cadence. The useful part is making space to notice what changed between one attempt and the next.

## Choose the useful details

Different forms suit different kinds of notes. A short comparison can help make the choice explicit.

| Form             | A good starting point                    |
| ---------------- | ---------------------------------------- |
| A short note     | One observation or a question to explore |
| A worked example | A concrete idea explained through code   |
| A longer essay   | Several connected ideas that need room   |

For a site built with Markdown, [Astro’s Markdown guide](https://docs.astro.build/en/guides/markdown-content/) is a useful reference. The [portfolio](/portfolio) offers a different way to explore finished work, while the [about page](/about) provides the context around it.

---

A small space, a few useful ideas, and enough room to add the next one. That is a good place to begin.
