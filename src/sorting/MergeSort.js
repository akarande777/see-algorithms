import React, { useEffect } from 'react';
import Input from './input';
import { colors } from '../common/constants';

var n, a;
var tbl, cell;
var mid, p, q, s;
var t, r, k;
var timer;

const wait = (ms) =>
    new Promise((resolve) => {
        timer = setTimeout(resolve, ms);
    });

function merge() {
    if (p <= mid && q <= s) {
        if (a[p] <= a[q]) {
            t[r] = a[p];
            cell[p + n].innerHTML = a[p];
            cell[p + n].setAttribute('bgcolor', colors.compare);
            cell[p].innerHTML = '';
            cell[p].removeAttribute('bgcolor');
            k = p++;
            return wait(100).then(shift);
        } else {
            t[r] = a[q];
            cell[q + n].innerHTML = a[q];
            cell[q + n].setAttribute('bgcolor', colors.compare);
            cell[q].innerHTML = '';
            cell[q].removeAttribute('bgcolor');
            k = q++;
            return wait(100).then(shift);
        }
    } else {
        if (p <= mid) {
            cell[p].setAttribute('bgcolor', colors.compare);
            return wait(200).then(() => {
                t[r] = a[p];
                cell[p + n].innerHTML = a[p];
                cell[p + n].setAttribute('bgcolor', colors.compare);
                cell[p].innerHTML = '';
                cell[p].removeAttribute('bgcolor');
                k = p++;
                return wait(100).then(shift);
            });
        }
        if (q <= s) {
            cell[q].setAttribute('bgcolor', colors.compare);
            return wait(200).then(() => {
                t[r] = a[q];
                cell[q + n].innerHTML = a[q];
                cell[q + n].setAttribute('bgcolor', colors.compare);
                cell[q].innerHTML = '';
                cell[q].removeAttribute('bgcolor');
                k = q++;
                return wait(100).then(shift);
            });
        }
    }
}

function shift() {
    if (k < r) {
        cell[k + n + 1].innerHTML = t[r];
        cell[k + n + 1].setAttribute('bgcolor', colors.compare);
        cell[k + n].innerHTML = '';
        cell[k + n].removeAttribute('bgcolor');
        k++;
        return wait(100).then(shift);
    } else if (k > r) {
        cell[k + n - 1].innerHTML = t[r];
        cell[k + n - 1].setAttribute('bgcolor', colors.compare);
        cell[k + n].innerHTML = '';
        cell[k + n].removeAttribute('bgcolor');
        k--;
        return wait(100).then(shift);
    } else {
        clearTimeout(timer);
        return wait(200).then(() => {
            cell[r + n + n].innerHTML = t[r];
            cell[r + n + n].setAttribute('bgcolor', colors.sorted);
            cell[r + n].innerHTML = '';
            cell[r + n].removeAttribute('bgcolor');
            r++;
            return wait(1000).then(merge);
        });
    }
}

function lift(u, v) {
    return wait(150).then(() => {
        if (u - n > -1) {
            for (let i = u; i <= v; i++) {
                cell[i - n].innerHTML = cell[i].innerHTML;
                cell[i - n].setAttribute('bgcolor', colors.sorted);
                cell[i].removeAttribute('bgcolor');
                cell[i].innerHTML = '';
            }
            return lift(u - n, v - n);
        } else {
            return wait(500).then(() => {
                for (let i = u; i <= v; i++) {
                    cell[i].removeAttribute('bgcolor');
                    cell[i + n + n].style.border = 0;
                    a[i] = t[i];
                }
            });
        }
    });
}

function mergeSort(start, end) {
    return wait(1000).then(() => {
        for (let i = 0; i < n; i++) {
            if (i >= start && i <= end) {
                cell[i].setAttribute('bgcolor', colors.compare);
            } else {
                cell[i].removeAttribute('bgcolor');
            }
        }
        if (start < end) {
            let m = Math.floor((start + end) / 2);
            return mergeSort(start, m)
                .then(() => mergeSort(m + 1, end))
                .then(() => {
                    return wait(1000).then(() => {
                        p = start;
                        s = end;
                        mid = Math.floor((p + s) / 2);
                        q = mid + 1;
                        r = p;
                        t = new Array();
                        for (let i = 0; i < n; i++) {
                            if (i >= start && i <= end) {
                                cell[i].setAttribute('bgcolor', colors.compare);
                                cell[i + n + n].style.border = '2px solid';
                            } else {
                                cell[i].removeAttribute('bgcolor');
                                cell[i + n + n].style.border = 0;
                            }
                        }
                        return wait(1000).then(() => merge());
                    });
                })
                .then(() => {
                    return lift(start + n + n, end + n + n);
                });
        }
    });
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
                if (i == 0) {
                    cell[i * n + j].innerHTML = a[j];
                    cell[i * n + j].style.border = '2px solid';
                }
                row.appendChild(cell[i * n + j]);
            }
            tbl.appendChild(row);
        }
        mergeSort(0, n - 1);
    };

    const stop = () => {
        clearTimeout(timer);
        tbl.innerHTML = '';
    };

    useEffect(() => {
        tbl = document.getElementById('tbl');
        return () => stop();
    }, []);

    return (
        <div className="container">
            <Input start={start} stop={stop} />
            <table id="tbl" />
        </div>
    );
}

export default MergeSort;
