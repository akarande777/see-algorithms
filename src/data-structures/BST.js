import React, { useEffect } from 'react';
import $ from 'jquery';
import DSInput from '../components/ds-input/ds-input';
import Tree from '../common/tree';
import { Colors } from '../common/constants';
import { wait } from '../common/timer';

const buttons = [
    { text: 'Insert', onClick: input, validate: true },
    { text: 'Clear', onClick: Tree.remove }
];
const delay = 500;

export default function (props) {
    useEffect(() => Tree.remove(), []);
    return (
        <div className="dsInput">
            <DSInput {...props} buttons={buttons} />
            <div className="resizable">
                <svg id="plane" />
            </div>
        </div>
    );
}

async function input(key) {
    if (!Tree.root()) {
        Tree.insert(key);
        return Promise.resolve();
    } else {
        $('.vrtx:first').attr('stroke', Colors.visited);
        const root = Tree.root();
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

function insert(key, node, parent, flag) {
    if (!node) {
        $('.vrtx').eq(parent.index).attr('stroke', Colors.stroke);
        return Tree.insert(key, parent, flag);
    }
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

function span(ei, vi, color) {
    $('.edge').eq(ei).attr('stroke', color);
    $('.vrtx').eq(vi).attr('stroke', color);
}
