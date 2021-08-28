const youtubeLiveTranslator = require('./index');

youtubeLiveTranslator({
    url: 'https://www.youtube.com/watch?v=mr15Xzb1Ook',
    lang: 'en-US',
    outputCallback: console.log,
    isVideo: true,
    translateTo: 'pt-BR'
});