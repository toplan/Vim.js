var _ = require('./util/helper.js');
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
extend(p, require('./instance/router/router.js'));

/**
 * Vim constructor
 * @constructor
 */
function Vim(textUtil) {
    this._init(textUtil);
}
p = Vim.prototype;
extend(p, require('./instance/vim/vim.js'));

/**
 * textUtil constructor
 * @constructor
 */
function TextUtil(element) {
    this._init(element);
}
p = TextUtil.prototype;
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
    this._init(options)
}
p = App.prototype;
extend(p, require('./instance/app/app.js'));
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