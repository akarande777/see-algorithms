import $ from 'jquery';
import Graph from './graph';
import { Colors } from './constants';

function distance(p, q) {
    return Math.sqrt((q.x - p.x) * (q.x - p.x) + (q.y - p.y) * (q.y - p.y));
}

function fromDistance(start, end, distance) {
    let x = end.x - start.x;
    let y = end.y - start.y;
    let z = Math.sqrt(x * x + y * y);
    let ratio = distance / z;
    let deltaX = x * ratio;
    let deltaY = y * ratio;
    return { x: end.x - deltaX, y: end.y - deltaY };
}

const mouseEvents = ['click', 'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave'];
const touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];

function withOffset(e) {
    let out = { x: 0, y: 0 };
    let { left, top } = $('#plane').offset();
    if (touchEvents.includes(e.type)) {
        let touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        out.x = touch.pageX - left;
        out.y = touch.pageY - top;
    } else if (mouseEvents.includes(e.type)) {
        out.x = e.pageX - left;
        out.y = e.pageY - top;
    }
    return [out.x, out.y];
}

function addVertex(p, vlbl) {
    let vrtx = `<g class="vgrp"><ellipse class="vrtx" cx="${p.x}" cy="${
        p.y
    }" rx="${18}" ry="15" stroke="${Colors.stroke}" stroke-width="2" fill="${
        Colors.vertex
    }" /><text class="vlbl" x="${p.x}" y="${
        p.y + 5
    }" text-anchor="middle" style="cursor:pointer">${vlbl}</text></g>`;
    document.getElementById('plane').innerHTML += vrtx;
}

function moveVertex(i, r) {
    $('.vrtx').eq(i).attr('cx', r.x);
    $('.vrtx').eq(i).attr('cy', r.y);
    $('.vlbl').eq(i).attr('x', r.x);
    $('.vlbl')
        .eq(i)
        .attr('y', r.y + 5);
}

function addEdge(p, q) {
    let edge = `<line class="edge" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke-width="2" stroke="${Colors.stroke}" />`;
    document.getElementById('plane').innerHTML += edge;
    $('line:last').insertBefore($('.vgrp:first'));
}

function cloneEdge(i, j) {
    let edge = `<line stroke-width="3" stroke="${Colors.visited}" />`;
    document.getElementById('plane').innerHTML += edge;
    $('line:last').insertBefore($('.vgrp:first'));
    let p, q;
    let segment = Graph.segment(j);
    if (segment.p.equals(Graph.point(i))) {
        p = segment.p;
        q = segment.q;
    } else {
        p = segment.q;
        q = segment.p;
    }
    $('line:last').attr('x1', p.x);
    $('line:last').attr('y1', p.y);
    $('line:last').attr('x2', p.x);
    $('line:last').attr('y2', p.y);
    let d = distance(p, q);
    return { p, q, d };
}

export const createTable = (m, n, id) => {
    for (let i = 0; i < m; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < n; j++) {
            let cell = document.createElement('td');
            cell.setAttribute('class', 'cell');
            row.appendChild(cell);
        }
        $(`#${id || 'tbl'}`).append(row);
    }
};

export { distance, fromDistance, withOffset, addVertex, moveVertex, addEdge, cloneEdge };
