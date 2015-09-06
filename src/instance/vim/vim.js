/**
 * Created by top on 15-9-6.
 */
const GENERAL = 'general_mode';
const COMMAND = 'command_mode';
const EDIT    = 'edit_mode';
const VISUAL  = 'visual_mode';
const _ENTER_ = '\n';

var textUtil;

exports._init = function (tu) {
    textUtil = tu;
    this.currentMode = EDIT;
    this.replaceRequest = false;
    this.parseInNewLineRequest = false;
    this.visualPosition = undefined;
    this.visualCursor = undefined;
};

exports._reset = function() {
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
    this.parseInNewLineRequest = false;
    return t;
};

exports.copyCurrentLine = function (p) {
    var sp = textUtil.getCurrLineStartPos(p);
    var ep = textUtil.getCurrLineEndPos(p);
    //clipboard = textUtil.getText(sp, ep);
    this.parseInNewLineRequest = true;
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
    this.parseInNewLineRequest = true;
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
}