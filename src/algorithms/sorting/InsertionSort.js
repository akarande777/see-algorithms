import React, { useEffect } from 'react';
import Numbers from '../../components/numbers/numbers';
import { Colors } from '../../common/constants';
import { createTable } from '../../common/utils';

var a, n, cells;
var i, j, temp;
var timer;
var delay = 800;

function InsertionSort() {
    const start = (values) => {
        a = [...values];
        n = a.length;
        createTable(2, n);
        cells = document.querySelectorAll('.cell');
        for (let k = 0; k < n; k++) {
            cells[k + n].innerHTML = a[k];
            cells[k + n].style.border = '2px solid';
        }
        i = 1;
        timer = setTimeout(() => {
            cells[n].setAttribute('bgcolor', Colors.sorted);
            timer = setTimeout(pick, delay);
        }, delay);
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

function pick() {
    if (i < n) {
        cells[i + n].setAttribute('bgcolor', Colors.compare);
        timer = setTimeout(function () {
            cells[i].innerHTML = cells[i + n].innerHTML;
            cells[i + n].innerHTML = '';
            cells[i + n].removeAttribute('bgcolor');
            cells[i].setAttribute('bgcolor', Colors.compare);
            temp = a[i];
            j = i;
            timer = setTimeout(function () {
                timer = setInterval(shift, delay / 2);
            }, delay / 2);
        }, delay / 2);
    }
}

function shift() {
    if (temp < a[j - 1]) {
        a[j] = a[j - 1];
        cells[j + n].innerHTML = a[j];
        cells[j + n].setAttribute('bgcolor', Colors.sorted);
        cells[j + n - 1].innerHTML = '';
        cells[j + n - 1].removeAttribute('bgcolor');
        j--;
    } else {
        clearInterval(timer);
        j = i;
        timer = setInterval(insert, 100);
    }
}

function insert() {
    if (temp < a[j - 1]) {
        cells[j - 1].innerHTML = cells[j].innerHTML;
        cells[j - 1].setAttribute('bgcolor', Colors.compare);
        cells[j].innerHTML = '';
        cells[j].removeAttribute('bgcolor');
        j--;
    } else {
        clearInterval(timer);
        a[j] = temp;
        cells[j + n].innerHTML = cells[j].innerHTML;
        cells[j + n].setAttribute('bgcolor', Colors.sorted);
        cells[j].innerHTML = '';
        cells[j].removeAttribute('bgcolor');
        i++;
        timer = setTimeout(pick, delay);
    }
}

export default InsertionSort;
