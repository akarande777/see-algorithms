
export const setPrevious = (() => {
    const ref = {};
    return (value) => {
        if (!ref.current) {
            ref.current = value;
            ref.previous = undefined;
        }
        else if (value !== ref.current) {
            ref.previous = ref.current;
            ref.current = value;
        }
        return ref.previous;
    }
})();