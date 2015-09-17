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
    var sp = vim.visualPosition || textUtil.getCursorPosition();
    var ep;
    App.repeatAction(function(){
        ep = vim.copyWord(ep);
    }, num);
    App.clipboard = textUtil.getText(sp,ep);
};

exports.deleteWord = function (num) {
    App.repeatAction(function () {
       return vim.deleteWord();
    }, num);
};
