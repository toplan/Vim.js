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
