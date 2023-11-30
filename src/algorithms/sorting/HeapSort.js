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
    const { txy, bgcolor } = animator;

    const createHeap = async () => {
        let n = arr.length;
        await Tree.insert(arr[0]);
        for (let i = 1; i < n; i++) {
            let j = Math.floor((i + 1) / 2) - 1;
            let parent = Tree.node(j);
            await Tree.insert(arr[i], parent, i % 2 === 1);
        }
        await delay(500);
        let k = Math.floor(n / 2) - 1;
        for (let i = k; i >= 0; i--) {
            let left = i * 2 + 1;
            let right = i * 2 + 2;
            let max = i;
            await bgcolor(`#node${i}`, Colors.compare);
            if (arr[left] > arr[max]) max = left;
            if (right < n && arr[right] > arr[max]) max = right;
            if (max !== i) {
                await bgcolor(`#node${max}`, Colors.compare);
                await Tree.swapNodes(i, max);
                let num = arr[i];
                arr[i] = arr[max];
                arr[max] = num;
                setNumbers(arr.slice());
                await bgcolor(`#node${max}`, Colors.white);
            }
            await bgcolor(`#node${i}`, Colors.white);
        }
    };

    const handleStart = (values) => {
        setNumbers(values);
        arr = values.slice();
        Tree = binaryTree(animator);
        setTimeout(createHeap, 100);
    };

    const handleStop = () => {
        setNumbers([]);
        arr = [];
    };

    return (
        <SortNumbers onStart={handleStart} onStop={handleStop} ref={scope}>
            <div className="heapSort" ref={scope}>
                {numbers.slice(1).map((_, i) => (
                    <Edge key={i} index={i} />
                ))}
                {numbers.map((num, i) => (
                    <Node
                        key={i}
                        index={i}
                        value={num}
                        style={{ opacity: 0 }}
                    />
                ))}
            </div>
        </SortNumbers>
    );
}
