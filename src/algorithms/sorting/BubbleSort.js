import React, { useState } from "react";
import Numbers, { Numbox } from "../../components/numbers/numbers";
import { Colors } from "../../common/constants";
import { useAnimate } from "framer-motion";
import { delay } from "../../common/utils";

var numbers = [];

export default function BubbleSort() {
    const [_numbers, setNumbers] = useState([]);
    const [scope, animate] = useAnimate();

    const swapNumbers = async (a, b) => {
        await Promise.all([
            animate(`#box${a}`, { x: 70 }, { duration: 1 }),
            animate(`#box${b}`, { x: -70 }, { duration: 1 }),
        ]);
        await Promise.all([
            animate(`#box${a}`, { x: 0 }, { duration: 0 }),
            animate(`#box${b}`, { x: 0 }, { duration: 0 }),
        ]);
        const temp = numbers[a];
        numbers[a] = numbers[b];
        numbers[b] = temp;
        setNumbers(numbers.slice());
    };

    const compare = (a, b) => {
        return Promise.all([
            animate(`#box${a}`, { backgroundColor: Colors.compare }),
            animate(`#box${b}`, { backgroundColor: Colors.compare }),
            a > 0
                ? animate(`#box${a - 1}`, { backgroundColor: "white" })
                : Promise.resolve(),
        ]);
    };

    const bubbleSort = async () => {
        for (let i = 1; i < numbers.length; i++) {
            for (let j = 0; j < numbers.length - i; j++) {
                await compare(j, j + 1);
                await delay(500);
                if (numbers[j] > numbers[j + 1]) {
                    await swapNumbers(j, j + 1);
                    await delay(500);
                }
            }
            let k = numbers.length - i;
            await Promise.all([
                animate(`#box${k - 1}`, { backgroundColor: "white" }),
                animate(`#box${k}`, { backgroundColor: Colors.sorted }),
            ]);
            await delay(500);
        }
        animate(`#box${0}`, { backgroundColor: Colors.sorted });
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
        <Numbers onStart={handleStart} onStop={handleStop}>
            <div className="d-flex" ref={scope}>
                {_numbers.map((num, i) => (
                    <Numbox key={i} index={i} value={num} />
                ))}
            </div>
        </Numbers>
    );
}
