import React from 'react';
import { fromEnd, distance } from './common/utils';
import Graph, { Point } from './common/Graph';
import GraphView from './common/Graph.view';
import $ from 'jquery';

var cell, k;
var n, ind;
var stack;
var timer;
var delay = 1000;

export default function (props) {
    return <GraphView {...props} start={start} stop={() => clearTimeout(timer)} isDAG={true} />;
}

function start() {
    $('#plane').off();
    let tbl = document.querySelector('#tbl');
    tbl.innerHTML = '';
    let row = document.createElement('tr');
    cell = [];
    n = Graph.totalPoints();
    for (let j = 0; j < n; j++) {
        cell[j] = document.createElement('td');
        cell[j].setAttribute('style', 'border:2px solid;width:40px;height:40px;padding:5px');
        row.appendChild(cell[j]);
    }
    tbl.appendChild(row);
    stack = [];
    ind = Graph.indegree();
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
        for (let j = 0; j < Graph.totalPoints(); j++) {
            let ei = Graph.edgeIndex(i, j);
            if (ei !== undefined && ind[j] !== 0) {
                --ind[j];
                k++;
                let p = Graph.point(i);
                let x2 = $(`line:eq(${ei})`).attr('x2');
                let y2 = $(`line:eq(${ei})`).attr('y2');
                let q = new Point(x2, y2);
                $(`line:eq(${ei})`).attr('stroke', 'orange');
                let d = distance(p, q);
                timer = setTimeout(() => {
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
        setTimeout(() => {
            document.querySelector('#clear').click();
        }, delay / 2);
    }
}

function extract(p, q, i, j, d) {
    let ei = Graph.edgeIndex(i, j);
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
        let np = Graph.totalPoints();
        cell[np - n].innerHTML = String.fromCharCode(65 + i);
        cell[np - n].setAttribute('bgcolor', 'orange');
        --n;
        timer = setTimeout(sort, delay / 2);
    }
}
