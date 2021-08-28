const fs = require('fs');
const youtubeLiveTranslator = require('./index');

const file = fs.createWriteStream('output.txt', { flags: 'a' });

youtubeLiveTranslator({
    url: 'https://www.youtube.com/watch?v=mr15Xzb1Ook',
    lang: 'en-US',
    outputCallback: data => file.write(data + '\n'),
    isVideo: true,
    translateTo: 'pt-BR',
    onEndCallback: () => file.end()
});