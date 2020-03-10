import React from 'react';
import { Button, message } from 'antd';
import { fromEnd, cloneEdge } from '../utils';
import { undirected } from './undirected';
import $ from 'jquery';

var self;
var pnts, sgts;
var wt, mt;
var mst, i, j;
var n, queue;
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
        for (let j = 0; j < n; j++)
            wt[i][j] = Infinity;
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
    queue = new Array();
    mst = new Array();
    i = 0;
    timer = setTimeout(function () {
        $('.vrtx').eq(i).attr("stroke", "orange");
        $('.vrtx').eq(i).attr("fill", "orange");
        timer = setTimeout(prim, delay / 2);
    }, delay);
}

function prim() {
    queue = queue.concat(wt[i]);
    console.log(wt[i])
    mst.push(i);
    for (let k = 0; k < n; k++) {
        if (mst.indexOf(k) == -1 && wt[i][k] != Infinity) {
            $('.edge').eq(mt[i][k]).attr('stroke', '#6495ed');
            $('.edge').eq(mt[i][k]).attr('stroke-dasharray', '8,5');
            $('.vrtx').eq(k).attr('stroke', '#6495ed');
        }
    }
    timer = setTimeout(extractMin, delay);
}

class Prims extends React.Component {
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
    j = queue.indexOf(Math.min(...queue));
    queue[j] = Infinity;
    i = mst[Math.floor(j / n)];
    j = j % n;
    if (mst.indexOf(j) != -1) {
        extractMin();
    }
    else {
        let newEdge = cloneEdge.bind(self)(i, mt[i][j]);
        let p = newEdge.p;
        let q = newEdge.q;
        let d = newEdge.d;
        timer = setTimeout(span, delay / 100, p, q, d - 2);
    }
}

function span(p, q, d) {
    if (d > 0) {
        let r = fromEnd(p, q, d);
        $('line:last').attr('x2', r.x);
        $('line:last').attr('y2', r.y);
        timer = setTimeout(span, delay / 100, p, q, d - 2);
    }
    else {
        $('line:last').remove();
        $('.edge').eq(mt[i][j]).attr('stroke', 'orange');
        $('.edge').eq(mt[i][j]).removeAttr('stroke-dasharray');
        $('.vrtx').eq(j).attr('stroke', 'orange');
        for (let k = 0; k < mst.length; k++) {
            if ($('.edge').eq(mt[j][mst[k]]).attr('stroke') == '#6495ed')
                $('.edge').eq(mt[j][mst[k]]).attr('stroke', '#ccc');
        }
        wt[i][j] = Infinity;
        wt[j][i] = Infinity;
        i = j;
        if (mst.length < n - 1) {
            timer = setTimeout(prim, delay / 2);
        }
    }
}

export default Prims;