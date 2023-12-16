import React, { useState } from 'react';
import DSInput from '../components/ds-input/ds-input';
import { try_, wait } from '../common/utils';
import { Colors } from '../common/constants';
import useAnimator from '../hooks/useAnimator';
import { binaryTree } from '../helpers/binaryTree';
import { Edge, Node } from '../components/numbers';

var arr = [], Tree;
var delay = 500;

export default function BinaryHeap(props) {
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
    const { bgcolor } = animator;

    const input = async (num) => {
        await wait(delay);
        if (!numbers.length) {
            arr = [num];
            setNumbers(arr);
            Tree = binaryTree(animator);
            Tree.insert(num);
        } else {
            arr.push(num);
            setNumbers(arr.slice());
            await search(Tree.root(), num);
        }
    };

    const search = async (node, num) => {
        await bgcolor(`#node${node.index}`, Colors.compare);
        await wait(delay);
        const isLeft = num <= node.value;
        const next = isLeft ? 'left' : 'right';
        if (!node[next]) {
            Tree.insert(num, node, isLeft);
            await wait(delay);
            await bgcolor(`#node${node.index}`, Colors.white);
        } else {
            await bgcolor(`#node${node.index}`, Colors.white);
            await search(node[next], num);
        }
    };

    const reset = () => setNumbers([]);

    const buttons = [
        { text: 'Insert', onClick: input, validate: true },
        { text: 'Clear', onClick: reset },
    ];

    return (
        <div className="dsInput">
            <DSInput {...props} buttons={buttons} />
            <div ref={scope}>
                {numbers.slice(0, -1).map((_, i) => (
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
        </div>
    );
}
