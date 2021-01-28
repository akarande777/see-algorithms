import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { Point, fromEnd, distance } from '../utils';
import { directed } from './directed';
import DAG from './DAG';
import $ from 'jquery';

var cell, k;
var n, ind;
var stack;
var timer;
var delay = 1000;

function start() {
    $('#plane').off();
    let tbl = document.querySelector('#tbl');
    tbl.innerHTML = '';
    let row = document.createElement('tr');
    cell = new Array();
    for (let j = 0; j < n; j++) {
        cell[j] = document.createElement('td');
        cell[j].setAttribute('style', 'border:2px solid;width:40px;height:40px;padding:5px');
        row.appendChild(cell[j]);
    }
    tbl.appendChild(row);
    stack = new Array();
    for (let i = 0; i < n; i++) {
        if (ind[i] === 0) {
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
        for (let j = 0; j < DAG.totalPoints(); j++) {
            let ei = DAG.edgeIndex(i, j);
            if (ei !== undefined && ind[j] !== 0) {
                --ind[j];
                k++;
                let p = DAG.point(i);
                let x2 = $(`line:eq(${ei})`).attr('x2');
                let y2 = $(`line:eq(${ei})`).attr('y2');
                let q = new Point(x2, y2);
                $(`line:eq(${ei})`).attr('stroke', 'orange');
                let d = distance(p, q);
                timer = setTimeout(function () {
                    if (ind[j] === 0) {
                        stack.push(j);
                        $(`.vrtx:eq(${j})`).attr('stroke', 'orange');
                    }
                    extract(p, q, i, j, d - 2);
                }, delay / 2);
            }
        }
        if (k === 0) {
            timer = setTimeout(fall, delay / 2, i);
        }
    } else {
        setTimeout(function () {
            document.querySelector('#clear').click();
            document.querySelector('#tbl').innerHTML = '';
        }, 500);
    }
}

function TopSort(props) {
    const [status, setStatus] = useState(false);

    const validate = () => {
        n = DAG.totalPoints();
        if (n < 3) {
            message.error('add minimum 3 vertices', 2);
            return;
        }
        ind = DAG.indegree();
        for (let i = 0; i < n; i++) {
            let k = 0;
            for (let j = 0; j < n; j++) {
                let ei = DAG.edgeIndex(i, j);
                if (ei === undefined) {
                    k++;
                }
            }
            if (k === n && ind[i] === 0) {
                message.error('connect all vertices');
                return;
            }
        }
        setStatus(true);
    };

    const stop = () => {
        clearTimeout(timer);
        $('#plane').off();
        $('#plane').children().not(':first').remove();
        status ? setStatus(false) : directed();
    };

    useEffect(() => {
        status ? start() : directed();
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
                    <Button type="primary" onClick={stop} id="clear">
                        Clear
                    </Button>
                </div>
            </div>
            <div>
                <svg id="plane" width="700" height="450">
                    <defs>
                        <marker
                            id="arrow"
                            viewBox="0 0 10 10"
                            refX="5"
                            refY="5"
                            markerWidth="4"
                            markerHeight="6"
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

function extract(p, q, i, j, d) {
    let ei = DAG.edgeIndex(i, j);
    if (d > 0) {
        let r = fromEnd(q, p, d);
        $(`line:eq(${ei})`).attr('x2', r.x);
        $(`line:eq(${ei})`).attr('y2', r.y);
        timer = setTimeout(extract, delay / 150, p, q, i, j, d - 2);
    } else {
        $(`line:eq(${ei})`).removeAttr('stroke');
        $(`line:eq(${ei})`).removeAttr('marker-end');
        if (--k === 0) {
            timer = setTimeout(fall, delay / 2, i);
        }
    }
}

function fall(i) {
    let cy = parseInt($(`.vrtx:eq(${i})`).attr('cy'));
    if (cy < 520) {
        $(`.vrtx:eq(${i})`).attr('cy', cy + 2);
        $(`.vlbl:eq(${i})`).attr('y', cy + 7);
        timer = setTimeout(fall, delay / 200, i);
    } else {
        let np = DAG.totalPoints();
        cell[np - n].innerHTML = String.fromCharCode(65 + i);
        cell[np - n].setAttribute('bgcolor', 'orange');
        --n;
        timer = setTimeout(sort, delay / 2);
    }
}

export default TopSort;
