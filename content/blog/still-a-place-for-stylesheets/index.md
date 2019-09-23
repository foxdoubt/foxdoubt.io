---
title: Smart Techniques, Dumb CSS
date: '2019-09-22T19:21:59.819Z'
description: 'CSS, including pre and post processors, can be much more powerful and elegant globally scoped. Its okay not to jam styles into components with JavaScript'
---

## Why has the world turned its back on CSS?

At work, I stepped away from developing for the browser for about a year. When I came back to it recently to build this blog, I was surprised by how rapidly the community had adopted CSS-in-JS techniques. There's a sense that it's the right way to style your app now, but I've been having a lot of trouble getting on board. It feels wrong to me to be mainstreaming a design approach that begins with the premise that inline CSS is okay. Five years ago, the general consensus was the opposite: inline CSS was considered very, very not okay. It was considered inefficient, confusing, wasteful and not scalable. It was the very definition of "hard coding" in frontend development. Folks have tried to sell me that composability via frameworks like React and Vue change this earlier paradigm, but I'm not convinced. Making your computer apply the same dumb styles to page elements very quickly doesn't make the underlying approach any smarter.

The arguments for a separate and distinct presentation layer as the gold standard for styling a web app are as sound today as they were five or ten years ago. After all, leaning smartly on global stylesheets organized into sensible, predictably named rules that utilize the cascade to keep code DRY is where CSS really shines. Throw a good preprocessor like Sass into the equation and you can start composing truly elegant, powerful and flexible design systems that don't have to get entangled in your application JavaScript to work.

- where JavaScript starts to feel like a blugeon is with CSS-in-JS techniques because in practice I see these actively taking away the strengths of having a truly separate space in your application for styles. And making my life more complicated for marginal improvements.

### quick overview of CSS-in-JS techniques

- css modules
- styled components
-

### Evaluation I - which are truly bringing solutions that makes live easier?

_how many of these are really solving problems that couldn't be solved before with comparable amount of effort?_

### Evaluation II - which are actively hurting developers and development?

_how does it actively take away?_

- I also see these techniques actively enabling less experienced engineers who are just starting out to never get a strong command of CSS and how much easier writing good CSS can make your life, and how good and flexible it can make your app. That's a real shame because it makes their lives harder in the long run not to be exposed to perfectly efficient and time-tested CSS strategies. The more we're exposed to good design of any kind, even the "old," the more our design creativity grows and the better we are at coming up with solutions to all kinds of problems we encounter
- Examples

```
what does the code formatting look like on this bad boy?
```

### An example that takes the best of both worlds

_show how to define a global space, then import partials that live with components, have access to all your fancy globally defined 'pre' and 'post' stuff and could still be namespaced if you want_

### my two cents

My hunch is that a little bit of this trend towards CSS-in-JS is yet another macho JavaScript thing. It has this element of being a macho vendetta. For all the years before the CSS-in-JS revolution of being constantly flustered and impatient with their stylesheets not working how they wanted them to. The macho-ness of never actually taking the time to learn how the cascade works, it's strengths and quirks, and instead just muscling it into doing what you needed it to do, (think tons of 'importants') not understanding or evaluating the technique or the hack you used, or why it needed so much extra padding. As Node's power grew, these folks finally have a way to never to have to deal with their frustrations again. Using a sophisticated runtime to essentially ignore the cascade entirely and write the type of rudimentary inline css you'd see in a web development for children.
