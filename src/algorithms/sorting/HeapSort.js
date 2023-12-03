import React, { useState } from 'react';
import { Edge, Node, SortNumbers } from '../../components/numbers';
import useAnimator from '../../hooks/useAnimator';
import { binaryTree } from '../../helpers/binaryTree';
import { delay } from '../../common/utils';
import { Colors } from '../../common/constants';

var arr = [], Tree;

export default function BubbleSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
    const { txy, bgcolor, animate } = animator;

    const heapSort = async () => {
        let n = arr.length;
        await Tree.insert(arr[0]);
        for (let i = 1; i < n; i++) {
            let j = Math.floor((i + 1) / 2) - 1;
            let parent = Tree.node(j);
            Tree.insert(arr[i], parent, i % 2 === 1);
        }
        await delay(1000);
        let k = Math.floor(n / 2) - 1;
        for (let i = k; i >= 0; i--) await heapify(i);
        await delay(500);
        for (let i = n - 1; i > 0; i--) {
            if (arr[0] !== arr[i]) await swapNodes(0, i);
            await delay(500);
            await bgcolor(`#node${i}`, Colors.sorted);
            await delay(500);
            await heapify(0, i);
            await delay(500);
        }
        await bgcolor(`#node${0}`, Colors.sorted);
        await delay(1000);
        for (let i = 0; i < n; i++) {
            txy(`#node${i}`, i * 50, 0);
            if (i < n - 1) {
                animate(`#edge${i}`, { width: 0 }, 0);
            }
        }
    };

    const heapify = async (i, _n) => {
        let left = i * 2 + 1;
        let right = i * 2 + 2;
        let max = i;
        let n = _n ? _n : arr.length;
        if (left < n) {
            if (arr[left] > arr[max]) max = left;
        }
        if (right < n) {
            if (arr[right] > arr[max]) max = right;
        }
        await bgcolor(`#node${i}`, Colors.compare);
        if (max !== i) {
            await bgcolor(`#node${max}`, Colors.compare);
            await swapNodes(i, max);
            await bgcolor(`#node${i}`, Colors.white);
            await heapify(max, n);
        } else {
            if (!_n) await delay(500);
            await bgcolor(`#node${i}`, Colors.white);
        }
    };

    const swapNodes = async (i, j) => {
        let a = Tree.node(i);
        let b = Tree.node(j);
        await Tree.swapNodes(a, b);
        await Promise.all([
            txy(`#node${i}`, a.x, a.y, 0),
            txy(`#node${j}`, b.x, b.y, 0),
        ]);
        let tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
        setNumbers(arr.slice());
    };

    const handleStart = (values) => {
        arr = values.slice();
        Tree = binaryTree(animator);
        setTimeout(() => {
            setNumbers(values);
            setTimeout(heapSort, 1000);
        }, 500);
    };

    const handleStop = () => {
        setNumbers([]);
        arr = [];
    };

    return (
        <SortNumbers onStart={handleStart} onStop={handleStop}>
            <div className="heapSort" ref={scope}>
                {numbers.slice(0, -1).map((_, i) => (
                    <Edge key={i} index={i} />
                ))}
                {numbers.map((num, i) => (
                    <Node
                        key={i}
                        index={i}
                        value={num}
                        animate={{ x: i * 50 }}
                    />
                ))}
            </div>
        </SortNumbers>
    );
}
