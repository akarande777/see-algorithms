import React from 'react';
import { fromEnd, distance } from '../../common/utils';
import Graph, { Point } from '../../common/graph';
import DrawGraph from '../../components/draw-graph/draw-graph';
import $ from 'jquery';
import Timer from '../../common/timer';
import { Colors } from '../../common/constants';

var cell, n, k;
var ind, stack;
var delay = 1000;

export default function (props) {
    return <DrawGraph {...props} start={start} isDAG={true} />;
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
        cell[j].setAttribute('style', 'border: 2px solid;width: 3rem');
        row.appendChild(cell[j]);
    }
    tbl.appendChild(row);
    stack = [];
    ind = Graph.indegree();
    for (let i = 0; i < n; i++) {
        if (ind[i] === 0) {
            stack.push(i);
            $(`.vrtx:eq(${i})`).attr('stroke', Colors.visited);
        }
    }
    k = 0;
    Timer.timeout(sort, delay);
}

function sort() {
    if (stack.length > 0) {
        let i = stack.pop();
        $(`.vrtx:eq(${i})`).attr('fill', Colors.visited);
        for (let j = 0; j < Graph.totalPoints(); j++) {
            let ei = Graph.edgeIndex(i, j);
            if (ei !== undefined && ind[j] !== 0) {
                --ind[j];
                k++;
                let p = Graph.point(i);
                let x2 = $(`line:eq(${ei})`).attr('x2');
                let y2 = $(`line:eq(${ei})`).attr('y2');
                let q = new Point(x2, y2);
                $(`line:eq(${ei})`).attr('stroke', Colors.visited);
                let d = distance(p, q);
                Timer.timeout(() => {
                    if (ind[j] === 0) {
                        stack.push(j);
                        $(`.vrtx:eq(${j})`).attr('stroke', Colors.visited);
                    }
                    extract(p, q, i, j, d - 2);
                }, delay / 2);
            }
        }
        if (k === 0) {
            Timer.timeout(fall, delay / 2, i);
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
        Timer.timeout(extract, delay / 200, p, q, i, j, d - 2);
    } else {
        $(`line:eq(${ei})`).removeAttr('stroke');
        $(`line:eq(${ei})`).removeAttr('marker-end');
        if (--k === 0) {
            Timer.timeout(fall, delay / 2, i);
        }
    }
}

function fall(i) {
    let cy = parseInt($(`.vrtx:eq(${i})`).attr('cy'));
    if (cy < 520) {
        $(`.vrtx:eq(${i})`).attr('cy', cy + 2);
        $(`.vlbl:eq(${i})`).attr('y', cy + 7);
        Timer.timeout(fall, delay / 200, i);
    } else {
        let np = Graph.totalPoints();
        cell[np - n].innerHTML = String.fromCharCode(65 + i);
        cell[np - n].setAttribute('bgcolor', Colors.visited);
        --n;
        Timer.timeout(sort, delay / 2);
    }
}
