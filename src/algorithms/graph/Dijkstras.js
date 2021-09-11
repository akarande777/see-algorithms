import React from 'react';
import { fromEnd, cloneEdge } from '../../common/utils';
import Graph from '../../common/graph';
import DrawGraph from '../../components/draw-graph/draw-graph';
import $ from 'jquery';
import Timer from '../../common/timer';
import { Colors } from '../../common/constants';

var n, w;
var d, queue;
var v, prev;
var delay = 1000;

export default function (props) {
    return <DrawGraph {...props} start={start} weighted={true} />;
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
    v = [source];
    d = [];
    for (let i = 0; i < n; i++) {
        d.push(i === source ? 0 : Infinity);
    }
    queue = [source];
    prev = [];
    d.forEach((x, i) => {
        x > 0 && $('.vlbl').eq(i).text('∞');
    });
    Timer.timeout(() => {
        $('.vrtx').eq(source).attr('stroke', Colors.visited);
        $('.vrtx').eq(source).attr('fill', Colors.visited);
        Timer.timeout(dijkstra, delay, source);
    }, delay);
}

function dijkstra(i) {
    for (let j = 0; j < n; j++) {
        if (v.indexOf(j) === -1) {
            let ei = Graph.edgeIndex(i, j);
            $('.edge').eq(ei).attr('stroke-dasharray', '8,5');
            if (d[i] + w[i][j] < d[j]) {
                d[j] = d[i] + w[i][j];
                $('.edge').eq(ei).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('stroke', Colors.enqueue);
                $('.vlbl').eq(j).text(d[j]);
                if (prev[j] !== undefined) {
                    let ej = Graph.edgeIndex(prev[j], j);
                    $('.edge').eq(ej).attr('stroke', Colors.rejected);
                }
                prev[j] = i;
            } else {
                $('.edge').eq(ei).attr('stroke', Colors.rejected);
            }
        }
    }
    for (let j = 0; j < n; j++) {
        queue[j] = v.indexOf(j) === -1 ? d[j] : Infinity;
    }
    Timer.timeout(extractMin, delay);
}

function extractMin() {
    let j = queue.indexOf(Math.min(...queue));
    v.push(j);
    let i = prev[j];
    let ei = Graph.edgeIndex(i, j);
    let { p, q, d } = cloneEdge(i, ei);
    Timer.timeout(span, 10, p, q, d - 2, j, ei);
}

function span(p, q, d, i, k) {
    if (d > 0) {
        let r = fromEnd(p, q, d);
        $('line:last').attr('x2', r.x);
        $('line:last').attr('y2', r.y);
        Timer.timeout(span, 10, p, q, d - 2, i, k);
    } else {
        $('line:last').remove();
        $('line').eq(k).attr('stroke', Colors.visited);
        $('line').eq(k).removeAttr('stroke-dasharray');
        $('.vrtx').eq(i).attr('stroke', Colors.visited);
        if (v.length < n) {
            Timer.timeout(dijkstra, delay / 2, i);
        }
    }
}
