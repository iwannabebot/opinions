---
title: "Debug Node.js application in VSCode!"
date: "2018-10-18T22:12:03.284Z"
template: "post"
draft: false
slug: "debug-node-js-application-in-vscode-in-less-than-3-minutes"
category: "Technology"
tags:
  - "MVC"
  - "GrapeCity"
description: "Debug Node.js application in VSCode in 3 minutes or less"
socialImage: "https://miro.medium.com/max/1200/1*BthNZyR5Mv49JzRda4QjeQ.png"
---

- Open and Update VS Code

![](https://miro.medium.com/max/600/1*nRKtjshQnRwj9AgkcGcM3g.gif)

- Open your Node.js application
- Enable auto attach:
- Ctrl + Shift + P on Windows or ⌘ + ⇧ + P on Mac
- Search for “Debug: Toggle Auto Attach
- Select to toggle

![](https://miro.medium.com/max/591/1*J_EUJS0_-xuEZXQ0Mm1V9g.gif)

- Add breakpoints in VSCode by clicking on left margin of editor.

![](https://miro.medium.com/max/591/1*VtbbM6nSn7WWmCzaSQiJ4g.gif)

- Run Node.js app with inspect switch
```
node hello.js --inspect-brk
```
![](https://miro.medium.com/max/978/1*FFYhxUB6wgZY6hFEiYxnaw.gif)
Done, check the clock :)