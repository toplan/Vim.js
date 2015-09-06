var u = require('./util/index.js');
var extend = u.extend;
var p;

/**
 * Router constructor
 * @constructor
 */
function Router () {
    this._init();
}
p = Router.prototype;
extend(p, require('./instance/router/router.js'));

/**
 * Vim constructor
 * @constructor
 */
function Vim (app) {
    this._init(app);
}
extend(Vim, require('./instance/vim/global.js'));
p = Vim.prototype;
extend(p, require('./instance/vim/vim.js'));

/**
 * textUtil constructor
 * @constructor
 */
function textUtil(app) {
    this._init(app);
}
p = textUtil.prototype;
extend(p, require('./instance/text/text.js'));

/**
 *
 * @constructor
 */
function Controller(app) {
    this._init(app);
}
p = Controller.prototype;
extend(p, require('./instance/controller.js'));

/**
 * App constructor
 * @constructor
 */
function App (options) {
    this._init(options, Router, textUtil, Vim, Controller)
        .start();
}
extend(App, require('./instance/app/global.js'));
p = App.prototype;
extend(p, require('./instance/app/app.js'));

/**
 * define vim
 * @type {{open: Function}}
 */
window.vim = {
    open: function(options){
        return new App(options)
    }
};