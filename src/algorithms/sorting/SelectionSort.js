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
            cells[i].textContent = a[i];
            cells[i].setAttribute('bgcolor', Colors.compare);
            cells[i + n].textContent = '';
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
    cells[prev + n].textContent = a[prev];
    cells[prev].textContent = '';
    cells[prev].removeAttribute('bgcolor');
    cells[pos].textContent = a[pos];
    cells[pos].setAttribute('bgcolor', Colors.compare);
    cells[pos + n].textContent = '';
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
            cells[k + n].textContent = a[k];
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
        cells[i + n + n].textContent = a[i];
        cells[i + n].textContent = '';
        k = 1;
        timer = setTimeout(function () {
            timer = setInterval(swap, 100);
        }, 200);
    } else {
        cells[pos + n].textContent = a[pos];
        cells[pos + n].setAttribute('bgcolor', Colors.sorted);
        cells[pos].textContent = '';
        cells[pos].removeAttribute('bgcolor');
        i++;
        timer = setTimeout(iloop, delay);
    }
}

function swap() {
    cells[pos - k].textContent = a[pos];
    cells[pos - k].setAttribute('bgcolor', Colors.compare);
    cells[pos - k + 1].textContent = '';
    cells[pos - k + 1].removeAttribute('bgcolor');
    let npn = i + n + n;
    cells[npn + k].textContent = a[i];
    cells[npn + k - 1].textContent = '';
    if (i + k === pos) {
        clearInterval(timer);
        timer = setTimeout(function () {
            cells[pos + n].textContent = a[i];
            cells[pos + n + n].textContent = '';
            cells[i + n].textContent = a[pos];
            cells[i + n].setAttribute('bgcolor', Colors.sorted);
            cells[i].textContent = '';
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
