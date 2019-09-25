---
title: Smart Techniques, Dumb CSS
date: '2019-09-22T19:21:59.819Z'
description: 'CSS with pre and post processors is still powerful and elegant in the global scope. Its okay not to jam your styles into components with JavaScript'
---

At work, I stepped away from developing for the browser for about a year. When I came back to it recently to build this blog, I was surprised by how rapidly the community had adopted CSS-in-JS techniques. There's a sense that it's the right way to style your app now, but I've been having a lot of trouble getting on board. It feels wrong to me to be mainstreaming a design approach that begins with the premise that inline CSS is okay. Five years ago, the general consensus was the opposite: inline CSS was considered very, very not okay. It was considered inefficient, confusing, wasteful and not scalable. It was the very definition of "hard coding" in frontend development. Folks have tried to sell me that composability via frameworks like React and Vue change this earlier paradigm, but I'm not convinced. Making your computer apply the same dumb styles to page elements very quickly doesn't make the underlying approach any smarter.

The arguments for a separate and distinct presentation layer as the gold standard for styling a web app are as sound today as they were five or ten years ago. After all, leaning smartly on global stylesheets organized into sensible, predictably named rules that utilize the cascade to keep code DRY is where CSS really shines. Throw a good preprocessor like Sass into the equation and you can start composing truly elegant, powerful and flexible design systems that don't have to get entangled in your application JavaScript to work.

### Quick Overview of Some Common CSS-in-JS techniques

<h4 class="blog-subtitle uppercase bold">css modules</h4>

Create a `.module.css` file, which should live side by side with the React component that's importing it:

```css
/* bio.module.css */

.container {
  display: flex;
}

.nametag {
  color: red;
}

.leadline {
  padding: 0 20px;
}
```

and have the selector names available as an object, so you can do things like this:

```jsx
// bio.jsx

import React from 'react';
import styles from './bio.module.css';

const Bio = ({ nametag, leadline }) => (
  <div className={styles.container}>
    <h3 className={styles.nametag}>{nametag}</h3>
    <p className={styles.leadline}>{leadline}</p>
  </div>
);

export default Bio;
```

After compilation, the classes you use are in essence locally scoped to the component by way of unique IDs magically injected into the selector name, thus avoiding naming collisions.

```css
/* actual css read by the browser */

.bio-module--container--12xpO {
  display: flex;
}

.bio-module--nametag--2kuhI {
  color: red;
}

.bio-module--leadline--1VRZK {
  padding: 0 20px;
}
```

CSS modules are the least egregious CSS-in-JS technique because the end result is still a stylesheet, not inline CSS. But it also needlessly limits the developer to think about component styles in an isolated way, which doesn't usually reflect the reality of the design you're building from. I've experienced firsthand that using CSS modules leads to a lot of code repetition, where page elements that appear stylistically unified are actually being rendered by duplicated CSS properties applied to virtually identical markup that happens to live in different components.

Another headache of styling with CSS modules is that there's no clear mapping between your markup and your JSX when you pop open dev tools to look at your app under the hood. The JSX is referencing class names by key on the `styles` object you imported, but that key doesn't match the rendered class name in the DOM, so it's your brain that gets to parse out all those dashes and hashes to determine which `div` got the container class. Good luck!

<h4 class="blog-subtitle uppercase bold">styled components and emotion</h4>

TODO: Example

I'll admit I am damn smitten by how sleak the Styled Components and Emotion APIs are. The use of tagged template literals and the terse and self-explanatory syntax for composing style-injected components is worth getting excited about. However, they still encourage developers to write dumb CSS. There is no apparent higher level vision for how to organize styles into manageable and predictable patterns the way that separate stylesheets alone do just fine. Furthermore, it deeply couples your app's design and functionality, since everything lives in JavaScript.

<h4 class="blog-subtitle uppercase bold">JSS</h4>

What's cool about JSS is that it considers the available styling options out there, e.g, Sass, PostCSS, Styled Components, etc., and tries to integrate as much functionality as it can using a lot of what ordinary JavaScript already does. I find their <a href="https://cssinjs.org/from-sass-to-cssinjs" target=_blank>From Sass to CSS-in-JS</a> presentation especially thought-provoking because I never thought about how many of Sass's fuctionalities can be virtually replicated using vanilla JavaScript.

```
JSS example
```

Since JSS has a whole plugin ecosystem, you can mix and match the types of CSS-in-JS you want for your project, which varies from Sass-like add-ons to functions that have APIs which give you Styled Component-like functionality. With example like this... I think, trying to accommodate the need for a composable and independent presentation layer for an application. But it still feels like unnecessary effort.

- show example of applying flex in a parent css object and then assuming the flex state in another object. Apologies for being so emphatic, but everything about this is wrong. It obscures how data in JavaScript behaves; it obscures how inheritance in CSS works.

CSS-in-JS means values are always captured in string form. But that's not actually how CSS works. CSS primatives are awesome. The CSS parser doesn't think in those terms, so writing CSS in strings means you're enforcing another layer of abstraction on yourself. The same is true of camel-case to dash-case. CSS selectors are typically written in dash-case or snake-case, and JavaScript in camel-case. While yes, template literals do make it so you can get a whole block of styles as if it's CSS syntax, those can't be parsed the way Sass can. You can't have it both ways: if you want your styles to be data scoped to a component at run time, you need to use string based property values, otherwise you can have your template literal floating chunks of CSS, that magically find their way to a stylesheet. Or, you can just use a stylesheet!

### The best of both worlds

Consider a separate and distinct presentation layer composed with Sass that establishes a set of base variables, placeholders, mixins and functions which form the totality of your site's design behavior. It then pulls in component-specific Sass partials via `import`. These partials can live side by side with your components, just like with CSS modules, but because they're imported after your base Sass, you can use all those Sass utilities, and `@extend` base classes easily within them. This setup has at least the potential for the kind of composibility that can make medium-to-big, complex projects easier to reason about, and its the best of both worlds: your styles get to live side by side with the components they're dressing up, but they're globally aware of your base styles as well.

```
example
```

What you don't have easily here is protection against naming collisions. However, I've worked on some pretty big sites where a lot of developers are writing styles at the same time, and I can't think of a single time we encountered a naming collision. However, if it's a risk you're freaked out about, with a little finagling you could use some Webpack plugins to add hashing. Webpack could also help you break up your monolithic stylesheet into smaller pieces, with the end result being not too terribly unlike what CSS modules can do.

### Takeaway

I also see these techniques actively enabling less experienced engineers who are just starting out to never get a strong command of CSS and how much easier writing good CSS can make your life, and how good and flexible it can make your app. That's a real shame because it makes their lives harder in the long run not to be exposed to perfectly efficient and time-tested CSS strategies. The more we're exposed to good design of any kind, even the "old," the more our design creativity grows and the better we are at coming up with solutions to all kinds of problems we encounter
