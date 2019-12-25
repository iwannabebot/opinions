---
title: Build an npm package with TypeScript
date: "2017-08-19T22:40:32.169Z"
template: "post"
draft: false
slug: "build-an-npm-package-with-typescript"
category: "Technology"
tags:
  - "TypeScript"
  - "npm"
  - "Web Development"
description: "This article would help you in deciding, designing, and deploying your no-dependency npm package with TypeScript. Lately, I was writing a survey application which renders beautiful, validated forms…"
socialImage: "https://cdn-images-1.medium.com/max/2560/1*6BB30K16pSoODx0fz0mI_w.png"
---
[Source Code](https://github.com/iwannabebot/universal-validator)

This article would help you in deciding, designing, and deploying your no-dependency npm package with TypeScript. Topics covered here includes

- Writing library
- Unit tests with coverage report
- Generating and deploying api document on GitHub Pages,
- CI and CD

> If you enjoyed the post, please clap hard so others can discover this. Cheers 🍻

## Motivation😇

Lately, I was involved in writing a survey application which renders beautiful, validated forms on your browser. I chose Angular for its fast bootstrapping and amazing TypeScript support. TypeScript brings type awareness that JavaScript lacked with all the amazing functional programming support. During one of the initial sprints, I wrote a string validation library, which however was tightly bound with the Angular Forms validation. Later when a lite version of the same application was required, I chose ReactJS for its small footprint. Immediately I found myself in a tight spot. I had make the validators I wrote earlier compatible with the lite version. Someone suggested me to write a dirty interop for it. Writing an interop would be a solution for ReactJs only, so instead I chose to strip any framework dependencies from validations library and built a completely singular, no dependency package. In its final form this library is compatible with all JavaScript based frameworks and platforms(server/client).
If you can relate with this, you will find your next 10 minutes very interesting.

### What is npm?

> npm is a library/package manager for NodeJs and is the largest software registry in the [known universe](https://www.youtube.com/watch?v=17jymDn0W6U). .NET developers like myself can relate npm with [NuGet](https://www.nuget.org/).

### What is TypeScript?

> [TypeScript](https://www.typescriptlang.org/) is the [typed](https://stackoverflow.com/questions/9154388/does-untyped-also-mean-dynamically-typed-in-the-academic-cs-world) superset of JavaScript that compiles to pure JavaScript. Microsoft defines TypeScript as JavaScript that scales.

### Why I chose TypeScript?

> We love TypeScript for many things… With TypeScript, several of our team members have said things like ‘I now actually understand most of our own code!’ because they can easily traverse it and understand relationships much better. And we’ve found several bugs via TypeScript’s checks.”
> — Brad Green, Engineering Director — Angular

TypeScript starts from the same syntax and semantics that millions of JavaScript developers know today. You can use existing JavaScript code, incorporate popular JavaScript libraries, and call TypeScript code from JavaScript. TypeScript compiles to clean, simple JavaScript code which runs on any browser, in Node.js, or in any JavaScript engine that supports ECMAScript 3 (or newer). Type support enable JavaScript developers to use highly-productive development tools and practices like static checking and code refactoring when developing JavaScript applications. Types are optional, and type inference allows a few type annotations to make a big difference to the static verification of your code. Types let you define interfaces between software components and gain insights into the behavior of existing JavaScript libraries.
If you have a JavaScript library and want to move to TypeScript this is an excellent place to start.

---

Let’s start building our own TypeScript library. I am assuming very basic JavaScript proficiency. You won’t need any prior TypeScript knowledge to follow along this.

## Lets Start 👷⏳

You should have NodeJs installed on your machine. I would be using VS Code throughout this. Any other editor like Atom or Sublime would work too.

### 1. Initialize project:

Initialize project by running this command:
```bash
mkdir universal-validator
cd universal-validator
npm init
```
A package.json would be created that would something like this:
```json
{
 “name”: “universal-validator”,
 “version”: “1.0.0”,
 “description”: “A string validation library for node”,
 “main”: “dist/index.js”,
 “scripts”: {
   “test”: “echo \”Error: no test specified\” && exit 1"
 },
 “keywords”: [
  “validator”,
  “npm”
 ],
 “license”: “MIT”,
}
```

### 2. Add TypeScript support:

Setup typescript:
```bash
npm i -D typescript @types/node tslint
```
Add tsconfig.json
```json
{
    "compilerOptions": {
      "target": "es6",
      "module": "commonjs",
      "declaration": true,
      "outDir": "./dist",
      "strict": true
    }
}
```
Add tslint.json
```json
{
  "extends": [
    "tslint:recommended"
  ],
  "rules": {
    "interface-name": false,
    "max-line-length": [
      true,
      100
    ],
    "no-console": [
      true,
      "time",
      "timeEnd",
      "trace"
    ],
    "no-string-literal": false,
    "object-literal-sort-keys": false,
    "ordered-imports": false,
    "quotemark": [
      true,
      "single",
      "avoid-escape"
    ],
    "trailing-comma": [
      false,
      {
        "multiline": "always",
        "singleline": "never"
      }
    ],
    "variable-name": [
      true,
      "allow-leading-underscore",
      "ban-keywords",
      "check-format"
    ]
  }
}
```
Add the following script to your npm scripts:
```json
"build": "tsc",
"build:watch": "tsc --watch",
"lint": "tslint --project \"./tsconfig.json\""
```
### 3. Library:
For sake of brevity we will create a single function which would check if a string is null or empty. Create a folder src
```bash
mkdir src
```
Add a file index.ts:
```
touch src/index.ts
```
Add the following content in index.ts:
```ts
export function IsNullOrEmpty(str: string): boolean {
    return str == null || str.trim().length === 0;
}
```
Build typescript:
```bash
npm run build
```
You will find your typescript code transpiled into pure javascript in dist folder in root. A typing file should also be there.
You can also build in watch mode:
```bash
npm run build:watch
```
Since the compiler is running in watch mode, any change made inside src folder would trigger transpiling again.
### 4. Test your library:
We will use mocha
> Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases
and chai
> Chai is an assertion library for node and the browser that can be delightfully paired with any javascript testing framework.
Add dependencies
```bash
npm i -D mocha @types/mocha chai @types/chai
```
Add this script in your npm scripts:
```json
"test": "mocha --reporter spec"
```
Create a folder test in root directory and add a new file test.js. Write some tests in test/test.js:
```js
'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
describe('simple validate test', () => {
  it('should return true for null string', () => {
    var result = index.IsNullOrEmpty(null);
    expect(result).to.equal(true);
  });
  it('should return true for undefined string', () => {
    var result = index.IsNullOrEmpty(undefined);
    expect(result).to.equal(true);
  });
  it('should return true for empty string', () => {
    var result = index.IsNullOrEmpty("");
    expect(result).to.equal(true);
  });
  it('should return true for whitespace string', () => {
    var result = index.IsNullOrEmpty(" ");
    expect(result).to.equal(true);
  });
  it('should return false for non-empty string', () => {
    var result = index.IsNullOrEmpty("test");
    expect(result).to.equal(false);
  });
});
```
Run test:
```bash
npm run test
```
Output:
```bash
simple validate test
    √ should return true for null string
    √ should return true for undefined string
    √ should return true for empty string
    √ should return true for whitespace string
    √ should return false for non-empty string
5 passing (8ms)
```
> Next four steps 5,6,7,8 would require you to create a GitHub repo for your package. This is in order to generate docs on GitHub pages and integrate with TravisCI. You can skip these steps and directly publish. However, I strongly recommend that you follow them.

### 5. Add library documentation:

We will use [TypeDoc](https://github.com/TypeStrong/typedoc) to generate document for our library. TypeDoc runs on Node.js and is available as an npm package. You can install TypeDoc in your project’s directory as usual:
```bash
npm i -D typedoc
```
We will gh-pages to publish our docs on Github Pages. gh-pages publish files to a gh-pages(or any other) branch on GitHub:
```bash
npm i -D gh-pages
```
Add the following script to your npm scripts:
```json
"docs": "typedoc --out docs src",
"gh-pages": "rimraf docs && npm run docs && gh-pages -d docs",
```
To publish library documentation on Github use the following command:
```bash
npm run gh-pages
```
After this you can browse to the below url to find library documentation:
> https://<username>.github.io/<reponame>/

![](https://miro.medium.com/max/1234/1*aCYWBhKAT2gfnzsMRal-Ug.png)

### 6. Setup CI:

We will use Travis for our CI requirements.

> Travis CI is a hosted, distributed continuous integration service used to build and test software projects hosted at GitHub.

1. Login in Travis and go to https://travis-ci.org/profile/<username>.
2. You should then switch on your repository.
3. Add .travis.yml to your repository root.
```yml
language : node_js
node_js :
 - stable
install:
 - npm install
script:
 - npm test
before_script:
 - npm run build
```
Committing and pushing the changes would trigger Travis to create a new build.

### 7. Code coverage:

Code coverage is a measure used to describe the degree to which the source code of a program is executed when a test suite runs. A program with high test coverage, measured as a percentage, has had more of its source code executed during testing, which suggests it has a lower chance of containing undetected software bugs compared to a program with low test coverage.

[Coveralls](https://coveralls.io/) help you deliver code confidently by showing which parts of your code aren’t covered by your test suite. Coverall is free for open source repos.
- Login in Coveralls and go to [https://coveralls.io/repos/new](https://coveralls.io/repos/new).
- You should then switch on your repository.
- Install instanbul and coveralls.
```bash
npm i -D istanbul @types/istanbul coveralls
```
- Add following script to npm scripts:
```json
"cover": "istanbul cover node_modules/mocha/bin/_mocha test/*.js - - -R spec",
"ci": "npm run lint && npm run build && npm run cover"
```
- Update .travis.yml in your repository root
```yml
language : node_js
node_js :  
 - stable
install:  
 - npm install
script:  
 - npm run ci
# Update Coveralls
after_script: "cat coverage/lcov.info | node_modules/coveralls/bin/coveralls.js"
```
Committing and pushing the changes would trigger Travis to create coverage using istanbul and report it to coveralls.

### 8. Setup README:

Before publishing your npm package, you should edit README since the README would be displayed in your npmjs package home page.
It is a good practice to add badges in your README which reports your repository status.

Travis:
```md
[![Build Status](https://travis-ci.org/<username>/<reponame>.svg?branch=master)](https://travis-ci.org/<username>/<reponame>)
```
Coveralls:
```md
[![Coverage Status](https://coveralls.io/repos/github/<username>/<reponame>/badge.svg?branch=master)](https://coveralls.io/github/<username>/<reponame>?branch=master)
```
You should also add installation and usage steps.

### 9. Publish your library to npm:

Add an .npmignore file with the following content:
```
dist/
```
Before publishing add the following script in your npm scripts:
```json
"postversion": "git push && git push --tags",
"prepublishOnly": "npm run ci",
"preversion": "npm run ci",
```
These are necessary scripts which should run before and after publishing. Make sure that you are a user in npmjs, and logged in to npm via
```bash
npm login
```
All you need now is this command:
```bash
npm publish
```

## Congratulations 🎉🎊🎉🎊🎉

You have just published your first NPM package.
Now all you need to do is use this package in your node project.

> npm install universal-validator

---

## Something went wrong 😵😵😵

If everything went well, you should see something like this:
![error-msg](https://miro.medium.com/max/664/1*-4YdbDS4lH-KbdaDvAgsuw.png)
If not be prepared that there are some gotchas with npm publish. Most of them are reported here:
[Npm Please try using this command again as root/administrator](https://stackoverflow.com/questions/22325031/npm-please-try-using-this-command-again-as-root-administrator/46571636#46571636)