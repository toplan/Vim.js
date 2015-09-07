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
