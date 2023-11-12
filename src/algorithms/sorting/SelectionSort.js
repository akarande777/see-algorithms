import React, { useState } from 'react';
import useAnimator from '../../hooks/useAnimator';
import { Numbox, SortNumbers } from '../../components/numbers';
import { Colors } from '../../common/constants';
import { delay } from '../../common/utils';

var numbers = [];

export default function SelectionSort() {
    const [_numbers, setNumbers] = useState([]);
    const [scope, { bgcolor, tx, ty }] = useAnimator();

    const pickNumber = async (i) => {
        await bgcolor(`#box${i}`, Colors.compare);
        await ty(`#box${i}`, -60, 0.5);
        await delay(500);
    };

    const nextNumber = async (j) => {
        bgcolor(`#box${j}`, Colors.compare);
        bgcolor(`#box${j - 1}`, Colors.white);
        await delay(500);
    };

    const swapNumbers = async (i, j) => {
        let k = j - i;
        await Promise.all([
            tx(`#box${i}`, k * 70, 0.2 * k),
            tx(`#box${j}`, -k * 70, 0.2 * k),
        ]);
        await Promise.all([ty(`#box${i}`, 0, 0.5), ty(`#box${j}`, 0, 0.5)]);
        await Promise.all([tx(`#box${i}`, 0, 0), tx(`#box${j}`, 0, 0)]);
        let num = numbers[i];
        numbers[i] = numbers[j];
        numbers[j] = num;
        setNumbers(numbers.slice());
    };

    const sortNumbers = async () => {
        let n = numbers.length;
        for (let i = 0; i < n - 1; i++) {
            await pickNumber(i);
            let k = i;
            for (let j = i + 1; j < n; j++) {
                await nextNumber(j);
                if (numbers[j] < numbers[k]) {
                    ty(`#box${k}`, 0, 0.5);
                    await pickNumber(j);
                    k = j;
                }
            }
            bgcolor(`#box${n - 1}`, Colors.white);
            await delay(500);
            if (k > i) {
                await ty(`#box${i}`, 60, 0.5);
                await swapNumbers(i, k);
            } else {
                await ty(`#box${k}`, 0, 0.5);
            }
            bgcolor(`#box${i}`, Colors.sorted);
            await delay(1000);
        }
        bgcolor(`#box${n - 1}`, Colors.sorted);
    };

    const handleStart = (values) => {
        setNumbers(values);
        numbers = values.slice();
        setTimeout(sortNumbers, 1000);
    };

    const handleStop = () => {
        setNumbers([]);
        numbers = [];
    };

    return (
        <SortNumbers onStart={handleStart} onStop={handleStop}>
            <div className="d-flex selectionSort" ref={scope}>
                {_numbers.map((num, i) => (
                    <Numbox key={i} index={i} value={num} />
                ))}
            </div>
        </SortNumbers>
    );
}
