/**
 * Created by top on 15-9-6.
 */
const GENERAL = 'general_mode';
const VISUAL  = 'visual_mode';

var _ = require('./util/helper.js');
var filter = require('./filter.js');
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
