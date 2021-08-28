const locate = require('@giancarl021/locate');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath = ffmpegPath;

module.exports = function ({ outputPath = 'data', segmentSize = 10, segmentBuffer = 20, onEnd = () => {} }) {
    function fromStream(stream) {

        const conversor = ffmpeg({ source: stream });

        if (segmentBuffer) {
            conversor.addOption('-segment_wrap', segmentBuffer);
        }

        conversor
            .audioCodec('pcm_s16le')
            .audioChannels(1)
            .audioBitrate(16000)
            .format('wav')
            .addOption('-f', 'segment')
            .addOption('-segment_time', segmentSize)
            .on('error', err => {
                console.error(err);
                process.exit(-1);
            })
            .on('end', () => onEnd())
            .saveToFile(`${locate(outputPath)}/%03d.wav`)
    }

    return {
        fromStream
    };
}