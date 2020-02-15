---
title: Cypress Is Not Quite TypeScript Native
date: '2020-02-14T19:21:59.819Z'
description: 'Despite what their docs say, TS devs still need to hack around quite a bit to get the TypeScript support we deserve in Cypress'
featuredImage: '../smart-techniques-dumb-css/frinkiac-first-frame.png'
featuredGif: '../smart-techniques-dumb-css/frinkiac.gif'
featuredGifAspectRatio: '4:3'
---

### Intro

- just finished building out a Cypress architecture...

### Problems

- types clash with Mocha types if you're trying to run Cypress in code
- typing custom commands is a pain b/c you can't easily import existing types in a declaration file
- these are small compared to some more fundamental issues, like what happens with tasks

  - Cypress simply does not support TypeScript for tasks, which means if you want to pull in parts of your TS application to use in your custom tasks, you're stuck with two bad options to choose from.
  - you can have a step that transpiles your TS into JS and pulls it into your plugins file before Cypress runs, which is pure pain. With example
  - you can use ts-node.register, which will transpile on the fly any TS file loaded after it's called. You might need a separate tsconfig file to pass into ts-node.register, which also sucks a lot

- with either of these cases, you're also pretty much out of luck when it comes to type support when you're trying to work with values returned by your tasks within Cypress test files. Even if you've typed your underlying task code beautifully before registering it with plugins.js, the way cy.task is typed does not foresee folks wanting to use TS for tasks. (Go a little bit into why that is, and how you can cast to unknown to get around this problem)
