/**
 * Created by top on 15-9-6.
 */

exports._init = function() {
    this.currentCode = undefined;
    this._keys = {};
}

exports.code = function (code, name) {
    if (!this._keys[code]) {
        this._keys[code] = {}
    }
    this._keys[code]['name'] = name;
    this._keys[code]['mode'] = '';
    this._keys[code]['record'] = false;
    this.currentCode = code;
    return this;
}

exports.action = function (name, methodName) {
    if (!this.currentCode) {
        return
    }
    this._keys[this.currentCode][name] = methodName;
    return this;
}

exports.mode = function(mode) {
    if (!this.currentCode) {
        return
    }
    this._keys[this.currentCode]['mode'] = mode;
    return this;
}

exports.record = function(isRecord) {
    if (!this.currentCode) {
        return
    }
    this._keys[this.currentCode]['record'] = isRecord;
    return this;
}

exports.getKeys = function() {
    return this._keys;
}
