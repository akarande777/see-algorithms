import React, { useEffect } from 'react';
import heap from './heap';
import { Point } from '../graph/Graph';
import { moveVertex } from '../graph/utils';
import $ from 'jquery';
import Wrapper from './wrapper';

var a, n;
var tbl, cell;
var v, j;
var p, q, flag;
var timer;
var delay = 1200;

function heapSort() {
    if (j >= 0) {
        heapify(j);
    } else {
        let t = a[0];
        a[0] = a[n - 1];
        a[n - 1] = t;
        p = new Point(v[0].x, v[0].y);
        q = new Point(v[n - 1].x, v[n - 1].y);
        let left = [7, 8, 3, 9, 10, 1, 4].indexOf(n - 1);
        let right = [14, 13, 6, 12, 11, 2, 5].indexOf(n - 1);
        timer =
            left > -1
                ? setInterval(swapMax, left, left, right)
                : setInterval(swapMax, right, left, right);
    }
}

function heapify(i) {
    $('.vrtx').eq(i).attr('fill', 'plum');
    let largest = i;
    let left = i * 2 + 1;
    let right = i * 2 + 2;
    if (left < n) {
        if (a[left] > a[largest]) {
            largest = left;
        }
    }
    if (right < n) {
        if (a[right] > a[largest]) {
            largest = right;
        }
    }
    if (largest !== i) {
        timer = setTimeout(() => {
            $('.vrtx').eq(largest).attr('fill', 'pink');
            p = v[i];
            q = v[largest];
            flag = p.x > q.x ? true : false;
            timer = setTimeout(() => {
                timer =
                    i === 0
                        ? setInterval(swap, 1, i, largest, 70)
                        : i === 1 || i === 2
                        ? setInterval(swap, 3, i, largest, 45)
                        : setInterval(swap, 5, i, largest, 25);
            }, delay / 2);
        }, delay / 2);
        let temp = a[i];
        a[i] = a[largest];
        a[largest] = temp;
    } else {
        j--;
        timer = setTimeout(() => {
            $('.vrtx').eq(i).attr('fill', '#eee');
            $('line')
                .eq(left - 1)
                .attr('stroke', '#777');
            if (right < n) {
                $('line')
                    .eq(right - 1)
                    .attr('stroke', '#777');
            }
            timer = setTimeout(heapSort, delay / 2);
        }, delay / 2);
    }
}

function extractMax() {
    $('line:last').remove();
    $('g:last').remove();
    --n;
    cell[n].innerHTML = a[n];
    if (n > 1) {
        j = 0;
        timer = setTimeout(heapify, delay / 2, j);
    } else {
        timer = setTimeout(() => {
            timer = setInterval(fall, delay / 100);
        }, delay / 2);
    }
}

function HeapSort(props) {
    const start = () => {
        n = a.length;
        cell = [];
        let row = document.createElement('tr');
        for (let j = 0; j < n; j++) {
            cell[j] = document.createElement('td');
            cell[j].style.border = '2px solid';
            row.appendChild(cell[j]);
        }
        tbl.appendChild(row);
        for (let i = 0; i < n; i++) {
            $('.vlbl').eq(i).html(a[i]);
        }
        j = Math.floor(n / 2) - 1;
        timer = setTimeout(heapSort, delay);
    };

    const stop = () => {
        clearTimeout(timer);
        clearInterval(timer);
        $('#plane').html('');
        tbl.innerHTML = '';
        props.setValues([]);
    };

    useEffect(() => {
        tbl = document.getElementById('tbl');
        return () => stop();
    }, []);

    useEffect(() => {
        if (props.status) {
            if (props.validate()) {
                start();
                return;
            }
            props.setStatus(false);
        } else {
            stop();
        }
    }, [props.status]);

    useEffect(() => {
        a = [...props.values];
        if (a.length) {
            v = heap(a.length);
        }
    }, [props.values]);

    return (
        <div style={{ padding: '0 24px' }}>
            <svg id="plane" style={{ border: 0, width: 650, height: 300 }} />
            <div style={{ width: 650 }} className="spaceAround">
                <table id="tbl" />
            </div>
        </div>
    );
}

function swapMax(left, right) {
    if (p.y < v[n - 1].y) {
        p.y += 1;
        $('.vrtx').eq(0).attr('cy', p.y);
        $('.vlbl')
            .eq(0)
            .attr('y', p.y + 5);
        q.y -= 1;
        $('.vrtx')
            .eq(n - 1)
            .attr('cy', q.y);
        $('.vlbl')
            .eq(n - 1)
            .attr('y', q.y + 5);
    } else {
        if (left > -1 && p.x > v[n - 1].x) {
            p.x -= 1;
            $('.vrtx').eq(0).attr('cx', p.x);
            $('.vlbl').eq(0).attr('x', p.x);
            q.x += 1;
            $('.vrtx')
                .eq(n - 1)
                .attr('cx', q.x);
            $('.vlbl')
                .eq(n - 1)
                .attr('x', q.x);
        } else if (right > -1 && p.x < v[n - 1].x) {
            p.x += 1;
            $('.vrtx').eq(0).attr('cx', p.x);
            $('.vlbl').eq(0).attr('x', p.x);
            q.x -= 1;
            $('.vrtx')
                .eq(n - 1)
                .attr('cx', q.x);
            $('.vlbl')
                .eq(n - 1)
                .attr('x', q.x);
        } else {
            clearInterval(timer);
            moveVertex(n - 1, v[n - 1]);
            $('.vlbl')
                .eq(n - 1)
                .html(a[n - 1]);
            moveVertex(0, v[0]);
            $('.vlbl').eq(0).html(a[0]);
            timer = setTimeout(() => {
                timer = setInterval(fall, delay / 200);
            }, delay / 2);
        }
    }
}

function fall() {
    if (n > 1) {
        let y1 = parseInt($('line:last').attr('y1'));
        if (y1 < 300) {
            $('line:last').attr('y1', y1 + 1);
            let cy = parseInt($('.vrtx:last').attr('cy'));
            $('.vrtx:last').attr('cy', cy + 1);
            $('.vlbl:last').attr('y', cy + 6);
            $('line:last').attr('y2', cy + 1);
        } else {
            clearInterval(timer);
            extractMax();
        }
    } else {
        let cy = parseInt($('.vrtx:last').attr('cy'));
        if (cy < 320) {
            $('.vrtx:last').attr('cy', cy + 2);
            $('.vlbl:last').attr('y', cy + 7);
        } else {
            clearInterval(timer);
            $(`g:eq(${0})`).remove();
            cell[0].innerHTML = a[0];
        }
    }
}

function swap(i, largest, angle) {
    if (p.y < v[largest].y) {
        let x1 = xco(angle, 1, p.x);
        let y1 = yco(angle, 1, p.y);
        p = new Point(x1, y1);
        moveVertex(i, p);
        let x2 = xco(angle, -1, q.x);
        let y2 = yco(angle, -1, q.y);
        q = new Point(x2, y2);
        moveVertex(largest, q);
    } else {
        clearInterval(timer);
        moveVertex(i, v[i]);
        $('.vlbl').eq(i).html(a[i]);
        moveVertex(largest, v[largest]);
        $('.vlbl').eq(largest).html(a[largest]);
        $('.vrtx').eq(i).attr('fill', 'pink');
        $('.vrtx').eq(largest).attr('fill', 'plum');
        timer = setTimeout(() => {
            $('.vrtx').eq(i).attr('fill', '#eee');
            $('line')
                .eq(i * 2)
                .attr('stroke', '#777');
            if (i * 2 + 2 < n) {
                $('line')
                    .eq(i * 2 + 1)
                    .attr('stroke', '#777');
            }
            if (i < Math.floor(n / 2)) {
                heapify(largest);
            }
        }, delay / 2);
    }
}

function xco(t, h, dx) {
    return flag ? dx - h * Math.sin(t * (Math.PI / 180)) : dx + h * Math.sin(t * (Math.PI / 180));
}

function yco(t, h, dy) {
    return dy + h * Math.cos(t * (Math.PI / 180));
}

export default Wrapper(HeapSort);
