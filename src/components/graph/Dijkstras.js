import React from 'react';
import { Button, message } from 'antd';
import { fromEnd, cloneEdge } from '../utils';
import { undirected } from './undirected';
import $ from 'jquery';

var self;
var pnts, sgts;
var n, wt, mt;
var d, queue;
var v, prev;
var timer;

const delay = 1000;

function start() {
    $('#plane').off();
    wt = new Array();
    mt = new Array();
    n = pnts.length;
    for (let i = 0; i < n; i++) {
        wt[i] = new Array();
        mt[i] = new Array();
        for (let j = 0; j < n; j++) {
            wt[i][j] = Infinity;
        }
    }
    for (let k = 0; k < sgts.length; k++) {
        let i, j;
        for (i = 0; i < pnts.length; i++) {
            if (pnts[i].equals(sgts[k].p))
                break;
        }
        for (j = 0; j < pnts.length; j++) {
            if (pnts[j].equals(sgts[k].q))
                break;
        }
        let w = $('.cost').eq(k).html();
        wt[i][j] = parseInt(w);
        wt[j][i] = parseInt(w);
        mt[i][j] = k;
        mt[j][i] = k;
    }
    v = new Array();
    v.push(0);
    d = new Array();
    d.push(0);
    for (let i = 1; i < n; i++) {
        d[i] = Infinity;
        $('.vlbl').eq(i).html('∞');
    }
    queue = new Array();
    queue.push(0);
    prev = new Array();
    timer = setTimeout(function () {
        $('.vrtx').eq(0).attr('stroke', 'orange');
        $('.vrtx').eq(0).attr('fill', 'orange');
        timer = setTimeout(dijkstra, delay, 0);
    }, delay / 2);
}

function dijkstra(i) {
    for (let j = 0; j < n; j++) {
        if (v.indexOf(j) == -1) {
            $('.edge').eq(mt[i][j]).attr('stroke-dasharray', '8,5');
            if (d[i] + wt[i][j] < d[j]) {
                d[j] = d[i] + wt[i][j];
                $('.edge').eq(mt[i][j]).attr('stroke', '#6495ed');
                $('.vrtx').eq(j).attr('stroke', '#6495ed');
                $('.vlbl').eq(j).html(d[j]);
                if (prev[j] != undefined)
                    $('.edge').eq(mt[prev[j]][j]).attr('stroke', '#ccc');
                prev[j] = i;
            }
            else $('.edge').eq(mt[i][j]).attr('stroke', '#ccc');
        }
    }
    for (let j = 0; j < n; j++) {
        if (v.indexOf(j) == -1)
            queue[j] = d[j];
        else queue[j] = Infinity;
    }
    timer = setTimeout(extractMin, delay);
}

class Dijkstras extends React.Component {
    pnts = [];
    sgts = [];

    constructor(props) {
        super(props);
        this.state = {
            started: false
        }
        self = this;
    }

    componentDidMount() {
        undirected.bind(this)(true);
    }

    componentDidUpdate() {
        if (!this.state.started) {
            undirected.bind(this)(true);
        }
    }

    componentWillUnmount() {
        clearTimeout(timer);
    }

    start = () => {
        if (this.sgts.length < 3) {
            message.error("draw atleast 3 edges", 2);
            return;
        }
        pnts = this.pnts;
        sgts = this.sgts;
        this.setState({
            started: true
        }, () => start());
    }

    stop = () => {
        clearTimeout(timer);
        $('#plane').html('');
        $('#plane').off();
        this.setState({
            started: false
        });
    }

    render() {
        return (
            <div style={{ padding: 24 }}>
                <div className="spaceBetween" style={{ width: 700 }}>
                    <span style={{ fontSize: 18 }}>
                        Draw Graph
                    </span>
                    <div>
                        <Button type="primary" onClick={this.start}>
                            Start
                        </Button>&nbsp;&nbsp;
                        <Button type="primary" onClick={this.stop}>
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
}

function extractMin() {
    let j = queue.indexOf(Math.min(...queue));
    v.push(j);
    let i = prev[j];
    let newEdge = cloneEdge.bind(self)(i, mt[i][j]);
    let p = newEdge.p;
    let q = newEdge.q;
    let d = newEdge.d;
    timer = setTimeout(span, delay / 50, p, q, d - 2, j, mt[i][j]);
}

function span(p, q, d, i, k) {
    if (d > 0) {
        let r = fromEnd(p, q, d);
        $('line:last').attr('x2', r.x);
        $('line:last').attr('y2', r.y);
        timer = setTimeout(span, delay / 100, p, q, d - 2, i, k)
    }
    else {
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