import React from 'react';
import { Button, message } from 'antd';
import { fromEnd, cloneEdge } from '../utils';
import { undirected } from './undirected';
import $ from 'jquery';

var self;
var pnts, sgts;
var wt, mt;
var queue;
var v, i;
var prev, k;
var timer;

const delay = 1000;

function bfs() {
    if (queue.length != 0) {
        $('.vrtx').eq(i).attr('fill', '#eee');
        i = queue.shift();
        k = prev[i];
        let newEdge = cloneEdge.bind(self)(k, mt[k][i]);
        let p = newEdge.p;
        let q = newEdge.q;
        let d = newEdge.d;
        timer = setTimeout(span, delay, p, q, d - 2);
    }
    else $('.vrtx').eq(i).attr('fill', '#eee');
}

function visit(j) {
    if (j < pnts.length) {
        if (wt[i][j] != undefined) {
            if (v.indexOf(j) == -1) {
                $('.edge').eq(mt[i][j]).attr('stroke', '#6495ed');
                $('.edge').eq(mt[i][j]).attr('stroke-dasharray', '8,4');
                $('.vrtx').eq(j).attr('stroke', '#6495ed');
                queue.push(j);
                v.push(j);
                prev[j] = i;
                timer = setTimeout(visit, delay / 2, ++j);
            }
            else if (queue.indexOf(j) != -1) {
                $('.edge').eq(mt[i][j]).attr('stroke', '#ccc');
                $('.edge').eq(mt[i][j]).attr('stroke-dasharray', '8,4');
                timer = setTimeout(visit, delay / 2, ++j);
            }
            else visit(++j);
        }
        else visit(++j);
    }
    else bfs();
}

class BFS extends React.Component {
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
        undirected.bind(this)(false);
    }

    componentDidUpdate() {
        if (!this.state.started) {
            undirected.bind(this)(false);
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
        this.setState(
            { started: true },
            () => start()
        );
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
                <div className="spaceBetween draw">
                    <span>Draw Graph</span>
                    <div>
                        <Button type="primary" onClick={this.start} disabled={this.state.started}>
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

function start() {
    $('#plane').off();
    wt = new Array();
    mt = new Array();
    for (let i = 0; i < pnts.length; i++) {
        wt[i] = new Array();
        mt[i] = new Array();
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
        wt[i][j] = 1; wt[j][i] = 1;
        mt[i][j] = k; mt[j][i] = k;
    }
    v = new Array();
    v.push(0);
    queue = new Array();
    prev = new Array();
    i = 0;
    timer = setTimeout(function () {
        $('.vrtx').eq(i).attr("stroke", "orange");
        $('.vrtx').eq(i).attr("fill", "orange");
        timer = setTimeout(visit, delay / 2, 1);
    }, delay);
}

function span(p, q, d) {
    if (d > 0) {
        let r = fromEnd(p, q, d);
        $('line:last').attr('x2', r.x);
        $('line:last').attr('y2', r.y);
        timer = setTimeout(span, delay / 200, p, q, d - 2);
    }
    else {
        $('line:last').remove();
        $('.edge').eq(mt[k][i]).removeAttr('stroke-dasharray');
        $('.edge').eq(mt[k][i]).attr('stroke', 'orange');
        $('.vrtx').eq(i).attr('stroke', 'orange');
        $('.vrtx').eq(i).attr('fill', 'orange');
        let j;
        for (j = 1; j < pnts.length; j++) {
            if (wt[i][j] != undefined) {
                if (v.indexOf(j) == -1 || queue.indexOf(j) != -1) {
                    timer = setTimeout(visit, delay / 2, 1);
                    break;
                }
            }
        }
        if (j == pnts.length) {
            timer = setTimeout(bfs, delay / 2, 1);
        }
    }
}



export default BFS;