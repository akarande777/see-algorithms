import React, { useEffect } from 'react';
import Numbers from '../../components/numbers/numbers';
import { Colors } from '../../common/constants';
import { createTable } from '../../common/utils';

var a, n, cells;
var i, j, pos;
var prev, k;
var timer;
var delay = 800;

function iloop() {
    if (i < n - 1) {
        cells[i + n].setAttribute('bgcolor', Colors.compare);
        pos = i;
        j = i + 1;
        timer = setTimeout(function () {
            cells[i].innerHTML = a[i];
            cells[i].setAttribute('bgcolor', Colors.compare);
            cells[i + n].innerHTML = '';
            cells[i + n].removeAttribute('bgcolor');
            timer = setInterval(jloop, delay / 2);
        }, delay / 2);
    } else {
        cells[n + n - 1].setAttribute('bgcolor', Colors.sorted);
    }
}

function jloop() {
    cells[j + n - 1].removeAttribute('bgcolor');
    cells[j + n].setAttribute('bgcolor', Colors.compare);
    if (a[pos] > a[j]) {
        prev = pos;
        pos = j;
        clearInterval(timer);
        timer = setTimeout(select, delay / 2);
    }
    if (j === n) {
        clearInterval(timer);
        cells[j + n].removeAttribute('bgcolor');
        timer = setTimeout(swapInit, delay);
    }
    j++;
}

function select() {
    cells[prev + n].innerHTML = a[prev];
    cells[prev].innerHTML = '';
    cells[prev].removeAttribute('bgcolor');
    cells[pos].innerHTML = a[pos];
    cells[pos].setAttribute('bgcolor', Colors.compare);
    cells[pos + n].innerHTML = '';
    cells[pos + n].removeAttribute('bgcolor');
    if (j >= n) {
        timer = setTimeout(swapInit, delay / 2);
    } else {
        timer = setInterval(jloop, delay / 2);
    }
}

function SelectionSort() {
    const start = (values) => {
        a = [...values];
        n = a.length;
        createTable(3, n);
        cells = document.querySelectorAll('.cell');
        for (let k = 0; k < n; k++) {
            cells[k + n].innerHTML = a[k];
            cells[k + n].style.border = '2px solid';
        }
        i = 0;
        timer = setTimeout(iloop, delay);
    };

    const stop = () => {
        clearTimeout(timer);
        clearInterval(timer);
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

function swapInit() {
    if (pos !== i) {
        cells[i + n + n].innerHTML = a[i];
        cells[i + n].innerHTML = '';
        k = 1;
        timer = setTimeout(function () {
            timer = setInterval(swap, 100);
        }, 200);
    } else {
        cells[pos + n].innerHTML = a[pos];
        cells[pos + n].setAttribute('bgcolor', Colors.sorted);
        cells[pos].innerHTML = '';
        cells[pos].removeAttribute('bgcolor');
        i++;
        timer = setTimeout(iloop, delay);
    }
}

function swap() {
    cells[pos - k].innerHTML = a[pos];
    cells[pos - k].setAttribute('bgcolor', Colors.compare);
    cells[pos - k + 1].innerHTML = '';
    cells[pos - k + 1].removeAttribute('bgcolor');
    let npn = i + n + n;
    cells[npn + k].innerHTML = a[i];
    cells[npn + k - 1].innerHTML = '';
    if (i + k === pos) {
        clearInterval(timer);
        timer = setTimeout(function () {
            cells[pos + n].innerHTML = a[i];
            cells[pos + n + n].innerHTML = '';
            cells[i + n].innerHTML = a[pos];
            cells[i + n].setAttribute('bgcolor', Colors.sorted);
            cells[i].innerHTML = '';
            cells[i].removeAttribute('bgcolor');
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
