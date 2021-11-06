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
        Tree.flag = key <= root.key;
        if (Tree.flag) {
            return wait(delay).then(() => insert(key, root.left, root, true));
        } else {
            return wait(delay).then(() => insert(key, root.right, root, false));
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
        span(node.index - 1, node.index, Colors.visited);
        return wait(delay).then(() => {
            span(node.index - 1, parent.index, Colors.stroke);
            $('.vrtx').eq(node.index).attr('stroke', Colors.stroke);
        });
    } else {
        span(node.index - 1, node.index, Colors.visited);
        return wait(delay).then(() => {
            span(node.index - 1, parent.index, Colors.stroke);
            if (key <= node.key) {
                return wait(delay).then(() => insert(key, node.left, node, true));
            } else {
                return wait(delay).then(() => insert(key, node.right, node, false));
            }
        });
    }
}

function span(ei, vi, color) {
    $('.edge').eq(ei).attr('stroke', color);
    $('.vrtx').eq(vi).attr('stroke', color);
}
