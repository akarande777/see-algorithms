import React from 'react';
import { fromEnd, cloneEdge } from './common/utils';
import Graph from './common/Graph';
import GraphView from './common/Graph.view';
import $ from 'jquery';
import timer from './common/timer';
import { colors } from '../common/constants';

var n, w;
var mst, i, j;
var queue;
var delay = 1000;

export default function (props) {
    return <GraphView {...props} start={start} isMST={true} />;
}

function start(source) {
    $('#plane').off();
    n = Graph.totalPoints();
    w = [];
    Graph.forEach((i, j) => {
        w[i] = w[i] || [];
        let ei = Graph.edgeIndex(i, j);
        if (ei !== undefined) {
            let value = $('.cost').eq(ei).text();
            w[i][j] = parseInt(value) || 0;
        } else {
            w[i][j] = Infinity;
        }
    });
    queue = [];
    mst = [];
    i = source;
    timer.timeout(() => {
        $('.vrtx').eq(i).attr('stroke', colors.visited);
        $('.vrtx').eq(i).attr('fill', colors.visited);
        timer.timeout(prim, delay / 2);
    }, delay);
}

function prim() {
    queue = queue.concat(w[i]);
    mst.push(i);
    for (let k = 0; k < n; k++) {
        if (mst.indexOf(k) === -1 && w[i][k] !== Infinity) {
            let ei = Graph.edgeIndex(i, k);
            $('.edge').eq(ei).attr('stroke', colors.enqueue);
            $('.edge').eq(ei).attr('stroke-dasharray', '8,5');
            $('.vrtx').eq(k).attr('stroke', colors.enqueue);
        }
    }
    timer.timeout(extractMin, delay);
}

function extractMin() {
    j = queue.indexOf(Math.min(...queue));
    queue[j] = Infinity;
    i = mst[Math.floor(j / n)];
    j = j % n;
    if (mst.indexOf(j) !== -1) {
        extractMin();
    } else {
        let ei = Graph.edgeIndex(i, j);
        let { p, q, d } = cloneEdge(i, ei);
        timer.timeout(span, delay / 100, p, q, d - 2);
    }
}

function span(p, q, d) {
    if (d > 0) {
        let r = fromEnd(p, q, d);
        $('line:last').attr('x2', r.x);
        $('line:last').attr('y2', r.y);
        timer.timeout(span, delay / 100, p, q, d - 2);
    } else {
        $('line:last').remove();
        let ei = Graph.edgeIndex(i, j);
        $('.edge').eq(ei).attr('stroke', colors.visited);
        $('.edge').eq(ei).removeAttr('stroke-dasharray');
        $('.vrtx').eq(j).attr('stroke', colors.visited);
        for (let k = 0; k < mst.length; k++) {
            let ej = Graph.edgeIndex(j, mst[k]);
            if ($('.edge').eq(ej).attr('stroke') === colors.enqueue)
                $('.edge').eq(ej).attr('stroke', colors.rejected);
        }
        w[i][j] = Infinity;
        w[j][i] = Infinity;
        i = j;
        if (mst.length < n - 1) {
            timer.timeout(prim, delay / 2);
        }
    }
}
