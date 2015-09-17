# Intro

Simple and lightweight Vim for web `textarea` and `input` field, to improve writing experience on web.

[Demo here](http://toplan.github.io/vimjs/index.html)

**Note:**

* This project is not to replace powerful IDEs on web pages,
  but rather as a web side writing(such as blogging, writing notes, ect.) of enhancements.

* This project is in development, there will be some improvements and new features.

* Please use the vim instructions in the English input method.

![demo gif](http://7o503b.com1.z0.glb.clouddn.com/demo.gif)

[中文文档](https://github.com/toplan/Vim.js/blob/master-dev/README_CN.md)

# Usage

The `vim.min.js` only 19kb, and no any dependencies.

```html
<script src="/path/to/vim.js"></script>
<script type="text/javascript">
    vim.open({
        debug   : true,
        showMsg : function(msg){
            alert('vim.js say:' + msg);
        }
    });
</script>
```

# Building
```
//install
npm install vim.js

//watch
npm run dev

//build
npm run build

//build min js file
npm run build_min
```

# Browser support

* Chrome  v39
* Firefox  v34, v40
* Safari

**Note:** Whether to support other browsers still unknown

# Features

## 1. general mode
|  Command |    Description |
| ----- | ----------------------- |
| Esc   | switch to general mode  |
| u     | returned to the previous operation |
| Move the cursor :               |
| h or ← | move left one character |
| j or ↓ | move down one line     |
| k or ↑ | move up one line       |
| l or → | move right one character |
| supported nh,nj,nk,nl           |
| 0 or [HOME]| move to head of line |
| $ or [End] | move to end of line |
| G          | go to end |
| gg         | go to first line |
| delete, copy and paste:        |
| x or [Delete] | delete single character |
| nx or n[Delete] | delete `n` characters |
| yy         | copy current line |
| nyy        | copy `n` lines    |
| dd         | delete current line |
| ndd        | delete `n` lines  |
| p,P        | `p` paste after，`P` paste before|
| w or W     | move to next word |
| supported nw and nW            |
| yw or yW   | copy one word  |
| nyw or nyW | copy `n` words |
| dw or dW   | delete one word  |
| ndw or ndW | delete `n` words  |

## 2. edit mode
|  Command |    Description  |
| ----- | ----------------------- |
| i     | insert |
| a     | append |
| o     | open line below and enter edit mode |
| O     | open line after and enter edit mode |
| r     | replace one character |

## 3. visual mode
|  Command |    Description |
| -----  | ----------------------- |
| v or V | switch ot visual mode   |
| y      | copy the selected text  |
| x or d | delete the selected text|