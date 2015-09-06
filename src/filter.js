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
            App._log('vim指令执行失败，请将输入法切换到英文输入');
            App.config.showMsg('vim指令执行失败，请将输入法切换到英文输入');
        }
    }
    return passed;
}
