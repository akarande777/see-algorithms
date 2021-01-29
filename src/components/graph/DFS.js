import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { fromEnd, cloneEdge } from './utils';
import { undirected } from './undirected';
import Graph from './Graph';
import $ from 'jquery';

var stack;
var v, i;
var prev, k;
var timer;
var delay = 1000;

function dfs() {
    if (stack.length) {
        $('.vrtx').eq(i).attr('fill', '#eee');
        i = stack.pop();
        k = prev[i];
        let ei = Graph.edgeIndex(k, i);
        let { p, q, d } = cloneEdge(k, ei);
        timer = setTimeout(span, delay, p, q, d - 2);
    } else {
        $('.vrtx').eq(i).attr('fill', '#eee');
    }
}

function visit(j) {
    if (j < Graph.totalPoints()) {
        let ei = Graph.edgeIndex(i, j);
        if (ei !== undefined) {
            if (v.indexOf(j) === -1) {
                $('.edge').eq(ei).attr('stroke', '#6495ed');
                $('.edge').eq(ei).attr('stroke-dasharray', '8,4');
                $('.vrtx').eq(j).attr('stroke', '#6495ed');
                stack.push(j);
                v.push(j);
                prev[j] = i;
                timer = setTimeout(visit, delay / 2, ++j);
            } else if (stack.indexOf(j) !== -1) {
                $('.edge').eq(ei).attr('stroke', '#ccc');
                $('.edge').eq(ei).attr('stroke-dasharray', '8,4');
                timer = setTimeout(visit, delay / 2, ++j);
            } else visit(++j);
        } else visit(++j);
    } else dfs();
}

function DFS(props) {
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
        $('#plane').html('');
        $('#plane').off();
        status ? setStatus(false) : undirected(false);
    };

    useEffect(() => {
        status ? start() : undirected(false);
        return () => clearTimeout(timer);
    });

    useEffect(() => {
        if (props.visible) stop();
    }, [props.visible]);

    return (
        <div style={{ padding: 24 }}>
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

function start() {
    $('#plane').off();
    v = [0];
    stack = [];
    prev = [];
    i = 0;
    timer = setTimeout(() => {
        $('.vrtx').eq(i).attr('stroke', 'orange');
        $('.vrtx').eq(i).attr('fill', 'orange');
        timer = setTimeout(visit, delay / 2, 1);
    }, delay);
}

function span(p, q, d) {
    if (d > 0) {
        let r = fromEnd(p, q, d);
        $('line:last').attr('x2', r.x);
        $('line:last').attr('y2', r.y);
        timer = setTimeout(span, delay / 200, p, q, d - 2);
    } else {
        $('line:last').remove();
        let ei = Graph.edgeIndex(k, i);
        $('.edge').eq(ei).removeAttr('stroke-dasharray');
        $('.edge').eq(ei).attr('stroke', 'orange');
        $('.vrtx').eq(i).attr('stroke', 'orange');
        $('.vrtx').eq(i).attr('fill', 'orange');
        let j;
        let n = Graph.totalPoints();
        for (j = 1; j < n; j++) {
            let ei = Graph.edgeIndex(i, j);
            if (ei !== undefined) {
                if (v.indexOf(j) === -1 || stack.indexOf(j) !== -1) {
                    timer = setTimeout(visit, delay / 2, 1);
                    break;
                }
            }
        }
        if (j === n) {
            timer = setTimeout(dfs, delay / 2, 1);
        }
    }
}

export default DFS;
