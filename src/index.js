import Promise from 'bluebird';
import path from 'path';

// const ind = require('./sources/mangafox')
/**
 * util function for silent requires
 * @param modulePath
 * @returns {*|{enumerable, writable, configurable, value}|Promise.<T>}
 */
function promiseQuire (modulePath, options) {
    return Promise.attempt(()=> {
        return require(modulePath)(options);
    }).catch((err) => {
        // console.log(new Error(`Cannot find source adapter on ${modulePath}`));
        return Promise.reject(err)
    });
}

/**
 *
 * @param options
 * @constructor
 */
export default function Manga(options) {

    /**
     * returns api based on passed source
     * @returns {Promise.<TResult>}
     */
    this.fromSource = () => {
        const sourcePath = `./sources/${options.source}`;
        return promiseQuire(sourcePath, options)
            .then(( source ) => source )
            .catch((err) => Promise.reject(err));
    };

    /**
     * searches and return a chapter from any source it finds.
     * Some sources might not have certain series so this is a source wide search.
     * @param title
     * @param chapter
     */
    this.search = (title, chapter) => {
        return new Promise();
    }
}