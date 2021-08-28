module.exports = async function ({ disposer, onEnd = () => {}, idleTimeout = 5000 }) {
    const PQueue = (await import('p-queue')).default;
    const queue = new PQueue({ concurrency: 1, });

    queue.on('completed', disposer);
    queue.on('idle', () => onEnd());

    function push(callback) {
        queue.add(callback);
    }

    return {
        push
    };
}