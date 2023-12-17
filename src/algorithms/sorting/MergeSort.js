import React, { useState } from 'react';
import useAnimator from '../../hooks/useAnimator';
import { Numbox, SortNumbers } from '../../components/numbers';
import { Colors } from '../../common/constants';
import { try_, wait } from '../../common/utils';

var arr = [];
var delay = 500;

export default function MergeSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { bgcolor, tx, ty, txy }] = useAnimator();

    const animate = (r, s) => {
        return txy(`#box${s}`, 60 * (r - s), 60);
    };

    const merge = async (start, mid, end) => {
        arr.forEach((_, i) => {
            if (i >= start && i <= end) {
                bgcolor(`#box${i}`, Colors.compare);
            } else if (i < start) {
                bgcolor(`#box${i}`, Colors.white);
            }
        });
        await wait(1000);
        let p = start, q = mid + 1;
        let r = start, tmp = [];
        while (r <= end) {
            if (p <= mid && q <= end) {
                if (arr[p] <= arr[q]) {
                    tmp.push(arr[p]);
                    await animate(r, p);
                    p++;
                } else {
                    tmp.push(arr[q]);
                    await animate(r, q);
                    q++;
                }
            } else if (p <= mid) {
                tmp.push(arr[p]);
                await animate(r, p);
                p++;
            } else {
                tmp.push(arr[q]);
                await animate(r, q);
                q++;
            }
            r++;
            await wait(delay);
        }
        tmp.forEach((_, i) => ty(`#box${start + i}`, 0));
        await wait(delay);
        tmp.forEach((_, i) => {
            bgcolor(`#box${start + i}`, Colors.sorted);
            arr[start + i] = tmp[i];
        });
        await wait(delay);
        tmp.forEach((_, i) => tx(`#box${start + i}`, 0, 0));
        setNumbers(arr.slice());
        await wait(delay);
    };

    const mergeSort = async (start, end) => {
        if (start === end) return;
        const mid = Math.floor((start + end) / 2);
        await mergeSort(start, mid);
        await mergeSort(mid + 1, end);
        await merge(start, mid, end);
    };

    const handleStart = (values) => {
        setNumbers(values);
        arr = values.slice();
        setTimeout(mergeSort, 1000, 0, arr.length - 1);
    };

    const handleStop = () => setNumbers([]);

    return (
        <SortNumbers onStart={handleStart} onStop={handleStop}>
            <div className="d-flex pt-4" ref={scope}>
                {numbers.map((num, i) => (
                    <Numbox key={i} index={i} value={num} />
                ))}
            </div>
        </SortNumbers>
    );
}
