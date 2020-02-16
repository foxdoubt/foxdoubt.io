---
title: A TypeScript Hack for Cypress Tasks
date: '2020-02-14T19:21:59.819Z'
description: 'Despite what their docs say, TS devs still need to hack around quite a bit to get the TypeScript support we deserve in Cypress'
featuredImage: '../smart-techniques-dumb-css/frinkiac-first-frame.png'
featuredGif: '../smart-techniques-dumb-css/frinkiac.gif'
featuredGifAspectRatio: '4:3'
---

### Intro

Cypress is one of the newest names in the world of end-to-end testing. It's notable for easy onboarding because of its exhaustive and accessible documentation, and an incredibly flexible and extensible API. It's also natively asynchronous, built over multiple existing assertion libraries, such as Mocha, so also very expressive.

For all its virtues, Cypress is surprisingly weak when it comes to TypeScript support. While test files and commands can be written in TypeScript with minimal configuration, currently there is no support for Cypress plugins. This is a disappointing realization for anyone looking to use Cypress to test their existing TypeScript application. Luckily there's a pretty painless workaround, using the `tsc` package. Click here to go right to the solution, or read on for more context!

### The Plugins API

In Cypress, plugins are a direct connection between the browser context where your tests are run, and the platform's underlying Node process. Tasks are an especially powerful feature of plugins. With tasks, you provide a task name and JSON serialize-able arguments to some custom Node function of your choosing, and Cypress will execute it and return the results to the browser. This is perfect for something like seeding your test database, and is in fact the preferred method for doing so, <a href="https://docs.cypress.io/api/commands/task.html#Command" target=_blank>according to the Cypress docs</a>. Here's an example using plain ole' JavaScript, assuming you've already set up a test server with a `/users/<userid>` route:

```typescript
// cypress/integration/user.ts

const seedData = [
  {
    firstName: 'Fox',
    lastName: 'Doubt',
    emailAddress: 'foxdoubt@gmail.com'
  },
  {
    firstName: 'Coyote',
    lastName: 'Pensive',
    emailAddress: 'coyotepensive@hotmail.com'
  }
];

describe('user', () => {
  before(() => {
    cy.task('seed', seedData).then(({ users }) => {
      const { emailAddress, id } = users[0];
      this.user1Id = id;
    });
  });
  it('does some user behavior', function() {
    cy.visit(`/users/${this.user1Id}`);
    // proceed with your test...
  });
});
```

Next you'd register the "seed" plugin like so:

```javascript
// cypress/plugins/index.js

const { createConnection, createUser } = require('./task-helpers');

module.exports = on => {
  // other plugins...
  on('task', {
    seed(input) {
      return createConnection().then(() => {
        return Promise.all(input.map(createUser(input)));
      });
    }
  });
};
```

And let's imagine `createConnection` and `createUser` are custom Node functions you wrote yourself expressly for seeding your end-to-end tests, which pull code in directly from your application:

```javascript
// plugins/task-helpers.js

const User = require('../../src/models/user');
const connect = require('../../src/models/db-connect');

export const createUser = async userData => {
  // do some end-to-end specific logic, then...
  return User.create(userData);
};

export const createConnection = async () => {
  // establishing a connection to your database
  return connect({
    env: 'TEST_INTEGRATION',
    timeout: 30000,
    connectionPoolConfig: {
      // ...
    }
  });
};
```

This is fine, but what if your application is written in TypeScript? If so, you could have a separate build step that runs _before_ `cypress` which transpiles your TypeScript to some output location, then `require` the code from there. But that would be an inconvenient and error prone dependency. Luckily, there's `ts-node` which exports a function `register` for TS->JS transpilation _on the fly_:

```javascript
// cypress/plugins/index.js
const tsConfig = require('../tsconfig.plugins');
require('ts-node').register(tsConfig);
const { createConnection, createUser } = require('./task-helpers');

module.exports = on => {
  // other plugins...
  on('task', {
    seed(input) {
      return createConnection().then(() => {
        return Promise.all(input.map(createUser(input)));
      });
    }
  });
};
```

`register` is amazing. All you have to do is call it with a TS config, and it will magically transpile any TypeScript that comes after it. That single line of code opens up the entire world of your TypeScript application for use in Cypress plugins.

So, back in our helpers file, which we can now make a TypeScript file:

```typescript
// plugins/task-helpers.ts

import User from '../../src/models/user';
import connect from '../../src/models/db-connect';

// add some types!
interface ICreateUserInput {}

interface ICreateUserOutput {}

export const createUser = async (
  userData: ICreateUserInput
): Promise<ICreateUserOutput[]> => {
  // do some end-to-end specific logic, then...
  return User.create(userData);
};

export const createConnection = async () => {
  // establishing a connection to your database
  return connect({
    env: 'TEST_INTEGRATION',
    timeout: 30000,
    connectionPoolConfig: {
      // ...
    }
  });
};
```

Unfortunately, there is no way to easily maintain type support in the test file itself.

Ideally, extending the `task` function type in a custom declaration file to accept a generic would probably be the most correct way to get around this. Like so:

```typescript
// TODO example
```

However, this ends up generating type warnings and errors that are beyond the scope of this post to untangle! So here's an arguably adequate work around. In the example cast the result returned from your task as `unknown` then back into its original type.

```typescript
// TODO example
```
