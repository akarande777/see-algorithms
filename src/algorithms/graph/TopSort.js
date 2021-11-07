import React from 'react';
import { fromDistance, distance, createTable } from '../../common/utils';
import Graph from '../../common/graph';
import DrawGraph from '../../components/draw-graph/draw-graph';
import $ from 'jquery';
import Timer from '../../common/timer';
import { Colors } from '../../common/constants';

export default function (props) {
    return <DrawGraph {...props} start={start} isDAG={true} />;
}

var cells, n;
var ind, stack, k;
var delay = 500;

function start() {
    n = Graph.totalPoints();
    createTable(1, n);
    cells = document.querySelectorAll('.cell');
    for (let i = 0; i < n; i++) {
        cells[i].setAttribute('style', 'border: 2px solid;width: 3rem');
    }
    stack = [];
    ind = Graph.indegree();
    for (let i = 0; i < n; i++) {
        if (ind[i] === 0) {
            stack.push(i);
            $(`.vrtx:eq(${i})`).attr('stroke', Colors.visited);
        }
    }
    k = 0;
    Timer.timeout(sort, delay * 2);
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
                let q = { x: x2, y: y2 };
                $(`line:eq(${ei})`).attr('stroke', Colors.visited);
                let d = distance(p, q);
                Timer.timeout(() => {
                    if (ind[j] === 0) {
                        stack.push(j);
                        $(`.vrtx:eq(${j})`).attr('stroke', Colors.visited);
                    }
                    extract(p, q, i, j, d - 2);
                }, delay);
            }
        }
        if (k === 0) {
            Timer.timeout(fall, delay, i);
        }
    } else {
        setTimeout(() => {
            document.getElementById('clear').click();
        }, delay);
    }
}

function extract(p, q, i, j, d) {
    let ei = Graph.edgeIndex(i, j);
    if (d > 0) {
        let r = fromDistance(q, p, d);
        $(`line:eq(${ei})`).attr('x2', r.x);
        $(`line:eq(${ei})`).attr('y2', r.y);
        Timer.timeout(extract, 5, p, q, i, j, d - 2);
    } else {
        $(`line:eq(${ei})`).removeAttr('stroke');
        $(`line:eq(${ei})`).removeAttr('marker-end');
        if (--k === 0) {
            Timer.timeout(fall, delay, i);
        }
    }
}

function fall(i) {
    let cy = parseInt($(`.vrtx:eq(${i})`).attr('cy'));
    if (cy < 520) {
        $(`.vrtx:eq(${i})`).attr('cy', cy + 2);
        $(`.vlbl:eq(${i})`).attr('y', cy + 7);
        Timer.timeout(fall, 5, i);
    } else {
        let np = Graph.totalPoints();
        cells[np - n].innerHTML = String.fromCharCode(65 + i);
        cells[np - n].setAttribute('bgcolor', Colors.visited);
        n--;
        Timer.timeout(sort, delay);
    }
}
