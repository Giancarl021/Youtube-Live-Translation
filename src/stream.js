const ytdl = require('ytdl-core');

module.exports = function ({ onEnd = () => {} }) {
    function connect(url) {
        const live = ytdl(url, { quality: 'highestaudio' });

        live.on('end', () => onEnd());

        return live;
    }

    return {
        connect
    };
}