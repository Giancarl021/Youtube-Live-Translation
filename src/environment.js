const dotenv = require('dotenv');
const locate = require('@giancarl021/locate');
const fs = require('fs');

const dirs = [
    'data'
];

module.exports = function () {
    function build() {
        dotenv.config({ path: locate('.env') });

        dirs
            .map(locate)
            .forEach(dir => {
                if (fs.existsSync(dir)) {
                    fs.rmSync(dir, { recursive: true, force: true });
                }
                fs.mkdirSync(dir);
            });
    }

    return {
        build
    };
}