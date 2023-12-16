import React, { useState } from 'react';
import useAnimator from '../../hooks/useAnimator';
import { Numbox, SortNumbers } from '../../components/numbers';
import { Colors } from '../../common/constants';
import { try_, wait } from '../../common/utils';

var arr = [];
var delay = 500;

export default function InsertionSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { bgcolor, tx, ty }] = useAnimator();

    const pickNumber = async (i) => {
        await bgcolor(`#box${i}`, Colors.compare);
        await wait(delay);
        await ty(`#box${i}`, -50, 0.5);
        await wait(delay);
    };

    const sortNumbers = try_(async () => {
        await bgcolor(`#box${0}`, Colors.sorted);
        await wait(delay);
        for (let i = 1; i < arr.length; i++) {
            await pickNumber(i);
            let num = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > num) {
                arr[j + 1] = arr[j];
                await tx(`#box${j}`, 60, 0.5);
                j--;
            }
            if (j < i - 1) {
                arr[j + 1] = num;
                let k = i - (j + 1);
                await tx(`#box${i}`, -k * 60, k * 0.2);
            }
            await ty(`#box${i}`, 0, 0.5);
            await bgcolor(`#box${i}`, Colors.sorted);
            await wait(delay);
            for (let k = j + 1; k <= i; k++) {
                tx(`#box${k}`, 0, 0);
            }
            setNumbers(arr.slice());
            await wait(delay);
        }
    });

    const handleStart = (values) => {
        setNumbers(values);
        arr = values.slice();
        setTimeout(sortNumbers, 1000);
    };

    const handleStop = () => setNumbers([]);

    return (
        <SortNumbers onStart={handleStart} onStop={handleStop}>
            <div className="d-flex insertionSort" ref={scope}>
                {numbers.map((num, i) => (
                    <Numbox key={i} index={i} value={num} />
                ))}
            </div>
        </SortNumbers>
    );
}
