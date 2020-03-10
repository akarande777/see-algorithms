import React from 'react';
import { Button, message } from 'antd';
import { Point, fromEnd, distance } from '../utils';
import { directed } from './directed';
import $ from 'jquery';

var pnts, sgts;
var wt, mt;
var cell, k;
var n, stack;
var ind, v;
var timer;

const delay = 1000;

function start() {
    $('#plane').off();
    n = pnts.length;
    for (let i = 0; i < n; i++) {
        let k = 0;
        for (let j = 0; j < n; j++) {
            if (wt[i][j] == undefined)
                k++;
        }
        if (k == n && ind[i] == 0) {
            alert("connect all vertices");
            return;
        }
    }
    let tbl = document.querySelector('#tbl');
    tbl.innerHTML = "";
    let row = document.createElement("tr");
    cell = new Array();
    for (let j = 0; j < n; j++) {
        cell[j] = document.createElement("td");
        cell[j].setAttribute("style", "border:thin solid;width:40px;height:40px;padding:5px");
        row.appendChild(cell[j]);
    }
    tbl.appendChild(row);
    stack = new Array();
    v = new Array();
    for (let i = 0; i < n; i++) {
        if (ind[i] == 0) {
            stack.push(i);
            $(`.vrtx:eq(${i})`).attr('stroke', 'orange');
        }
    }
    k = 0;
    timer = setTimeout(sort, delay);
}

function sort() {
    if (stack.length > 0) {
        let i = stack.pop();
        $(`.vrtx:eq(${i})`).attr('fill', 'orange');
        for (let j = 0; j < pnts.length; j++) {
            if (wt[i][j] != undefined && ind[j] != 0) {
                --ind[j];
                k++;
                let p = pnts[i];
                let x2 = $(`line:eq(${mt[i][j]})`).attr("x2");
                let y2 = $(`line:eq(${mt[i][j]})`).attr("y2");
                let q = new Point(x2, y2);
                $(`line:eq(${mt[i][j]})`).attr('stroke', 'orange');
                let d = distance(p, q);
                timer = setTimeout(function () {
                    if (ind[j] == 0) {
                        stack.push(j);
                        $(`.vrtx:eq(${j})`).attr('stroke', 'orange');
                    }
                    extract(p, q, i, j, d - 2);
                }, delay / 2);
            }
        }
        if (k == 0) {
            timer = setTimeout(fall, delay / 2, i);
        }
    }
    else {
        setTimeout(function() {
            document.querySelector('#clear').click();
            document.querySelector('#tbl').innerHTML = "";
        }, 500);
    }
}

class TopSort extends React.Component {
    pnts = [];
    sgts = [];

    constructor(props) {
        super(props);
        this.state = {
            started: false
        }
    }

    componentDidMount() {
        directed.bind(this)(true);
    }

    componentDidUpdate() {
        if (!this.state.started) {
            directed.bind(this)(true);
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
        wt = this.wt;
        mt = this.mt;
        ind = this.ind;
        this.setState({
            started: true
        }, () => start());
    }

    stop = () => {
        clearTimeout(timer);
        $('#plane').off();
        $('#plane').children().not(':first').remove();
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
                        <Button type="primary" onClick={this.stop} id="clear">
                            Clear
                        </Button>
                    </div>
                </div>
                <div>
                    <svg id="plane" width="700" height="450">
                        <defs>
                            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
                                markerWidth="4" markerHeight="6"
                                orient="auto-start-reverse"
                            >
                                <path d="M 0 0 L 10 5 L 0 10 z" />
                            </marker>
                        </defs>
                    </svg>
                </div>
                <div style={{ width: 700, display: 'flex', justifyContent: 'space-around' }}>
                    <table id="tbl" />
                </div>
            </div>
        );
    }
}

function extract(p, q, i, j, d) {
    if (d > 0) {
        let r = fromEnd(q, p, d);
        $(`line:eq(${mt[i][j]})`).attr("x2", r.x);
        $(`line:eq(${mt[i][j]})`).attr("y2", r.y);
        timer = setTimeout(extract, delay / 150, p, q, i, j, d - 2);
    }
    else {
        $(`line:eq(${mt[i][j]})`).removeAttr('stroke');
        $(`line:eq(${mt[i][j]})`).removeAttr('marker-end');
        if (--k == 0) timer = setTimeout(fall, delay / 2, i);
    }
}

function fall(i) {
    let cy = parseInt($(`.vrtx:eq(${i})`).attr("cy"));
    if (cy < 520) {
        $(`.vrtx:eq(${i})`).attr("cy", cy + 2);
        $(`.vlbl:eq(${i})`).attr("y", cy + 7);
        timer = setTimeout(fall, delay / 200, i);
    }
    else {
        cell[pnts.length - n].innerHTML = String.fromCharCode(65 + i);
        cell[pnts.length - n].setAttribute("bgcolor", "orange");
        --n;
        timer = setTimeout(sort, delay / 2);
    }
}

export default TopSort;