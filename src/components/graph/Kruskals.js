import React from 'react';
import Graph from './common/Graph';
import GraphView from './common/Graph.view';
import $ from 'jquery';

var parent;
var arr;
var mst, j;
var timer;
var delay = 1000;

function findParent(q) {
    return parent[q] === q ? q : findParent(parent[q]);
}

export default function (props) {
    return <GraphView {...props} start={start} stop={() => clearTimeout(timer)} isMST={true} />;
}

function start() {
    $('#plane').off();
    arr = [];
    $('.cost').each(function () {
        let edge = {};
        edge.w = parseInt($(this).text()) || 0;
        arr.push(edge);
        $(this).attr('contenteditable', 'false');
    });
    let n = Graph.totalPoints();
    parent = [];
    for (let i = 0; i < n; i++) {
        parent[i] = i;
        for (let j = 0; j < n; j++) {
            let ei = Graph.edgeIndex(i, j);
            if (ei !== undefined) {
                arr[ei].u = i;
                arr[ei].v = j;
                arr[ei].i = ei;
            }
        }
    }
    arr.sort((a, b) => a.w - b.w);
    mst = [];
    j = 0;
    timer = setTimeout(find, delay);
}

function find() {
    if (j < arr.length) {
        let p = findParent(arr[j].u);
        let q = findParent(arr[j].v);
        if (p !== q) {
            parent[q] = p;
            $('.vrtx').eq(arr[j].u).attr('stroke', 'orange');
            $('.vrtx').eq(arr[j].u).attr('fill', 'orange');
            $('.vrtx').eq(arr[j].v).attr('stroke', 'orange');
            $('.vrtx').eq(arr[j].v).attr('fill', 'orange');
            $('.edge').eq(arr[j].i).attr('stroke', 'orange');
            timer = setTimeout(() => {
                $('.vrtx').eq(arr[j].u).attr('fill', '#eee');
                $('.vrtx').eq(arr[j].v).attr('fill', '#eee');
                mst.push(arr[j++]);
                timer = setTimeout(find, delay);
            }, delay / 1.5);
        } else {
            $('.vrtx').eq(arr[j].u).attr('stroke', 'red');
            $('.vrtx').eq(arr[j].v).attr('stroke', 'red');
            $('.edge').eq(arr[j].i).attr('stroke', 'red');
            timer = setTimeout(skip, delay / 1.5);
        }
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
