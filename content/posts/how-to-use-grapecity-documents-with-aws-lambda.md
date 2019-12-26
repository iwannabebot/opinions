---
title: "How to use GrapeCity Documents with AWS Lambda?"
date: "2019-05-18T22:12:03.284Z"
template: "post"
draft: false
slug: "how-to-use-grapecity-documents-with-aws-lambda"
category: "Technology"
tags:
  - "AWS"
  - "Lambda"
  - "GrapeCity"
  - "Web API"
description: "GrapeCity Documents are fast and efficient APIs that provide full control of your Excel and PDF documents. GrapeCity Documents for Excel is a server-side spreadsheet API, that can generate, load, save, convert, calculate, format, parse, and export spreadsheets without having MS Excel dependencies."
socialImage: "https://grapecitycontentcdn.azureedge.net/blogs/activereports/20180614-ar-webinar-files/lambda.png"
---

GrapeCity Documents are fast and efficient APIs that provide full control of your Excel and PDF documents. GrapeCity Documents for Excel is a server-side spreadsheet API, that can generate, load, save, convert, calculate, format, parse, and export spreadsheets without having MS Excel dependencies.

GrapeCity Documents for PDF is a server-side PDF API, that can generate, load, edit, and save PDF documents. This high-speed, feature-rich PDF document API for .NET Standard 2.0 gives you total control of your PDF documents, with no dependencies on Adobe Acrobat.

The APIs are written in .NET Standard 2.0, making them platform agnostic. You can use GcDocs in your desktop, browser, and mobile applications (within the norms of a .NET ecosystem).

In this article, we will walk through the process of using GrapeCity Documents APIs with AWS Lambda, Amazon’s serverless offering. AWS Lambda allows you to write and deploy an API quickly, auto scaling on demand -- removing the hassle of designing a server’s architecture. You can use the full power of .NET Core with AWS Toolkit for VS.

### Using GrapeCity Documents with AWS Lambda

1. Download and Install AWS Toolkit for Visual Studio.
2. Open Visual Studio.
3. Create new project GrapeCityDocsAWSLambda by selecting C# > AWS Lambda > AWS Serverless Application(.NET Core).
4. Select appropriate template or blueprint. In this case, select ASP.NET Core Web API or ASP.NET Core Web App.

![](https://grapecitycontentcdn.azureedge.net/blogs/activereports/20180614-ar-webinar-files/picture1.png)

5. Open NuGet Package Manager, search GrapeCity.Documents, and install the packages: GrapeCity.Documents.Pdf and GrapeCity.Documents.Excel.

![](https://grapecitycontentcdn.azureedge.net/blogs/activereports/20180614-ar-webinar-files/picture2.png)

6. Add new API Controller Class in your project, named GrapeCityDocsController:

7. Replace the content of the class with the following:

```cs
using Microsoft.AspNetCore.Mvc;
using GrapeCity.Documents.Pdf;
using GrapeCity.Documents.Text;
using GrapeCity.Documents.Excel;
using System.Drawing;
using System.IO;
namespace GrapeCityDocsAWSLambda.Controllers
{
    [Route("api/[controller]")]
    public class GrapeCityDocsController : Controller
    {
        [HttpGet("{name}")]
        [Route("GeneratePdf")]
        public IActionResult GeneratePdf(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return new BadRequestObjectResult("Please pass a name on the query"
                        + " string or in the request body");
            }
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

        [HttpGet("{name}")]
        [Route("GenerateExcel")]
        public IActionResult GenerateExcel(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return new BadRequestObjectResult("Please pass a name on the query"
                        + " string or in the request body");
            }
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
8. Rebuild the solution. Run your project and see the results. Your links should look like this:
```
http://localhost:7071/api/GenerateExcel?name=John
http://localhost:7071/api/GeneratePdf?name=Jane
```
> Note: these links will work from your project while debugging.

Your Lambda application is ready now. You can publish this app directly from Visual Studio.