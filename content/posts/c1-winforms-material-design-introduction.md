---
title: "Introduction to Material Design in WinForms Apps"
date: "2016-09-01T23:46:37.121Z"
template: "post"
draft: false
slug: "c1-winforms-material-design-introduction"
category: "Technology"
tags:
  - "ComponentOne"
  - "WinForms"
  - "GrapeCity"
description: "Material Design’s immense popularity and utility has compelled ComponentOne Studio to include feature sets to support Material specs. We already support Material design in our ASP.NET MVC and JavaScript controls."
socialImage: ""
---

Material Design’s immense popularity and utility has compelled ComponentOne Studio to include feature sets to support Material specs. We already support Material design in our ASP.NET MVC and JavaScript controls. With growing popularity of Material Design, we know our desktop users will be using it too, and ComponentOne’s WinForms controls support for Material Design specs in 2018 v3 is a big testament to it.

### Adding Material Themes to WinForms apps

ComponentOne Studio Edition for WinForms has now added new Material and Material Dark themes. These themes are available as C1Themes that can be applied on any controls in WinForms edition as well as most of the commonly-used Microsoft controls. These two themes provide two different color schemes, adhere to the same material principle and color specifications, and can even act as base themes for your future material themes. Material theme is a light theme compared to Material Dark.

![Material theme](https://grapecitycontentcdn.azureedge.net/blogs/componentone/20181129-material-theme-designer/image01.png)

![Material Dark theme](https://grapecitycontentcdn.azureedge.net/blogs/componentone/20181129-material-theme-designer/image02.png)

Here's a comparison of how controls look in their default themes and Material theme:

|Control           | Default Theme          | Material Theme         |
|------------------|------------------------|------------------------|
|C1FlexGrid        |WinForms Material Design|WinForms Material Design|
|C1Scheduler       |WinForms Material Design|WinForms Material Design|
|C1Input           |WinForms Material Design|WinForms Material Design|
|Microsoft Controls|WinForms Material Design|WinForms Material Design|

### Create new themes using the WinForms Material Theme Designer

The Material Design color system consists of primary and secondary colors. These colors reflect your application’s branding and styling. ComponentOne's new Material Designer sample is an interactive designer that lets you select primary and secondary accent colors for your Material theme. You can save the theme and apply it in your WinForms application later.

![WinForms Material Designer](https://grapecitycontentcdn.azureedge.net/blogs/componentone/20181129-material-theme-designer/image11.png)

To change the color scheme for your theme, follow these easy steps:

1. Run the Material Theme Designer sample.
2. Click on the “SETTINGS” tab, and select template and accent colors based on your brand/theme.
3. Preview how the theme looks with C1 controls.
4. Click on the cog icon to open the application menu.
5. Click on “Save Theme” to save the theme at your preferred location.
6. See the Material Theme Designer in action:

![](https://grapecitycontentcdn.azureedge.net/blogs/componentone/20181129-material-theme-designer/material-design-walkthrough.gif)

### Apply Material Themes to your WinForms application

Material themes can be applied at design time as well as on runtime. You can apply a theme at design time with the Theme Controller dialog or by modifying the ‘App.config’ file. To apply at runtime, use the C1ThemeController static class to apply themes.

Using Theme Controller Dialog

1. Open a form in your application in the Visual Studio's forms designer.
2. From the designer's toolbox, drag a C1ThemeController and drop it on your form. A ThemeController dialog box appears. This enables you to select the:
    - Application-wide default theme,
    - Current controller’s default theme,
    - Themes for all supporting controls already on the form.
3. In the dialog that pops up, the theme is initially specified as "(none)" for all supporting controls already on the form. This prevents unintentional loss of property settings on those controls.
4. Click the All to (default) button in the dialog so that the default theme is set on all controls. Note: If you've customized some of the controls already, this will be ignored, and the default theme will not be restored.
5. Select Material from the list of available built-in themes. You can also select the material theme you created with Material Theme Designer.
6. Click the All to (default) button as mentioned above, to set the default theme on all supporting controls on the form.
7. Click the OK button to close the dialog and apply the specified theme to the controls on the form.


#### Using App.config file

Include C1.Win.C1Themes.(4/2).dll in your application. You can add the following app settings in your App.Config to apply the basic theme:
```xml
<configuration>  <appSettings>
      <add key="C1ApplicationTheme" value="Material"/>
  </appSettings>
</configuration>
```

#### Using Code
Include C1.Win.C1Themes.(4/2).dll in your application and add the following code in your application before it loads.

```cs
C1Theme theme = C1.Win.C1Themes.C1ThemeController.GetThemeByName(“Material”, false);
C1ThemeController.ApplyThemeToControlTree(control, theme);
```

### Customizing Material themes (Advanced)

C1Theme Designer Application allows easy designing of new themes for any controls in WinForms Edition. It also lets you edit/modify an existing theme to achieve the appearance of your choice, or match with the application theme. You can further use this application to tweak the Material theme to the most granular level allowed by the control.

A theme is an XML file with .c1theme extension that consists of a set of properties and their values (which determines the look and feel of a control). Themes are divided internally into different sections corresponding to different controls. A section Base Theme Properties is accessible to all other controls. This section contains a sub section, Material, which stores the Material properties that can be altered to created different material themes.

For example, let’s start changing our material theme for FlexGrid, where the headers are the primary color.

#### How to use the WinForms Material Theme Designer
1. Open the ComponentOne Theme Designer from ComponentOne Start Menu. Press Ctrl + N or File > New. Select Material as the base theme for your new theme.

![Select base theme](https://grapecitycontentcdn.azureedge.net/blogs/componentone/20181129-material-theme-designer/image12.png)

2. Click on BTP Editor button (1). This opens a new Base Theme Property Editor. Select “Material” properties (2). Here, you can see different colors used in Material:

![Colors used in Material Design](https://grapecitycontentcdn.azureedge.net/blogs/componentone/20181129-material-theme-designer/image13.png)

3. Go to the theme tree and expand C1FlexGrid node.

4. Expand C1FlexGrid > Styles > Fixed node. This node would hold the styles for a fixed (header) cell.

5. Select the ForeColo dropdown to open the color picker.

6. You can select the Reference tab in the picker dropdown to select the primary color.

![Select a primary color](https://grapecitycontentcdn.azureedge.net/blogs/componentone/20181129-material-theme-designer/image14.png)

7. You can save this theme and use it as mentioned in the "Applying Material Themes in your application" section. Your FlexGrid should now have a header color based on your primary color settings.