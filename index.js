require('./src/environment')().build();

const createStreamConnector = require('./src/stream');
const createConversor = require('./src/convert');
const createRecognizer = require('./src/recognize');
const createWatcher = require('./src/watch');
const createQueue = require('./src/queue');
const createEvents = require('./src/event');
const createTranslator = require('./src/translate');

async function main({ url, lang = 'en-US', segmentSize = 10, segmentBuffer = 20, showLogs = false, outputCallback = console.log, isVideo = false, translateTo = null }) {
    let lastPath;

    const onEnd = () => {
        if (showLogs) console.log('[EVENT] Finished');
        if (isVideo) process.exit(0);
    };

    const disposer = text => {
        if (!text) return;
        outputCallback(text);
    }

    const events = createEvents({ onEnd, showLogs });
    const stream = createStreamConnector({ onEnd: events.onEndStream });
    const conversor = createConversor({ segmentSize, segmentBuffer: isVideo ? null : segmentBuffer, onEnd: events.onEndEncoding });
    const recognizer = createRecognizer({ lang, segmentSize, showLogs });
    const translator = createTranslator();

    const queue = await createQueue({ disposer, onEnd: events.onEndTranscription });

    const callback = path => {
        if (path === lastPath) return;

        const callback = translateTo ?
            async () => {
                const text = await recognizer.recognize(path);
                return await translator.translate(text, translateTo);
            } :
            async () => await recognizer.recognize(path);

        queue.push(callback);
        lastPath = path;
    };

    const watcher = createWatcher({ callback });

    watcher.start();

    const live = stream.connect(url);

    conversor.fromStream(live);
}

module.exports = main;