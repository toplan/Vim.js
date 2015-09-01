# Vim.js
Simple vim for web textarea/input field, to improve writing experience on web.

![demo gif](http://7o503b.com1.z0.glb.clouddn.com/demo.gif)

**Note:**
* This project is in development
* 一般模式/视图模式中的指令需在英文输入法下输入

# usage

```html
...
<input type="text">
<textarea rows=20></textarea>

<script src="vim.dev.js"></script>
<script type="text/javascript">
    vim.open({
        debug : true,
        msg   : function(msg){
            alert('vim.js say:' + msg);
        }
    });
</script>
...

```
# supported browser

* Chrome  v39
* Firefox  v34
* Safari

**Note** Whether to support other browsers still unknown

# supported command

## 1. general mode (一般模式)
|  指令  |        说明             |
| ----- | ----------------------- |
| Esc   | 由编辑模式切换到一般模式    |
| u     | 复原前一个操作，支持多个文本域/输入框独立复原|
|          移动光标:               |
| h或左箭头键(←) | 光标向左移动一个字符   |
| j或下箭头键(↓) | 光标向下移动一个字符   |
| k或上箭头键(↑) | 光标向上移动一个字符   |
| l或右箭头键(→) | 光标向右移动一个字符   |
| 如果想进行多次移动，例如向下移动10行，可以使用"10j"，或"10↓"的组合键|
| 0或功能键[HOME]| 光标移动到当前行的第一个字符处 |
| $或功能键[End] | 光标移动到当前行的最后一个字符处 |
| gg            | 光标移动到第一行     |
|          删除、复制与粘贴:        |
| x或功能键[Delete] | 向后删除一个字符 |
| nx或n[Delete] | 向后删除个字符 |
| y            | 复制当前选中字符 |
| yy           | 复制当前行      |
| dd           | 删除当前行      |
| ndd          | 向下删除n行      |
| p,P          | p向后粘贴，P向前粘贴|

## 2. switch general mode to edit mode (切换到编辑模式)
|  指令  |        说明             |
| ----- | ----------------------- |
| 进入插入或替换的编辑模式            |
| i     | 从目前光标所在出插入       |
| a     | 从目前光标所在的下一个字符处出插入|
| o,O   | o为在目前光标所在处的下一行处插入新的一行，O为在上一行插入新一行|
| r     | 替换光标所在的那一个字符    |

## 3. switch general mode to visual mode (切换到视图模式)
|  指令  |        说明             |
| ----- | ----------------------- |
| v,V   | 切换到视图模式，即多字符选择模式|
| y     | 复制选中的所有字符         |
| x     | 删除选中的所有字符         |
