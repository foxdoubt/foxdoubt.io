---
title: Smart Techniques, Dumb CSS
date: '2019-09-22T19:21:59.819Z'
description: 'CSS with pre and post processors is still powerful and elegant in the global scope. Its okay not to jam your styles into components with JavaScript'
---

At work, I stepped away from developing for the browser for about a year. When I came back to it recently to build this blog, I was surprised by how rapidly the community had adopted CSS-in-JS techniques. There's a sense that it's the right way to style your app now, but I've been having a lot of trouble getting on board. It feels wrong to me to be mainstreaming a design approach that begins with the premise that inline CSS is okay. Five years ago, the general consensus was the opposite: inline CSS was considered very, very not okay. It was considered inefficient, confusing, wasteful and not scalable. It was the very definition of "hard coding" in frontend development. Folks have tried to sell me that composability via frameworks like React and Vue change this earlier paradigm, but I'm not convinced. Making your computer apply the same dumb styles to page elements very quickly doesn't make the underlying approach any smarter.

**Important distinction**: there's a difference between inlining chunks of CSS in a document `head` with `style` tags as part of your build process, and writing them directly into HTML elements via React. I don't take issue with a browser-ready page inlining styles in the `head`. Gatsby does this by default. What I mean by inline styles is more generally inlining as a design pattern, encouraged by tools like Styled Components and Emotion (sorry to pick on these. There are tons more, but these are the most visible as a Gatsby fan like myself).

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

And your markup looks like this:

```html
<div class="bio-module--container--12xpO">
  <h3 class="bio-module--nametag--2kuhI">Dan DeWald</h3>
  <p class="bio-module--leadline--1VRZK">creative, unconventional thinker</p>
</div>
```

CSS modules are the least egregious CSS-in-JS technique because the end result is still a stylesheet, not inline CSS. But it also needlessly limits the developer to think about component styles in an isolated way, which doesn't usually reflect the reality of the design you're building from. I've experienced firsthand that using CSS modules leads to a lot of code repetition, where page elements that appear stylistically unified are actually being rendered by duplicated CSS properties applied to virtually identical markup that happens to live in different components.

Another headache of styling with CSS modules is that there's no clear mapping between your markup and your JSX when you pop open dev tools to look at your app under the hood. The JSX is referencing class names by key on the `styles` object you imported, but that key doesn't match the rendered class name in the DOM, so it's your brain that gets to parse out all those dashes and hashes to determine which `div` got the container class. Good luck!

<h4 class="blog-subtitle uppercase bold">styled components and emotion</h4>

I'll admit I am damn smitten by how sleak the <a href="https://www.styled-components.com/" target=_blank>Styled Components</a> and <a href="https://emotion.sh/docs/introduction" target=_blank>Emotion</a> APIs are. The use of tagged template literals and the terse and self-explanatory syntax for composing style-injected components is worth getting excited about. However, they still encourage developers to write dumb CSS.

**NOTE**: The following example is massively simplified, and demonstrates only one possible way to use the emotion API, which has a lot of different expressions. I'll spare an example using Styled Components, because the API works basically the same way as `@emotion/styled` does:

```jsx
// bio.jsx

import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
const Container = styled.div`
  display: flex;
`;

const Nametag = styled.h3`
  color: red;
`;

const padding = css`
  padding: 0 20px;
`;

const Bio = ({ nametag, leadline }) => {
  return (
    <Container>
      <Nametag>{nametag}</Nametag>
      <p css={padding}>{leadline}</p>
    </Container>
  );
};

export default Bio;
```

What you end with in the browser is a bunch of `style` tags that correspond to each of the template tags you used in your component:

```html
<style data-emotion="css">
  .css-oaang6-Container {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
</style>
<style data-emotion="css">
  .css-yvqipt-Nametag {
    color: red;
  }
</style>
<style data-emotion="css">
  .css-f74j69-padding {
    padding: '0 20px';
  }
</style>
```

And markup that looks like this:

```html
<div class="css-oaang6-Container e1vt4fp0">
  <h3 class="css-yvqipt-Nametag e1vt4fp1">Dan DeWald</h3>
  <p class="css-f74j69-padding">creative, unconventional thinker</p>
</div>
```

I'm impressed by the smartness of this approach and especially appreciate the vendor prefixing for the `Container` class. Where I'm skeptical is when I try to picture how I'd use this to organize a higher level vision for a presentation layer. Furthermore, it deeply couples your app's design and functionality, since everything lives in JavaScript.

<h4 class="blog-subtitle uppercase bold">JSS</h4>

What's cool about <a href="https://cssinjs.org" target=_blank>JSS</a> is that it considers the available styling options out there, e.g, Sass, PostCSS, Styled Components, etc., and tries to integrate as much of those functionalities as it can via an impressive plugin ecosystem. I find their <a href="https://cssinjs.org/from-sass-to-cssinjs" target=_blank>From Sass to CSS-in-JS</a> presentation especially thought-provoking because I never thought about how many CSS pre- and post-processor fuctionalities can be virtually replicated using just plain JavaScript.

The API is quite extensive, but approaching styling the bio, as we did above for the other examples, you could write the styles in plain JavaScript and inject them into the DOM with `createUseStyles` from `react-jss`:

```jsx
import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  container: {
    display: 'flex'
  },
  nametag: {
    color: 'red'
  },
  leadline: {
    padding: '0 20px'
  }
});

const Bio = ({ nametag, leadline }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <h3 className={classes.nametag}>{nametag}</h3>
      <p className={classes.leadline}>{leadline}</p>
    </div>
  );
};

export default Bio;
```

Like Emotion and Styled Components, this is what ends up in the DOM:

```html
<head>
  <style data-jss="" data-meta="Unthemed">
    .container-0-2-1 {
      display: flex;
    }
    .nametag-0-2-2 {
      color: red;
    }
    .leadline-0-2-3 {
      padding: 0 20px;
    }
  </style>
</head>
```

And the markup itself

```html
<div class="container-0-2-1">
  <h3 class="nametag-0-2-2">Dan DeWald</h3>
  <p class="leadline-0-2-3">creative, unconventional thinker</p>
</div>
```

At first glance JSS is no more egregious in its approach than any of the others we've looked at, until you consider more true-to-life examples of how you might use it to style a site. Take <a href="https://cssinjs.org/react-jss#basic" target=_blank>this example code from the JSS docs</a>:

```javascript
const useStyles = createUseStyles({
  myButton: {
    color: 'green',
    margin: {
      // jss-plugin-expand gives more readable syntax
      top: 5, // jss-plugin-default-unit makes this 5px
      right: 0,
      bottom: 0,
      left: '1rem'
    },
    '& span': {
      // jss-plugin-nested applies this to a child span
      fontWeight: 'bold' // jss-plugin-camel-case turns this into 'font-weight'
    }
  },
  myLabel: {
    fontStyle: 'italic'
  }
});
```

or worse, <a href="https://cssinjs.org/jss-syntax?v=v10.0.0#media-queries" target=_blank>this one</a>:

```javascript
const styles = {
  button: {
    width: 100
  },
  '@media (min-width: 1024px)': {
    button: {
      width: 200
    }
  }
};
```

Or possibly even worse, <a href="https://cssinjs.org/jss-syntax?v=v10.0.0#comma-separated-values" target=_blank>this</a>:

```javascript
const styles = {
  button: {
    // Comma separated value with space separated values inside.
    border: [
      // Numbers can become default unit automatically.
      [1, 'solid', 'red'],
      [1, 'solid', 'blue']
    ]
  }
};
```

Apologies for being so emphatic, but everything about this is wrong. It obscures how data in JavaScript behaves and it obscures how inheritance in CSS works: a true _lose-lose_.

To pull this kind of thing off, CSS property values must be captured in strings. But CSS thinks in primatives that weren't conceived with a JavaScript compile step in mind. And those CSS primatives are awesome! Why deprive yourself of them by writing CSS in strings, enforcing yet another layer of abstraction on yourself in a toolchain that's already way too abstract? The same is true of camel-case to dash-case. CSS selectors are typically written in dash-case or snake-case, and JavaScript in camel-case. While yes, template literals do make it so you can move around chunks of CSS in its intended syntax, those chunks can't be parsed the way existing CSS pre- and post-processors can parse them. It appears you can't have it both ways: if you want styles as data, scoped to a component at run time, you need to use string-based property values. Otherwise, you can write floating chunks of CSS in template literals that look more like CSS, but are basically useless from a programmatic perspective once run time begins.

### Just leave JS out of it

With a separate and distinct presentation layer using a pre- or post-processor like Sass, you would establish a set of base rules and utilities, e.g., variables, placeholders, mixins, functions, which would form the totality of your site's design spec. A central `.scss` or `.css` file would then pull in component-specific Sass partials via `import`. These partials can live side by side with your components, just like with CSS modules, but because they're imported after your base Sass, you can use all those Sass utilities, and `@extend` base classes easily within them. This setup or some variant of it is nothing new. It's battle tested, and has at least the potential for the kind of composibility that can make even big,complex projects easier to reason about. I would even say it captures aspects of the CSS-in-JS world, in that your styles get to live side by side with the components they're dressing up, but they're globally aware of your base styles as well.

`src/styles/main.scss`

```scss
$blue: #0090c4;
$sand: #ffe599ff;
$white: #fcfafaff;
$red: #9a0646;
$tablet-width: 768px;
$desktop-width: 1024px;
$content-space-sm: 20px;
$h3-font-size: 28px;
$text-xxl: 44px;

@mixin tablet {
  @media (min-width: $tablet-width) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: $desktop-width) {
    @content;
  }
}

import './component-styles';
```

`src/styles/component-styles/_index.scss`

```scss
import './../../src/components/bio/styles';
import './../../src/components/image/styles';
import './../../src/components/footer/styles';
import './../../src/components/all-the-things/styles';
```

In your partials, compose small custom rules that take advantage of everything in scope from `main.scss` by way of the import:

`src/components/bio/styles/_index.scss`

```scss
.profile {
  margin: $content-space-sm 0 0 $content-space-sm;
}
.nametag-container {
  .nametag {
    font-size: $h3-heading-font-size;
    @include tablet {
      font-size: $text-xxl;
    }
  }
}
```

Then finally hook into the styles with simple class names in React.

`src/components/bio/index.js`

```jsx
import React from 'react';

const Bio = ({ nametag, leadline }) => (
  <div className='profile'>
    <div className='nametag-container'>
      <h3 className='nametag'>{nametag}</h3>
      <p>{leadline}</p>
    </div>
  </div>
);

export default Bio;
```

Yes, with a set up like this you have to deal with the dark and scary cascade. But, if your CSS architecture is sensible, it'll mostly be like a funnel, where the base rules are the most declaration-heavy, and the imported partials are lightweight, handling component-specific tweaks and blocking unwanted inheritance here and there.

What you don't have easily here is protection against naming collisions. However, I've worked on some pretty big sites where a lot of developers are writing styles at the same time, and I can't think of a single time we encountered a naming collision. If it's a risk you're freaked out about, with a little finagling you could use some Webpack plugins to add hashing. Webpack could also help you break up your monolithic stylesheet into smaller pieces, with the end result being not too terribly unlike what CSS modules can do.

### Takeaway

With CSS-in-JS techniques I think you end up paying a high price and not getting that much in return. Life gets more complicated when the opposite was supposed to happen. On the other hand, if you're working on a project with people who don't care how dumb and repetitive their CSS is so long as team members can ship new components as quickly as possible, then CSS-in-JS makes a lot of sense. After all, it fits perfectly into the _everything is a component_ dogma that defines the field of frontend right now.

Maybe the ideal toolchain is one that allows you to use centrally defined pre- and post-processor goodies globally and within CSS modules. I'm sure folks are doing that right now.
