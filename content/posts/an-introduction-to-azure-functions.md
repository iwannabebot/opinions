---
title: "An Introduction to Azure Functions"
date: "2019-01-01T22:12:03.284Z"
template: "post"
draft: false
slug: "an-introduction-to-azure-functions"
category: "Technology"
tags:
  - "Azure"
  - "Functions"
  - "Serverless"
description: "Functions are feature-packed FaaS offerings from Microsoft Azure that enables you to run your code directly on-demand in Azure’s infrastructure. Think of them as a pieces of code that are invoked by triggers, wherein you do not have to worry about the underlying infrastructure."
socialImage: "https://grapecitycontentcdn.azureedge.net/blogs/grapecity/20181112-an-introduction-to-azure-functions-/azure-header.jpg"
---

Last month, when I wrote a blog on [How to use GrapeCity Documents with Azure Functions](https://www.grapecity.com/en/blogs/how-to-use-grapecity-documents-with-azure-functions), I wanted to write another post to dive into Azure Functions in further detail. If, like me, you aren't a big fan of App Service and Service Fabric because of the limitations they bring, Azure Functions will fit in your metaphoric Goldilocks zone. While App Service is stateless, and Service Fabric is stateful, Functions, on the other hand, gives you the freedom of developing both stateless and stateful microservices. This article is an overview of Azure Functions and discusses why you may want to choose Azure Functions as your microservice.

App Service and Service Fabric expect tons of configurations resulting in a steep learning curve and decreased productivity. Functions, in comparison, are like an easy switch for quick development. It can be argued that Functions are opiniated to an extent. Due to this, you benefit with faster development. Also, you have complete freedom of architecting your use cases with any third-party dependencies, in almost any major programming language.

Although Functions may not provide everything that App Services and Service Fabric can offer, in most cases, they are a more a practical and productive choice.

## What are Azure Functions?

Functions are feature-packed FaaS offerings from Microsoft Azure that enables you to run your code directly on-demand in Azure’s infrastructure. Think of them as a pieces of code that are invoked by triggers, wherein you do not have to worry about the underlying infrastructure. They scale on demand and you pay only for what you get. This frees you from countless design decisions that you would otherwise have to make to write a cost-efficient service.

You can choose [any programming language of your choice](https://docs.microsoft.com/en-us/azure/azure-functions/functions-infrastructure-as-code) from C#, F#, Node.js, Java, Python, PHP, etc., and bring in dependencies from NPM, NuGet, and Maven. With Function’s small unit of deployment, you can minimize the efforts taken to build and configure your DevOps pipeline. Azure Functions' core concept revolves around piece of code or function. This function, when combined with events and data, gives a complete picture of what Azure Functions should be.

![](https://grapecitycontentcdn.azureedge.net/blogs/grapecity/20181112-an-introduction-to-azure-functions-/2.png)

Let’s understand about each of these in little detail.

### What is a function?

A function is a central concept in Azure Functions. You can write code for a function, in any language of your choice, and save the code and configuration files in the same folder. [Azure Functions Runtime](https://docs.microsoft.com/en-us/azure/azure-functions/functions-runtime-overview) reads the configuration file to determine the events to be monitored and how to pass data into and return data from function execution.

### What are triggers?
Triggers are ways to start the execution of your code. A function must always have a single trigger. Triggers have data which becomes the payload that invokes functions. There are multiple triggers available with Azure Functions.

The following are several triggers, along with the information on when they trigger.

- HTTP: Runs when an HTTP endpoint is requested. These functions are simple RESTful HTTP end points. You invoke them like a RESTful web API. These triggers are created when you need some HTTP service without having to recreate underlying infrastructure. A very common example is writing a web proxy over your services. You can use them for application-level load balancing.
The following function can reroute your API requests based on a request parameter.

The following function can reroute your API requests based on a request parameter.

```cs
[FunctionName("MyProxyService")]
public static async Task<HttpResponseMessage> Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)]HttpRequestMessage req, 
    TraceWriter log)
{
    log.Info("Requsting proxy service.");

    // parse query parameter
    string region = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "region", true) == 0)
        .Value;

    switch (region)
    {
        case "us":
            myRegionEndPoint = "http://myservice.companyname.com/us/";
            break;
        case "jp":
            myRegionEndPoint = "http://myservice.companyname.com/jp/";
            break;
        default:
            req.CreateResponse(HttpStatusCode.BadRequest, "Please pass a valid region");
            break;

    }
    using (var client = new HttpClient())
    {
        var request = new HttpRequestMessage(new HttpMethod("PATCH"), myRegionEndPoint);

        try
        {
            response = await (await client.SendAsync(request)).Content.ReadAsStringAsync());
            req.CreateResponse(HttpStatusCode.OK, response);
        }
        catch (HttpRequestException ex)
        {
            req.CreateResponse(HttpStatusCode.BadRequest, "Please pass a valid region");
        }
    }
}
```

- Timer: Runs on a regular schedule. Their functions trigger on a predefined schedule. You use CRON expressions to decide schedule duration. Unlike the queue trigger, the timer trigger doesn't retry after a function fails. When a function fails, it isn't called again until the next time on the schedule. A good example can be seen in a walk through below, where we are generating a PDF report on a schedule.
```cs
public static void Run([TimerTrigger("0 */5 * * * *")]TimerInfo myTimer, TraceWriter log)
{
    if(myTimer.IsPastDue)
    {
        log.Info("Timer is running late!");
    }
    log.Info($"C# Timer trigger function executed at: {DateTime.Now}");
}
```
- Webhook: Runs when a webhook like GitHub is consumed. Azure Functions currently support three types of Webhook function triggers:
    - Generic Webhook
    - GitHub Webhook
    - Slack Webhook
```cs
[FunctionName("GitHubWebhookTriggerCSharp ")]
public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{

  // Get request body
  dynamic data = await req.Content.ReadAsAsync<object>();

  // Extract github comment from request body
  string gitHubComment = data?.comment?.body;

  return req.CreateResponse(HttpStatusCode.OK, "From Github:" + gitHubComment);
}
```

- Blob: Runs when a file is uploaded in Azure Blob Storage
```cs
[FunctionName("BlobTriggerCSharp")]        
public static void Run([BlobTrigger("samples-workitems/{name}")] Stream myBlob, string name, TraceWriter log)
{
    log.Info($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");
}
```
- CosmosDb: Runs when data is added or changed in Azure CosmosDb.
```cs
[FunctionName("CosmosTrigger")]
public static void Run([CosmosDBTrigger(
            databaseName: "ToDoItems",
            collectionName: "Items",
            ConnectionStringSetting = "CosmosDBConnection",
            LeaseCollectionName = "leases",
            CreateLeaseCollectionIfNotExists = true)]IReadOnlyList<Document> documents,
            TraceWriter log)
{
    if (documents != null && documents.Count > 0)
    {
        log.Info($"Documents modified: {documents.Count}");
        log.Info($"First document Id: {documents[0].Id}");
    }
}
```
- Blob: Runs when a file is uploaded in Azure Blob Storage
```cs
[FunctionName("BlobTriggerCSharp")]        
public static void Run([BlobTrigger("samples-workitems/{name}")] Stream myBlob, string name, TraceWriter log)
{
    log.Info($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");
}
```
 - Queue: Runs when a message is added or removed from Azure Queue Storage
```cs
[FunctionName("QueueTrigger")]
public static void QueueTrigger(
        [QueueTrigger("myqueue-items")] string myQueueItem,
        TraceWriter log)
{
    log.Info($"C# function processed: {myQueueItem}");
}
```
 - Event Hub: Runs when an event is registered in Azure Event Hub
```cs
[FunctionName("EventHubTriggerCSharp")]
public static void Run([EventHubTrigger("samples-workitems", Connection = "EventHubConnectionAppSetting")] string myEventHubMessage, TraceWriter log)
{
    log.Info($"C# Event Hub trigger function processed a message: {myEventHubMessage}");
}
```
 - Service Bus: Runs when a topic is updated on Azure Service Bus
```cs
[FunctionName("ServiceBusQueueTriggerCSharp")]
public static void Run(
    [ServiceBusTrigger("myqueue", AccessRights.Manage, Connection = "ServiceBusConnection")]
    string myQueueItem,
    Int32 deliveryCount,
    DateTime enqueuedTimeUtc,
    string messageId,
    TraceWriter log)
{
    log.Info($"C# ServiceBus queue trigger function processed message: {myQueueItem}");
    log.Info($"EnqueuedTimeUtc={enqueuedTimeUtc}");
    log.Info($"DeliveryCount={deliveryCount}");
    log.Info($"MessageId={messageId}");
}
```

### What are bindings?

Bindings are ways to simplify coding for data input and output. Bindings are optional, and a function can have multiple input and output bindings.

Azure Functions integrate with most of the Azure services as well as some of the third-party services. These integrations can behave as triggers as well as bindings for your function.

Types of Azure integrations
 - Azure Cosmos DB
 - Azure Event Hubs
 - Azure Event Grid
 - Azure Mobile Apps
 - Azure Navigation Hubs
 - Azure Service Bus
 - Azure Storage

Suppose you want to write a new row to the Azure Table storage whenever a new message appears in Azure Queue storage. This scenario can be implemented using an Azure Queue storage trigger and an Azure Table storage output binding.

### Building Azure Functions

Functions are good solution for integrating systems, process granular data, build small microservices and work with IoTs. To facilitate various types of scenarios, you have numerous triggers.

Let’s start with a problem statement: "Send a weekly sales report to all the stakeholders of product X."

From this statement, you can identify that you must write some code that would run in a schedule and send a certain report to a recipient. It is important to understand that problem can be solved by a function. It is trivial to write a code that generate some report. However, to schedule them in an order in a reliable way can be tricky. Function uses CRON expression to configure schedules.

A CRON expression looks like this:
```
{second} {minute} {hour} {day} {month} {day-of-week}
```

Some CRON examples are:

| Example | When triggered |
|---------|----------------|
|0 0 12 ? | Fire at 12:00 PM (noon) every day |
|0 15 10 ? | Fire at 10:15 AM every day |
|0 15 10 L ? | Fire at 10:15 AM on the last day of every month |
|0 15 10 ? 6L 2002-2005 | Fire at 10:15 AM on every last friday of every month during the years 2002, 2003, 2004, and 2005 |
|0 15 10 ? 2005 | Fire at 10:15 AM every day during the year 2005 |
|0 14 * ? | Fire every minute starting at 2:00 PM and ending at 2:59 PM, every day |
|0 11 11 11 11 ? | Fire every November 11 at 11:11 AM |

Web services are usually invoked outside its environment, irrespective of its design and architecture. So, if you are writing a web service you should then have to create some kind of ‘executor’ or ‘invoker’ process. A desktop service on other hand needs a compute instance to run. So, if you do not have an idle or unutilized VM, I think buying a new VM for a single service is an overkill.

A Timer Function fits perfectly into out use case, because of the advantage it brings with inbuilt schedulers. We will create an Azure Functions app that contains a function which would generate a sales report from a database. You may use Visual Studio or Visual Studio Code to build an Azure Functions Project. Let’s look at both of them.

### Using Azure and Visual Studio Code

Pre-requisites:

 - Visual Studio Code and [NuGet Package Manager for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=jmrog.vscode-nuget-package-manager)
 - [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local/)
 - [Azure Functions Extensions for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
 - [Enable debugging in 64-bit](https://github.com/Microsoft/vscode-azurefunctions/blob/master/docs/func64bit.md/)

 1. Create new Azure Functions Project. Start Visual Studio Code and click on Azure Icon on the activity bar. If you do not see the Azure icon, you should install Azure Functions Extensions for VS Code, the link to which is provided above. Click on the Functions folder iconto create a new Functions project. Select C# as your language.
 2. Add Azure Functions. Click on Functions iconto create a new function “GenerateScheduleReport”. You should be choosing TimerTriggered template with Anonymous access rights.
 3. Generate Report. Write you report generation code in a C# class.
```cs
using System.Threading.Tasks;
namespace GrapeCity.Blogs
{
    public class Report
    {
        public async Task Generate ()
        {
            // Write your report creation logic here
        }
    }
}
```
 4. Schedule the report. Since we must schedule the report weekly, we are choosing Monday 8 AM as report generation time. The CRON to be expected here is: ```0 0 8 ? * MON *```
 ```cs
 using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json.Linq;

namespace GrapeCity.Blogs
{
    public static class GenerateScheduleReport
    {
        [FunctionName("GenerateScheduleReport ")]
        public static async Task<HttpResponseMessage> Run([TimerTrigger("0 0 8 ? * MON *")]TimerInfo myTimer, TraceWriter log)
        {
            if(myTimer.IsPastDue) {
               Report report = new Report();
               await report.Generate();
            }
        }
    }
}
```
 5. Run the report. Press F5 to build and run you function locally.

### Using Azure Functions and Visual Studio:

Pre-requisites:
 - Visual Studio 2015+
 - Azure Functions Tools for Visual Studio

For Visual Studio, all the steps are identical as above; however, the step to create a Functions project is little different. See the following steps that are different in Visual Studio.
 - Create new project by selecting Visual C#>Cloud>Azure Functions.
 - A dialog box would appear. Select Http trigger template with Anonymous access rights in your 'New Project' dialog box.
 - You can also set Storage Account to None, since we are not going to use Azure Storage in this example.
 - Click OK to create the project.
 - Follow the steps from above
 - Press F5 to build and run you function locally.

## Choosing an appropriate plan for your Functions

Azure provide you two kinds of plans for Functions: App Service Plan and Consumption Plan.Note: With a Consumption Plan you are billed only when your function is executed. The Consumption Plan allocates computation power while your code is running. With this, you are billed only when your function is executed. Your application is scaled out when your function needs additional power and is scaled down when your code is not running.

In an App Service Plan, you can scale between tiers to allocate different amount of resources. Your app runs on VMs on Basic, Standard, Premium, and Isolated SKUs. This is also the case in App Service apps. You should be choose the App Service Plan only if your function is running continuously, or if the Consumption Plan has any limitation. In most of the cases, developers tend to choose Consumption Plans.

If you run on an App Service Plan, you should enable the Always on setting so that your function app runs correctly. On an App Service Plan, the Functions Runtime goes idle after a few minutes of inactivity, so only HTTP triggers will "wake up" your functions. Always on is available only on an App Service Plan. On a Consumption Plan, the platform activates function apps automatically.

## Why should you choose Azure Functions as your microservice?

Following are the set of conditions to help you decide if your scenario fits Azure Functions’ capabilities.

### 1. Platform Lock-In

> You are going to choose Azure as your cloud solution	

Azure Functions are platforms locked in with Azure. This means, once your app is written and deployed, you cannot move to any other serverless or computing solution. You can always update the code, but a function can be deployed only on Azure Functions. There are some third-party packages like serverless, which allow some degree of platform independence. However, the binding technique is unique to Azure. This may of course change in the future, since Functions are developed in open-source. If choosing Azure is not an issue for you (and it won’t be if you are reading this), Functions is for you.	

### 2. Small unit of deployment

> You want to develop an independent micro-service	

Functions are small and deployed singularly. Their design favours you to write a simple method call. You can have a bunch of functions written, and deployed independently as Azure Functions. With an App Service or Service Fabric, their focus is more on deploying a full-scale service. If they are overkill for your scenario, Functions are for you.	
	
### 3. Zero-Configuration

> You don’t care aabout the platform configuration

Functions on App Service Plan have some control over the amount of resource you would need. However, for most of the cases, there is hardly any configuration required or control provided for and by Azure to you. Serverless systems are supposed to abstract the infrastructure. You cannot maintain a service pool since only one would be provided to you. If these are things that don’t seem necessary to you, you just want to run your code, Functions are for you.	

### 4. Gentle learning Curve

> You want to write code in the technology of your choice

For most of us, learning new technology comes with the profession. Most of us don’t dread it. But for the sake of productivity, learning new technology creates unnecessary overhead in a software lifecycle which can also be avoided. Functions don’t require learning any new framework or design patterns. If you can write a method in any of the language it supports, you can write Functions.	

### 5. Reuse dependencies from NuGet, Maven, NPM

> You want to use your own dependencies and design framework/patterns

You can bring your dependencies from your favourite package managers. Depending on the technology you have selected, you can choose among NuGet, Maven, Pip, NPM, and many more.

Choosing Azure Functions can be the best (or worst) design decision you have taken, depending on your use case. Most of the time, Functions can allow you write quickly, without the overhead of customization and configurations. You can easily integrate multiple Azure or third-party services with an unprecedented degree of ease.

With so many SaaS vendors and providers moving towards a more decoupled and independent architecture, Functions are becoming more relevant for you every day.