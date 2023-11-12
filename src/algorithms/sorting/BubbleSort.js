import React, { useState } from 'react';
import useAnimator from '../../hooks/useAnimator';
import { Numbox, SortNumbers } from '../../components/numbers';
import { Colors } from '../../common/constants';
import { delay } from '../../common/utils';

var numbers = [];

export default function BubbleSort() {
    const [_numbers, setNumbers] = useState([]);
    const [scope, { bgcolor, tx }] = useAnimator();

    const swapNumbers = async (a, b) => {
        await Promise.all([tx(`#box${a}`, 70, 0.5), tx(`#box${b}`, -70, 0.5)]);
        await Promise.all([tx(`#box${a}`, 0, 0), tx(`#box${b}`, 0, 0)]);
        let num = numbers[a];
        numbers[a] = numbers[b];
        numbers[b] = num;
        setNumbers(numbers.slice());
        await delay(500);
    };

    const compare = async (a, b) => {
        await Promise.all([
            bgcolor(`#box${a}`, Colors.compare),
            bgcolor(`#box${b}`, Colors.compare),
            a > 0 ? bgcolor(`#box${a - 1}`, Colors.white) : Promise.resolve(),
        ]);
        await delay(500);
    };

    const bubbleSort = async () => {
        let n = numbers.length;
        for (let i = 1; i < n; i++) {
            for (let j = 0; j < n - i; j++) {
                await compare(j, j + 1);
                if (numbers[j] > numbers[j + 1]) {
                    await swapNumbers(j, j + 1);
                }
            }
            let k = n - i;
            await Promise.all([
                bgcolor(`#box${k - 1}`, Colors.white),
                bgcolor(`#box${k}`, Colors.sorted),
            ]);
            await delay(500);
        }
        bgcolor(`#box${0}`, Colors.sorted);
    };

    const handleStart = (values) => {
        setNumbers(values);
        numbers = values.slice();
        setTimeout(bubbleSort, 1000);
    };

    const handleStop = () => {
        setNumbers([]);
        numbers = [];
    };

    return (
        <SortNumbers onStart={handleStart} onStop={handleStop}>
            <div className="d-flex pt-4" ref={scope}>
                {_numbers.map((num, i) => (
                    <Numbox key={i} index={i} value={num} />
                ))}
            </div>
        </SortNumbers>
    );
}
