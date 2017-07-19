import Promise from 'bluebird'
import tableJson from 'tabletojson';
import rp from 'request-promise';
import cheerio from 'cheerio';
import { get } from 'lodash';
import memoize from 'promise-memorize'

/**
 * urls in mangafox are used in the form of xxxx_xxx_xxx
 * @param titleString
 * @returns {string}
 */
function formatUrlTitle(titleString){
    return titleString
        .replace(/(^\s+|\s+$)/gim, '')
        .replace(/(^\W+|\W+$)/gim, '')
        .replace(/(^\s+|\W+|^\W+|\W+$)/gim, '_')
        .toLowerCase();
}

/**
 * checks if manga is still ongoing from className of link on index page
 * @param className
 * @returns {*}
 */
function isStillOngoing (className) {
    if(className.includes('manga_open')){
        return true;
    } else if(className.includes('manga_close')) {
        return false;
    }
    else {
        return 'N/A'
    }
}

/**
 * take a cheerio object and explode its contents into json
 * @param chapters
 */
function explodeChapters (chapters) {
    return chapters.map((volumeChapter, idx) => {
        return {
            chapter_id: chapters.length - idx,
            title: get(volumeChapter, 'children[1].children[5].children[3].children[0].data', 'N/A'),
            url: get(volumeChapter, 'children[1].children[5].children[1].attribs.href', 'N/A')
        }
    }).sort((a, b) =>  a.chapter_id - b.chapter_id );
}

/**
 *  constructs a generic error object
 * @param message
 * @param status
 */
function createAndThrowError (message, status) {
    const genericErrorObject = new Error (message);
    genericErrorObject.status = status;
    delete genericErrorObject.stack;
    return genericErrorObject;
}

/**
 * abstracts away the process of looking up a manga by id in the index
 * @param mid
 */
function findMangaById (mId) {
    return Promise
        .resolve(mangaIndex)
        .then((mangas) => {
            const manga = mangas.find((manga) =>  manga.m_id === mId);
            if (!manga) {
                const cannotFindMangaError = createAndThrowError(`Could not find any manga with id ${mId}`, 404);
                throw cannotFindMangaError;
            }
            return manga;
        })
        .catch((err) => Promise.reject(err));
}

/**
 * return a nested array contain all the volumes in the series and their containing chapters
 * @param $
 * @returns {Array}
 */
function getVolumes($){
    const volumes = [];
    const volumeContainers = $('.chlist');
    volumeContainers.each((idx, volume) => {
        const chapters = volume.children.filter((child) => {
            return child.name === 'li';
        });
        volumes.push ({
            volume_number: volumeContainers.length - idx,
            chapter_count: chapters.length,
            chapters: explodeChapters(chapters)
        });
    });
    return volumes;
}

/**
 * returns some babsic info about the title
 * @param $
 * @param info
 * @returns {{synopsis: jQuery, info: {releaseYear: *, author: *, artist: *, genre: (Array|*)}, rating: {value: Number, total: number}, content: {volumes: *}}}
 */
function createTitleInfo ($, info) {
    return {
        synopsis: $('.summary').text(),
        info: formatMangaInfo(info[0][0]),
        rating:{
        value: parseFloat($('#rating')[0].attribs.rel),
            total: 5.0
        },
        content_info: {
            volumes: getVolumes($)
        }
    }
}

/**
 *
 * @param infoData
 * @returns {{releaseYear: *, author: *, artist: *, genre: (Array|*)}}
 */
function formatMangaInfo(infoData){
    return {
        releaseYear: infoData["Released:"],
        author: infoData["Author(s):"],
        artist: infoData["Artist(s):"],
        genre: infoData["Genre(s):"].split(',')
    }
}

/**
 * talks to mangafox servers
 * @param url
 * @returns {*|{enumerable, writable, configurable, value}|Promise.<T>}
 */
function fetchData(url){
    const baseUrl = 'http://mangafox.me';
    return rp({ uri:baseUrl + url })
        .then((response) => {
            return cheerio.load(response);
        })
        .catch((error) => Promise.reject(error));
}

class MangafoxService {

    constructor(options) {
        this.options = options;
    }

    /**
     * gets index page
     */
    getIndex (options){
        return fetchData('/manga').then(($) => {
            const data = [];
            const links = $('.series_preview');
            links.each((i, link) => {
                data.push({
                    m_id: link.attribs.rel,
                    url: link.attribs.href,
                    title: link.children[0].data,
                    is_ongoing: isStillOngoing(link.attribs.class),
                    url_name: formatUrlTitle(link.children[0].data),
                    cover: this.getCoverUrls(link.attribs.rel)
                });
            });
            return { data };
        }).catch((error) => {
            return Promise.reject(error);
        });
    }

    /**
     * returns information about the title
     * @param mid
     */
    getTitleInfo (mId) {
        return this.getTitlePage(mId, mangaIndex)
            .then(($) => {
                const manga = mangaIndex.find((manga) =>  manga.m_id === mId);
                const info = tableJson.convert($('div#title').html());
                return Object.assign(manga, createTitleInfo($, info));
            })
            .catch((error) => Promise.reject(error));
    }

    /**
     *
     * @param mId
     */
    getChapters (mId) {
        return this.getTitlePage(mId)
            .then((idx) => {
                const manga = idx.find((manga) =>  manga.m_id === mid);
                return fetchData(`/manga/${ manga.url_name }`);
            })
            .then (($) => {
                console.log($(''));
            });
    }

    /**
     * get title page
     * @param mId
     */
    getTitlePage (mId) {
        return this.getTitles()
            .then((manga) => {
                console.log(manga);
                return fetchData(`/manga/${ manga.url_name }`);
            })
            .catch((err) => Promise.reject(err));
    }

    /**
     *
     * @param mId
     * @returns {{_s: string}}
     */
    getCoverUrls (mId) {
        return {
            _s: `http://l.mfcdn.net/store/manga/${mId}/cover.jpg`
        }
    }

}

export default (options) => {
    return new MangafoxService(options);
}