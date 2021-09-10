import React, { useEffect } from 'react';
import Numbers from '../../components/numbers/numbers';
import { Colors } from '../../common/constants';
import Timer, { wait } from '../../common/timer';

var n, a;
var tbl, cell;
var mid, p, q, s;
var t, r, k;
var delay = 800;

function merge() {
    if (p <= mid && q <= s) {
        if (a[p] <= a[q]) return shiftInit(p++);
        else return shiftInit(q++);
    } else {
        if (p <= mid) {
            cell[p].setAttribute('bgcolor', Colors.compare);
            return wait(200).then(() => shiftInit(p++));
        }
        if (q <= s) {
            cell[q].setAttribute('bgcolor', Colors.compare);
            return wait(200).then(() => shiftInit(q++));
        }
    }
}

function shiftInit(i) {
    t[r] = a[i];
    cell[i + n].innerHTML = a[i];
    cell[i + n].setAttribute('bgcolor', Colors.compare);
    cell[i].innerHTML = '';
    cell[i].removeAttribute('bgcolor');
    k = i;
    return wait(100).then(shift);
}

function shift() {
    if (k < r) {
        cell[k + n + 1].innerHTML = t[r];
        cell[k + n + 1].setAttribute('bgcolor', Colors.compare);
        cell[k + n].innerHTML = '';
        cell[k + n].removeAttribute('bgcolor');
        k++;
        return wait(100).then(shift);
    } else if (k > r) {
        cell[k + n - 1].innerHTML = t[r];
        cell[k + n - 1].setAttribute('bgcolor', Colors.compare);
        cell[k + n].innerHTML = '';
        cell[k + n].removeAttribute('bgcolor');
        k--;
        return wait(100).then(shift);
    } else {
        return wait(200).then(() => {
            cell[r + n + n].innerHTML = t[r];
            cell[r + n + n].setAttribute('bgcolor', Colors.sorted);
            cell[r + n].innerHTML = '';
            cell[r + n].removeAttribute('bgcolor');
            r++;
            return wait(delay).then(merge);
        });
    }
}

function lift(u, v) {
    if (u - n > -1) {
        for (let i = u; i <= v; i++) {
            cell[i - n].innerHTML = cell[i].innerHTML;
            cell[i - n].setAttribute('bgcolor', Colors.sorted);
            cell[i].removeAttribute('bgcolor');
            cell[i].innerHTML = '';
        }
        return wait(100).then(() => lift(u - n, v - n));
    } else {
        return wait(delay / 2).then(() => {
            for (let i = u; i <= v; i++) {
                cell[i].removeAttribute('bgcolor');
                cell[i + n + n].style.border = 0;
                a[i] = t[i];
            }
        });
    }
}

function mergeSort(start, end) {
    for (let i = 0; i < n; i++) {
        if (i >= start && i <= end) {
            cell[i].setAttribute('bgcolor', Colors.compare);
        } else {
            cell[i].removeAttribute('bgcolor');
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
                        cell[i].setAttribute('bgcolor', Colors.compare);
                        cell[i + n + n].style.border = '2px solid';
                    } else {
                        cell[i].removeAttribute('bgcolor');
                        cell[i + n + n].style.border = 0;
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
        cell = [];
        for (let i = 0; i < 3; i++) {
            let row = document.createElement('tr');
            for (let j = 0; j < n; j++) {
                cell[i * n + j] = document.createElement('td');
                if (i === 0) {
                    cell[i * n + j].innerHTML = a[j];
                    cell[i * n + j].style.border = '2px solid';
                }
                row.appendChild(cell[i * n + j]);
            }
            tbl.appendChild(row);
        }
        wait(delay).then(() => mergeSort(0, n - 1));
    };

    const stop = () => {
        Timer.clear();
        tbl.innerHTML = '';
    };

    useEffect(() => {
        tbl = document.getElementById('tbl');
        return () => stop();
    }, []);

    return (
        <div className="sortNumbers">
            <Numbers start={start} stop={stop} />
            <table id="tbl" />
        </div>
    );
}

export default MergeSort;
