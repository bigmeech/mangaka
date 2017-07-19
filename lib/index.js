'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Manga;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const ind = require('./sources/mangafox')
/**
 * util function for silent requires
 * @param modulePath
 * @returns {*|{enumerable, writable, configurable, value}|Promise.<T>}
 */
function promiseQuire(modulePath) {
    return _bluebird2.default.attempt(() => {
        return require(modulePath);
    }).catch(err => {
        // console.log(new Error(`Cannot find source adapter on ${modulePath}`));
        return _bluebird2.default.reject(err);
    });
}

/**
 *
 * @param options
 * @constructor
 */
function Manga(options) {

    /**
     * returns api based on passed source
     * @returns {Promise.<TResult>}
     */
    this.fromSource = () => {
        const sourcePath = `./sources/${options.source}`;
        return promiseQuire(sourcePath).then(api => api).catch(err => _bluebird2.default.reject(err));
    };

    /**
     * searches and return a chapter from any source it finds.
     * Some sources might not have certain series so this is a source wide search.
     * @param title
     * @param chapter
     */
    this.search = (title, chapter) => {
        return new _bluebird2.default();
    };
}
module.exports = exports['default'];