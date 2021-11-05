import React, { useEffect } from 'react';
import $ from 'jquery';
import DataInput from '../components/data-input/data-input';
import { addVertex, addEdge, fromDistance, moveVertex, distance } from '../common/utils';
import { Point } from '../common/graph';
import Tree from '../common/tree';
import { Colors } from '../common/constants';
import { wait } from '../common/timer';

const buttons = [{ text: 'Insert', onClick: input }];

export default function (props) {
    useEffect(() => Tree.reset(), []);
    return <DataInput {...props} buttons={buttons} />;
}

var rx = 350;
var dx = 30, dy = 60;
var delay = 500;

function input(key) {
    if (Tree.size() === 15) {
        return Promise.resolve(true);
    }
    if (!Tree.nodeAt(0)) {
        let root = { key, index: 0 };
        root.point = new Point(rx, dy);
        addVertex(root.point, key);
        Tree.pushNode(root);
        return Promise.resolve();
    } else {
        let size = Tree.size();
        let parent = Tree.nodeAt(Math.floor((size - 1) / 2));
        let { node, p, q } = createNode(key, parent, size);
        Tree.pushNode(node);
        let d = distance(p, q);
        return wait(10).then(() => span(node, p, q, d - 2));
    }
}

function createNode(key, parent, index) {
    let node = { key, parent, index };
    node.flag = index % 2 === 1;
    let p = parent.point;
    let x, y;
    if (node.flag) {
        parent.left = node;
        x = p.x - dx;
    } else {
        parent.right = node;
        x = p.x + dx;
    }
    y = p.y + dy;
    let q = new Point(x, y);
    node.point = q;
    let left = [1, 3, 4, 7, 8, 9, 10];
    Tree.flag = left.indexOf(index) > -1;
    if (node.flag !== Tree.flag) {
        Tree.findSubRoot(parent);
        if (Math.abs(q.x - rx) < 15) Tree.shiftSubRoot(dx);
        else Tree.shiftSubRoot(50);
    }
    addEdge(p, p);
    return { node, p, q };
}

function span(node, p, q, d) {
    if (d > 0) {
        let r = fromDistance(p, q, d);
        $('line').eq(node.index - 1).attr('x2', r.x);
        $('line').eq(node.index - 1).attr('y2', r.y);
        return wait(10).then(() => span(node, p, q, d - 2));
    } else {
        addVertex(q, node.key, 15);
        return wait(delay).then(() => heapify(node, node.parent));
    }
}

function heapify(child, parent) {
    if (parent && child.key > parent.key) {
        $('.vrtx').eq(child.index).attr('fill', Colors.compare);
        let temp = parent.key;
        parent.key = child.key;
        child.key = temp;
        return wait(delay).then(() => {
            $('.vrtx').eq(parent.index).attr('fill', Colors.compare);
            return wait(delay).then(() => {
                let d = distance(parent.point, child.point);
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
