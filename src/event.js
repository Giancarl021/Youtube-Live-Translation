module.exports = function ({ onEnd, showLogs = false }) {
    const events = {};
    function onEndStream() {
        events.endStream = true;
        if (showLogs) console.log('[EVENT] Ended streaming');
    }

    function onEndEncoding() {
        events.endEncoding = true;
        if (showLogs) console.log('[EVENT] Ended encoding');
    }

    function onEndTranscription() {
        events.endTranscription = true;
        if (showLogs) console.log('[EVENT] Ended transcription');

        if (events.endStream && events.endEncoding && events.endTranscription) {
            onEnd();
        }
    }

    return {
        onEndStream,
        onEndEncoding,
        onEndTranscription
    };
}