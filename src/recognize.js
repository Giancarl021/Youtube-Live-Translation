const sdk = require('microsoft-cognitiveservices-speech-sdk');
const fs = require('fs');

module.exports = function ({ lang = 'en-US', segmentSize = 10, showLogs = false }) {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
        process.env.SPEECH_SECRET,
        process.env.SPEECH_REGION
    );

    speechConfig.speechRecognitionLanguage = lang;
    speechConfig.setProperty(sdk.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs, '30000');

    async function recognize(audioPath) {
        const audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(audioPath));
        const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

        const result = await new Promise((resolve, reject) => {
            recognizer.recognizeOnceAsync(result => {

                if (result.errorDetails) {
                    return reject(result.errorDetails);
                }

                recognizer.close();

                setTimeout(() => fs.unlink(audioPath, err => (err && showLogs) && console.log('[EVENT] ' + err.message)), segmentSize * 1000);

                return resolve(result.text);
            });
        });

        return result;
    }

    return {
        recognize
    };
}