![build status](https://travis-ci.org/bigmeech/mangaka.svg?branch=master)

# What is this

This is promise based library for extracting scanlated content from manga websites

Supported Websites
- Mangafox

# Installation
``` npm install mangaka ```

# usage

```js
 // instantiate a new manga object passing source via an options object
 const optionsObject = {
    source: 'mangafox', // mangafox, mangeden, mangarack
    concurrency: 10,
    timeout: 10000
 }

 const manga = new Manga(optionsObject)
 const sourceApi = manga.fromSource().then((api) => api);
 sourceApi.then((api) => {
    api.getTitles().then((titles) => {
        console.log(titles);
    })
 })
```

# Options
- **source**: specify a source to crawl from. Only supports mangafox for now. (Pull requests are welcomed)
- **concurrency**: specify how many simulataneous connections to fire off
- **timeout**: specify a connection timeout.
- **useCache**: Memoize huge requests.

# API

### api.getTitleIndex(filterObject)
Returns an index of all titles with corresponding ids
- **accepts**:
    Query filter for params. filter by alphabets A - Z
- **return** :
    A promise which eventually resolves to an array of title objects;

### api.getTitle(titleId)
Returns some information about a particular title
- **accepts**:
    Id of the title. See call to getTitleIndex
- **return** :
    Some more information about the title in an expanded title object.

### api.getChapters(titleId, [volumeId])
Return all chapter info for a particular volume of a title
- **accepts**:
    Id of the title. See call to getTitleIndex,
    volume number of the title (if available)
- **return** :
    a promise that will eventually resolve to an object containing chapters in the volume.
