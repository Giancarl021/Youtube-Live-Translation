const locate = require('@giancarl021/locate');
const chokidar = require('chokidar');

module.exports = function ({ path = 'data', callback }) {
    let watcher;
    function start() {
        watcher = chokidar.watch(locate(path));

        watcher.on('change', path => callback(path));
    }

    function stop() {
        if (watcher) watcher.close();
    }
    
    return {
        start,
        stop
    };
}