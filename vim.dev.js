
/*
 | Vim.0.1.js | v 0.1
 | vi/vim functionality to textarea and input.
 |------------------------------------
 | Created by top on 15-7-25.
 |
 */

window.vim = (function () {
    //vim mode
    const  GENERAL = 'GENERAL_MODE';
    const  EDIT    = 'EDIT_MODE';
    const  COMMAND = 'COMMAND_MODE';
    const  VISUAL  = 'VISUAL_MODE';

    //char \r\n
    const  _ENTER_ = '\n';

    //text area / input fields
    var boxes = undefined;

    //config
    var config = undefined;

    //vim instance
    var vim = undefined;

    //text util instance
    var textUtil = undefined;

    //clipboard
    var clipboard = undefined;

    //version history
    var doList = [];
    var doListLimit = 100;

    //prev key code
    var prevCode = undefined;
    var prevCodeTime = 0;

    //numerical value
    var _number = '';

    //key code white list
    var _keycode_white_list = [9, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123];

    //system feature key
    var _special_keys = {
        //8:'Backspace',
        27:['Escape', 'switchModeToGeneral'],
        //33:'PageUp',
        //34:'PageDown',
        35:['End', 'moveToCurrentLineTail'],
        36:['Home', 'moveToCurrentLineHead'],
        37:['Left', 'selectPrevCharacter'],
        38:['Up', 'selectPrevLine'],
        39:['Right', 'selectNextCharacter'],
        40:['Down', 'selectNextLine'],
        45:['Insert', 'insert'],
        46:['Delete', 'delCharAfter', true]
    };

    //vim feature key
    var _vim_keys = {
        //0:move to current line head
        48:{name:'0', 0:'moveToCurrentLineHead'},
        //&:move to current line tail
        52:{name:'4', shift_4:'moveToCurrentLineTail'},
        //append
        65:{name:'a', a:'append', A:'appendLineTail'},
        //insert
        73:{name:'i', i:'insert', I:'insertLineHead'},
        79:{name:'o', o:'appendNewLine', O:'insertNewLine', record:true},
        //replace
        82:{name:'r', r:'replaceChar'},
        //down
        13:{name:'enter', enter:'selectNextLine'},
        74:{name:'j', j:'selectNextLine'},
        //up
        75:{name:'k', k:'selectPrevLine'},
        //left
        72:{name:'h', h:'selectPrevCharacter'},
        //right
        76:{name:'l', l:'selectNextCharacter'},
        //paste
        80:{name:'p', p:'pasteAfter', P:'pasteBefore', record:true},
        //back
        85:{name:'u', u:'backToHistory'},
        //copy char
        89:{name:'y', y:'copyChar'},
        '89_89':{name:'yy', yy:'copyCurrentLine'},
        //v
        86:{name:'v', v:'switchModeToVisual', V:'switchModeToVisual'},
        //delete character
        88:{name:'x', x:'delCharAfter', X:'delCharBefore', record:true},
        //delete line
        '68_68':{name:'dd', dd:'delCurrLine', record:true},
        //gg
        71:{name:'g', G:'moveToLastLine'},
        '71_71':{name:'gg', gg:'moveToFirstLine'}
    };

    function _init (conf) {
        config = conf;
        vim = new Vim();
        _bind();
    }

    function _bind() {
        boxes = document.querySelectorAll('input, textarea');
        for (var i = 0;i<boxes.length;i++) {
            var box = boxes[i];
            box.onfocus = _on_focus;
            box.onclick = _on_click;
            box.onkeydown = _on_key_down;
        }
        Event.on('reset_cursor_position', function (e) {
            if (vim.isMode(GENERAL) || vim.isMode(VISUAL)) {
                vim.resetCursorByMouse();
            }
        });
        Event.on('input', function (ev, replaced) {
            var code = ev.keyCode || ev.which || ev.charCode;
            _log('mode:'+vim.currentMode);
            if (replaced) {
                _record_text();
                return;
            }
            if (_filter(code)) {
                var unionCode = _is_union_code(code, -1);
                if (unionCode !== undefined && _vim_keys[unionCode] !== undefined) {
                    code = unionCode;
                }
                _log('key code:' + code);
                if (code != 68 && code != 89) {
                    //68:d 89:y
                    var num = _number_manager(code);
                }
                _route(code, ev, num);
            }
        });
    }

    function _on_focus() {
        config.el = this;
        textUtil = new Text(this);
        vim.init();
        _init_number()
    }

    function _on_click(e) {
        var ev = e || event || window.event;
        Event.fire('reset_cursor_position', ev);
    }

    function _on_key_down(e) {
        var replaced = false;
        var ev = e || event || window.event;
        var code = ev.keyCode || ev.which || ev.charCode;
        if (_index_of(_keycode_white_list, code) !== -1) {
            return true;
        }
        if (vim.isMode(GENERAL) || vim.isMode(VISUAL)) {
            if (vim.replaceRequest) {
                replaced = true;
                vim.replaceRequest = false;
                setTimeout(function () {
                    vim.selectPrevCharacter();
                }, 50);
            } else {
                if (ev.preventDefault) {
                    ev.preventDefault();
                } else {
                    ev.returnValue = false;
                }
            }
        } else {
            if (code != 27) {
                var p = textUtil.getCursorPosition();
                _record_text(undefined, (p-1>=0 ? p-1 : p));
            }
        }
        Event.fire('input', ev, replaced);
    }

    function _filter(keyCode) {
        var passed = true;
        if (keyCode == 229) {
            if (vim.isMode(GENERAL) || vim.isMode(VISUAL)) {
                passed = false;
                _log('vim指令执行失败，请将输入法切换到英文输入');
                config.msg('vim指令执行失败，请将输入法切换到英文输入');
            }
        }
        return passed;
    }

    function _route(keyCode, ev, num) {
        var c = new Controller();
        var param = num;
        var prefix = 'c.';
        var suffix = '(param)';

        //special key route
        if (_special_keys[keyCode] !== undefined) {
            //record
            if (_special_keys[keyCode][2]) {
                _record_text();
            }
            eval(prefix + _special_keys[keyCode][1] + suffix);
            //init number
            _init_number();
        }

        //vim key route
        if (_vim_keys[keyCode] !== undefined && (vim.isMode(GENERAL) || vim.isMode(VISUAL)) ) {
            var keyName = _vim_keys[keyCode]['name'];
            if (ev.shiftKey) {
                if (keyName == keyName.toUpperCase()) {
                    keyName = 'shift_' + keyName;
                } else {
                    keyName = keyName.toUpperCase();
                }
            }
            _log(_vim_keys[keyCode][keyName] + suffix);
            if (_vim_keys[keyCode][keyName] !== undefined) {
                //record
                if (_vim_keys[keyCode]['record']) {
                    _record_text();
                }
                eval(prefix + _vim_keys[keyCode][keyName] + suffix);
                //init number
                _init_number();

            }
        }
    }

    function _number_manager(code) {
        var num = String.fromCharCode(code);
        if (!isNaN(num) && num >=0 && num <=9) {
            _number = _number + '' + num;
            _log('number:' + _number);
        } else {
            var n = _number;
            _init_number();
            if (n) {
                return parseInt(n);
            }
        }
        return undefined;
    }

    function _init_number() {
        _number = '';
    }

    function _record_text(t, p) {
        t = (t === undefined) ? textUtil.getText() : t;
        p = (p === undefined) ? textUtil.getCursorPosition() : p;
        var data = {
            't':t,
            'p':p
        };
        var key = _el_key();
        if (!doList[key]) {
            doList[key] = [];
        }
        if (doList[key].length >= doListLimit) {
            doList[key].shift();
        }
        doList[key].push(data);
        _log(doList);
    }

    function _el_key() {
        return _index_of(boxes, config.el);
    }

    /**
     * 控制器
     * @constructor
     */
    function Controller() {

        this.selectPrevCharacter = function (num) {
            _repeat_action(function(){
                vim.selectPrevCharacter();
            }, num);
        };

        this.selectNextCharacter = function (num) {
            _repeat_action(function(){
                vim.selectNextCharacter();
            }, num);
        };

        this.switchModeToGeneral = function () {
            var cMode= vim.currentMode;
            if (vim.isMode(GENERAL)) {
                return;
            }
            vim.switchModeTo(GENERAL);
            var p = textUtil.getCursorPosition();
            var sp = textUtil.getCurrLineStartPos();
            if (p === sp) {
                var c = textUtil.getCurrLineCount();
                if (!c) {
                    textUtil.appendText(' ', p);
                }
                vim.selectNextCharacter();
                vim.selectPrevCharacter();
                if (textUtil.getCurrLineCount() === 1) {
                    textUtil.select(p, p+1);
                }
            } else {
                if (cMode === VISUAL) {
                    vim.selectNextCharacter();
                }
                vim.selectPrevCharacter();
            }
        };

        this.switchModeToVisual = function () {
            if (vim.isMode(VISUAL)) {
                var s = vim.visualCursor;
                if (s === undefined) {
                    return;
                }
                var p = vim.visualPosition;
                if (p < s) {
                    textUtil.select(s-1, s);
                } else {
                    textUtil.select(s, s+1);
                }
                if (textUtil.getPrevSymbol(s) == _ENTER_) {
                    textUtil.select(s, s+1);
                }
                vim.switchModeTo(GENERAL);
                return;
            }
            vim.switchModeTo(VISUAL);
            vim.visualPosition = textUtil.getCursorPosition();
            vim.visualCursor = undefined;
        };

        this.append = function() {
            vim.append();
            setTimeout(function () {
                vim.switchModeTo(EDIT);
            }, 100);
        };

        this.insert = function() {
            vim.insert();
            setTimeout(function () {
                vim.switchModeTo(EDIT);
            }, 100);
        };

        this.selectNextLine = function (num) {
            _repeat_action(function(){
                vim.selectNextLine();
            }, num);
        };

        this.selectPrevLine = function (num) {
            _repeat_action(function(){
                vim.selectPrevLine();
            }, num);
        };

        this.copyChar = function() {
            vim.parseInNewLineRequest = false;
            clipboard = textUtil.getSelectedText();
            if (vim.isMode(VISUAL)) {
                this.switchModeToGeneral();
            }
        };

        this.copyCurrentLine = function() {
            vim.copyCurrentLine();
        };

        this.pasteAfter = function () {
            if (clipboard !== undefined) {
                if(vim.parseInNewLineRequest){
                    var ep = textUtil.getCurrLineEndPos();
                    textUtil.appendText(_ENTER_ + clipboard, ep, true);
                } else {
                    textUtil.appendText(clipboard, undefined, true)
                }
            }
        };

        this.pasteBefore = function () {
            if (clipboard !== undefined) {
                if(vim.parseInNewLineRequest){
                    var sp = textUtil.getCurrLineStartPos();
                    textUtil.insertText(clipboard + _ENTER_, sp, true);
                } else {
                    textUtil.insertText(clipboard, undefined, true)
                }
            }
        };
        this.moveToCurrentLineHead = function () {
            vim.moveToCurrentLineHead();
        };
        this.moveToCurrentLineTail = function () {
            vim.moveToCurrentLineTail();
        };
        this.replaceChar = function () {
            vim.replaceRequest = true;
        };
        this.appendNewLine = function () {
            vim.appendNewLine();
            setTimeout(function () {
                vim.switchModeTo(EDIT);
            }, 100);
        };
        this.insertNewLine = function () {
            vim.insertNewLine();
            setTimeout(function () {
                vim.switchModeTo(EDIT);
            }, 100);
        };
        this.delCharAfter = function (num) {
            _repeat_action(function(){
               return vim.deleteSelected();
            }, num);
            this.switchModeToGeneral()
        };
        this.backToHistory = function () {
            vim.backToHistory();
        };
        this.delCurrLine = function (num) {
            _repeat_action(function () {
               return vim.delCurrLine();
            }, num);
        };
        this.moveToFirstLine = function () {
            vim.moveToFirstLine();
        };
        this.moveToLastLine = function () {
            vim.moveToLastLine();
        }
    }

    /**
     * 文本处理器
     * @constructor
     */
    function Text(el) {

        this.getText = function(sp, ep) {
            if (sp !== undefined || ep !== undefined) {
                return el.value.slice(sp, ep);
            }
            return el.value;
        };

        this.setText = function (t) {
            el.value = t;
        };

        this.getSelectedText = function() {
            //var t = document.getSelection() || document.selection.createRange().text;
            var t;
            if(document.selection){
                t = document.selection.createRange().text;// for IE
            } else {
                t = el.value.substring(el.selectionStart, el.selectionEnd);
            }
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

        this.getSelectEndPos = function () {
            if (document.selection) {
                el.focus();
                var ds = document.selection;
                var range = ds.createRange();
                var stored_range = range.duplicate();
                stored_range.moveToElementText(el);
                stored_range.setEndPoint("EndToEnd", range);
                el.selectionStart = stored_range.text.length - range.text.length;
                el.selectionEnd = el.selectionStart + range.text.length;
                return el.selectionEnd;
            } else {
                return el.selectionEnd;
            }
        };

        this.select = function (start, end) {
            if (start > end) {
                var p = start;
                start = end;
                end = p;
            }
            if (start < 0) {
                start = 0;
            }
            if (end > this.getText().length) {
                end = this.getText().length;
            }
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

        this.appendText = function (t, p, parse) {
            var ot = this.getText();
            if (p === undefined) {
                p = this.getCursorPosition() + 1;
            }
            var nt = ot.slice(0, p) + t + ot.slice(p, ot.length);
            this.setText(nt);
            if (parse) {
                if (vim.parseInNewLineRequest && p) {
                    this.select(p+1, p+2);
                } else {
                    this.select(p+t.length, p+t.length-1);
                }
            } else {
                this.select(p, p + t.length);
            }
        };

        this.insertText = function (t, p, parse) {
            var ot = this.getText();
            if (p === undefined) {
                p = this.getCursorPosition();
            }
            var nt = ot.slice(0, p) + t + ot.slice(p, ot.length);
            this.setText(nt);
            if (parse) {
                if (vim.parseInNewLineRequest) {
                    this.select(p, p+1);
                } else {
                    this.select(p+t.length, p+t.length-1);
                }
            } else {
                this.select(p, p + t.length);
            }
        };

        this.delete = function (sp, ep) {
            if (sp > ep) {
                var p = ep;
                sp = ep;
                ep = p;
            }
            if (ep - sp > 0) {
                var t = this.getText();
                var nt = t.slice(0, sp) + t.slice(ep);
                if (!nt) {
                    nt = ' ';
                }
                this.setText(nt);
                return t.slice(sp, ep);
            }
            return undefined;
        };

        this.delSelected = function () {
            var sp = this.getCursorPosition();
            var ep = this.getSelectEndPos();
            return this.delete(sp, ep);
        };

        this.getCountFromStartToPosInCurrLine = function(p) {
            if (p === undefined) {
                p = this.getCursorPosition();
            }
            var s = this.getCurrLineStartPos(p);
            return (p - s) + 1;
        };

        this.getCurrLineStartPos = function (p) {
            if (p === undefined) {
                p = this.getCursorPosition();
            }
            var sp = this.findSymbolBefore(p, _ENTER_);
            return sp || 0;
        };

        this.getCurrLineEndPos = function (p) {
            if (p === undefined) {
                p = this.getCursorPosition();
            }
            if (this.getSymbol(p) == _ENTER_) {
                return p;
            }
            var end = this.findSymbolAfter(p, _ENTER_);
            return end || this.getText().length;
        };

        this.getCurrLineCount = function (p) {
            if (p === undefined) {
                p = this.getCursorPosition();
            }
            var left = this.findSymbolBefore(p, _ENTER_);
            var right = this.findSymbolAfter(p, _ENTER_);
            if (left === undefined) {
                return right;
            }
            return right - left;
        };

        this.getNextLineStart = function (p) {
            var sp = this.getCurrLineStartPos(p);
            var cc = this.getCurrLineCount(p);
            return sp + cc + 1;
        };

        this.getNextLineEnd = function (p) {
            var start = this.getNextLineStart(p);
            if (start !== undefined) {
                var end = this.findSymbolAfter(start, _ENTER_);
                return end || this.getText().length;
            }
            return undefined;
        };

        this.getPrevLineEnd = function (pos) {
            var p = this.getCurrLineStartPos(pos);
            if (p > 0) {
                return p - 1;
            }
            return undefined;
        };

        this.getPrevLineStart = function (pos) {
           var p = this.getPrevLineEnd(pos);
           if (p !== undefined) {
               var sp = this.findSymbolBefore(p, _ENTER_);
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
            return 0;
        };

        this.findSymbolAfter = function (p, char) {
            var text = this.getText();
            for (var i = p; i<text.length; i++) {
                if (text.charAt(i) == char) {
                    return i;
                }
            }
            return this.getText().length;
        };

        this.getSymbol = function (p) {
            var text = this.getText();
            return text.charAt(p) || undefined;
        };

        this.getNextSymbol = function (p) {
            return this.getSymbol(p+1);
        };

        this.getPrevSymbol = function (p) {
            return this.getSymbol(p-1);
        };
    }

    /**
     * Vim 模型
     * @constructor
     */
    function Vim() {

        this.currentMode = EDIT;
        this.replaceRequest = false;
        this.parseInNewLineRequest = false;
        this.visualPosition = undefined;
        this.visualCursor = undefined;

        this.init = function () {
            this.replaceRequest = false;
            this.visualPosition = undefined;
            this.visualCursor = undefined;
        };

        this.isMode = function (modeName) {
            return this.currentMode === modeName
        };

        this.switchModeTo = function (modeName) {
            if (modeName === GENERAL || modeName === COMMAND || modeName === EDIT || modeName === VISUAL) {
                this.currentMode = modeName;
            }
        };

        this.resetCursorByMouse = function() {
            this.switchModeTo(GENERAL);
            var p = textUtil.getCursorPosition();
            var sp = textUtil.getCurrLineStartPos();
            var c = textUtil.getCurrLineCount();
            if (p === sp && !c) {
                textUtil.appendText(' ', p);
            }
            var ns = textUtil.getNextSymbol(p-1);
            if (ns && ns !== _ENTER_) {
                textUtil.select(p, p+1);
            } else {
                textUtil.select(p-1, p);
            }
        };

        this.selectNextCharacter = function() {
            var p = textUtil.getCursorPosition();
            if (this.isMode(VISUAL) && this.visualCursor !== undefined) {
                p = this.visualCursor;
            }
            if (this.isMode(GENERAL) && textUtil.getNextSymbol(p) == _ENTER_) {
                return;
            }
            if (this.isMode(VISUAL) && textUtil.getNextSymbol(p-1) == _ENTER_) {
                return;
            }
            if (p+1 <= textUtil.getText().length) {
                var s = p+1;
                if (this.isMode(VISUAL)) {
                    s = this.visualPosition;
                    this.visualCursor = p+1;
                    var f1 = this.visualCursor;
                    var f2 = this.visualPosition;
                    var f3 = textUtil.getCursorPosition();
                }
                //default
                textUtil.select(s, p+2);
                //special
                if (this.isMode(VISUAL)) {
                    if (s == p) {
                        textUtil.select(s, p+2);
                        this.visualCursor = p+2;
                    } else {
                        textUtil.select(s, p+1);
                    }
                    if (f2 > f1 && f2 > f3) {
                        textUtil.select(s, p+1);
                    } else if (f1 == f2 && f2 - f3 == 1) {
                        //textUtil.select(s, p+1);
                        this.visualPosition = f2-1;
                        this.visualCursor = p+2;
                        textUtil.select(s-1, p+2);
                    }
                }
            }
        };

        this.selectPrevCharacter = function() {
            var p = textUtil.getCursorPosition();
            if (this.isMode(VISUAL) && this.visualCursor !== undefined) {
                p = this.visualCursor;
            }
            if (textUtil.getPrevSymbol(p) == _ENTER_) {
                return;
            }
            var s = p-1;
            if (this.isMode(VISUAL)) {
                s = this.visualPosition;
                if (s < p && textUtil.getPrevSymbol(p-1) == _ENTER_) {
                    return;
                }
                if (s == p) {
                    p = p+1;
                    s = s-1;
                    this.visualPosition = p;
                    this.visualCursor = s;
                } else if (p == s+1) {
                    s = s+1;
                    p = p-2;
                    this.visualPosition = s;
                    this.visualCursor = p;
                } else if (p == s-1) {
                    p = s-2;
                    this.visualCursor = p;
                } else {
                    //default
                    if (!(s < p && (p+1 == textUtil.getSelectEndPos()))) {
                        p = p-1;
                    }
                    this.visualCursor = p;
                }
            }
            if (this.visualCursor < 0) {
                this.visualCursor = 0;
            }
            if ((this.isMode(GENERAL) && s>=0) || this.isMode(VISUAL)) {
                textUtil.select(s, p);
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
            var sp = undefined;
            if (this.isMode(VISUAL) && this.visualCursor !== undefined) {
                sp = this.visualCursor;
            }
            var nl = textUtil.getNextLineStart(sp);
            var nr = textUtil.getNextLineEnd(sp);
            var nc = nr - nl;
            var cc = textUtil.getCountFromStartToPosInCurrLine(sp);
            if (this.isMode(VISUAL) && this.visualCursor != undefined && this.visualPosition < this.visualCursor) {
                cc = cc-1;
            }
            var p = nl + (cc > nc ? nc : cc);
            if (p <= textUtil.getText().length) {
                var s = p-1;
                if (this.isMode(VISUAL)) {
                    s = this.visualPosition;
                    if (s > p) {
                        p = p-1;
                    }
                    this.visualCursor = p;
                    if (textUtil.getSymbol(nl) == _ENTER_) {
                        textUtil.appendText(' ', nl);
                        p = p+1;
                        this.visualCursor = p;
                        if (s > p) {
                            //因为新加了空格符，导致字符总数增加，visual开始位置相应增加
                            s += 1;
                            this.visualPosition = s;
                        }
                    }
                }
                textUtil.select(s, p);
                if (this.isMode(GENERAL)) {
                    if (textUtil.getSymbol(nl) == _ENTER_) {
                        textUtil.appendText(' ', nl);
                    }
                }
            }
        };

        this.selectPrevLine = function () {
            var sp = undefined;
            if (this.isMode(VISUAL) && this.visualCursor !== undefined) {
                sp = this.visualCursor;
            }
            var pl = textUtil.getPrevLineStart(sp);
            var pr = textUtil.getPrevLineEnd(sp);
            var cc = textUtil.getCountFromStartToPosInCurrLine(sp);
            if (this.isMode(VISUAL) && this.visualCursor != undefined && this.visualPosition < this.visualCursor) {
                cc = cc-1;
            }
            var pc = pr - pl;
            var p = pl + (cc > pc ? pc : cc);
            if (p >= 0) {
                var s = p-1;
                var e = p;
                if (this.isMode(VISUAL)) {
                    s = this.visualPosition;
                    if (textUtil.getPrevSymbol(p) != _ENTER_ && s != p-1 && e < s) {
                        e = p-1;
                    }
                    this.visualCursor = e;
                }
                textUtil.select(s, e);
                if (this.isMode(GENERAL)) {
                    if (textUtil.getSymbol(pl) == _ENTER_) {
                        textUtil.appendText(' ', pl);
                    }
                }
            }
        };

        this.moveToCurrentLineHead = function () {
            var p = textUtil.getCurrLineStartPos();
            if (this.isMode(GENERAL)) {
                textUtil.select(p, p+1);
            }
            if (this.isMode(VISUAL)) {
                var sp = vim.visualCursor;
                if (sp === undefined) {
                    sp = textUtil.getCursorPosition();
                }
                for (sp;sp>p;sp--) {
                    this.selectPrevCharacter();
                }
            }
        };

        this.moveToCurrentLineTail = function () {
            var p = textUtil.getCurrLineEndPos();
            if (this.isMode(GENERAL)) {
                textUtil.select(p - 1, p);
            }
            if (this.isMode(VISUAL)) {
                var sp = vim.visualCursor;
                if (sp === undefined) {
                    sp = textUtil.getCursorPosition();
                }
                p = textUtil.getCurrLineEndPos(sp);
                if (sp == p-1) {
                    p = p-1
                }
                for (sp;sp<p;sp++){
                    this.selectNextCharacter();
                }
            }
        };

        this.appendNewLine = function () {
            var p = textUtil.getCurrLineEndPos();
            textUtil.appendText(_ENTER_ + " ", p);
            textUtil.select(p+1, p+1);
        };

        this.insertNewLine = function () {
            var p = textUtil.getCurrLineStartPos();
            textUtil.appendText(" " + _ENTER_, p);
            textUtil.select(p, p);
        };

        this.deleteSelected = function () {
            var p = textUtil.getCursorPosition();
            var t = textUtil.delSelected();
            textUtil.select(p, p+1);
            this.parseInNewLineRequest = false;
            return t;
        };

        this.copyCurrentLine = function () {
            var sp = textUtil.getCurrLineStartPos();
            var ep = textUtil.getCurrLineEndPos();
            clipboard = textUtil.getText(sp, ep);
            this.parseInNewLineRequest = true;
        };

        this.backToHistory = function () {
            var key = _el_key();
            var list = doList[key];
            if (list) {
                var data = list.pop();
                if (data !== undefined) {
                    textUtil.setText(data.t);
                    textUtil.select(data.p, data.p+1);
                }
            }
        };

        this.delCurrLine = function () {
            var sp = textUtil.getCurrLineStartPos();
            var ep = textUtil.getCurrLineEndPos();
            var t = textUtil.delete(sp, ep+1);
            textUtil.select(sp, sp+1);
            this.parseInNewLineRequest = true;
            return t;
        };

        this.moveToFirstLine = function () {
            if (this.isMode(GENERAL)) {
                textUtil.select(0,1);
            } else if (this.isMode(VISUAL)) {
                textUtil.select(this.visualPosition, 0);
                this.visualCursor = 0;
            }
        };

        this.moveToLastLine = function () {
            var lp = textUtil.getText().length;
            var sp = textUtil.getCurrLineStartPos(lp-1);
            if (this.isMode(GENERAL)) {
                textUtil.select(sp, sp+1);
            } else if (this.isMode(VISUAL)) {
                textUtil.select(this.visualPosition, sp+1);
                this.visualCursor = sp+1;
            }
        }
    }

    var _current_time = function () {
        return new Date().getTime();
    };

    var _is_union_code = function (code, maxTime) {
        if (maxTime === undefined) {
            maxTime = 600;
        }
        var ct = _current_time();
        var pt = prevCodeTime;
        var pc = prevCode;
        prevCode = code;
        prevCodeTime = ct;
        if (pc && (maxTime < 0 || ct - pt <= maxTime)) {
            if (pc == code) {
                prevCode = undefined;
            }
            return pc + '_' + code;
        }
        return undefined;
    };

    var _log = function (msg) {
        if (config.debug) {
            console.log(msg);
        }
    };

    var _repeat_action = function (action, num) {
        if (typeof action !== 'function') {
            return;
        }
        var res = undefined;
        if (num === undefined || isNaN(num)) {
            res = action.apply();
            if (res) {
                clipboard = res;
            }
        } else {
            for (var i=0;i<num;i++) {
                res = action.apply();
                if (res) {
                    if (!i) {
                        clipboard = '';
                    }
                    clipboard = clipboard + res;
                }
            }
        }
    };

    var _index_of = function(array,key){
        if (array === null) {
            return -1
        }
        var i = 0, length = array.length;
        for (; i < length; i++) {
          if (array[i] == key) {
              return i;
          }
        }
        return -1;
    };

    var Event = {
        on:function(key,listener){
            if (!this._events) {
                this._events = {}
            }
            if (typeof listener === 'function') {
                this._events[key] = listener
            }
            return this
        },
        fire:function(key){
            if (!this._events || !this._events[key]) {
                return;
            }
            var args = Array.prototype.slice.call(arguments, 1) || [];
            var listener = this._events[key];
            listener.apply(this, args);
            return this;
        },
        off:function(key){
            if (!key) {
                this._events = {};
            } else {
                delete this._events[key];
            }
            return this;
        }
    };

    return {
        open: function(config) {
            _init(config);
        }
    };
}());
