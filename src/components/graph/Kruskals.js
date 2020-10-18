import React from 'react';
import { Button, message } from 'antd';
import { undirected } from './undirected';
import $ from 'jquery';

var pnts, sgts;
var parent;
var arr;
var mst, j;
var timer;

const delay = 1000;

function Edge(u, v, w, i) {
    this.u = u;
    this.v = v;
    this.w = w;
    this.i = i;
}

function findParent(q) {
    return parent[q] == q ? q : findParent(parent[q]);
}

function start() {
    $('#plane').off();
    arr = new Array();
    $('.cost').each(function () {
        let e = new Edge();
        e.w = parseInt($(this).html());
        arr.push(e);
        $(this).attr('contenteditable', 'false');
    });
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
        arr[k].u = i;
        arr[k].v = j;
        arr[k].i = k;
    }
    arr.sort(function (a, b) {
        return a.w - b.w;
    });
    parent = new Array();
    for (let i = 0; i < pnts.length; i++) {
        parent[i] = i;
    }
    mst = new Array();
    j = 0;
    timer = setTimeout(find, delay);
}

function find() {
    if (j < arr.length) {
        let p = findParent(arr[j].u);
        let q = findParent(arr[j].v);
        if (p != q) {
            parent[q] = p;
            $('.vrtx').eq(arr[j].u).attr('stroke', 'orange');
            $('.vrtx').eq(arr[j].u).attr('fill', 'orange');
            $('.vrtx').eq(arr[j].v).attr('stroke', 'orange');
            $('.vrtx').eq(arr[j].v).attr('fill', 'orange');
            $('.edge').eq(arr[j].i).attr('stroke', 'orange');
            timer = setTimeout(function () {
                $('.vrtx').eq(arr[j].u).attr('fill', '#eee');
                $('.vrtx').eq(arr[j].v).attr('fill', '#eee');
                mst.push(arr[j++]);
                timer = setTimeout(find, delay);
            }, delay / 1.5);
        }
        else {
            $('.vrtx').eq(arr[j].u).attr('stroke', 'red');
            $('.vrtx').eq(arr[j].v).attr('stroke', 'red');
            $('.edge').eq(arr[j].i).attr('stroke', 'red');
            timer = setTimeout(skip, delay / 1.5);
        }
    }
}

class Kruskals extends React.Component {
    pnts = [];
    sgts = [];

    constructor(props) {
        super(props);
        this.state = {
            started: false
        }
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

function skip() {
    $('.vrtx').eq(arr[j].u).attr('stroke', 'orange');
    $('.vrtx').eq(arr[j].v).attr('stroke', 'orange');
    $('.edge').eq(arr[j].i).attr('stroke', '#ccc');
    $('.edge').eq(arr[j].i).attr('stroke-dasharray', '8,5');
    j++;
    timer = setTimeout(find, delay);
}

export default Kruskals;