---
title: A TypeScript Hack for Cypress Tasks
date: '2020-02-14T19:21:59.819Z'
description: 'Despite what the docs say, TS devs still need to hack around a bit to get the TypeScript support we deserve in Cypress'
featuredImage: './homer-reactor.png'
featuredGif: './homer-reactor.gif'
featuredGifAspectRatio: '4:3'
---

Cypress is a promising arrival to the world of end-to-end testing. Its accessible documentation makes it easy to get started writing tests with more than just a superficial understanding. Plus, it has an incredibly flexible, extensible API, and an intuitive assertions library built on <a href="https://mochajs.org" target=_blank>Mocha</a> and <a href="https://sinonjs.org/" target=_blank>Sinon</a>.

For all its virtues, however, Cypress is surprisingly weak when it comes to TypeScript support. While test files and commands can be written in TypeScript with minimal effort, currently there is no support for Cypress plugins. This is disappointing for anyone looking to use Cypress to test an existing TypeScript application. Luckily there's a pretty painless workaround, using `ts-node`. [Click here to go right to the solution](#the-problem), or read on for more context!

### The Plugins API

In Cypress, plugins provide a connection between the browser context where your tests are run and the platform's underlying Node process. Tasks are an especially powerful feature of plugins. With tasks, you provide a task name and JSON serialize-able arguments to a custom Node function, and Cypress will execute your code and return the results back to the browser. This is a perfect tool for something like seeding your test database and is in fact the preferred method for doing so <a href="https://docs.cypress.io/api/commands/task.html#Command" target=_blank>according to the Cypress docs</a>.

For illustration purposes, imagine an incredibly simple application that's able to generate a user profile:

```
my-app
 ┗ src
 ┃ ┣ client
 ┃ ┃ ┣ index.tsx
 ┃ ┃ ┗ user-profile.tsx
 ┃ ┗ server
 ┃ ┃ ┣ models
 ┃ ┃ ┃ ┗ user.ts
 ┃ ┃ ┣ db.ts
 ┃ ┃ ┗ index.ts
```

Once you add <a href="https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Folder-Structure" target=_blank>the standard Cypress integration</a>, you'd have something like this:

```
my-app
 ┣ cypress
 ┃ ┣ integration
 ┃ ┃ ┗ user.ts
 ┃ ┣ plugins
 ┃ ┃ ┣ index.js
 ┃ ┃ ┗ task-helpers.js
 ┃ ┣ support
 ┃ ┃ ┣ commands.js
 ┃ ┃ ┗ index.js
 ┃ ┗ tsconfig.json
 ┗ src
 ┃ ┣ client
 ┃ ┃ ┣ index.tsx
 ┃ ┃ ┗ user-profile.tsx
 ┃ ┗ server
 ┃ ┃ ┣ models
 ┃ ┃ ┃ ┗ user.ts
 ┃ ┃ ┣ db.ts
 ┃ ┃ ┗ index.ts
```

Assuming your server had a `/users/<userid>` route, you could write the following Cypress test:

```typescript
// cypress/integration/user.ts

const seedData = {
  users: [
    {
      firstName: 'Fox',
      lastName: 'Doubt',
      emailAddress: 'foxdoubt@gmail.com'
    }
  ]
};

describe('user', () => {
  before(() => {
    cy.task('seed', seedData).then(({ allUsers }) => {
      const { id, createdAt } = allUsers[0];
      this.userId = id;
      this.userCreatedAt = createdAt;
    });
  });
  after(() => {
    cy.task('tearDown');
  });
  it('contains the user creation time', function() {
    cy.visit(`/users/${this.userId}`);
    cy.get('[data-cy="profile-timestamp"]').should(
      'have.text',
      this.userCreatedAt
    );
  });
});
```

Next you'd register the "seed" task like so:

```javascript
// cypress/plugins/index.js

const { seedTestDb, tearDownDb } = require('./task-helpers');

module.exports = on => {
  // other plugins...
  on('task', {
    seed(input) {
      return seedTestDb(input);
    },
    tearDown() {
      return tearDownDb();
    }
  });
};
```

And let's imagine `seedTestDb` and `tearDownDb` are custom Node functions:

```javascript
// cypress/plugins/task-helpers.js

const createConnection = async () => {
  // establish connection with your app's
  // DB driver if one does not already exist
};

const createUser = async userData => {
  // insert a user into your test database
};

export const seedTestDb = async input => {
  await createConnection();
  let allUsers = [];
  if (input.users && input.users.length) {
    allUsers = await Promise.all(input.users.map(createUser));
  }
  // additional checks could be added for seeding the test
  // DB with other application resources
  return {
    allUsers
    // ...
  };
};

export const tearDownDb = async () => {
  // clears all rows in all tables
};
```

<h3 class="blog-subtitle" id="the-problem">The Problem</h3>

What if your app already contains great functions that you want to use in these helpers rather than writing them from scratch? Because you cannot import TypeScript modules for use in your tasks, you're out of luck. One solution would be to have a separate build step that runs before `cypress` which transpiles your TypeScript into JavaScript and saves it to some output location, then `require` the code from there. But that would be an inconvenient and error prone dependency. Luckily, there's `ts-node`, which exports a function `register` for transpiling TypeScript modules in Node:

```javascript
// cypress/plugins/index.js

require('ts-node').register({
  transpileOnly: true
  // other ts options...
});

const { seedTestDb, tearDownDb } = require('./task-helpers');

module.exports = on => {
  // other plugins...
  on('task', {
    seed(input) {
      return seedTestDb(input);
    },
    tearDown() {
      return tearDownDb();
    }
  });
};
```

`register` is amazing. It will transpile any TypeScript modules required after it, and will do so remarkably fast if you pass it an options object with `transpileOnly: true`. <a href="https://github.com/TypeStrong/ts-node#configuration-options" target=_blank>Here are the full list of options for `ts-node`</a>.

Using `register` opens up the entire world of your TypeScript application for use in Cypress plugins. Now, back to our helpers file, which we can convert to TypeScript and import modules from our application code:

```typescript
// cypress/plugins/task-helpers.ts

import User from '../../src/models/user';
import { connect } from '../../src/server/db';

interface ICreateUserInput {
  firstName: string;
  lastName: string;
  emailAddress: string;
}

export interface ICreateUserOutput {
  allUsers: User[];
}

const createConnection = async () => {
  // establish connection with your app's
  // DB driver if one does not already exist
};

export const seedTestDb = async input => {
  await createConnection();
  let allUsers = [];
  if (input.users && input.users.length) {
    allUsers = await Promise.all(User.create);
  }
  // additional checks could be added for seeding the test
  // DB with other application resources
  return {
    allUsers
    // ...
  };
};

export const tearDownDb = async () => {
  // clears all rows in all tables
};
```

Unfortunately, there is no way to easily maintain type support in the test file itself. Ideally, extending the Cypress `then` function type in a custom declaration file to accept a generic would probably be the most correct way to get around this. Like so:

```typescript
// cypress/cypress-types.d.ts

declare module 'cypress-types' {
  global {
    interface Chainable<Subject> {
      // TODO FINISH THIS
      then<T>();
      // ...
    }
  }
  export = global;
}
```

However, this ends up generating type issues that are beyond the scope of this post to untangle! Here's an adequate work-around. We cast the result returned from the `seed` task as `unknown` then to `ICreateUserOutput`.

```typescript
// cypress/integration/user.ts

import { ICreateUserOutput } from '../plugins/task-helpers';

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
    cy.task('seed', seedData).then(seedResult => {
      const { users } = (seedResult as unknown) as ICreateUserOutput;
      this.user1Id = users[0].id;
    });
  });
  it('does some user behavior', function() {
    cy.visit(`/users/${this.user1Id}`);
    // proceed with your test...
  });
});
```

When you run this with `cypress open` or `cypress run`, you can at the very least import TypeScript modules from your application source to run as part of your Cypress test suite, and it's pretty much seamless. Additionally, you will get at least _some_ type support. Hopefully Cypress will address this issue in a future release, but for now, we're stuck with the workaround.
