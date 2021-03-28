import React from 'react';
import { fromEnd, cloneEdge } from './common/utils';
import Graph from './common/Graph';
import GraphView from './common/Graph.view';
import $ from 'jquery';
import timer from './common/timer';

var queue;
var v, i;
var prev, k;
var delay = 1000;

export default function (props) {
    return <GraphView {...props} start={start} />;
}

function start(source) {
    $('#plane').off();
    v = [source];
    queue = [];
    prev = [];
    i = source;
    timer.timeout(() => {
        $('.vrtx').eq(i).attr('stroke', 'orange');
        $('.vrtx').eq(i).attr('fill', 'orange');
        timer.timeout(visit, delay / 2, 0);
    }, delay);
}

function visit(j) {
    if (j < Graph.totalPoints()) {
        let ei = Graph.edgeIndex(i, j);
        if (ei !== undefined) {
            if (v.indexOf(j) === -1) {
                $('.edge').eq(ei).attr('stroke', '#6495ed');
                $('.edge').eq(ei).attr('stroke-dasharray', '8,4');
                $('.vrtx').eq(j).attr('stroke', '#6495ed');
                queue.push(j);
                v.push(j);
                prev[j] = i;
                timer.timeout(visit, delay / 2, ++j);
            } else if (queue.indexOf(j) !== -1) {
                $('.edge').eq(ei).attr('stroke', '#ccc');
                $('.edge').eq(ei).attr('stroke-dasharray', '8,4');
                timer.timeout(visit, delay / 2, ++j);
            } else visit(++j);
        } else visit(++j);
    } else bfs();
}

function bfs() {
    if (queue.length) {
        $('.vrtx').eq(i).attr('fill', '#eee');
        i = queue.shift();
        k = prev[i];
        let ei = Graph.edgeIndex(k, i);
        let { p, q, d } = cloneEdge(k, ei);
        timer.timeout(span, delay, p, q, d - 2);
    } else {
        $('.vrtx').eq(i).attr('fill', '#eee');
    }
}

function span(p, q, d) {
    if (d > 0) {
        let r = fromEnd(p, q, d);
        $('line:last').attr('x2', r.x);
        $('line:last').attr('y2', r.y);
        timer.timeout(span, delay / 200, p, q, d - 2);
    } else {
        $('line:last').remove();
        let ei = Graph.edgeIndex(k, i);
        $('.edge').eq(ei).removeAttr('stroke-dasharray');
        $('.edge').eq(ei).attr('stroke', 'orange');
        $('.vrtx').eq(i).attr('stroke', 'orange');
        $('.vrtx').eq(i).attr('fill', 'orange');
        let j;
        let n = Graph.totalPoints();
        for (j = 0; j < n; j++) {
            let ei = Graph.edgeIndex(i, j);
            if (ei !== undefined) {
                if (v.indexOf(j) === -1 || queue.indexOf(j) !== -1) {
                    timer.timeout(visit, delay / 2, 0);
                    break;
                }
            }
        }
        if (j === n) {
            timer.timeout(bfs, delay / 2);
        }
    }
}
