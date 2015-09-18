/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);
	var extend = _.extend;
	var p;
	
	/**
	 * Router constructor
	 * @constructor
	 */
	function Router () {
	    this._init();
	}
	p = Router.prototype;
	extend(p, __webpack_require__(2));
	
	/**
	 * Vim constructor
	 * @constructor
	 */
	function Vim(textUtil) {
	    this._init(textUtil);
	}
	p = Vim.prototype;
	extend(p, __webpack_require__(3));
	
	/**
	 * textUtil constructor
	 * @constructor
	 */
	function TextUtil(element) {
	    this._init(element);
	}
	p = TextUtil.prototype;
	extend(p, __webpack_require__(5));
	
	/**
	 *
	 * @constructor
	 */
	function Controller(app) {
	    this._init(app);
	}
	p = Controller.prototype;
	extend(p, __webpack_require__(6));
	
	/**
	 * App constructor
	 * @constructor
	 */
	function App (options) {
	    this._init(options)
	}
	p = App.prototype;
	extend(p, __webpack_require__(7));
	p.class('Router', Router);
	p.class('Vim', Vim);
	p.class('TextUtil', TextUtil);
	p.class('Controller', Controller);
	
	/**
	 * define vim
	 * @type {{open: Function}}
	 */
	window.vim = {
	    open: function(options){
	        return new App(options)
	    }
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Created by top on 15-9-6.
	 */
	
	exports.extend = function(to, form){
	    for (var key in form) {
	        to[key] = form[key]
	    }
	    return to
	}
	
	exports.indexOf = function (array, key) {
	    for (var k in array) {
	        if (array[k] == key) {
	            return k;
	        }
	    }
	    return -1;
	}
	
	exports.currentTime = function () {
	    return new Date().getTime();
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Created by top on 15-9-6.
	 */
	
	exports._init = function() {
	    this.currentCode = undefined;
	    this._keys = {};
	}
	
	exports.code = function (code, name) {
	    if (!this._keys[code]) {
	        this._keys[code] = {}
	    }
	    this._keys[code]['name'] = name;
	    this._keys[code]['mode'] = '';
	    this._keys[code]['record'] = false;
	    this.currentCode = code;
	    return this;
	}
	
	exports.action = function (name, methodName) {
	    if (!this.currentCode) {
	        return
	    }
	    this._keys[this.currentCode][name] = methodName;
	    return this;
	}
	
	exports.mode = function(mode) {
	    if (!this.currentCode) {
	        return
	    }
	    this._keys[this.currentCode]['mode'] = mode;
	    return this;
	}
	
	exports.record = function(isRecord) {
	    if (!this.currentCode) {
	        return
	    }
	    this._keys[this.currentCode]['record'] = isRecord;
	    return this;
	}
	
	exports.getKeys = function() {
	    return this._keys;
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by top on 15-9-6.
	 */
	const GENERAL = 'general_mode';
	const COMMAND = 'command_mode';
	const EDIT    = 'edit_mode';
	const VISUAL  = 'visual_mode';
	const _ENTER_ = '\n';
	
	var _ = __webpack_require__(1);
	var extend = _.extend;
	var textUtil;
	
	exports._init = function (tu) {
	    extend(this, __webpack_require__(4));
	    textUtil = tu;
	};
	
	exports.resetVim = function() {
	    this.replaceRequest = false;
	    this.visualPosition = undefined;
	    this.visualCursor = undefined;
	}
	
	exports.setTextUtil = function(tu) {
	    textUtil = tu;
	}
	
	exports.isMode = function (modeName) {
	    return this.currentMode === modeName
	};
	
	exports.switchModeTo = function (modeName) {
	    if (modeName === GENERAL || modeName === COMMAND || modeName === EDIT || modeName === VISUAL) {
	        this.currentMode = modeName;
	    }
	};
	
	exports.resetCursorByMouse = function() {
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
	
	exports.selectNextCharacter = function() {
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
	
	exports.selectPrevCharacter = function() {
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
	
	exports.append = function () {
	    var p = textUtil.getCursorPosition();
	    textUtil.select(p+1, p+1);
	};
	
	exports.insert = function () {
	    var p = textUtil.getCursorPosition();
	    textUtil.select(p, p);
	};
	
	exports.selectNextLine = function () {
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
	
	exports.selectPrevLine = function () {
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
	
	exports.moveToCurrentLineHead = function () {
	    var p = textUtil.getCurrLineStartPos();
	    if (this.isMode(GENERAL)) {
	        textUtil.select(p, p+1);
	    }
	    if (this.isMode(VISUAL)) {
	        var sp = this.visualCursor;
	        if (sp === undefined) {
	            sp = textUtil.getCursorPosition();
	        }
	        for (sp;sp>p;sp--) {
	            this.selectPrevCharacter();
	        }
	    }
	};
	
	exports.moveToCurrentLineTail = function () {
	    var p = textUtil.getCurrLineEndPos();
	    if (this.isMode(GENERAL)) {
	        textUtil.select(p - 1, p);
	    }
	    if (this.isMode(VISUAL)) {
	        var sp = this.visualCursor;
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
	
	exports.appendNewLine = function () {
	    var p = textUtil.getCurrLineEndPos();
	    textUtil.appendText(_ENTER_ + " ", p);
	    textUtil.select(p+1, p+1);
	};
	
	exports.insertNewLine = function () {
	    var p = textUtil.getCurrLineStartPos();
	    textUtil.appendText(" " + _ENTER_, p);
	    textUtil.select(p, p);
	};
	
	exports.deleteSelected = function () {
	    var p = textUtil.getCursorPosition();
	    var t = textUtil.delSelected();
	    textUtil.select(p, p+1);
	    this.pasteInNewLineRequest = false;
	    return t;
	};
	
	exports.copyCurrentLine = function (p) {
	    var sp = textUtil.getCurrLineStartPos(p);
	    var ep = textUtil.getCurrLineEndPos(p);
	    //clipboard = textUtil.getText(sp, ep);
	    this.pasteInNewLineRequest= true;
	    return textUtil.getText(sp, ep+1);
	};
	
	exports.backToHistory = function (list) {
	    if (list) {
	        var data = list.pop();
	        if (data !== undefined) {
	            textUtil.setText(data.t);
	            textUtil.select(data.p, data.p+1);
	        }
	    }
	};
	
	exports.delCurrLine = function () {
	    var sp = textUtil.getCurrLineStartPos();
	    var ep = textUtil.getCurrLineEndPos();
	    var t = textUtil.delete(sp, ep+1);
	    textUtil.select(sp, sp+1);
	    this.pasteInNewLineRequest = true;
	    return t;
	};
	
	exports.moveToFirstLine = function () {
	    if (this.isMode(GENERAL)) {
	        textUtil.select(0,1);
	    } else if (this.isMode(VISUAL)) {
	        textUtil.select(this.visualPosition, 0);
	        this.visualCursor = 0;
	    }
	};
	
	exports.moveToLastLine = function () {
	    var lp = textUtil.getText().length;
	    var sp = textUtil.getCurrLineStartPos(lp-1);
	    if (this.isMode(GENERAL)) {
	        textUtil.select(sp, sp+1);
	    } else if (this.isMode(VISUAL)) {
	        textUtil.select(this.visualPosition, sp+1);
	        this.visualCursor = sp+1;
	    }
	};
	
	exports.moveToNextWord = function () {
	    var p;
	    if (this.isMode(VISUAL)) {
	        p = this.visualCursor;
	    }
	    var poses = textUtil.getCurrWordPos(p);
	    //poses[1] is next word`s start position
	    var sp = poses[1];
	    if (sp) {
	        if (this.isMode(GENERAL)) {
	            textUtil.select(sp, sp+1);
	        } else if (this.isMode(VISUAL)) {
	            textUtil.select(this.visualPosition, sp+1);
	            this.visualCursor = sp+1;
	        }
	    }
	};
	
	exports.copyWord = function (p) {
	    var poses = textUtil.getCurrWordPos(p);
	    return poses[1];
	};
	
	exports.deleteWord = function () {
	    var t;
	    var poses = textUtil.getCurrWordPos();
	    if (poses[1]) {
	        t = textUtil.delete(poses[0], poses[1]);
	        textUtil.select(poses[0], poses[0]+1)
	    }
	    return t;
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * default mode
	 * @type {string}
	 */
	exports.currentMode = 'edit_mode';
	
	/**
	 * whether the request to replace a character
	 * @type {boolean}
	 */
	exports.replaceRequest = false;
	
	/**
	 * whether the request to paste characters in new line
	 * @type {boolean}
	 */
	exports.pasteInNewLineRequest = false;
	
	/**
	 * the starting position of selected text (visual mode)
	 * @type {undefined}
	 */
	exports.visualPosition = undefined;
	
	/**
	 * the end position of selected text (visual mode)
	 * @type {undefined}
	 */
	exports.visualCursor = undefined;

/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Created by top on 15-9-6.
	 */
	const _ENTER_ = '\n';
	var el;
	
	exports._init = function (element) {
	    el = element;
	}
	
	exports.setEle = function(e){
	    el = e;
	}
	
	exports.getText = function(sp, ep) {
	    if (sp !== undefined || ep !== undefined) {
	        return el.value.slice(sp, ep);
	    }
	    return el.value;
	};
	
	exports.setText = function (t) {
	    el.value = t;
	};
	
	exports.getSelectedText = function() {
	    //var t = document.getSelection() || document.selection.createRange().text;
	    var t;
	    if(document.selection){
	        t = document.selection.createRange().text;// for IE
	    } else {
	        t = el.value.substring(el.selectionStart, el.selectionEnd);
	    }
	    return t + '';
	};
	
	exports.getCursorPosition = function () {
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
	
	exports.getSelectEndPos = function () {
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
	
	exports.select = function (start, end) {
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
	
	exports.appendText = function (t, p, paste, isNewLine) {
	    var ot = this.getText();
	    if (p === undefined) {
	        p = this.getCursorPosition() + 1;
	    }
	    var nt = ot.slice(0, p) + t + ot.slice(p, ot.length);
	    this.setText(nt);
	    if (paste) {
	        if (isNewLine && p) {
	            this.select(p+1, p+2);
	        } else {
	            this.select(p+t.length, p+t.length-1);
	        }
	    } else {
	        this.select(p, p + t.length);
	    }
	};
	
	exports.insertText = function (t, p, paste, isNewLine) {
	    var ot = this.getText();
	    if (p === undefined) {
	        p = this.getCursorPosition();
	    }
	    var nt = ot.slice(0, p) + t + ot.slice(p, ot.length);
	    this.setText(nt);
	    if (paste) {
	        if (isNewLine) {
	            this.select(p, p+1);
	        } else {
	            this.select(p+t.length, p+t.length-1);
	        }
	    } else {
	        this.select(p, p + t.length);
	    }
	};
	
	exports.delete = function (sp, ep) {
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
	
	exports.delSelected = function () {
	    var sp = this.getCursorPosition();
	    var ep = this.getSelectEndPos();
	    return this.delete(sp, ep);
	};
	
	exports.getCountFromStartToPosInCurrLine = function(p) {
	    if (p === undefined) {
	        p = this.getCursorPosition();
	    }
	    var s = this.getCurrLineStartPos(p);
	    return (p - s) + 1;
	};
	
	exports.getCurrLineStartPos = function (p) {
	    if (p === undefined) {
	        p = this.getCursorPosition();
	    }
	    var sp = this.findSymbolBefore(p, _ENTER_);
	    return sp || 0;
	};
	
	exports.getCurrLineEndPos = function (p) {
	    if (p === undefined) {
	        p = this.getCursorPosition();
	    }
	    if (this.getSymbol(p) == _ENTER_) {
	        return p;
	    }
	    var end = this.findSymbolAfter(p, _ENTER_);
	    return end || this.getText().length;
	};
	
	exports.getCurrLineCount = function (p) {
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
	
	exports.getNextLineStart = function (p) {
	    var sp = this.getCurrLineStartPos(p);
	    var cc = this.getCurrLineCount(p);
	    return sp + cc + 1;
	};
	
	exports.getNextLineEnd = function (p) {
	    var start = this.getNextLineStart(p);
	    if (start !== undefined) {
	        var end = this.findSymbolAfter(start, _ENTER_);
	        return end || this.getText().length;
	    }
	    return undefined;
	};
	
	exports.getPrevLineEnd = function (pos) {
	    var p = this.getCurrLineStartPos(pos);
	    if (p > 0) {
	        return p - 1;
	    }
	    return undefined;
	};
	
	exports.getPrevLineStart = function (pos) {
	   var p = this.getPrevLineEnd(pos);
	   if (p !== undefined) {
	       var sp = this.findSymbolBefore(p, _ENTER_);
	       return sp || 0;
	   }
	   return undefined;
	};
	
	exports.findSymbolBefore = function (p, char) {
	    var text = this.getText();
	    for (var i = (p-1); i>=0; i--) {
	        if (text.charAt(i) == char) {
	            return i+1;
	        }
	    }
	    return 0;
	};
	
	exports.findSymbolAfter = function (p, char, char2) {
	    var text = this.getText();
	    var pattern = new RegExp(char);
	    //And conditions
	    var andPattern = char2 ? new RegExp(char2) : false;
	    for (var i = p; i<text.length; i++) {
	        if (pattern.test(text.charAt(i))) {
	            if (!andPattern) {
	                return i;
	            } else if (andPattern.test(text.charAt(i))) {
	                return i;
	            }
	        }
	    }
	    return this.getText().length;
	};
	
	exports.getSymbol = function (p) {
	    var text = this.getText();
	    return text.charAt(p) || undefined;
	};
	
	exports.getNextSymbol = function (p) {
	    return this.getSymbol(p+1);
	};
	
	exports.getPrevSymbol = function (p) {
	    return this.getSymbol(p-1);
	};
	
	exports.getCurrWordPos = function (p) {
	    p = p || this.getCursorPosition();
	    //current character
	    var char = this.getSymbol(p);
	
	    //parse current character type
	    //
	    var patternStr;
	    if (/[\w\u4e00-\u9fa5]/.test(char) && /[^\|]/.test(char)) {
	        //this char is a general character(such as a-z,0-9,_, etc),
	        //and should find symbol character(such as *&^%$|{(, etc).
	        //
	        //pattern string for find symbol char:
	        patternStr = "[^\\w\u4e00-\u9fa5]";
	    } else if (/\W/.test(char) && /\S/.test(char)) {
	        //this char is a symbol character(such as *&^%$, etc),
	        //and should find general character(such as a-z,0-9,_, etc).
	        //
	        //pattern string for find general char:
	        patternStr = "[\\w\u4e00-\u9fa5]";
	    }
	
	    //parse and get current word`s last character`s right position,
	    //and in other word, get the next word`s first character`s left position
	    //
	    var lastCharPos;
	    if (patternStr) {
	        //get first invisible character position
	        var firstInvisible = this.findSymbolAfter(p, '\\s');
	        //get first visible character which after first invisible space
	        var firstVisible = this.findSymbolAfter(firstInvisible, '\\S');
	        //get position
	        lastCharPos = this.findSymbolAfter(p, patternStr, '\\S');
	        lastCharPos = lastCharPos - p < firstInvisible - p ? lastCharPos : firstVisible;
	    } else {
	        //get any visible symbol`s position
	        lastCharPos = this.findSymbolAfter(p, '\\S');
	    }
	
	    //return current word`s start position and end position
	    //
	    if (lastCharPos < this.getText().length) {
	        return [p, lastCharPos];
	    }
	    return [p, undefined];
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Created by top on 15-9-6.
	 */
	const GENERAL = 'general_mode';
	const COMMAND = 'command_mode';
	const EDIT    = 'edit_mode';
	const VISUAL  = 'visual_mode';
	const _ENTER_ = '\n';
	
	var App;
	var vim;
	var textUtil;
	
	exports._init = function (app) {
	    App = app;
	    vim = app.vim;
	    textUtil = app.textUtil;
	}
	
	exports.setVim = function(v) {
	    vim = v;
	}
	
	exports.setTextUtil = function(tu) {
	    textUtil = tu;
	}
	
	exports.selectPrevCharacter = function (num) {
	    App.repeatAction(function(){
	        vim.selectPrevCharacter();
	    }, num);
	};
	
	exports.selectNextCharacter = function (num) {
	    App.repeatAction(function(){
	        vim.selectNextCharacter();
	    }, num);
	};
	
	exports.switchModeToGeneral = function () {
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
	
	exports.switchModeToVisual = function () {
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
	
	exports.append = function() {
	    vim.append();
	    setTimeout(function () {
	        vim.switchModeTo(EDIT);
	    }, 100);
	};
	
	exports.insert = function() {
	    vim.insert();
	    setTimeout(function () {
	        vim.switchModeTo(EDIT);
	    }, 100);
	};
	
	exports.selectNextLine = function (num) {
	    App.repeatAction(function(){
	        vim.selectNextLine();
	    }, num);
	};
	
	exports.selectPrevLine = function (num) {
	    App.repeatAction(function(){
	        vim.selectPrevLine();
	    }, num);
	};
	
	exports.copyChar = function() {
	    vim.pasteInNewLineRequest = false;
	    App.clipboard = textUtil.getSelectedText();
	    if (vim.isMode(VISUAL)) {
	        this.switchModeToGeneral();
	    }
	};
	
	exports.copyCurrentLine = function(num) {
	    var _data = {p:undefined, t:''};
	    App.repeatAction(function () {
	        _data.t = vim.copyCurrentLine(_data.p);
	        _data.p = textUtil.getNextLineStart(_data.p);
	        return _data.t;
	    }, num);
	};
	
	exports.pasteAfter = function () {
	    if (App.clipboard !== undefined) {
	        if(vim.pasteInNewLineRequest){
	            var ep = textUtil.getCurrLineEndPos();
	            textUtil.appendText(_ENTER_ + App.clipboard, ep, true, true);
	        } else {
	            textUtil.appendText(App.clipboard, undefined, true, false)
	        }
	    }
	};
	
	exports.pasteBefore = function () {
	    if (App.clipboard !== undefined) {
	        if(vim.pasteInNewLineRequest){
	            var sp = textUtil.getCurrLineStartPos();
	            textUtil.insertText(App.clipboard + _ENTER_, sp, true, true);
	        } else {
	            textUtil.insertText(App.clipboard, undefined, true, false)
	        }
	    }
	};
	
	exports.moveToCurrentLineHead = function () {
	    vim.moveToCurrentLineHead();
	};
	
	exports.moveToCurrentLineTail = function () {
	    vim.moveToCurrentLineTail();
	};
	
	exports.replaceChar = function () {
	    vim.replaceRequest = true;
	};
	
	exports.appendNewLine = function () {
	    vim.appendNewLine();
	    setTimeout(function () {
	        vim.switchModeTo(EDIT);
	    }, 100);
	};
	
	exports.insertNewLine = function () {
	    vim.insertNewLine();
	    setTimeout(function () {
	        vim.switchModeTo(EDIT);
	    }, 100);
	};
	
	exports.delCharAfter = function (num) {
	    App.repeatAction(function(){
	       return vim.deleteSelected();
	    }, num);
	    this.switchModeToGeneral()
	};
	
	exports.backToHistory = function () {
	    var key = App.getEleKey();
	    var list = App.doList[key];
	    vim.backToHistory(list);
	};
	
	exports.delCurrLine = function (num) {
	    App.repeatAction(function () {
	       return vim.delCurrLine();
	    }, num);
	};
	
	exports.moveToFirstLine = function () {
	    vim.moveToFirstLine();
	};
	
	exports.moveToLastLine = function () {
	    vim.moveToLastLine();
	};
	
	exports.moveToNextWord = function (num) {
	    App.repeatAction(function(){
	        vim.moveToNextWord();
	    }, num);
	};
	
	exports.copyWord = function (num) {
	    vim.pasteInNewLineRequest = false;
	    var sp = textUtil.getCursorPosition();
	    var ep;
	    App.repeatAction(function(){
	        ep = vim.copyWord(ep);
	    }, num);
	    App.clipboard = textUtil.getText(sp,ep);
	};
	
	exports.deleteWord = function (num) {
	    vim.pasteInNewLineRequest = false;
	    App.repeatAction(function () {
	       return vim.deleteWord();
	    }, num);
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by top on 15-9-6.
	 */
	const GENERAL = 'general_mode';
	const VISUAL  = 'visual_mode';
	const _ENTER_ = '\n';
	
	var _ = __webpack_require__(1);
	var config = __webpack_require__(8);
	var routes = __webpack_require__(9);
	var bind = __webpack_require__(10);
	var extend = _.extend;
	
	exports.classes = {}
	
	exports._init = function (options) {
	    extend(this, __webpack_require__(12));
	
	    this.config = extend(config, options);
	    this.key_code_white_list = config.key_code_white_list;
	
	    this.router = this.createClass('Router');
	    this.textUtil = this.createClass('TextUtil', this.currentEle);
	    this.vim = this.createClass('Vim', this.textUtil);
	    this.controller = this.createClass('Controller', this);
	
	    this._log(this);
	    this._start();
	}
	
	exports._start = function () {
	    this._route();
	    this._bind();
	}
	
	exports._route = function () {
	    routes.ready(this.router);
	}
	
	exports._bind = function() {
	    bind.listen(this);
	}
	
	exports._on = function (event, fn) {
	    if (!this._events) {
	        this._events = {}
	    }
	    if (typeof  fn === 'function') {
	        this._events[event] = fn;
	    }
	    return this;
	}
	
	exports._fire = function (event) {
	    if (!this._events || !this._events[event]) {
	        return;
	    }
	    var args = Array.prototype.slice.call(arguments, 1) || [];
	    var fn = this._events[event];
	    fn.apply(this, args);
	    return this;
	}
	
	exports._log = function(msg, debug) {
	    debug = debug ? debug : this.config.debug;
	    if (debug) {
	        console.log(msg)
	    }
	}
	
	exports.repeatAction = function(action, num) {
	    if (typeof action !== 'function') {
	        return;
	    }
	    var res = undefined;
	    if (num === undefined || isNaN(num)) {
	        num = 1;
	    }
	    for (var i=0;i<num;i++) {
	        res = action.apply();
	        if (res) {
	            if (!i) {
	                this.clipboard = '';
	            }
	            if (i == num-1) {
	                //remove line break char
	                res = res.replace(_ENTER_, '');
	            }
	            this.clipboard = this.clipboard + res;
	        }
	    }
	}
	
	exports.recordText = function(t, p) {
	    t = (t === undefined) ? this.textUtil.getText() : t;
	    p = (p === undefined) ? this.textUtil.getCursorPosition() : p;
	    var data = {
	        't':t,
	        'p':p
	    };
	    var key = this.getEleKey();
	    if (!this.doList[key]) {
	        this.doList[key] = [];
	    }
	    if (this.doList[key].length >= this.doListDeep) {
	        this.doList[key].shift();
	    }
	    this.doList[key].push(data);
	    this._log(this.doList);
	}
	
	exports.getEleKey = function() {
	    return _.indexOf(this.boxes, this.currentEle);
	}
	
	exports.numberManager = function(code) {
	    if (code == 68 || code == 89) {
	        //防止ndd和nyy时候数值计算错误,如当code为68时，
	        //如果不拦截，则会在后面执行initNumber()，导致dd时无法获取数值
	        return undefined;
	    }
	    var num = String.fromCharCode(code);
	    if (!isNaN(num) && num >=0 && num <=9) {
	        this._number = this._number + '' + num;
	        this._log('number:' + this._number);
	    } else {
	        var n = this._number;
	        this.initNumber();
	        if (n) {
	            return parseInt(n);
	        }
	    }
	    return undefined;
	}
	
	exports.initNumber = function() {
	    this._number = '';
	}
	
	exports.isUnionCode = function (code, maxTime) {
	    if (maxTime === undefined) {
	        maxTime = 600;
	    }
	    var ct = _.currentTime();
	    var pt = this.prevCodeTime;
	    var pc = this.prevCode;
	    this.prevCode = code;
	    this.prevCodeTime = ct;
	    if (pc && (maxTime < 0 || ct - pt <= maxTime)) {
	        if (pc == code) {
	            this.prevCode = undefined;
	        }
	        return pc + '_' + code;
	    }
	    return undefined;
	}
	
	exports.parseRoute = function(code, ev, num) {
	    var c = this.controller;
	    var param = num;
	    var prefix = 'c.';
	    var suffix = '(param)';
	    var vimKeys = this.router.getKeys();
	    if (code === 27) {
	        c.switchModeToGeneral();
	        return;
	    }
	    if (vimKeys[code] && (this.vim.isMode(GENERAL) || this.vim.isMode(VISUAL))) {
	        var mode = vimKeys[code]['mode'];
	        if (mode && !this.vim.isMode(mode)) {
	            return false;
	        }
	        var keyName = vimKeys[code]['name'];
	        if (ev.shiftKey) {
	            if (keyName == keyName.toUpperCase()) {
	                keyName = 'shift_' + keyName;
	            } else {
	                keyName = keyName.toUpperCase();
	            }
	        }
	        this._log(vimKeys[code][keyName] + suffix);
	        if (vimKeys[code][keyName]) {
	            //record
	            if (vimKeys[code]['record']) {
	                this.recordText();
	            }
	            eval(prefix + vimKeys[code][keyName] + suffix);
	            //init number
	            this.initNumber();
	        }
	    }
	}
	
	exports.class = function (name, fn) {
	    if (!name) {
	        throw new Error('first param is required');
	    }
	    if (typeof fn !== 'function') {
	        throw new Error('second param must be a function');
	    }
	    this.classes[name] = fn;
	}
	
	exports.createClass = function(name, arg) {
	    var fn = this.classes[name];
	    if (typeof fn !== 'function') {
	        throw new Error('class '+name+' not define');
	    }
	    return new fn(arg);
	}
	


/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Created by top on 15-9-6.
	 */
	
	module.exports = {
	
	    /**
	     * whether to print debut messages
	     */
	    debug: true,
	
	    /**
	     * how to show msg from vim app
	     * @param msg
	     * @param code
	     */
	    showMsg: function(msg, code) {
	        alert(msg);
	    },
	
	    /**
	     * key codes white list of vim,
	     * they are effective in general and visual mode
	     */
	    key_code_white_list: [9, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123]
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Created by top on 15-9-6.
	 */
	
	exports.ready = function(router){
	
	    //---------------------------
	    //system feature keys:
	    //---------------------------
	
	    router.code(35, 'End').action('End', 'moveToCurrentLineTail');
	    router.code(36, 'Home').action('Home', 'moveToCurrentLineHead');
	    router.code(37, 'Left').action('Left', 'selectPrevCharacter');
	    router.code(38, 'Up').action('Up', 'selectPrevLine');
	    router.code(39, 'Right').action('Right', 'selectNextCharacter');
	    router.code(40, 'Down').action('Down', 'selectNextLine');
	    router.code(45, 'Insert').action('Insert', 'insert');
	    router.code(46, 'Delete').action('Delete', 'delCharAfter').record(true);
	
	    //---------------------------
	    //vim feature keys:
	    //---------------------------
	
	    //0:move to current line head
	    router.code(48, '0').action(0, 'moveToCurrentLineHead');
	    //&:move to current line tail
	    router.code(52, '4').action('shift_4', 'moveToCurrentLineTail');
	    //append
	    router.code(65, 'a').action('a', 'append').action('A', 'appendLineTail');
	    //insert
	    router.code(73, 'i').action('i', 'insert').action('I', 'insertLineHead');
	    //new line
	    router.code(79, 'o').action('o', 'appendNewLine').action('O', 'insertNewLine').record(true);
	    //replace
	    router.code(82, 'r').action('r', 'replaceChar');
	    //down
	    router.code(13, 'enter').action('enter', 'selectNextLine');
	    router.code(74, 'j').action('j', 'selectNextLine');
	    //up
	    router.code(75, 'k').action('k', 'selectPrevLine');
	    //left
	    router.code(72, 'h').action('h', 'selectPrevCharacter');
	    //right
	    router.code(76, 'l').action('l', 'selectNextCharacter');
	    //paste
	    router.code(80, 'p').action('p', 'pasteAfter').action('P', 'pasteBefore').record(true);
	    //back
	    router.code(85, 'u').action('u', 'backToHistory');
	    //copy char
	    router.code(89, 'y').action('y', 'copyChar').mode('visual_mode');
	    router.code('89_89', 'yy').action('yy', 'copyCurrentLine');
	    //v
	    router.code(86, 'v').action('v', 'switchModeToVisual').action('V', 'switchModeToVisual');
	    //delete character
	    router.code(88, 'x').action('x', 'delCharAfter').action('X', 'delCharBefore').record(true);
	    //delete selected char in visual mode
	    router.code(68, 'd').action('d', 'delCharAfter').mode('visual_mode').record(true);
	    //delete line
	    router.code('68_68', 'dd').action('dd', 'delCurrLine').record(true);
	    //G
	    router.code(71, 'g').action('G', 'moveToLastLine');
	    //gg
	    router.code('71_71', 'gg').action('gg', 'moveToFirstLine');
	    //move to next word
	    router.code(87, 'w').action('w', 'moveToNextWord').action('W', 'moveToNextWord');
	    //copy word
	    router.code('89_87', 'yw').action('yw', 'copyWord');
	    //delete one word
	    router.code('68_87', 'dw').action('dw', 'deleteWord').record(true);
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by top on 15-9-6.
	 */
	const GENERAL = 'general_mode';
	const VISUAL  = 'visual_mode';
	
	var _ = __webpack_require__(1);
	var filter = __webpack_require__(11);
	var App;
	
	exports.listen = function(app) {
	    App = app;
	    var boxes = window.document.querySelectorAll('input, textarea');
	    App.boxes = boxes;
	    for (var i = 0; i<boxes.length;i++) {
	        var box = boxes[i];
	        box.onfocus = onFocus;
	        box.onclick = onClick;
	        box.onkeydown = onKeyDown;
	    }
	    App._on('reset_cursor_position', function (e) {
	        if (App.vim.isMode(GENERAL) || App.vim.isMode(VISUAL)) {
	            App.vim.resetCursorByMouse();
	        }
	    });
	    App._on('input', function(ev, replaced){
	        var code = getCode(ev);
	        App._log('mode:'+App.vim.currentMode);
	        if (replaced) {
	            App.recordText();
	            return;
	        }
	        if (filter.code(App, code)) {
	            var unionCode = App.isUnionCode(code, -1);
	            var vimKeys = App.router.getKeys();
	            if (unionCode && vimKeys[unionCode]) {
	                code = unionCode;
	            }
	            App._log('key code:'+code);
	            var num = App.numberManager(code);
	            App.parseRoute(code, ev, num);
	        }
	    });
	}
	
	function onFocus() {
	    App.currentEle = this;
	    App.textUtil.setEle(this);
	    App.vim.setTextUtil(App.textUtil);
	    App.vim.resetVim();
	    App.controller.setVim(App.vim);
	    App.controller.setTextUtil(App.textUtil);
	    App.initNumber();
	}
	
	function onClick(e) {
	    var ev = e || event || window.event;
	    App._fire('reset_cursor_position', ev);
	}
	
	function onKeyDown(e) {
	    var replaced = false;
	    var ev = getEvent(e);
	    var code = getCode(e);
	    if (_.indexOf(App.key_code_white_list, code) !== -1) {
	        return;
	    }
	    if (App.vim.isMode(GENERAL) || App.vim.isMode(VISUAL)) {
	        if (App.vim.replaceRequest) {
	            replaced = true;
	            App.vim.replaceRequest = false;
	            setTimeout(function () {
	                App.vim.selectPrevCharacter();
	            }, 50);
	        } else {
	            if (ev.preventDefault) {
	                ev.preventDefault();
	            } else {
	                ev.returnValue = false;
	            }
	        }
	    } else {
	        if(code != 27){
	            var p = App.textUtil.getCursorPosition();
	            App.recordText(undefined, (p-1>=0 ? p-1:p));
	        }
	    }
	    App._fire('input', ev, replaced);
	}
	
	function getEvent(e) {
	    return e || event || window.event;
	}
	
	function getCode(ev) {
	    var e = getEvent(ev);
	    return e.keyCode || e.which || e.charCode;
	}


/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * Created by top on 15-9-6.
	 */
	const GENERAL = 'general_mode';
	const COMMAND = 'command_mode';
	const EDIT    = 'edit_mode';
	const VISUAL  = 'visual_mode';
	
	exports.code = function (App, code) {
	    var passed = true;
	    if (code == 229) {
	        if (App.vim.isMode(GENERAL) || App.vim.isMode(VISUAL)) {
	            passed = false;
	            var msg = 'Execution failure! Please use the vim instructions in the English input method.';
	            App._log(msg);
	            App.config.showMsg(msg);
	        }
	    }
	    return passed;
	}


/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * current element
	 * @type {undefined}
	 */
	exports.currentEle = undefined;
	
	/**
	 * elements of vim.js app
	 * @type {undefined}
	 */
	exports.boxes = undefined;
	
	/**
	 * app config
	 * @type {undefined}
	 */
	exports.config = undefined;
	
	/**
	 * Router instance
	 * @type {undefined}
	 */
	exports.router = undefined;
	
	/**
	 * Vim instance
	 * @type {undefined}
	 */
	exports.vim = undefined;
	
	/**
	 * TextUtil instance
	 * @type {undefined}
	 */
	exports.textUtil = undefined;
	
	/**
	 * clipboard of app
	 * @type {undefined}
	 */
	exports.clipboard = undefined;
	
	/**
	 * app do list
	 * @type {Array}
	 */
	exports.doList = [];
	
	/**
	 * app do list deep
	 * @type {number}
	 */
	exports.doListDeep = 100;
	
	/**
	 * previous key code
	 * @type {undefined}
	 */
	exports.prevCode = undefined;
	
	exports.prevCodeTime = 0;
	
	/**
	 * numerical for vim command
	 * @type {string}
	 * @private
	 */
	exports._number = '';
	
	/**
	 * key codes white list of vim
	 * @type {Array}
	 */
	exports.key_code_white_list = [];
	


/***/ }
/******/ ]);
//# sourceMappingURL=vim.js.map