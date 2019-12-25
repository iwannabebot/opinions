---
title: "Configure Bearer middleware for SwaggerUI in ASP.NET Core 2.0"
date: "2018-12-01T23:46:37.121Z"
template: "post"
draft: false
slug: "configure-bearer-middleware-for-swaggerui-in-asp-net-core-2-0"
category: "Technology"
tags:
  - "ASP.NET Core"
description: "Swagger UI allows anyone - be it your development team or your end consumers - to visualize and interact with the API's resources without…"
socialImage: "media/bearer-swaggerui.png"
---

Swagger UI allows anyone - be it your development team or your end consumers - to visualize and interact with the API's resources without having any of the implementation logic in place. It's automatically generated from your Swagger specification, with the visual documentation making it easy for back-end implementation and client-side consumption.

### Method #1:

If you are using an OAuth2/OpenID compliant middleware with the implicit flow, you can configure the security definition directly in your Startup:

[Add OAuth2/OpenID compatible middleware to Swagger](https://gist.github.com/iwannabebot/35cc02f21da4cb52763efa298d00d04f)

This is appropriate when your OAuth2 server has UI which you can redirect from.

### Method #2:

If method #1 is not appropriate for you, but you do have access token then you can use the following code:

[Add Bearer token in header of a Swagger request](https://gist.github.com/iwannabebot/5e9f4087f05b37d285b1a4b557e88e17)

This way access token is asked to be passed with the request every time.