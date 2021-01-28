import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { undirected } from './undirected';
import $ from 'jquery';
import Graph from './Graph';

var parent;
var arr;
var mst, j;
var timer;
var delay = 1000;

function findParent(q) {
    return parent[q] === q ? q : findParent(parent[q]);
}

function start() {
    $('#plane').off();
    arr = [];
    $('.cost').each(() => {
        let edge = {};
        edge.w = parseInt($(this).html());
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

function Kruskals(props) {
    const [status, setStatus] = useState(false);

    const validate = () => {
        if (Graph.totalSegments() < 3) {
            message.error('draw atleast 3 edges', 2);
        } else {
            setStatus(true);
        }
    };

    const stop = () => {
        clearTimeout(timer);
        $('#plane').html('');
        $('#plane').off();
        status ? setStatus(false) : undirected(true);
    };

    useEffect(() => {
        status ? start() : undirected(true);
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
                    <Button type="primary" onClick={stop}>
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

function skip() {
    $('.vrtx').eq(arr[j].u).attr('stroke', 'orange');
    $('.vrtx').eq(arr[j].v).attr('stroke', 'orange');
    $('.edge').eq(arr[j].i).attr('stroke', '#ccc');
    $('.edge').eq(arr[j].i).attr('stroke-dasharray', '8,5');
    j++;
    timer = setTimeout(find, delay);
}

export default Kruskals;
