/**
 * Created by top on 15-9-6.
 */
const GENERAL = 'general_mode';
const COMMAND = 'command_mode';
const EDIT    = 'edit_mode';
const VISUAL  = 'visual_mode';
const _ENTER_ = '\n';

var vim;
var textUtil;
var _repeat_action;

exports._init = function (app) {
    vim = app.vim;
    textUtil = app.textUtil;
    _repeat_action = app.repeatAction;
}

exports.setVim = function(v) {
    vim = v;
}

exports.setTextUtil = function(tu) {
    textUtil = tu;
}

exports.selectPrevCharacter = function (num) {
    _repeat_action(function(){
        vim.selectPrevCharacter();
    }, num);
};

exports.selectNextCharacter = function (num) {
    _repeat_action(function(){
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
    _repeat_action(function(){
        vim.selectNextLine();
    }, num);
};

exports.selectPrevLine = function (num) {
    _repeat_action(function(){
        vim.selectPrevLine();
    }, num);
};

exports.copyChar = function() {
    vim.parseInNewLineRequest = false;
    clipboard = textUtil.getSelectedText();
    if (vim.isMode(VISUAL)) {
        this.switchModeToGeneral();
    }
};

exports.copyCurrentLine = function(num) {
    var _data = {p:undefined, t:''};
    _repeat_action(function () {
        _data.t = vim.copyCurrentLine(_data.p);
        _data.p = textUtil.getNextLineStart(_data.p);
        return _data.t;
    }, num);
};

exports.pasteAfter = function () {
    if (clipboard !== undefined) {
        if(vim.parseInNewLineRequest){
            var ep = textUtil.getCurrLineEndPos();
            textUtil.appendText(_ENTER_ + clipboard, ep, true);
        } else {
            textUtil.appendText(clipboard, undefined, true)
        }
    }
};

exports.pasteBefore = function () {
    if (clipboard !== undefined) {
        if(vim.parseInNewLineRequest){
            var sp = textUtil.getCurrLineStartPos();
            textUtil.insertText(clipboard + _ENTER_, sp, true);
        } else {
            textUtil.insertText(clipboard, undefined, true)
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
    _repeat_action(function(){
       return vim.deleteSelected();
    }, num);
    this.switchModeToGeneral()
};

exports.backToHistory = function () {
    vim.backToHistory();
};

exports.delCurrLine = function (num) {
    _repeat_action(function () {
       return vim.delCurrLine();
    }, num);
};

exports.moveToFirstLine = function () {
    vim.moveToFirstLine();
};

exports.moveToLastLine = function () {
    vim.moveToLastLine();
}
