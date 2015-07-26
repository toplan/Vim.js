
/*
 | Vim.js | v 0.1
 | vi/vim functionality to textarea and input.
 |------------------------------------
 | Created by top on 15-7-25.
 |
 */

window.vim_test = (function () {

    const  COMMAND = 'COMMAND_MODE';
    const  INPUT   = 'INPUT_MODE';
    const  VISUAL  = 'VISUAL_MODE';

    var config = undefined;
    var vim = undefined;
    var textUtil = undefined;
    var clipboard = undefined;

    var _special_keys = {
        8:'Backspace',
        9:'Tab',
        13:'Enter',
        27:['Escape', 'switchModeToCommand'],
        33:'PageUp',
        34:'PageDown',
        35:'End',
        36:'Home',
        37:'Left',
        38:'Up',
        39:'Right',
        40:'Down',
        45:'Insert',
        46:'Delete'
    };

    var _vim_keys = {
        //0:move to current line head
        48:{name:'0', 0:'moveToCurrentLineHead'},
        //&:move to current line tail
        55:{name:'7', shift_7:'moveToCurrentLineTail'},
        //append
        65:{
            name:'a',
            a:'append',
            A:'appendLineTail'
        },
        //insert
        73:{
            name:'i',
            i:'insert',
            I:'insertLineHead'
        },
        //down
        74:{
            name:'j',
            j:'selectNextLine'
        },
        //up
        75:{
            name:'k',
            k:'selectPrevLine'
        },
        //left
        72:{
            name:'h',
            h:'selectPrevCharacter'
        },
        //right
        76:{
            name:'l',
            l:'selectNextCharacter'
        },
        //paste
        80:{
            name:'p',
            p:'pasteAfter',
            P:'pasteBefore'
        },
        //copy char
        89:{
            name:'y',
            y:'copyChar'
        }
    };

    function _init (conf) {
        config = conf;
        textUtil = new Text(config.el);
        vim = new Vim();
        _bind();
    }

    function _bind() {
        config.el.onclick = _on_click;
        config.el.onkeydown = _on_key_down;
        Event.on('reset_cursor_position', function (e) {
            if (vim.isCommandMode()) {
                vim.resetCursorByMouse();
            }
        });
        Event.on('input', function (ev) {
            var code = ev.keyCode || ev.which || ev.charCode;
            console.log('mode:'+vim.currentMode);
            console.log('input code:' + code);
            console.log('_clipboard:'+ clipboard);
            if (_filter(code)) {
                //这里要检测是否是相邻键组合键(如yy,dd,dw...), 并修改code值
                //todo
                _route(code, ev);
            }

        })
    }

    function _on_click(e) {
        var ev = e || event || window.event;
        Event.fire('reset_cursor_position', ev)
    }

    function _on_key_down(e) {
        var ev = e || event || window.event;
        Event.fire('input', ev);
        if (vim.isCommandMode()) {
            if (ev.preventDefault) {
                ev.preventDefault();
            } else {
                ev.returnValue = false;
            }
            return false;
        }
    }

    function _filter(keyCode) {
        var passed = true;
        switch (keyCode) {
            case 229:
                if (vim.isMode(COMMAND)) {
                    passed = false;
                    config.msg('请将输入法切换到英文输入');
                }
                break;
            default : break;
        }
        return passed;
    }

    function _route(keyCode, ev) {
        var c = new Controller();
        var param = undefined;
        var prefix = 'c.';
        var suffix = '(param)';

        //special key route
        if (_special_keys[keyCode] !== undefined) {
            eval(prefix + _special_keys[keyCode][1] + suffix);
        }

        //vim key route
        if (_vim_keys[keyCode] !== undefined && vim.isCommandMode()) {
            var keyName = _vim_keys[keyCode]['name'];
            if (ev.shiftKey) {
                if (keyName == keyName.toUpperCase()) {
                    keyName = 'shift_' + keyName;
                } else {
                    keyName = keyName.toUpperCase();
                }
            }
            console.log(prefix + _vim_keys[keyCode][keyName] + suffix);
            if (_vim_keys[keyCode][keyName] !== undefined) {
                eval(prefix + _vim_keys[keyCode][keyName] + suffix);
            }
        }
    }

    /**
     * 控制器
     * @constructor
     */
    function Controller() {

        this.selectPrevCharacter = function () {
            vim.selectPrevCharacter();
        };

        this.selectNextCharacter = function () {
            vim.selectNextCharacter();
        };

        this.switchModeToCommand = function () {
            vim.switchModeTo(COMMAND);
            vim.resetCursorByMouse();
        };

        this.append = function() {
            vim.append();
            setTimeout(function () {
                vim.switchModeTo(INPUT);
            }, 100);
        };

        this.insert = function() {
            vim.insert();
            setTimeout(function () {
                vim.switchModeTo(INPUT);
            }, 100);
        };

        this.selectNextLine = function () {
            vim.selectNextLine();
        };

        this.selectPrevLine = function () {
            vim.selectPrevLine();
        };

        this.copyChar = function() {
            clipboard = textUtil.getSelectedText();
        };
        
        this.pasteAfter = function () {
            if (clipboard !== undefined) {
                textUtil.appendText(clipboard)
            }
        };

        this.pasteBefore = function () {
            if (clipboard !== undefined) {
                textUtil.insertText(clipboard)
            }
        };
        this.moveToCurrentLineHead = function () {
            vim.moveToCurrentLineHead();
        };
        this.moveToCurrentLineTail = function () {
            vim.moveToCurrentLineTail();
        };
    }

    /**
     * 文本处理器
     * @param el
     * @constructor
     */
    function Text(el) {

        this.getText = function() {
            return el.value;
        };

        this.setText = function (t) {
            el.value = t;
        };

        this.getSelectedText = function() {
            var t = document.getSelection() || document.selection.createRange().text;
            return t + '';
        };

        this.getCursorPosition = function () {
            if (document.selection) {
                el.focus();
                var ds = document.selection;
                var range = ds.createRange();
                var stored_range = range.duplicate();
                stored_range.moveToElementText(el);
                stored_range.setEndPoint("EndToEnd", range);
                el.selectionStart = stored_range.text.length - range.text.length;
                el.selectionEnd = el.selectionStart + range.text.length;
                return el.selectionStart;
            } else {
                return el.selectionStart
            }
        };

        this.select = function (start, end) {
            if(document.selection){
                var range = el.createTextRange();
                range.moveEnd('character', -el.value.length);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }else{
                el.setSelectionRange(start, end);
                el.focus();
            }
        };

        this.appendText = function (t) {
            var ot = this.getText();
            var p = this.getCursorPosition() + 1;
            var nt = ot.slice(0, p) + t + ot.slice(p, ot.length);
            this.setText(nt);
            this.select(p, p + t.length);
        };

        this.insertText = function (t) {
            var ot = this.getText();
            var p = this.getCursorPosition();
            var nt = ot.slice(0, p) + t + ot.slice(p, ot.length);
            this.setText(nt);
            this.select(p, p + t.length);
        };

        this.getCountFromStartToPosInCurrLine = function() {
            var p = this.getCursorPosition();
            var s = this.getCurrLineStartPos();
            return (p - s) + 1;
        };

        this.getCurrLineStartPos = function () {
            var p = this.getCursorPosition();
            var sp = this.findSymbolBefore(p, "\n");
            return sp || 0;
        };

        this.getCurrLineEndPos = function () {
            var p = this.getCursorPosition();
            var end = this.findSymbolAfter(p, "\n");
            return end || this.getText().length;
        };

        this.getCurrLineCount = function () {
            var p = this.getCursorPosition();
            var left = this.findSymbolBefore(p, "\n");
            var right = this.findSymbolAfter(p, "\n");
            if (left === undefined) {
                return right;
            }
            return right - left;
        };

        this.getNextLineStart = function () {
            var sp = this.getCurrLineStartPos();
            var cc = this.getCurrLineCount();
            return sp + cc + 1;
        };

        this.getNextLineEnd = function () {
            var start = this.getNextLineStart();
            if (start !== undefined) {
                var end = this.findSymbolAfter(start, "\n");
                return end || this.getText().length;
            }
            return undefined;
        };

        this.getPrevLineEnd = function () {
            var p = this.getCurrLineStartPos();
            if (p > 0) {
                return p - 1;
            }
            return undefined;
        };

        this.getPrevLineStart = function () {
           var p = this.getPrevLineEnd();
           if (p !== undefined) {
               var sp = this.findSymbolBefore(p, "\n");
               return sp || 0;
           }
           return undefined;
        };

        this.findSymbolBefore = function (p, char) {
            var text = this.getText();
            for (var i = (p-1); i>=0; i--) {
                if (text.charAt(i) == char) {
                    return i+1;
                }
            }
            return undefined;
        };

        this.findSymbolAfter = function (p, char) {
            var text = this.getText();
            for (var i = (p+1); i<text.length; i++) {
                if (text.charAt(i) == char) {
                    return i;
                }
            }
            return undefined;
        }
    }

    /**
     * Vim 模型
     * @constructor
     */
    function Vim() {

        this.currentMode = INPUT;

        this.isCommandMode = function () {
            return this.isMode(COMMAND);
        };

        this.isMode = function (modeName) {
            return this.currentMode === modeName
        };

        this.switchModeTo = function (modeName) {
            if (modeName === COMMAND || modeName === INPUT || modeName === VISUAL) {
                this.currentMode = modeName;
            }
        };

        this.resetCursorByMouse = function() {
            var p = textUtil.getCursorPosition();
            textUtil.select(p, p+1);
        };

        this.selectNextCharacter = function() {
            var p = textUtil.getCursorPosition();
            if (p+2 <= textUtil.getText().length) {
                textUtil.select(p+1, p+2);
            }
        };

        this.selectPrevCharacter = function() {
            var p = textUtil.getCursorPosition();
            if (p-1 >= 0) {
                textUtil.select(p-1, p);
            }
        };

        this.append = function () {
            var p = textUtil.getCursorPosition();
            textUtil.select(p+1, p+1);
        };

        this.insert = function () {
            var p = textUtil.getCursorPosition();
            textUtil.select(p, p);
        };

        this.selectNextLine = function () {
            var nl = textUtil.getNextLineStart();
            var nr = textUtil.getNextLineEnd();
            var nc = nr - nl;
            var cc = textUtil.getCountFromStartToPosInCurrLine();
            var p = nl + (cc > nc ? nc : cc);
            if (p < textUtil.getText().length) {
                textUtil.select(p-1, p);
            }
        };

        this.selectPrevLine = function () {
            var pl = textUtil.getPrevLineStart();
            var pr = textUtil.getPrevLineEnd();
            var cc = textUtil.getCountFromStartToPosInCurrLine();
            var pc = pr - pl;
            var p = pl + (cc > pc ? pc : cc);
            if (p > 0) {
                textUtil.select(p-1, p);
            }
        };

        this.moveToCurrentLineHead = function () {
            var p = textUtil.getCurrLineStartPos();
            textUtil.select(p, p+1);
        };

        this.moveToCurrentLineTail = function () {
            var p = textUtil.getCurrLineEndPos();
            textUtil.select(p-1, p);
        };
    }

    //辅组函数，获取数组里某个元素的索引 index
    var _indexOf = function(array,key){
        if (array === null) return -1;
        var i = 0, length = array.length;
        for (; i < length; i++) if (array[i] == key) return i;
        return -1;
    };

    var Event = {
        //添加监听
        on:function(key,listener){
            //this.__events存储所有的处理函数
            if (!this.__events) {
                this.__events = {}
            }
            if (!this.__events[key]) {
                this.__events[key] = []
            }
            if (_indexOf(this.__events[key], listener) === -1 && typeof listener === 'function') {
                this.__events[key].push(listener)
            }
            return this
        },
        //触发一个事件，也就是通知
        fire:function(key){
            if (!this.__events || !this.__events[key]) return;

            var args = Array.prototype.slice.call(arguments, 1) || [];

            var listeners = this.__events[key];
            var i = 0;
            var l = listeners.length;

            for (i; i < l; i++) {
                listeners[i].apply(this,args)
            }
            return this
        },
        //取消监听
        off:function(key,listener){
            if (!key && !listener) {
                this.__events = {}
            }
            //不传监听函数，就去掉当前key下面的所有的监听函数
            if (key && !listener) {
                delete this.__events[key]
            }
            if (key && listener) {
                var listeners = this.__events[key]
                var index = _indexOf(listeners, listener)
                (index > -1) && listeners.splice(index, 1)
            }
            return this;
        }
    };

    return {
        applyTo: function(config){
            var el = document.getElementById(config.id);
            config.el = el;
            _init(config);
        }
    };
}());
