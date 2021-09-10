import React, { useEffect } from 'react';
import Numbers from '../../components/numbers/numbers';
import { Colors } from '../../common/constants';

var a, n;
var tbl, cell;
var i, j, pos;
var prev, k;
var flag1, flag2;
var timer;
var delay = 800;

function iloop() {
    if (i < n - 1) {
        cell[i + n].setAttribute('bgcolor', Colors.compare);
        pos = i;
        j = i + 1;
        flag1 = true; // start loop
        flag2 = false;
        timer = setTimeout(function () {
            cell[i].innerHTML = a[i];
            cell[i].setAttribute('bgcolor', Colors.sorted);
            cell[i + n].innerHTML = '';
            cell[i + n].removeAttribute('bgcolor');
            timer = setInterval(jloop, delay / 2);
        }, delay / 2);
    } else {
        cell[n + n - 1].setAttribute('bgcolor', Colors.sorted);
    }
}

function jloop() {
    if (flag1) {
        if (a[pos] > a[j]) {
            prev = pos;
            pos = j;
            flag2 = true;
        }
        cell[j + n - 1].removeAttribute('bgcolor');
        cell[j + n].setAttribute('bgcolor', Colors.compare);
        j++;
    }
    if (!flag1 && flag2) {
        cell[prev + n].innerHTML = a[prev];
        cell[prev].innerHTML = '';
        cell[prev].removeAttribute('bgcolor');
        cell[pos].innerHTML = a[pos];
        cell[pos].setAttribute('bgcolor', Colors.sorted);
        cell[pos + n].innerHTML = '';
        cell[pos + n].removeAttribute('bgcolor');
        flag1 = true; // continue loop
        flag2 = false;
    }
    if (j >= n && !flag2) {
        clearInterval(timer);
        timer = setTimeout(function () {
            cell[n + n - 1].removeAttribute('bgcolor');
            if (pos !== i) {
                timer = setTimeout(function () {
                    cell[i + n + n].innerHTML = a[i];
                    cell[i + n].innerHTML = '';
                    k = 1;
                    timer = setTimeout(function () {
                        timer = setInterval(swap, 100);
                    }, 200);
                }, delay / 2);
            } else {
                timer = setTimeout(function () {
                    cell[pos + n].innerHTML = a[pos];
                    cell[pos + n].setAttribute('bgcolor', Colors.sorted);
                    cell[pos].innerHTML = '';
                    cell[pos].removeAttribute('bgcolor');
                    i++;
                    timer = setTimeout(iloop, delay);
                }, delay / 2);
            }
        }, delay / 2);
    }
    if (flag2) flag1 = false; // pause loop
}

function SelectionSort() {
    const start = (values) => {
        a = [...values];
        n = a.length;
        cell = [];
        for (let i = 0; i < 3; i++) {
            let row = document.createElement('tr');
            for (let j = 0; j < n; j++) {
                cell[i * n + j] = document.createElement('td');
                if (i === 1) {
                    cell[i * n + j].innerHTML = a[j];
                    cell[i * n + j].style.border = '2px solid';
                }
                row.appendChild(cell[i * n + j]);
            }
            tbl.appendChild(row);
        }
        i = 0;
        timer = setTimeout(iloop, delay);
    };

    const stop = () => {
        clearTimeout(timer);
        clearInterval(timer);
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

function swap() {
    cell[pos - k].innerHTML = a[pos];
    cell[pos - k].setAttribute('bgcolor', Colors.sorted);
    cell[pos - k + 1].innerHTML = '';
    cell[pos - k + 1].removeAttribute('bgcolor');
    cell[i + n + n + k].innerHTML = a[i];
    cell[i + n + n + k - 1].innerHTML = '';
    if (i + k === pos) {
        clearInterval(timer);
        timer = setTimeout(function () {
            cell[pos + n].innerHTML = a[i];
            cell[pos + n + n].innerHTML = '';
            cell[i + n].innerHTML = a[pos];
            cell[i + n].setAttribute('bgcolor', Colors.sorted);
            cell[i].innerHTML = '';
            cell[i].removeAttribute('bgcolor');
            let t = a[i];
            a[i] = a[pos];
            a[pos] = t;
            i++;
            timer = setTimeout(iloop, delay);
        }, 200);
    }
    k++;
}

export default SelectionSort;
