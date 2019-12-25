---
title: "An Introduction to Material Design for ComponentOne Studio - MVC Edition"
date: "2018-02-02T22:40:32.169Z"
template: "post"
draft: false
slug: "an-introduction-to-material-design-for-componentone-studio-mvc-edition"
category: "Technology"
tags:
  - "Material Design"
  - "ComponentOne Studio"
  - "MVC"
  - "GrapeCity"
description: "Material design is a versatile set of guidelines that support the best practices of user interface design. It provides uniform specifications for themes, layouts, animation, components, and…"
socialImage: "/media/c1-material.png"
---

Material design is a versatile set of guidelines that support the best practices of user interface design. It provides uniform specifications for themes, layouts, animation, components, and typography to let you express your brand with confidence. Material design is inspired by the physical world and its texture - how they reflect light, and cast shadows with a minimalist and clean approach.

Google announced Material and it's specification in mid-2014, defining Material as based on paper and ink with advanced implementations. As of today, all of Google's mobile applications for Android have applied Material.

## How to use Material Design with ComponentOne MVC Controls

[ComponentOne MVC](https://www.grapecity.com/en/aspnet-mvc) controls lets you add Material design look and feel by using [Material Design Lite](https://getmdl.io/started/index.html#download). It does not rely on any JS framework. It only takes two steps to add material support in your application. Our material theme should work in all evergreen browsers alike, with full support in Chrome for Android and Mobile Safari. For older browsers like IE9, we degrade to CSS only.

There are two ways to use our inbuilt Material themes: with HTML/tag helpers and with our theme builder.

### ComponentOne MVC HTML/Tag Helpers

All the resources used with ComponentOne controls are registered when you create a web application using our MVC template. By default, when you create an MVC application with ComponentOne controls, it uses a default theme. You are provided many different pre-defined visual themes. The themes are consistent across all the ComponentOne controls for your project.

- If you are using [ComponentOne Template](http://help.grapecity.com/componentone/NetHelp/c1mvchelpers/webframe.html#Using%20C1%20Template.html) you can use the application Wizard to set the theme.
![](https://miro.medium.com/max/840/1*-RciWmhdAsN-qfzV-sxnJg.png)
- If you are using a [Visual Studio Template](http://help.grapecity.com/componentone/NetHelp/c1mvchelpers/UsingVSTemplate.html) you can set material theme manually while [registering resources](http://help.grapecity.com/componentone/NetHelp/c1mvchelpers/RegisteringResources.html) for your application.

To apply material theme in your application, you need to add the following code in _Layout.cshtml (Views/Shared/_Layout.cshtml)

[See Example](https://gist.github.com/iwannabebot/04ac1db9b5bafbc280979a8b9a4fbcff)

Material themes are written in a specific format to allow several combinations of primary/accent colours. The format is:

```js
material[.{{primary_colour}}-{{secondary_colour}}]
```

### Using a Theme Builder
We've also made an [interactive theme builder](https://demos.wijmo.com/5/Angular/MaterialDesignLite/MaterialDesignLite/). This builder allows you to choose colors and preview your theme with our controls before adding them to your application. If you are using a combination (of primary and accent colors) you would have to include a specific CSS file, compared to some other combination. Therefore, we felt it was necessary to provide you an interactive theme builder, that will decide what resources you need to download and include in you web application.
You can also preview how these different combinations of primary and accent colours looks with C1 MVC controls.

Follow these steps:
- Include the Material Lite JavaScript file in _Layout page of your application.
- Use our theme builder to decide some colour combinations. After deciding some arbitrary colour combination, you would be provided with a code to include in your layout page. 
[See Example](https://gist.github.com/iwannabebot/8b510f41e0ccef2f2f53eab4a87acc50)
- You can optionally include Material Icons in your application:
[See Example](https://gist.github.com/iwannabebot/e99e4697c13389f4813ed7498ddd2afe)

[Here is a live version of our MVC controls with a Material theme.](https://demos.componentone.com/ASPNET/MVCExplorer/FlexGrid?theme=material.indigo-pink)

*I published this article originally on [GrapeCity’s](https://www.grapecity.com/en/) website as [An Introduction to Material Design for MVC](https://www.grapecity.com/en/blogs/introduction-to-material-design-for-mvc). This blog is a reading material for developers using [ComponentOne Studio — MVC Edition](https://www.grapecity.com/en/aspnet-mvc)*