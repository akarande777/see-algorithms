import React, { useEffect } from 'react';
import Numbers from '../../components/numbers/numbers';
import { Colors } from '../../common/constants';
import { createTable } from '../../common/utils';

var a, n, cells;
var i, j, swaps;
var timer;
var delay = 800;

function iloop() {
    if (i < n - 1 && swaps > 0) {
        swaps = 0;
        j = 0;
        timer = setTimeout(jloop, delay);
    } else {
        for (let k = 0; k < n; k++) {
            cells[k + n].setAttribute('bgcolor', Colors.sorted);
        }
    }
}

function jloop() {
    if (j < n - i - 1) {
        cells[j + n].setAttribute('bgcolor', Colors.compare);
        cells[j + n + 1].setAttribute('bgcolor', Colors.compare);
        cells[j + n - 1].removeAttribute('bgcolor');
        if (a[j + 1] < a[j]) {
            timer = setTimeout(swap, delay);
            swaps++;
        } else {
            timer = setTimeout(jloop, delay);
            j++;
        }
    } else {
        cells[j + n - 1].removeAttribute('bgcolor');
        cells[j + n].setAttribute('bgcolor', Colors.sorted);
        i++;
        iloop();
    }
}

function BubbleSort() {
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
        j = 0;
        swaps = 1;
        iloop();
    };

    const stop = () => {
        clearTimeout(timer);
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

function swap() {
    let t = a[j];
    a[j] = a[j + 1];
    a[j + 1] = t;
    let npn = n + n;
    timer = setTimeout(function () {
        shift(j + 1, j + n + 1);
        shift(j + npn, j + n);
    }, 150);
    timer = setTimeout(function () {
        shift(j, j + 1);
        shift(j + npn + 1, j + npn);
    }, 300);
    timer = setTimeout(function () {
        shift(j + n, j);
        shift(j + n + 1, j + npn + 1);
        j++;
    }, 450);
    timer = setTimeout(jloop, delay);
}

function shift(u, v) {
    cells[u].innerHTML = cells[v].innerHTML;
    cells[u].setAttribute('bgcolor', Colors.compare);
    cells[v].removeAttribute('bgcolor');
    cells[v].innerHTML = '';
}

export default BubbleSort;
