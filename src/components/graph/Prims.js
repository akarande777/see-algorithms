import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { fromEnd, cloneEdge } from './utils';
import { undirected } from './undirected';
import Graph from './Graph';
import $ from 'jquery';

var n, w;
var mst, i, j;
var queue;
var timer;
var delay = 1000;

function start() {
    $('#plane').off();
    w = [];
    n = Graph.totalPoints();
    for (let i = 0; i < n; i++) {
        w[i] = [];
        for (let j = 0; j < n; j++) {
            let ei = Graph.edgeIndex(i, j);
            if (ei != undefined) {
                let value = $('.cost').eq(ei).html();
                w[i][j] = parseInt(value);
            } else {
                w[i][j] = Infinity;
            }
        }
    }
    queue = [];
    mst = [];
    i = 0;
    timer = setTimeout(function () {
        $('.vrtx').eq(i).attr('stroke', 'orange');
        $('.vrtx').eq(i).attr('fill', 'orange');
        timer = setTimeout(prim, delay / 2);
    }, delay);
}

function prim() {
    queue = queue.concat(w[i]);
    mst.push(i);
    for (let k = 0; k < n; k++) {
        if (mst.indexOf(k) == -1 && w[i][k] != Infinity) {
            let ei = Graph.edgeIndex(i, k);
            $('.edge').eq(ei).attr('stroke', '#6495ed');
            $('.edge').eq(ei).attr('stroke-dasharray', '8,5');
            $('.vrtx').eq(k).attr('stroke', '#6495ed');
        }
    }
    timer = setTimeout(extractMin, delay);
}

function Prims(props) {
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

function extractMin() {
    j = queue.indexOf(Math.min(...queue));
    queue[j] = Infinity;
    i = mst[Math.floor(j / n)];
    j = j % n;
    if (mst.indexOf(j) != -1) {
        extractMin();
    } else {
        let ei = Graph.edgeIndex(i, j);
        let { p, q, d } = cloneEdge(i, ei);
        timer = setTimeout(span, delay / 100, p, q, d - 2);
    }
}

function span(p, q, d) {
    if (d > 0) {
        let r = fromEnd(p, q, d);
        $('line:last').attr('x2', r.x);
        $('line:last').attr('y2', r.y);
        timer = setTimeout(span, delay / 100, p, q, d - 2);
    } else {
        $('line:last').remove();
        let ei = Graph.edgeIndex(i, j);
        $('.edge').eq(ei).attr('stroke', 'orange');
        $('.edge').eq(ei).removeAttr('stroke-dasharray');
        $('.vrtx').eq(j).attr('stroke', 'orange');
        for (let k = 0; k < mst.length; k++) {
            let ej = Graph.edgeIndex(j, mst[k]);
            if ($('.edge').eq(ej).attr('stroke') == '#6495ed')
                $('.edge').eq(ej).attr('stroke', '#ccc');
        }
        w[i][j] = Infinity;
        w[j][i] = Infinity;
        i = j;
        if (mst.length < n - 1) {
            timer = setTimeout(prim, delay / 2);
        }
    }
}

export default Prims;
