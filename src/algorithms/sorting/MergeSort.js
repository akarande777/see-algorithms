import React, { useEffect } from 'react';
import Numbers from '../../components/numbers/numbers';
import { Colors } from '../../common/constants';
import Timer, { wait } from '../../common/timer';
import { createTable } from '../../common/utils';

var n, a, cells;
var mid, p, q, s;
var t, r, k;
var delay = 800;

function merge() {
    if (p <= mid && q <= s) {
        if (a[p] <= a[q]) return shiftInit(p++);
        else return shiftInit(q++);
    } else {
        if (p <= mid) {
            cells[p].setAttribute('bgcolor', Colors.compare);
            return wait(200).then(() => shiftInit(p++));
        }
        if (q <= s) {
            cells[q].setAttribute('bgcolor', Colors.compare);
            return wait(200).then(() => shiftInit(q++));
        }
    }
}

function shiftInit(i) {
    t[r] = a[i];
    cells[i + n].innerHTML = a[i];
    cells[i + n].setAttribute('bgcolor', Colors.compare);
    cells[i].innerHTML = '';
    cells[i].removeAttribute('bgcolor');
    k = i;
    return wait(100).then(shift);
}

function shift() {
    if (k < r) {
        cells[k + n + 1].innerHTML = t[r];
        cells[k + n + 1].setAttribute('bgcolor', Colors.compare);
        cells[k + n].innerHTML = '';
        cells[k + n].removeAttribute('bgcolor');
        k++;
        return wait(100).then(shift);
    } else if (k > r) {
        cells[k + n - 1].innerHTML = t[r];
        cells[k + n - 1].setAttribute('bgcolor', Colors.compare);
        cells[k + n].innerHTML = '';
        cells[k + n].removeAttribute('bgcolor');
        k--;
        return wait(100).then(shift);
    } else {
        return wait(200).then(() => {
            cells[r + n + n].innerHTML = t[r];
            cells[r + n + n].setAttribute('bgcolor', Colors.sorted);
            cells[r + n].innerHTML = '';
            cells[r + n].removeAttribute('bgcolor');
            r++;
            return wait(delay).then(merge);
        });
    }
}

function lift(u, v) {
    if (u - n > -1) {
        for (let i = u; i <= v; i++) {
            cells[i - n].innerHTML = cells[i].innerHTML;
            cells[i - n].setAttribute('bgcolor', Colors.sorted);
            cells[i].removeAttribute('bgcolor');
            cells[i].innerHTML = '';
        }
        return wait(100).then(() => lift(u - n, v - n));
    } else {
        return wait(delay / 2).then(() => {
            for (let i = u; i <= v; i++) {
                cells[i].removeAttribute('bgcolor');
                cells[i + n + n].style.border = 0;
                a[i] = t[i];
            }
        });
    }
}

function mergeSort(start, end) {
    for (let i = 0; i < n; i++) {
        if (i >= start && i <= end) {
            cells[i].setAttribute('bgcolor', Colors.compare);
        } else {
            cells[i].removeAttribute('bgcolor');
        }
    }
    if (start < end) {
        let m = Math.floor((start + end) / 2);
        return wait(delay)
            .then(() => mergeSort(start, m))
            .then(() => wait(delay))
            .then(() => mergeSort(m + 1, end))
            .then(() => wait(delay))
            .then(() => {
                p = start;
                s = end;
                mid = Math.floor((p + s) / 2);
                q = mid + 1;
                r = p;
                t = new Array();
                for (let i = 0; i < n; i++) {
                    if (i >= start && i <= end) {
                        cells[i].setAttribute('bgcolor', Colors.compare);
                        cells[i + n + n].style.border = '2px solid';
                    } else {
                        cells[i].removeAttribute('bgcolor');
                        cells[i + n + n].style.border = 0;
                    }
                }
                return wait(delay).then(() => merge());
            })
            .then(() => {
                return lift(start + n + n, end + n + n);
            });
    }
}

function MergeSort() {
    const start = (values) => {
        a = [...values];
        n = a.length;
        createTable(3, n);
        cells = document.querySelectorAll('.cell');
        for (let i = 0; i < n; i++) {
            cells[i].innerHTML = a[i];
            cells[i].style.border = '2px solid';
        }
        wait(delay).then(() => mergeSort(0, n - 1));
    };

    const stop = () => {
        Timer.clear();
        document.getElementById('tbl').innerHTML = '';
    };

    useEffect(() => () => stop(), []);

    return (
        <div className="sortNumbers">
            <Numbers start={start} stop={stop} />
            <table id="tbl" />
        </div>
    );
}

export default MergeSort;
