---
title: "How to create a thumbnail image on AWS S3 using an Imaging API"
date: "2019-04-18T22:12:03.284Z"
template: "post"
draft: false
slug: "create-a-thumbnail-image-using-documents-for-imaging"
category: "Technology"
tags:
  - "AWS"
  - "Lambda"
  - "Serverless"
  - "AWS S3"
  - "GrapeCity"
description: "With the ComponentOne scaffolder, you can do a lot more than just traditional data binding. Visual Studio has an inbuilt scaffolder wizard, but it is limited to generate views with only basic HTML support."
socialImage: "https://gccontent.blob.core.windows.net/gccontent/blogs/gcdocuments/20190121-create-a-thumbnail-image-using-documents-for-imaging/image1.png"
---

GrapeCity Document for Imaging (or GcImaging) is a high-speed, feature-rich API to process images in .NET Core targeted applications. You can create, load, modify, crop, resize, convert, and draw images.

Earlier we discussed how GrapeCity Documents can be used to generate documents (PDF and Excel) on top of AWS Lambda. In this article. we'll discuss how we can leverage this compatibility of GrapeCity Documents with Lambda functions and extend this to GcImaging for creating an imaging service over AWS S3 events.

## Designing the service

### GcImaging and Image operations

GcImaging is distributed as standalone NuGet packages, available directly from NuGet.org.

NuGet Package Manager 
> Install-Package GrapeCity.Documents.Imaging 

Dotnet CLI 
> dotnet add package GrapeCity.Documents.Imaging 

In this blog, we'll design a service that will read an image uploaded to S3 and create a grayscale thumbnail with a watermark. Here are the operations that we'll perform:
- Add Watermark on the image
- Convert Image to Grayscale
- Resize the image to a thumbnail

![](https://gccontent.blob.core.windows.net/gccontent/blogs/gcdocuments/20190121-create-a-thumbnail-image-using-documents-for-imaging/image2.png)

### The Workflow

Amazon S3 can publish events (for example, when an object is created in a bucket) to AWS Lambda and invoke your Lambda function by passing the event data as a parameter. This integration enables you to write Lambda functions that process Amazon S3 events. In Amazon S3, you can add a bucket notification configuration that identifies the type of event you want Amazon S3 to publish and the Lambda function you want to invoke. This notification system can then be used to manipulate the image which is uploaded to a bucket.

We can create a Lambda function that this bucket would invoke after an image is uploaded into it. Then this Lambda function can read the image and upload a manipulated image into another bucket. A high-level design of our imaging service would look like the following:

![](https://gccontent.blob.core.windows.net/gccontent/blogs/gcdocuments/20190121-create-a-thumbnail-image-using-documents-for-imaging/image3.png)

The flow of this diagram can be described as:

1. User uploads an image into a specific S3 bucket (say, Source bucket)
2. An event (object created) is raised w.r.t the uploaded image.
3. This event is notified to an AWS Lambda function
    - This invoked function takes S3 event and its object�s key (image unique ID).
    - GcImaging library is used to manipulate this image
    - S3 service then uploads the image to another bucket (say, Target bucket)

### Pre-requisites:

1. Visual Studio
2. Download and Install [AWS Toolkit for Visual Studio](https://aws.amazon.com/visualstudio/).

### Setup AWS Services:

1. Two S3 bucket ("Source Bucket" and "Target Bucket")
    - Open AWS Management Console
    - Select All Services > Storage > S3
    - Click on Create bucket
        - Name: gc-imaging-source-bucket
        - Click on Create bucket
        - Name: gc-imaging-target-bucket
2. An Execution role which gives permission to access AWS resources
    - Open AWS Management Console
    - Open IAM Console
    - Click on 'Create Role' button
    - Select 'AWS Lambda' and press next to select permission
    - Select arn:aws:iam::aws:policy/AWSLambdaExecute policy and press 'Create Role'

The AWSLambdaExecute policy has the permissions that the function needs to manage objects in Amazon S3. Next, we will create a Lambda function which will contain the code to fetch, modify, and upload the image to an S3 bucket.

### Creating a Lambda Function with Visual Studio

You can download the [project](https://github.com/iwannabebot/gc-imaging-aws-lambda-s3) from GitHub

1. Open Visual Studio and create new project 'GCImagingAWSLambdaS3' by selecting C# > AWS Lambda > AWS Lambda Project (.NET Core)
2. Select 'Simple S3 Function' from 'Select Blueprint' dialog.

![](https://gccontent.blob.core.windows.net/gccontent/blogs/gcdocuments/20190121-create-a-thumbnail-image-using-documents-for-imaging/image4.png)

3. Open NuGet Package Manager, search GrapeCity.Documents.Imaging, and install the package.
4. Create a new class GcImagingOperations.cs. GcImagingOperations class would contain static functions that will manipulate your images.
```csharp
using System; 
using System.IO; 
using System.Drawing; 
using GrapeCity.Documents.Drawing; 
using GrapeCity.Documents.Text; 
using GrapeCity.Documents.Imaging; 
namespace GCImagingAWSLambdaS3 
{ 
 public class GcImagingOperations 
 { 
    public static string GetConvertedImage(byte[] stream) 
    { 
         using (var bmp = new GcBitmap()) 
         { 
              bmp.Load(stream); 
              // Add watermark 
              var newImg = new GcBitmap(); 
              newImg.Load(stream); 
              using (var g = bmp.CreateGraphics(Color.White)) 
              { 
                 g.DrawImage( 
                     Image.FromGcBitmap(newImg, true), 
                     new RectangleF(0, 0, bmp.Width, bmp.Height), 
                     null, 
                     ImageAlign.Default 
                     ); 
                  g.DrawString("DOCUMENT", new TextFormat 
                  { 
                      FontSize = 22, 
                      ForeColor = Color.FromArgb(128, Color.Yellow), 
                      Font = FontCollection.SystemFonts.DefaultFont 
                  }, 
                  new RectangleF(0, 0, bmp.Width, bmp.Height), 
                  TextAlignment.Center, ParagraphAlignment.Center, false); 
              } 
              //  Convert to grayscale 
              bmp.ApplyEffect(GrayscaleEffect.Get(GrayscaleStandard.BT601)); 
              //  Resize to thumbnail 
              var resizedImage = bmp.Resize(100, 100, InterpolationMode.NearestNeighbor); 
              return GetBase64(resizedImage); 
         } 
    } 
    #region helper 
    private static string GetBase64(GcBitmap bmp) 
    { 
         using (MemoryStream m = new MemoryStream()) 
         { 
             bmp.SaveAsPng(m); 
             return Convert.ToBase64String(m.ToArray()); 
         } 
    } 
    #endregion 
 } 
}
```
5. Open Function class. Add the following code in its 'FunctionHandler' method:
```csharp
public async Task<string> FunctionHandler(S3Event evnt, ILambdaContext context) 
{ 
 var s3Event = evnt.Records?[0].S3; 
 if(s3Event == null) 
 { 
     return null; 
 } 
 try 
 { 
     var rs = await this.S3Client.GetObjectMetadataAsync( 
         s3Event.Bucket.Name, 
         s3Event.Object.Key); 
     if (rs.Headers.ContentType.StartsWith("image/")) 
     { 
         using (GetObjectResponse response = await S3Client.GetObjectAsync( 
             s3Event.Bucket.Name, 
             s3Event.Object.Key)) 
         { 
             using (Stream responseStream = response.ResponseStream) 
             { 
                 using (StreamReader reader = new StreamReader(responseStream)) 
                 { 
                     using (var memstream = new MemoryStream()) 
                     { 
                         var buffer = new byte[512]; 
                         var bytesRead = default(int); 
                         while ((bytesRead = reader.BaseStream.Read(buffer, 0, buffer.Length)) > 0) 
                             memstream.Write(buffer, 0, bytesRead); 
                         // Perform image manipulation 
                         var transformedImage = GcImagingOperations.GetConvertedImage(memstream.ToArray()); 
                         PutObjectRequest putRequest = new PutObjectRequest() 
                         { 
                             BucketName = DestBucket, 
                             Key = $"grayscale-{s3Event.Object.Key}", 
                             ContentType = rs.Headers.ContentType, 
                             ContentBody = transformedImage 
                         }; 
                         await S3Client.PutObjectAsync(putRequest); 
                     } 
                 } 
             } 
         } 
     } 
     return rs.Headers.ContentType; 
 } 
 catch (Exception e) 
 { 
     throw; 
 } 
}
```
6. You can then publish your function to AWS directly by right-clicking on your project and then selecting 'Publish to AWS Lambda.'

![](https://gccontent.blob.core.windows.net/gccontent/blogs/gcdocuments/20190121-create-a-thumbnail-image-using-documents-for-imaging/image5.png)

### Configure S3 to Publish Events

The event your Lambda function receives is for a single object and it provides information, such as the bucket name and object key name. There are two types of permissions policies that you work with when you set up the end-to-end experience:

Permissions for your Lambda function � Regardless of what invokes a Lambda function, AWS Lambda executes the function by assuming the IAM role (execution role) that you specify at the time you create the Lambda function. Using the permissions policy associated with this role, you grant your Lambda function the permissions that it needs. For example, if your Lambda function needs to read an object, you grant permissions for the relevant Amazon S3 actions in the permissions policy. For more information, see Manage Permissions: Using an IAM Role (Execution Role).

Permissions for Amazon S3 to invoke your Lambda function � Amazon S3 cannot invoke your Lambda function without your permission. You grant this permission via the permissions policy associated with the Lambda function.

The remaining configuration is to setup S3 to publish events to the function we have written. Follow these steps:

1. Open [Amazon S3 Console](https://signin.aws.amazon.com/signin?redirect_uri=https%3A%2F%2Fconsole.aws.amazon.com%2Fs3%2Fhome%3Fstate%3DhashArgs%2523%26isauthcode%3Dtrue&client_id=arn%3Aaws%3Aiam%3A%3A015428540659%3Auser%2Fs3&forceMobileApp=0)
2. Select your bucket gc-imaging-source-bucket.
3. Select Properties > Advanced settings > Events

![](https://gccontent.blob.core.windows.net/gccontent/blogs/gcdocuments/20190121-create-a-thumbnail-image-using-documents-for-imaging/image6.png)

4. Add a notification with following settings
    - Name: GrayScaleImage
    - Events: All object create events
    - Send To: Lambda Function
    - Lambda: GCImagingAWSLambdaS3::GCImagingAWSLambdaS3.Function::FunctionHandler (Lambda Function ARN, [see your project's configuration file](https://github.com/iwannabebot/gc-imaging-aws-lambda-s3/blob/master/GCImagingAWSLambdaS3/aws-lambda-tools-defaults.json))
5. Publish the settings.

Now whenever you upload any image in gc-imaging-source-bucket you will have its grayscale version uploaded into gc-imaging-target-bucket bucket.