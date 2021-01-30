import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { fromEnd, cloneEdge } from './common/utils';
import { undirected } from './common/undirected';
import Graph from './common/Graph';
import $ from 'jquery';

var n, w;
var d, queue;
var v, prev;
var timer;
var delay = 1000;

function start() {
    $('#plane').off();
    n = Graph.totalPoints();
    w = [];
    for (let i = 0; i < n; i++) {
        w[i] = [];
        for (let j = 0; j < n; j++) {
            let ei = Graph.edgeIndex(i, j);
            if (ei !== undefined) {
                let value = $('.cost').eq(ei).text();
                w[i][j] = parseInt(value) || 0;
            } else {
                w[i][j] = Infinity;
            }
        }
    }
    v = [0];
    d = [0];
    for (let i = 1; i < n; i++) {
        d[i] = Infinity;
        $('.vlbl').eq(i).text('∞');
    }
    queue = [0];
    prev = [];
    timer = setTimeout(() => {
        $('.vrtx').eq(0).attr('stroke', 'orange');
        $('.vrtx').eq(0).attr('fill', 'orange');
        timer = setTimeout(dijkstra, delay, 0);
    }, delay);
}

function dijkstra(i) {
    for (let j = 0; j < n; j++) {
        if (v.indexOf(j) === -1) {
            let ei = Graph.edgeIndex(i, j);
            $('.edge').eq(ei).attr('stroke-dasharray', '8,5');
            if (d[i] + w[i][j] < d[j]) {
                d[j] = d[i] + w[i][j];
                $('.edge').eq(ei).attr('stroke', '#6495ed');
                $('.vrtx').eq(j).attr('stroke', '#6495ed');
                $('.vlbl').eq(j).text(d[j]);
                if (prev[j] !== undefined) {
                    let ej = Graph.edgeIndex(prev[j], j);
                    $('.edge').eq(ej).attr('stroke', '#ccc');
                }
                prev[j] = i;
            } else {
                $('.edge').eq(ei).attr('stroke', '#ccc');
            }
        }
    }
    for (let j = 0; j < n; j++) {
        queue[j] = v.indexOf(j) === -1 ? d[j] : Infinity;
    }
    timer = setTimeout(extractMin, delay);
}

function Dijkstras(props) {
    const [status, setStatus] = useState(false);

    const validate = () => {
        if (Graph.totalSegments() < 3) {
            message.error('draw atleast 3 edges', 2);
        } else {
            setStatus(true);
        }
    };

    const stop = () => {
        clearTimeout(timer);
        $('#plane').text('');
        $('#plane').off();
        status ? setStatus(false) : undirected(true);
    };

    useEffect(() => {
        status ? start() : undirected(true);
        return () => clearTimeout(timer);
    });

    useEffect(() => {
        if (props.visible) stop();
    }, [props.visible]);

    return (
        <div>
            <div className="spaceBetween draw">
                <span>Draw Graph</span>
                <div>
                    <Button type="primary" onClick={validate} disabled={status}>
                        Start
                    </Button>
                    &nbsp;&nbsp;
                    <Button type="primary" onClick={stop}>
                        Clear
                    </Button>
                </div>
            </div>
            <div>
                <svg id="plane" width="700" height="450" />
            </div>
        </div>
    );
}

function extractMin() {
    let j = queue.indexOf(Math.min(...queue));
    v.push(j);
    let i = prev[j];
    let ei = Graph.edgeIndex(i, j);
    let { p, q, d } = cloneEdge(i, ei);
    timer = setTimeout(span, delay / 50, p, q, d - 2, j, ei);
}

function span(p, q, d, i, k) {
    if (d > 0) {
        let r = fromEnd(p, q, d);
        $('line:last').attr('x2', r.x);
        $('line:last').attr('y2', r.y);
        timer = setTimeout(span, delay / 100, p, q, d - 2, i, k);
    } else {
        $('line:last').remove();
        $('line').eq(k).attr('stroke', 'orange');
        $('line').eq(k).removeAttr('stroke-dasharray');
        $('.vrtx').eq(i).attr('stroke', 'orange');
        if (v.length < n) {
            timer = setTimeout(dijkstra, delay / 2, i);
        }
    }
}

export default Dijkstras;
