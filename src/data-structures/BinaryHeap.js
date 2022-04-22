import React, { useEffect } from 'react';
import $ from 'jquery';
import DSInput from '../components/ds-input/ds-input';
import { fromDistance, moveVertex } from '../common/utils';
import Tree from '../common/tree';
import { Point } from '../common/graph';
import { Colors } from '../common/constants';
import { wait } from '../common/timer';

var buttons = [
    { text: 'Insert', onClick: input, validate: true },
    { text: 'Clear', onClick: Tree.remove }
];
var delay = 500;

export default function (props) {
    useEffect(() => Tree.remove(), []);
    return <DSInput {...props} buttons={buttons} />;
}

async function input(key) {
    if (!Tree.root()) {
        Tree.insert(key);
        return Promise.resolve();
    } else {
        let size = Tree.size();
        let parent = Tree.find((node) => {
            return node.index === Math.floor((size - 1) / 2);
        });
        Tree.flag = [1, 3, 4, 7, 8, 9, 10].indexOf(size) > -1;
        return Tree.insert(key, parent, size % 2 === 1).then((node) => {
            return wait(delay).then(() => heapify(node, parent));
        });
    }
}

function heapify(child, parent) {
    if (parent && child.key > parent.key) {
        $('.vrtx').eq(child.index).attr('fill', Colors.compare);
        let temp = parent.key;
        parent.key = child.key;
        child.key = temp;
        return wait(delay).then(() => {
            let { index, point } = parent;
            $('.vrtx').eq(index).attr('fill', Colors.compare);
            return wait(delay).then(() => {
                let d = Point.distance(point, child.point);
                return wait(5).then(() => swap(parent, child, d - 1));
            });
        });
    }
    return Promise.resolve();
}

function swap(parent, child, d) {
    let p = parent.point;
    let q = child.point;
    if (d > 0) {
        let r = fromDistance(p, q, d);
        moveVertex(parent.index, r);
        r = fromDistance(q, p, d);
        moveVertex(child.index, r);
        return wait(5).then(() => swap(parent, child, d - 1));
    } else {
        moveVertex(parent.index, p);
        $('.vlbl').eq(parent.index).html(parent.key);
        moveVertex(child.index, q);
        $('.vlbl').eq(child.index).html(child.key);
        return wait(delay).then(() => {
            $('.vrtx').eq(child.index).attr('fill', Colors.vertex);
            $('.vrtx').eq(parent.index).attr('fill', Colors.vertex);
            return heapify(parent, parent.parent);
        });
    }
}
