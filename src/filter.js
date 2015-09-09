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
