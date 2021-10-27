import React from 'react';
import { fromDistance, cloneEdge } from '../../common/utils';
import Graph from '../../common/graph';
import DrawGraph from '../../components/draw-graph/draw-graph';
import $ from 'jquery';
import Timer from '../../common/timer';
import { Colors } from '../../common/constants';

var n, w;
var mst, i, j;
var queue;
var delay = 1000;

export default function (props) {
    return <DrawGraph {...props} start={start} isMST={true} />;
}

function start(source) {
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
    Timer.timeout(() => {
        $('.vrtx').eq(i).attr('stroke', Colors.visited);
        $('.vrtx').eq(i).attr('fill', Colors.visited);
        Timer.timeout(prim, delay / 2);
    }, delay);
}

function prim() {
    queue = queue.concat(w[i]);
    mst.push(i);
    for (let k = 0; k < n; k++) {
        if (mst.indexOf(k) === -1 && w[i][k] !== Infinity) {
            let ei = Graph.edgeIndex(i, k);
            $('.edge').eq(ei).attr('stroke', Colors.enqueue);
            $('.edge').eq(ei).attr('stroke-dasharray', '8,5');
            $('.vrtx').eq(k).attr('stroke', Colors.enqueue);
        }
    }
    Timer.timeout(extractMin, delay);
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
        Timer.timeout(span, 10, p, q, d - 2);
    }
}

function span(p, q, d) {
    if (d > 0) {
        let r = fromDistance(p, q, d);
        $('line:last').attr('x2', r.x);
        $('line:last').attr('y2', r.y);
        Timer.timeout(span, 10, p, q, d - 2);
    } else {
        $('line:last').remove();
        let ei = Graph.edgeIndex(i, j);
        $('.edge').eq(ei).attr('stroke', Colors.visited);
        $('.edge').eq(ei).removeAttr('stroke-dasharray');
        $('.vrtx').eq(j).attr('stroke', Colors.visited);
        for (let k = 0; k < mst.length; k++) {
            let ej = Graph.edgeIndex(j, mst[k]);
            if ($('.edge').eq(ej).attr('stroke') === Colors.enqueue)
                $('.edge').eq(ej).attr('stroke', Colors.rejected);
        }
        w[i][j] = Infinity;
        w[j][i] = Infinity;
        i = j;
        if (mst.length < n - 1) {
            Timer.timeout(prim, delay / 2);
        }
    }
}
