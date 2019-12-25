---
title: "Using PDF and Excel API with Azure Cloud Functions"
date: "2017-08-18T22:12:03.284Z"
template: "post"
draft: false
slug: "how-to-use-grapecity-documents-with-azure-functions"
category: "Technology"
tags:
  - "Azure"
  - "Functions"
  - "Serverless"
  - "GraeCity"
description: "GrapeCity Documents are fast and efficient APIs that can provide full control of your Excel and PDF documents. GrapeCity Documents for Excel is a server-side spreadsheet API, that can generate, load, save, convert, calculate, format, parse, and export spreadsheets without having MS Excel dependencies."
socialImage: "https://grapecitycontentcdn.azureedge.net/blogs/gcdocuments/20180613-how-to-use-grapecity-documents-with-azure-functions/blog-grapeCity-documents-azure-functions.png"
---

GrapeCity Documents are fast and efficient APIs that can provide full control of your Excel and PDF documents. GrapeCity Documents for Excel is a server-side spreadsheet API, that can generate, load, save, convert, calculate, format, parse, and export spreadsheets without having MS Excel dependencies.

GrapeCity Documents for PDF is a server-side PDF API, that can generate, load, edit, and save PDF documents. This high-speed, feature-rich PDF document API for .NET Core gives you total control of your PDF documents, with no dependencies on Adobe Acrobat.

The APIs are written in .NET Core, making them platform agnostic. You can use GcDocs in your desktop, browser, and mobile applications (within the norms of a .NET ecosystem).

This article discusses the process of using GrapeCity Documents APIs with Azure Functions, Microsoft's serverless architecture.

Azure Functions allow developers to quickly write a lean API (by auto-scaling on demand and by removing the hassle of designing a server's architecture).

Using GrapeCity Documents with Azure functions

1. Open Visual Studio.
2. Update/ Install Azure Functions and Web Jobs Tools for Visual Studios.
3. Create a new project GrapeCityDocsAzFunc by selecting, Visual C# > Cloud > Azure Functions.
4. Open NuGet Package Manager, search GrapeCity.Documents, and install the packages: GrapeCity.Documents.Pdf and GrapeCity.Documents.Excel.
5. Create an HTTP-triggered Azure function and name it GenerateExcel and add the content from the following code:
```cs
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;
using GrapeCity.Documents.Excel;
using GrapeCity.Documents.Text;
using System.Drawing;

namespace GrapeCityDocsAzFunc
{
    public static class GenerateExcel
    {
        /// <summary>
        /// This function generates a Excel with the text
        /// "Hi there 'name'!" in the cell A1 of first sheet
        /// To invoke: http://localhost:7071/api/GenerateExcel?name=MyName
        /// (replace URL with the one this function runs on, and 'MyName' with the name to use in Excel).
        /// </summary>
        /// <param name="req"></param>
        /// <param name="log"></param>
        /// <returns></returns>
        [FunctionName("GenerateExcel")]
        public static IActionResult Run([HttpTrigger(AuthorizationLevel.Function,
                      "get", "post", Route = null)]HttpRequest req, TraceWriter log)
        {
            // Get parameter
            string name = req.Query["name"];
            string requestBody = new StreamReader(req.Body).ReadToEnd();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            name = name ?? data?.name;
            name = name ?? "GrapeCity";
            if (string.IsNullOrEmpty(name))
                return new BadRequestObjectResult("Please pass a name on the query"
                        + " string or in the request body");
            else
            {
                // Create Excel workbook
                var workbook = new Workbook();
                var worksheet = workbook.ActiveSheet;
                worksheet.Range["A1"].Value = $"Hi there {name}!";
                // Save excel to stream
                MemoryStream ms = new MemoryStream();
                workbook.Save(ms, SaveFileFormat.Xlsx);
                ms.Seek(0, SeekOrigin.Begin);
                // Return file
                FileStreamResult result = new FileStreamResult(ms,
                       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                return result;
            }
        }
    }
}
```
6. Create an HTTP-triggered Azure function and name it GeneratePdf. Add the content from the following code
```cs
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;
using GrapeCity.Documents.Pdf;
using GrapeCity.Documents.Text;
using System.Drawing;

namespace GrapeCityDocsAzFunc
{
    public static class GeneratePdf
    {
        /// <summary>
        /// This function generates a PDF with the text
        /// "Hi there 'name'!".
        /// To invoke: http://localhost:7071/api/GeneratePdf?name=MyName
        /// (replace URL with the one this function runs on, and 'MyName' with the name to use in PDF).
        /// </summary>
        /// <param name="req"></param>
        /// <param name="log"></param>
        /// <returns></returns>
        [FunctionName("GeneratePdf")]
        public static IActionResult Run([HttpTrigger(AuthorizationLevel.Function,
                      "get", "post", Route = null)]HttpRequest req, TraceWriter log)
        {
            // Get parameter
            string name = req.Query["name"];
            string requestBody = new StreamReader(req.Body).ReadToEnd();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            name = name ?? data?.name;
            name = name ?? "GrapeCity";
            if (string.IsNullOrEmpty(name))
                return new BadRequestObjectResult("Please pass a name on the query"
                        + " string or in the request body");
            else
            {
                // Create Pdf Document
                var pdf = new GcPdfDocument();
                pdf.NewPage().Graphics.DrawString($"Hi there {name}!", new TextFormat(), new PointF(72, 72));
                // Save PDF
                var ms = new MemoryStream();
                pdf.Save(ms);
                ms.Seek(0, SeekOrigin.Begin);
                // Return file
                FileStreamResult result = new FileStreamResult(ms, "application/pdf");
                return result;
            }
        }
    }
}
```
7. Run your project and see the results. Your links should look like this:

```
http://localhost:7071/api/GenerateExcel?name=John
http://localhost:7071/api/GeneratePdf?name=Jane
```

> Note: these links will work from your project while debugging.

There are many additional features that can be programmed using GrapeCity Documents APIs. For more information, a complete feature list, and to download a free trial, please visit [GrapeCity Documents](https://www.grapecity.com/en/documents-api).