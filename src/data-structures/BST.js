import React, { useEffect } from 'react';
import $ from 'jquery';
import DataInput from '../components/data-input/data-input';
import { addVertex, addEdge } from '../common/utils';
import Tree from '../common/tree';
import { Colors } from '../common/constants';
import { wait } from '../common/timer';

const buttons = [{ text: 'Insert', onClick: input }];

export default function (props) {
    useEffect(() => Tree.clear(), []);
    return <DataInput {...props} buttons={buttons} />;
}

var root, rx = 350;
var dx = 50, dy = 60;
var delay = 500;

function input(key) {
    if (Tree.size() === 15) {
        return Promise.resolve(true);
    }
    if (!Tree.nodeAt(0)) {
        root = { key, index: 0 };
        root.point = { x: rx, y: dy };
        addVertex(root.point, key);
        Tree.pushNode(root);
        return Promise.resolve();
    } else {
        $('.vrtx:first').attr('stroke', Colors.visited);
        const { left, right } = root;
        if (key <= root.key) {
            Tree.flag = true;
            return wait(delay).then(() => insert(key, left, root, true));
        } else {
            Tree.flag = false;
            return wait(delay).then(() => insert(key, right, root, false));
        }
    }
}

function createNode(key, parent, left) {
    let node = { key, parent, index: Tree.size() };
    node.flag = left;
    let p = parent.point;
    let x, y;
    if (left) {
        parent.left = node;
        x = p.x - dx;
    } else {
        parent.right = node;
        x = p.x + dx;
    }
    y = p.y + dy;
    let q = { x, y };
    node.point = q;
    if (node.flag !== Tree.flag) {
        Tree.findSubRoot(parent);
        if (Math.abs(x - rx) < 15) Tree.shiftSubRoot(25);
        else Tree.shiftSubRoot(dx);
    }
    addEdge(p, q);
    addVertex(q, node.key);
    return node;
}

function insert(key, node, parent, flag) {
    if (!node) {
        node = createNode(key, parent, flag);
        Tree.pushNode(node);
        const { index } = node;
        span(index - 1, index, Colors.visited);
        return wait(delay).then(() => {
            span(index - 1, parent.index, Colors.stroke);
            $('.vrtx').eq(index).attr('stroke', Colors.stroke);
        });
    } else {
        const { index, left, right } = node;
        span(index - 1, index, Colors.visited);
        return wait(delay).then(() => {
            span(index - 1, parent.index, Colors.stroke);
            if (key <= node.key) {
                return wait(delay).then(() => insert(key, left, node, true));
            } else {
                return wait(delay).then(() => insert(key, right, node, false));
            }
        });
    }
}

function span(ei, vi, color) {
    $('.edge').eq(ei).attr('stroke', color);
    $('.vrtx').eq(vi).attr('stroke', color);
}
