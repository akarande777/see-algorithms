import React from 'react';
import Graph from '../../common/graph';
import DrawGraph from '../../components/graph/graph';
import $ from 'jquery';
import timer from '../../common/timer';
import { colors } from '../../common/constants';

var parent;
var arr;
var mst, j;
var delay = 1000;

function findParent(q) {
    return parent[q] === q ? q : findParent(parent[q]);
}

export default function (props) {
    return <DrawGraph {...props} start={start} isMST={true} customSource={false} />;
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
    timer.timeout(find, delay);
}

function find() {
    if (j < arr.length) {
        let p = findParent(arr[j].u);
        let q = findParent(arr[j].v);
        if (p !== q) {
            parent[q] = p;
            $('.vrtx').eq(arr[j].u).attr('stroke', colors.visited);
            $('.vrtx').eq(arr[j].u).attr('fill', colors.visited);
            $('.vrtx').eq(arr[j].v).attr('stroke', colors.visited);
            $('.vrtx').eq(arr[j].v).attr('fill', colors.visited);
            $('.edge').eq(arr[j].i).attr('stroke', colors.visited);
            timer.timeout(() => {
                $('.vrtx').eq(arr[j].u).attr('fill', colors.vertex);
                $('.vrtx').eq(arr[j].v).attr('fill', colors.vertex);
                mst.push(arr[j++]);
                timer.timeout(find, delay);
            }, delay / 1.5);
        } else {
            $('.vrtx').eq(arr[j].u).attr('stroke', colors.danger);
            $('.vrtx').eq(arr[j].v).attr('stroke', colors.danger);
            $('.edge').eq(arr[j].i).attr('stroke', colors.danger);
            timer.timeout(skip, delay / 1.5);
        }
    }
}

function skip() {
    $('.vrtx').eq(arr[j].u).attr('stroke', colors.visited);
    $('.vrtx').eq(arr[j].v).attr('stroke', colors.visited);
    $('.edge').eq(arr[j].i).attr('stroke', colors.rejected);
    $('.edge').eq(arr[j].i).attr('stroke-dasharray', '8,5');
    j++;
    timer.timeout(find, delay);
}
