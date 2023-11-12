import { useAnimate } from 'framer-motion';
import { useMemo } from 'react';

export default function useAnimator() {
    const [scope, animate] = useAnimate();

    const animator = useMemo(() => ({
        bgcolor(id, color) {
            return animate(id, { backgroundColor: color });
        },
        tx(id, x, t) {
            return animate(id, { x }, { duration: t });
        },
        ty(id, y, t) {
            return animate(id, { y }, { duration: t });
        },
        txy(id, x, y, t) {
            return animate(id, { x, y }, { duration: t });
        },
        width(id, width, t) {
            return animate(id, { width }, { duration: t });
        },
        rotate(id, rotate, t) {
            return animate(id, { rotate }, { duration: t });
        },
    }), [animate]);

    return [scope, animator];
}
