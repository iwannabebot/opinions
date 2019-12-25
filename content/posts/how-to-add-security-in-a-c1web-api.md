---
title: "How to Add Security in C1 Web API?"
date: "2018-10-18T22:12:03.284Z"
template: "post"
draft: false
slug: "how-to-add-security-in-a-c1web-api"
category: "Technology"
tags:
  - "ComponentOne"
  - "GrapeCity"
  - "Web API"
description: "The GrapeCity ComponentOne Studio Web API (C1WebApi) provides a set of RESTful HTTP services layered over ASP.NET and ASP.NET Core Web API. It supports security from its feature set, allowing the flexibility of an out-of-the-box customization."
socialImage: "https://grapecitycontentcdn.azureedge.net/blogs/componentone/20180615-secure-c1webapi-with-custom-oauth2-part1/header.png"
---

The GrapeCity ComponentOne Studio Web API (C1WebApi) provides a set of RESTful HTTP services layered over ASP.NET and ASP.NET Core Web API. It supports security from its feature set, allowing the flexibility of an out-of-the-box customization.

A Web API acts as a backbone of an application. Web APIs address the need for maintainability, modularity, and scalability. With the arrival of service-oriented architecture and its various advantages, an increasing number of developers are opting for its implementation. In such applications, micro-services are decoupled based on their role; many times, security is seperated into a different micro-service.

Many SOA applications looks like this:

![](https://grapecitycontentcdn.azureedge.net/blogs/componentone/20180615-secure-c1webapi-with-custom-oauth2-part1/1.png)

Interactions between applications and micro-services are stateless. Each layer must protect the resource by implementing authorization/authentication. Traditional security methods (like digests and session tokens) are not ideal.

A set of protocols known as Open Authentication (OAuth) were written to address this issue. OAuth2 has developed shortly afterward. OAuth2 is an industry standard authorization protocol, specifying how a third-party accesses an HTTP service on behalf of an owner or a client. This protocol has distinct definitions for clients, user agents, resources, and resource owners. It uses hashed tokens as a mean of access control.

Specifications of OAuth2 are always evolving and can be found here. Thanks to several implementations by industry giants, such as Google and Facebook, OAuth2 is rapidly replacing traditional application security.

Redesigning this architecture to support OAuth2 token service leads to the following architecture:

![](https://grapecitycontentcdn.azureedge.net/blogs/componentone/20180615-secure-c1webapi-with-custom-oauth2-part1/2.png)

Above, the red arrows are unauthorized requests and the green arrows are authorized after a bearer token is added to its header.

It is essential to understand that the token service would be singular and reusable by all the APIs. Security contains two principal concerns: Authorization and Authentication.

### Authentication in Web API security
Authentication validates the identity of a user who is accessing the system to see if that end user has valid credentials. Popular protocols include: OpenId Connect.

### Authorization in Web API security
Authorization is the second step after authentication to achieve security. Authorization is the process of identifying whether some user can access a resource. Authorization identifies what permissions the authenticated user has to access web resources. Popular protocols include OAuth and OAuth2.

#### Create secure token service

Ideally, a Secure Token Service (STS) is written separately from the services. Developed by Brock Allen and Dominick Baier, IdentityServer is an excellent implementation of OAuth2 in .NET Core 2.0.

For the sake of brevity, we'll pull a quick start project from IdSrv4’s samples.

The only customization we'll need to do is to change the API resources and client’s configuration. The finished configuration would look like this:

```cs
public static IEnumerable<ApiResource> GetApiResources()
{
    return new List<ApiResource>
    {
        new ApiResource("c1webapi", "C1WebAPI")
    };
}

// clients want to access resources (aka scopes)
public static IEnumerable<Client> GetClients()
{
    // client credentials client
    return new List<Client>
    {
        new Client
        {
            ClientId = "client",
            AllowedGrantTypes = GrantTypes.ClientCredentials,

            ClientSecrets = 
            {
                new Secret("secret".Sha256())
            },
            AllowedScopes = { "c1webapi" }
        },

        // resource owner password grant client
        new Client
        {
            ClientId = "ro.client",
            AllowedGrantTypes = GrantTypes.ResourceOwnerPassword,

            ClientSecrets = 
            {
                new Secret("secret".Sha256())
            },
            AllowedScopes = { "c1webapi" }
        },

        // OpenID Connect implicit flow client (MVC)
        new Client
        {
            ClientId = "mvc",
            ClientName = "MVC Client",
            AllowedGrantTypes = GrantTypes.Implicit,

            RedirectUris = { "http://localhost:5002/signin-oidc" },
            PostLogoutRedirectUris = { "http://localhost:5002/signout-callback-oidc" },

            AllowedScopes =
            {
                IdentityServerConstants.StandardScopes.OpenId,
                IdentityServerConstants.StandardScopes.Profile
            }
        }
    };
}
```

### Secure C1WebApi Controllers
ASP.NET provides inbuilt filters that insert features on MVC/WebApi controllers and endpoints.

The Authorize attribute is a filter that adds authorization middleware in your service. To add an identity server to your container, add the following in ConfigureServices method to your API:

```cs
services.AddAuthorization();

services.AddAuthentication("Bearer")
    .AddIdentityServerAuthentication(options =>
    {
        options.Authority = "http://localhost:5000";
        options.RequireHttpsMetadata = false;
        options.ApiName = "c1webapi";
    });
```
Add the following in Configure method:
```cs
app.UseAuthentication();
```

Configure method is called at runtime to configure HTTP request pipeline. Then, your service will be configured with STS.

Note: C1WebApi controllers are inserted into the container at runtime; filters cannot be added directly. To add Authorize filter, we'll need to manually add C1 controllers in the API.

Resolve controllers C1WebApi endpoints with custom C1WebApi controllers. Add new controllers in your project.

Name them:

```
C1BarCodeController 
C1DataEngineController
C1DocumentController
C1ExcelController
C1ImageController
C1PdfController
C1ReportController
```
```cs
[Authorize]
[Route("api/barcode")]
public class C1BarCodeController : C1.Web.Api.BarCode.BarCodeController
{
}
[Authorize]
[Route("api/dataengine ")]
public class C1DataEngineController : C1.Web.Api.DataEngine.DataEngineController
{
}
[Authorize]
[Route("api/document")]
public class C1DocumentController : C1.Web.Api.Document.DocumentController
{
}
[Authorize]
[Route("api/excel")]
public class C1ExcelController : C1.Web.Api.Excel.ExcelController
{
}
[Authorize]
[Route("api/image")]
public class C1ImageController : C1.Web.Api.Image.ImageController
{
}
[Authorize]
[Route("api/pdf")]
public class C1PdfController : C1.Web.Api.Pdf.PdfController
{
}
[Authorize]
[Route("api/pdf")]
public class C1ReportController : C1.Web.Api.Report.ReportController
{
}
```

Note: If the new controller’s route collides with default controllers of C1WebApi, it will throw an AmbiguousActionException at runtime.

To solve this issue, you can either change your controller to a different route, (for example v2/api/excel) or use ControllerFeatureProvider to remove all the default C1WebApi controllers.

If this happens, you'll have to update all the views with the new route. However, if you want to have the same route, you must create a new class inheriting from ControllerFeatureProvider, as shown below:

```cs
public class C1ControllerFeatureProvider : Microsoft.AspNetCore.Mvc.Controllers.ControllerFeatureProvider
{
    protected override bool IsController(System.Reflection.TypeInfo typeInfo)
    {
        var result = base.IsController(typeInfo);
        if (result)
        {
            if (typeof(C1.Web.Api.BarCode.BarCodeController) == typeInfo)
            {
                return false;
            }
            else if (typeof(C1.Web.Api.DataEngine.DataEngineController) == typeInfo)
            {
                return false;
            }
            else if (typeof(C1.Web.Api.Document.DocumentController) == typeInfo)
            {
                return false;
            }
            else if (typeof(C1.Web.Api.Excel.ExcelController) == typeInfo)
            {
                return false;
            }
            else if (typeof(C1.Web.Api.Image.ImageController) == typeInfo)
            {
                return false;
            }
            else if (typeof(C1.Web.Api.Pdf.PdfController) == typeInfo)
            {
                return false;
            }
            else if (typeof(C1.Web.Api.Report.ReportController) == typeInfo)
            {
                return false;
            }
        }
        return result;
    }
}
```
Then add this in ConfigureServices,
```cs
services
    .AddMvc()
    .ConfigureApplicationPartManager(manager =>
    {
        if(manager.FeatureProviders.Any(iafp => iafp.GetType() == typeof(ControllerFeatureProvider)))
        {
            manager.FeatureProviders.Remove(
                manager.FeatureProviders.First(iafp => iafp.GetType() == typeof(ControllerFeatureProvider))
                );
        }
        manager.FeatureProviders.Add(new C1ControllerFeatureProvider());
    });
```

You have successfully configured a token service as authorization middleware for your API. Whenever you try to access C1WebApi endpoints without adding a valid bearer token in your request header, you'll get a 401 error.