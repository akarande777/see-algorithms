import React, { useEffect } from 'react';
import { createHeap, xco, yco } from '../../helpers/create-heap';
import { Point } from '../../common/graph';
import { moveVertex } from '../../common/utils';
import $ from 'jquery';
import Numbers from '../../components/numbers/numbers';
import { Colors } from '../../common/constants';

var a, n;
var tbl, cell;
var v, k;
var p, q, flag;
var timer;
var delay = 1200;

function heapSort() {
    if (k >= 0) {
        heapify(k);
    } else {
        let t = a[0];
        a[0] = a[n - 1];
        a[n - 1] = t;
        p = new Point(v[0].x, v[0].y);
        q = new Point(v[n - 1].x, v[n - 1].y);
        let left = [7, 8, 3, 9, 10, 1, 4].indexOf(n - 1);
        let right = [14, 13, 6, 12, 11, 2, 5].indexOf(n - 1);
        if (left > -1) {
            timer = setInterval(swapLargest, left, true);
        } else {
            timer = setInterval(swapLargest, right, false);
        }
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
            flag = p.x > q.x;
            timer = setTimeout(() => {
                switch (true) {
                    case i === 0:
                        timer = setInterval(swap, 1, i, largest, 70);
                        break;
                    case i === 1 || i === 2:
                        timer = setInterval(swap, 3, i, largest, 45);
                        break;
                    default:
                        timer = setInterval(swap, 5, i, largest, 25);
                }
            }, delay / 2);
        }, delay / 2);
        let temp = a[i];
        a[i] = a[largest];
        a[largest] = temp;
    } else {
        k--;
        timer = setTimeout(() => {
            $('.vrtx').eq(i).attr('fill', Colors.vertex);
            $('line')
                .eq(left - 1)
                .attr('stroke', Colors.stroke);
            if (right < n) {
                $('line')
                    .eq(right - 1)
                    .attr('stroke', Colors.stroke);
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
        k = 0;
        timer = setTimeout(heapify, delay / 2, k);
    } else {
        timer = setTimeout(() => {
            timer = setInterval(fall, delay / 100);
        }, delay / 2);
    }
}

function HeapSort() {
    const start = (values) => {
        a = [...values];
        v = createHeap(a.length);
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
            $('.vlbl').eq(i).text(a[i]);
        }
        k = Math.floor(n / 2) - 1;
        timer = setTimeout(heapSort, delay);
    };

    const stop = () => {
        clearTimeout(timer);
        clearInterval(timer);
        $('#plane').text('');
        tbl.innerHTML = '';
    };

    useEffect(() => {
        tbl = document.getElementById('tbl');
        return () => stop();
    }, []);

    return (
        <div className="sortNumbers">
            <Numbers start={start} stop={stop} />
            <svg id="plane" style={{ width: 650, height: 300 }} />
            <br />
            <br />
            <div style={{ width: 650 }} className="spaceAround">
                <table id="tbl" />
            </div>
        </div>
    );
}

function swapLargest(flag) {
    if (p.y < v[n - 1].y) {
        p.y += 1;
        moveVertex(0, p);
        q.y -= 1;
        moveVertex(n - 1, q);
    } else {
        if (flag && p.x > v[n - 1].x) {
            p.x -= 1;
            moveVertex(0, p);
            q.x += 1;
            moveVertex(n - 1, q);
            return;
        }
        if (!flag && p.x < v[n - 1].x) {
            p.x += 1;
            moveVertex(0, p);
            q.x -= 1;
            moveVertex(n - 1, q);
            return;
        }
        clearInterval(timer);
        moveVertex(n - 1, v[n - 1]);
        $('.vlbl')
            .eq(n - 1)
            .text(a[n - 1]);
        moveVertex(0, v[0]);
        $('.vlbl').eq(0).text(a[0]);
        timer = setTimeout(() => {
            timer = setInterval(fall, delay / 200);
        }, delay / 2);
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
        let x1 = xco(angle, 1, p.x, flag);
        let y1 = yco(angle, 1, p.y);
        p = new Point(x1, y1);
        moveVertex(i, p);
        let x2 = xco(angle, -1, q.x, flag);
        let y2 = yco(angle, -1, q.y);
        q = new Point(x2, y2);
        moveVertex(largest, q);
    } else {
        clearInterval(timer);
        moveVertex(i, v[i]);
        $('.vlbl').eq(i).text(a[i]);
        moveVertex(largest, v[largest]);
        $('.vlbl').eq(largest).text(a[largest]);
        $('.vrtx').eq(i).attr('fill', 'pink');
        $('.vrtx').eq(largest).attr('fill', 'plum');
        timer = setTimeout(() => {
            $('.vrtx').eq(i).attr('fill', Colors.vertex);
            $('line')
                .eq(i * 2)
                .attr('stroke', Colors.stroke);
            if (i * 2 + 2 < n) {
                $('line')
                    .eq(i * 2 + 1)
                    .attr('stroke', Colors.stroke);
            }
            if (i < Math.floor(n / 2)) {
                heapify(largest);
            }
        }, delay / 2);
    }
}

export default HeapSort;
