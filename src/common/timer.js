var timer, start;
var callback, delay;
var status = 0;

export default {
    timeout(cb, d, ...args) {
        delay = d;
        callback = () => {
            status = 0;
            cb(...args);
        };
        status = 1;
        start = Date.now();
        timer = setTimeout(callback, d);
    },

    pause() {
        if (status === 1) {
            delay = start + delay - Date.now();
            status = -1;
            clearTimeout(timer);
        }
    },

    resume() {
        if (status === -1) {
            start = Date.now();
            status = 1;
            timer = setTimeout(callback, delay);
        }
    },

    clear() {
        status = 0;
        clearTimeout(timer);
    },
};
