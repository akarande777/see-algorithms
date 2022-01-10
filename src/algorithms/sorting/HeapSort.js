import React, { useEffect } from 'react';
import { createHeap, xco, yco } from '../../helpers/createHeap';
import { createTable, moveVertex } from '../../common/utils';
import $ from 'jquery';
import Numbers from '../../components/numbers/numbers';
import { Colors } from '../../common/constants';

var a, n, v, k;
var p, q, flag;
var timer;
var delay = 500;

function heapSort() {
    if (k >= 0) heapify(k);
    else {
        let t = a[0];
        a[0] = a[n - 1];
        a[n - 1] = t;
        p = { ...v[0] };
        q = { ...v[n - 1] };
        let left = [7, 8, 3, 9, 10, 1, 4].indexOf(n - 1);
        let right = [14, 13, 6, 12, 11, 2, 5].indexOf(n - 1);
        if (left > -1) {
            flag = true;
            timer = setInterval(swapLargest, left);
        } else {
            flag = false;
            timer = setInterval(swapLargest, right);
        }
    }
}

function heapify(i) {
    $('.vrtx').eq(i).attr('fill', Colors.compare);
    let largest = i;
    let left = i * 2 + 1;
    let right = i * 2 + 2;
    if (left < n) {
        if (a[left] > a[largest]) largest = left;
    }
    if (right < n) {
        if (a[right] > a[largest]) largest = right;
    }
    if (largest !== i) {
        timer = setTimeout(() => {
            $('.vrtx').eq(largest).attr('fill', Colors.compare);
            p = v[i];
            q = v[largest];
            flag = p.x > q.x;
            timer = setTimeout(() => {
                switch (true) {
                    case i === 0:
                        timer = setInterval(swap, 2, i, largest, 70);
                        break;
                    case i === 1 || i === 2:
                        timer = setInterval(swap, 4, i, largest, 45);
                        break;
                    default:
                        timer = setInterval(swap, 8, i, largest, 25);
                }
            }, delay);
        }, delay);
        let temp = a[i];
        a[i] = a[largest];
        a[largest] = temp;
    } else {
        k--;
        timer = setTimeout(() => {
            $('.vrtx').eq(i).attr('fill', Colors.vertex);
            $('.edge').eq(left - 1).attr('stroke', Colors.stroke);
            if (right < n) {
                $('.edge').eq(right - 1).attr('stroke', Colors.stroke);
            }
            timer = setTimeout(heapSort, delay);
        }, delay);
    }
}

function HeapSort() {
    const start = (values) => {
        a = [...values];
        v = createHeap(a);
        n = a.length;
        createTable(1, n);
        for (let i = 0; i < n; i++) {
            $('.cell').eq(i).css('border', '2px solid');
        }
        for (let i = 0; i < n; i++) {
            $('.vlbl').eq(i).text(a[i]);
        }
        k = Math.floor(n / 2) - 1;
        timer = setTimeout(heapSort, delay * 2);
    };

    const stop = () => {
        clearTimeout(timer);
        clearInterval(timer);
        $('#plane').html('');
        $('#tbl').html('');
    };

    useEffect(() => () => stop(), []);

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

function swap(i, largest, angle) {
    if (p.y < v[largest].y) {
        let x, y;
        x = xco(angle, 1, p.x, flag);
        y = yco(angle, 1, p.y);
        p = { x, y };
        moveVertex(i, p);
        x = xco(angle, -1, q.x, flag);
        y = yco(angle, -1, q.y);
        q = { x, y };
        moveVertex(largest, q);
    } else {
        clearInterval(timer);
        moveVertex(i, v[i]);
        $('.vlbl').eq(i).text(a[i]);
        moveVertex(largest, v[largest]);
        $('.vlbl').eq(largest).text(a[largest]);
        $('.vrtx').eq(largest).attr('fill', Colors.compare);
        $('.vrtx').eq(i).attr('fill', Colors.compare);
        timer = setTimeout(() => {
            $('.vrtx').eq(i).attr('fill', Colors.vertex);
            $('.edge').eq(i * 2).attr('stroke', Colors.stroke);
            if (i * 2 + 2 < n) {
                $('.edge').eq(i * 2 + 1).attr('stroke', Colors.stroke);
            }
            if (i < Math.floor(n / 2)) heapify(largest);
        }, delay);
    }
}

function swapLargest() {
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
        $('.vlbl').eq(n - 1).text(a[n - 1]);
        moveVertex(0, v[0]);
        $('.vlbl').eq(0).text(a[0]);
        timer = setTimeout(() => {
            timer = setInterval(fall, 5);
        }, delay);
    }
}

function fall() {
    if (n > 1) {
        let y1 = parseInt($('.edge:last').attr('y1'));
        if (y1 < 300) {
            $('.edge:last').attr('y1', y1 + 1);
            let cy = parseInt($('.vrtx:last').attr('cy'));
            $('.vrtx:last').attr('cy', cy + 1);
            $('.vlbl:last').attr('y', cy + 6);
            $('.edge:last').attr('y2', cy + 1);
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
            $('.vgrp').eq(0).remove();
            $('.cell').eq(0).text(a[0]);
        }
    }
}

function extractMax() {
    $('.edge:last').remove();
    $('.vgrp:last').remove();
    n--;
    $('.cell').eq(n).text(a[n]);
    if (n > 1) {
        timer = setTimeout(heapify, delay, (k = 0));
    } else {
        timer = setTimeout(() => {
            timer = setInterval(fall, 10);
        }, delay);
    }
}

export default HeapSort;
