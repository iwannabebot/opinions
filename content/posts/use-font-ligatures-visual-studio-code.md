---
title: Use font ligatures in Visual Studio Code
date: "2018-05-08T12:00:00.000Z"
template: "post"
draft: false
slug: "use-font-ligatures-visual-studio-code"
category: "Utility"
tags:
  - "Visual Studio Code"
  - "Fonts"
description: "General programming involves using a large number of symbols. Lexically, these symbols are identified by your compiler as individual tokens. But for a human brain, sequences of symbols like <=, != are easier to process as single tokens"
---

General programming involves using a large number of symbols. Lexically, these symbols are identified by your compiler as individual tokens. But for a human brain, sequences of symbols like <=, != are easier to process as single tokens.

Ligatures occur when more than one characters combine to create a single glyph. Ligature converts this:

![](./media/font-ligature-1.png)

to this:

![](./media/font-ligature-2.png)

Can you see what changed?

## Fira Code

Fira Code is an extension of the Fira Mono font containing a set of ligatures for common programming multi-character combinations. This is just a font rendering feature: underlying code remains ASCII-compatible. This helps to read and understand code faster.

![](./media/font-ligature-3.png)

## How to add it to VS Code?

- Open settings.json from File>Preferences>Settings or press Ctrl + , (Cmd + , on Mac)
- Paste the following line

```json
"editor.fontFamily": "Fira Code",
"editor.fontLigatures": true
```

- Restart VS

### Bonus:
Have you tried 'goes to' operator? 
 
```cpp
#include <stdio.h>
int main()
{
    int x = 10;
    while (x --> 0) // x goes to 0
    {
        printf("%d ", x);
    }
}
```

![](./media/font-ligature-4.png)