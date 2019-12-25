---
title: Build a scroll progress bar with vanilla js in 2 minutes or less
date: "2019-07-21T00:00:00.000Z"
template: "post"
draft: false
slug: "build-a-scroll-progress-bar-with-vanilla-js-in-10-minutes-or-less"
category: "Technology"
tags:
  - "Javascript"
  - "CSS3"
  - "Web Development"
description: "Build old medium style scroll progress bar in your web application with this quick walkthrough."
socialImage: "https://cdn-images-1.medium.com/max/800/1*Srp321ROEFy_K1c6Xy7RUw.png"
---

## HTML:
A simple placeholder for progress bar
```html
<div id="_progress"></div>
```

## CSS:
Use var to access a CSS Property ' - scroll'. ' - scroll' stores the scroll percentage for the page.
```css
#_progress {
      --scroll: 0%;
      background: linear-gradient(to right,rgb(0, 143, 105) var(--scroll),transparent 0);
      position: fixed;
      width: 100%;
      height: 5px;
      top:0px;
      z-index: 100;
  }
```

## JS:
On scroll calculate value of ' - scroll' css property.
```js
document.addEventListener(
  "scroll",
  function() {
    var scrollTop =
      document.documentElement["scrollTop"] || document.body["scrollTop"];
    var scrollBottom =
      (document.documentElement["scrollHeight"] ||
        document.body["scrollHeight"]) - document.documentElement.clientHeight;
    scrollPercent = scrollTop / scrollBottom * 100 + "%";
    document
      .getElementById("_progress")
      .style.setProperty("--scroll", scrollPercent);
  },
  { passive: true }
);
```
## Live:

[Live Example](https://codepen.io/iwannabebot/pen/qKqExG)